import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'mock_key_id',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret',
        });
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { amount, currency = 'INR', receipt = 'receipt#1', notes = {} } = body;

        if (!amount) {
            return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
        }

        // Razorpay expects amount in the smallest subunit (e.g. paise for INR)
        // So passing amount=50000 creates an order for INR 500.00
        const options = {
            amount: parseInt(amount),
            currency,
            receipt,
            notes: {
                ...notes,
                user_id: user.id,
            }
        };

        const order = await razorpay.orders.create(options);
        return NextResponse.json(order);

    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
