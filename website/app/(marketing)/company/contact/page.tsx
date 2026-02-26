"use client";

import { Mail, MessageSquare, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");

        const formData = new FormData(e.currentTarget);
        const data = {
            name: `${formData.get("firstName")} ${formData.get("lastName")}`.trim(),
            email: formData.get("email"),
            company: formData.get("company"),
            message: formData.get("message"),
        };

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to send message");
            }

            setStatus("success");
            (e.target as HTMLFormElement).reset();
        } catch (err: any) {
            setStatus("error");
            setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-background">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-sans font-black tracking-tight mb-6">Let's Connect</h1>
                    <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">Have questions about our enterprise plans, agency services, or products? We're here to help.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Methods */}
                    <div className="space-y-8">
                        <div className="p-8 rounded-3xl border border-white/[0.08] bg-surface/30 flex items-start gap-5 hover:bg-surface/50 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <Mail className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-foreground">Email Us</h3>
                                <p className="text-muted-foreground mb-4 leading-relaxed tracking-wide font-light">For general inquiries, sales, and support.</p>
                                <a href="mailto:hello@tiltedprompts.com" className="text-primary hover:text-primary/80 transition font-medium">
                                    hello@tiltedprompts.com
                                </a>
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl border border-white/[0.08] bg-surface/30 flex items-start gap-5 hover:bg-surface/50 transition-colors">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                <MessageSquare className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2 text-foreground">Discord Community</h3>
                                <p className="text-muted-foreground mb-4 leading-relaxed tracking-wide font-light">Join our builder community for peer support and alpha access.</p>
                                <Link href="#" className="text-accent hover:text-accent/80 transition font-medium">
                                    Join Discord Server
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="p-8 md:p-10 rounded-3xl border border-white/[0.08] bg-surface/40 shadow-2xl relative overflow-hidden">
                        {status === "success" && (
                            <div className="absolute inset-0 bg-surface/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-300">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">Message Received</h3>
                                <p className="text-muted-foreground mb-8">We'll get back to you within 24 hours.</p>
                                <button onClick={() => setStatus("idle")} className="px-6 py-3 rounded-full bg-secondary text-foreground font-medium hover:bg-secondary/80 transition">
                                    Send Another Message
                                </button>
                            </div>
                        )}

                        <h3 className="text-2xl font-bold mb-8 text-foreground">Send a Message</h3>

                        {status === "error" && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-red-400">{errorMessage}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2 relative group">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">First Name</label>
                                    <input required name="firstName" type="text" className="w-full p-4 rounded-xl border border-white/[0.08] bg-black/20 text-foreground focus:border-primary focus:bg-black/40 outline-none transition-all placeholder:text-muted-foreground/30" placeholder="Jane" />
                                </div>
                                <div className="space-y-2 relative group">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Last Name</label>
                                    <input required name="lastName" type="text" className="w-full p-4 rounded-xl border border-white/[0.08] bg-black/20 text-foreground focus:border-primary focus:bg-black/40 outline-none transition-all placeholder:text-muted-foreground/30" placeholder="Doe" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2 relative group">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email Address</label>
                                    <input required name="email" type="email" className="w-full p-4 rounded-xl border border-white/[0.08] bg-black/20 text-foreground focus:border-primary focus:bg-black/40 outline-none transition-all placeholder:text-muted-foreground/30" placeholder="jane@example.com" />
                                </div>
                                <div className="space-y-2 relative group">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Company <span className="text-muted-foreground/30">(Optional)</span></label>
                                    <input name="company" type="text" className="w-full p-4 rounded-xl border border-white/[0.08] bg-black/20 text-foreground focus:border-primary focus:bg-black/40 outline-none transition-all placeholder:text-muted-foreground/30" placeholder="Acme Inc" />
                                </div>
                            </div>
                            <div className="space-y-2 relative group">
                                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Message</label>
                                <textarea required name="message" rows={5} className="w-full p-4 rounded-xl border border-white/[0.08] bg-black/20 text-foreground focus:border-primary focus:bg-black/40 outline-none transition-all resize-none placeholder:text-muted-foreground/30" placeholder="How can we help you?"></textarea>
                            </div>
                            <button
                                disabled={status === "loading"}
                                type="submit"
                                className="w-full h-14 mt-4 rounded-full bg-primary text-white font-bold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {status === "loading" ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send Message"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
