'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg('')

        const supabase = createClient()
        const { error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            setErrorMsg(error.message)
            setLoading(false)
            return
        }

        // Success animation triggers
        setSuccess(true)
        setLoading(false)

        // Wait a beat before redirecting to members area
        setTimeout(() => {
            router.push('/members')
            router.refresh()
        }, 800)
    }

    return (
        <div className="flex min-h-screen relative bg-background">
            {/* ── Left brand panel (desktop only) ── */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface items-center justify-center">
                <div className="absolute top-[30%] right-[15%] w-[350px] h-[350px] rounded-full bg-accent/12 blur-[110px]" />
                <div className="absolute bottom-[15%] left-[20%] w-[280px] h-[280px] rounded-full bg-primary/15 blur-[100px]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px]" />

                <div className="relative z-10 text-center px-12 max-w-md">
                    <Link href="/" className="inline-flex items-center gap-2.5 mb-10 group">
                        <Image
                            src="/logo-icon.svg"
                            alt="TiltedPrompts"
                            width={32}
                            height={32}
                            className="w-8 h-8 group-hover:scale-105 transition-transform"
                        />
                        <span className="text-xl tracking-tight text-foreground">
                            <span className="font-normal">Tilted</span><span className="font-bold">Prompts</span>
                        </span>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
                        Join the Builder Economy
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Get access to production-grade MCP servers, voice AI, developer templates, and a community of vibe coders building the future.
                    </p>
                </div>
            </div>

            {/* ── Right form panel ── */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 relative overflow-hidden">
                <Link
                    href="/"
                    className="absolute left-6 top-6 py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.05] flex items-center gap-1.5 text-sm transition-colors z-20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                    Back
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full max-w-sm relative z-10"
                >
                    <div className="lg:hidden flex items-center justify-center gap-2.5 mb-10">
                        <Image
                            src="/logo-icon.svg"
                            alt="TiltedPrompts"
                            width={28}
                            height={28}
                            className="w-7 h-7"
                        />
                        <span className="text-lg tracking-tight text-foreground">
                            <span className="font-normal">Tilted</span><span className="font-bold">Prompts</span>
                        </span>
                    </div>

                    <div className="p-8 rounded-2xl border border-border/50 bg-surface/50 backdrop-blur-xl relative overflow-hidden">

                        {/* Success Overlay Fill */}
                        <motion.div
                            initial={false}
                            animate={{ opacity: success ? 1 : 0 }}
                            className="absolute inset-0 bg-primary/10 backdrop-blur-sm z-20 flex flex-col items-center justify-center pt-8 border-t-2 border-primary"
                            style={{ pointerEvents: success ? 'auto' : 'none' }}
                        >
                            <motion.div
                                animate={success ? { scale: [0.5, 1.2, 1] } : { scale: 0 }}
                                transition={{ duration: 0.4, type: "spring" }}
                            >
                                <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4 drop-shadow-lg" />
                            </motion.div>
                            <p className="font-bold text-foreground text-lg">Account Created</p>
                            <p className="text-muted-foreground text-sm">Redirecting to dashboard...</p>
                        </motion.div>

                        <form onSubmit={handleSignup} className="flex flex-col gap-1 text-foreground">
                            <h1 className="text-2xl font-bold mb-1">Create Account</h1>
                            <p className="text-sm text-muted-foreground mb-6">Start building with TiltedPrompts today.</p>

                            <label className="text-sm font-medium mb-1.5" htmlFor="email">Email</label>
                            <input
                                className="h-11 rounded-lg px-4 bg-background/50 border border-border/50 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all mb-4"
                                name="email"
                                placeholder="you@example.com"
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading || success}
                            />

                            <label className="text-sm font-medium mb-1.5" htmlFor="password">Password</label>
                            <input
                                className="h-11 rounded-lg px-4 bg-background/50 border border-border/50 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all mb-6"
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading || success}
                            />

                            <div className="flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={loading || success}
                                    className="h-11 flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-semibold transition-all shadow-sm disabled:opacity-70"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign Up'}
                                </button>

                                <div className="flex items-center gap-3 my-1">
                                    <div className="flex-1 h-px bg-border/50" />
                                    <span className="text-xs text-muted-foreground">or</span>
                                    <div className="flex-1 h-px bg-border/50" />
                                </div>

                                <Link
                                    href="/login"
                                    className="h-11 flex items-center justify-center border border-border/50 bg-surface/30 hover:bg-surface text-foreground rounded-lg text-sm font-medium transition-all"
                                >
                                    I already have an account
                                </Link>
                            </div>

                            {errorMsg && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-6 p-3 bg-red-500/10 text-red-500 text-center rounded-lg border border-red-500/20 text-sm"
                                >
                                    {errorMsg}
                                </motion.p>
                            )}
                        </form>
                    </div>

                    <p className="text-xs text-muted-foreground text-center mt-6">
                        By signing up, you agree to our{" "}
                        <Link href="/terms" className="text-foreground hover:text-primary transition-colors">Terms</Link>
                        {" "}&amp;{" "}
                        <Link href="/privacy" className="text-foreground hover:text-primary transition-colors">Privacy Policy</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
