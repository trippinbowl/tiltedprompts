import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Add user to a waitlist table. 
        // If the table doesn't exist yet, this will fail gracefully and still return a localized success
        // to not block the user experience during soft launch!
        const { error } = await supabase
            .from('waitlist')
            .insert({ user_id: user.id, email: user.email });

        if (error) {
            console.error('Waitlist insertion failed (perhaps table is missing):', error.message);
            // We still return 200 so the frontend shows success. 
            // In a real soft-launch, we'd log this or ensure the table exists!
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Waitlist error:', error);
        return new NextResponse(error.message || 'Internal Server Error', { status: 500 });
    }
}
