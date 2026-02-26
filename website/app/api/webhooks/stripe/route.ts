import { NextResponse } from 'next/server';
import { stripe } from '@/utils/stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize a supabase Admin client using the service role to bypass RLS!
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
    const payload = await req.text();
    const sig = req.headers.get('stripe-signature') as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        if (!sig || !webhookSecret) {
            console.error('Missing signature or webhook secret');
            return new NextResponse('Webhook error: Missing signature or secret', { status: 400 });
        }
        event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as any;
            const userId = session.client_reference_id;
            const stripeCustomerId = session.customer;

            if (userId) {
                // Update the user's tier to 'pro' using our admin client since this is a server-to-server call securely validated by Stripe
                console.log(`Updating User ${userId} to PRO tier!`);
                const { error } = await supabaseAdmin
                    .from('profiles')
                    .update({
                        tier: 'pro',
                        stripe_customer_id: stripeCustomerId,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', userId);

                if (error) {
                    console.error('Supabase profile update failed:', error);
                    return new NextResponse('Profile update failed', { status: 500 });
                }
            }
            break;
        }
        // Additional webhooks like invoice.payment_succeeded could be handled here for recurring billings
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
}
