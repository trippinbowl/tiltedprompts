'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function UpgradeButton() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

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
                    setSuccess(true);
                    setLoading(false);
                    // Refresh the route after showing the success modal for 2s
                    setTimeout(() => {
                        router.refresh();
                    }, 2000);
                },
                theme: {
                    color: "#6366f1" // primary color
                }
            };

            const paymentObject = new (window as any).Razorpay(options);

            // Handle when the user closes the modal without paying
            paymentObject.on('payment.failed', function () {
                setLoading(false);
            });
            // We cannot hook into simple closure natively with old razorpay reliably unless checking `paymentObject?.close` isn't triggered
            // So we manually listen to modal closes roughly via polling or assume loading halts if they click away.
            window.addEventListener('message', (event) => {
                if (event.data?.eventName === 'close') {
                    setLoading(false);
                }
            });

            paymentObject.open();

        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again later.');
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full">
            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-emerald-500/10 backdrop-blur-sm border-2 border-emerald-400 rounded-xl"
                    >
                        <motion.div
                            animate={{ scale: [0.5, 1.2, 1] }}
                            transition={{ duration: 0.4, type: "spring" }}
                        >
                            <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2 drop-shadow-md" />
                        </motion.div>
                        <p className="text-sm font-bold text-emerald-400">Pro Unlocked!</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={handleUpgrade}
                disabled={loading || success}
                className="w-full relative flex items-center justify-center h-12 bg-foreground text-background font-bold rounded-xl hover:bg-foreground/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 min-w-[200px] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 text-background animate-spin" />
                ) : (
                    'Join the Pro Waitlist'
                )}
            </button>
        </div>
    );
}
