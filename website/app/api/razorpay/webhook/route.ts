import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    try {
        const bodyText = await req.text();
        const signature = req.headers.get('x-razorpay-signature');
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        // Verify webhook authenticity
        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret!)
            .update(bodyText)
            .digest('hex');

        if (expectedSignature !== signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const event = JSON.parse(bodyText);

        // Process successful payment
        if (event.event === 'payment.captured' || event.event === 'order.paid') {
            const payment = event.payload.payment.entity;
            const orderId = payment.order_id;
            const userId = payment.notes?.user_id;

            if (userId) {
                const supabase = await createClient();

                // Assuming you have a purchases or subscriptions table
                // Here is the provision for upgrading the user:
                await supabase
                    .from('profiles')
                    .update({ tier: 'pro' })
                    .eq('id', userId);

                // Insert into purchases
                await supabase
                    .from('purchases')
                    .insert({
                        user_id: userId,
                        order_id: orderId,
                        payment_id: payment.id,
                        amount: payment.amount,
                        currency: payment.currency,
                        status: payment.status
                    });
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Webhook Handler Failed' }, { status: 500 });
    }
}
