import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { stripe } from '@/utils/stripe';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // We can parse the requested return path to send them exactly where they came from
        let returnPath = '/members';
        try {
            const body = await req.json();
            if (body.returnPath) {
                returnPath = body.returnPath;
            }
        } catch (e) {
            // No body
        }

        // Dynamically get the site URL
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const host = req.headers.get('host') || 'localhost:3000';
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;

        // Create the Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            customer_email: user.email,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'TiltedPrompts Pro Membership',
                            description: 'Unlock full access to the AI prompt library, n8n workflows, and OpenClaw skills.',
                        },
                        unit_amount: 4900, // $49.00 USD
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: `${siteUrl}${returnPath}?success=true`,
            cancel_url: `${siteUrl}${returnPath}?canceled=true`,
            client_reference_id: user.id, // Very important for processing the webhook
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
    }
}
