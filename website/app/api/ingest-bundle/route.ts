import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

/**
 * TiltedPrompts — Asset Ingestion API
 *
 * POST /api/ingest-bundle
 *
 * Receives generated assets from the OpenClaw tilted_asset_generator agent
 * and inserts them into the Supabase library_assets table.
 *
 * Authentication: HMAC-SHA256 signature verification
 *   - X-Ingest-Key: API key identifier
 *   - X-Ingest-Timestamp: Unix epoch seconds (must be within 5 minutes)
 *   - X-Ingest-Signature: HMAC-SHA256(timestamp + "." + body, secret)
 *
 * This endpoint uses the Supabase service role client to bypass RLS,
 * since it is a server-to-server call authenticated by HMAC, not a user session.
 */

// Initialize Supabase Admin client (bypasses RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Configuration
const INGEST_API_KEY = process.env.INGEST_API_KEY || '';
const INGEST_SECRET = process.env.INGEST_SECRET || '';
const MAX_PAYLOAD_BYTES = 512_000; // 500KB
const TIMESTAMP_WINDOW_SECONDS = 300; // 5 minutes
const MAX_INGESTIONS_PER_HOUR = 20;

// Simple in-memory rate limiter (resets on cold start, which is fine for Vercel)
const ingestionLog: number[] = [];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function verifyHmacSignature(
    timestamp: string,
    body: string,
    receivedSignature: string
): boolean {
    const message = `${timestamp}.${body}`;
    const expectedSignature = crypto
        .createHmac('sha256', INGEST_SECRET)
        .update(message)
        .digest('hex');

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
        Buffer.from(expectedSignature, 'hex'),
        Buffer.from(receivedSignature, 'hex')
    );
}

function isTimestampValid(timestamp: string): boolean {
    const ts = parseInt(timestamp, 10);
    if (isNaN(ts)) return false;
    const now = Math.floor(Date.now() / 1000);
    return Math.abs(now - ts) <= TIMESTAMP_WINDOW_SECONDS;
}

function isRateLimited(): boolean {
    const now = Date.now();
    const oneHourAgo = now - 3_600_000;

    // Prune old entries
    while (ingestionLog.length > 0 && ingestionLog[0] < oneHourAgo) {
        ingestionLog.shift();
    }

    if (ingestionLog.length >= MAX_INGESTIONS_PER_HOUR) {
        return true;
    }

    ingestionLog.push(now);
    return false;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

interface IngestPayload {
    title: string;
    description: string;
    asset_type: string;
    platform: string[];
    content: Record<string, unknown>;
    tags: string[];
    is_premium: boolean;
}

const VALID_ASSET_TYPES = [
    'prompt_bundle',
    'n8n_workflow',
    'openclaw_skill',
    'gpt_config',
    'code_template',
    'voice_agent',
];

function validatePayload(data: unknown): { valid: boolean; errors: string[]; payload?: IngestPayload } {
    const errors: string[] = [];

    if (!data || typeof data !== 'object') {
        return { valid: false, errors: ['Request body must be a JSON object'] };
    }

    const obj = data as Record<string, unknown>;

    // Required: title
    if (!obj.title || typeof obj.title !== 'string' || obj.title.trim().length === 0) {
        errors.push('title: required, must be a non-empty string');
    } else if (obj.title.length > 200) {
        errors.push('title: must be 200 characters or fewer');
    }

    // Required: description
    if (!obj.description || typeof obj.description !== 'string') {
        errors.push('description: required, must be a string');
    }

    // Required: asset_type
    if (!obj.asset_type || typeof obj.asset_type !== 'string') {
        errors.push('asset_type: required, must be a string');
    } else if (!VALID_ASSET_TYPES.includes(obj.asset_type)) {
        errors.push(`asset_type: must be one of: ${VALID_ASSET_TYPES.join(', ')}`);
    }

    // Required: content
    if (!obj.content || typeof obj.content !== 'object') {
        errors.push('content: required, must be a JSON object');
    }

    // Optional: platform (default [])
    if (obj.platform !== undefined) {
        if (!Array.isArray(obj.platform) || !obj.platform.every((p: unknown) => typeof p === 'string')) {
            errors.push('platform: must be an array of strings');
        }
    }

    // Optional: tags (default [])
    if (obj.tags !== undefined) {
        if (!Array.isArray(obj.tags) || !obj.tags.every((t: unknown) => typeof t === 'string')) {
            errors.push('tags: must be an array of strings');
        }
    }

    // Optional: is_premium (default false)
    if (obj.is_premium !== undefined && typeof obj.is_premium !== 'boolean') {
        errors.push('is_premium: must be a boolean');
    }

    if (errors.length > 0) {
        return { valid: false, errors };
    }

    return {
        valid: true,
        errors: [],
        payload: {
            title: (obj.title as string).trim(),
            description: (obj.description as string).trim(),
            asset_type: obj.asset_type as string,
            platform: (obj.platform as string[] | undefined) || [],
            content: obj.content as Record<string, unknown>,
            tags: (obj.tags as string[] | undefined) || [],
            is_premium: (obj.is_premium as boolean | undefined) || false,
        },
    };
}

// ---------------------------------------------------------------------------
// Route Handler
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
    try {
        // --- Step 0: Check configuration ---
        if (!INGEST_API_KEY || !INGEST_SECRET) {
            console.error('Ingestion API: Missing INGEST_API_KEY or INGEST_SECRET env vars');
            return NextResponse.json(
                { error: 'Server misconfigured: ingestion credentials not set' },
                { status: 500 }
            );
        }

        // --- Step 1: Rate limiting ---
        if (isRateLimited()) {
            return NextResponse.json(
                { error: `Rate limit exceeded: max ${MAX_INGESTIONS_PER_HOUR} ingestions per hour` },
                { status: 429 }
            );
        }

        // --- Step 2: Read headers ---
        const ingestKey = req.headers.get('X-Ingest-Key') || '';
        const timestamp = req.headers.get('X-Ingest-Timestamp') || '';
        const signature = req.headers.get('X-Ingest-Signature') || '';

        if (!ingestKey || !timestamp || !signature) {
            return NextResponse.json(
                { error: 'Missing required headers: X-Ingest-Key, X-Ingest-Timestamp, X-Ingest-Signature' },
                { status: 401 }
            );
        }

        // --- Step 3: Verify API key ---
        if (ingestKey !== INGEST_API_KEY) {
            return NextResponse.json(
                { error: 'Invalid API key' },
                { status: 401 }
            );
        }

        // --- Step 4: Check timestamp freshness ---
        if (!isTimestampValid(timestamp)) {
            return NextResponse.json(
                { error: `Timestamp expired or invalid (must be within ${TIMESTAMP_WINDOW_SECONDS}s)` },
                { status: 401 }
            );
        }

        // --- Step 5: Read and size-check body ---
        const bodyText = await req.text();

        if (Buffer.byteLength(bodyText, 'utf-8') > MAX_PAYLOAD_BYTES) {
            return NextResponse.json(
                { error: `Payload too large (max ${MAX_PAYLOAD_BYTES} bytes)` },
                { status: 413 }
            );
        }

        // --- Step 6: Verify HMAC signature ---
        try {
            if (!verifyHmacSignature(timestamp, bodyText, signature)) {
                return NextResponse.json(
                    { error: 'HMAC signature verification failed' },
                    { status: 401 }
                );
            }
        } catch {
            return NextResponse.json(
                { error: 'HMAC signature verification failed (malformed signature)' },
                { status: 401 }
            );
        }

        // --- Step 7: Parse and validate payload ---
        let data: unknown;
        try {
            data = JSON.parse(bodyText);
        } catch {
            return NextResponse.json(
                { error: 'Invalid JSON in request body' },
                { status: 400 }
            );
        }

        const validation = validatePayload(data);
        if (!validation.valid || !validation.payload) {
            return NextResponse.json(
                { error: 'Payload validation failed', details: validation.errors },
                { status: 422 }
            );
        }

        const payload = validation.payload;

        // --- Step 8: Check for duplicate titles ---
        const { data: existing } = await supabaseAdmin
            .from('library_assets')
            .select('id')
            .eq('title', payload.title)
            .limit(1);

        if (existing && existing.length > 0) {
            return NextResponse.json(
                { error: `Asset with title "${payload.title}" already exists`, existing_id: existing[0].id },
                { status: 409 }
            );
        }

        // --- Step 9: Insert into database ---
        const { data: inserted, error: insertError } = await supabaseAdmin
            .from('library_assets')
            .insert({
                title: payload.title,
                description: payload.description,
                asset_type: payload.asset_type,
                platform: payload.platform,
                content: payload.content,
                tags: payload.tags,
                is_premium: payload.is_premium,
                download_count: 0,
            })
            .select('id, title, asset_type, is_premium, created_at')
            .single();

        if (insertError) {
            console.error('Supabase insert failed:', insertError);
            return NextResponse.json(
                { error: 'Database insert failed', detail: insertError.message },
                { status: 500 }
            );
        }

        // --- Step 10: Success ---
        console.log(`Asset ingested: ${inserted.id} — "${inserted.title}" (${inserted.asset_type})`);

        return NextResponse.json(
            {
                success: true,
                asset_id: inserted.id,
                title: inserted.title,
                asset_type: inserted.asset_type,
                is_premium: inserted.is_premium,
                created_at: inserted.created_at,
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Ingestion endpoint error:', message);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
