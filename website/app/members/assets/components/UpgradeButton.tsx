'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function UpgradeButton() {
    const [loading, setLoading] = useState(false);
    const [joined, setJoined] = useState(false);
    const pathname = usePathname();

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleUpgrade = async () => {
        try {
            setLoading(true);

            // Load script dynamically
            const res = await loadRazorpayScript();
            if (!res) {
                alert("Razorpay SDK failed to load. Are you online?");
                setLoading(false);
                return;
            }

            // Create Order via Server
            const orderResponse = await fetch('/api/razorpay/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: 50000 }) // E.g., INR 500.00
            });

            if (!orderResponse.ok) throw new Error('Failed to create Razorpay Order');
            const orderData = await orderResponse.json();

            // Open Razorpay Checkout Window
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Tilted Prompts",
                description: "Pro Tier Upgrade",
                image: "https://tiltedprompts.com/logo-icon.svg",
                order_id: orderData.id,
                handler: function (response: any) {
                    setJoined(true);
                },
                theme: {
                    color: "#6366f1" // primary color
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

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
