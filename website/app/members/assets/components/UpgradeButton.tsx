'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function UpgradeButton() {
    const [loading, setLoading] = useState(false);
    const [joined, setJoined] = useState(false);
    const pathname = usePathname();

    const handleUpgrade = async () => {
        try {
            setLoading(true);

            // --- STRIPE CHECKOUT FLAG (COMMENTED FOR SOFT LAUNCH) ---
            /*
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ returnPath: pathname }),
            });
            if (!response.ok) throw new Error('Failed to create checkout session');
            const { url } = await response.json();
            if (url) window.location.href = url;
            */

            // --- SOFT LAUNCH WAITLIST FLOW ---
            const response = await fetch('/api/waitlist', { method: 'POST' });
            if (!response.ok) throw new Error('Waitlist join failed');

            setJoined(true);
            setLoading(false);

        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again later.');
            setLoading(false);
        }
    };

    if (joined) {
        return (
            <div className="px-8 py-4 bg-primary/20 text-primary font-bold rounded-xl border border-primary/30 text-center inline-block">
                ✨ You're on the Waitlist! We'll email you soon.
            </div>
        );
    }

    return (
        <button
            onClick={handleUpgrade}
            disabled={loading}
            className="px-8 py-4 bg-foreground text-background font-bold rounded-xl hover:bg-foreground/90 transition shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? 'Joining Waitlist...' : 'Join the Pro Waitlist'}
        </button>
    );
}
