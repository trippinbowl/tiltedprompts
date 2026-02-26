import Link from 'next/link'
import Image from 'next/image'
import { login, signup } from './actions'

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message: string }
}) {
    return (
        <div className="flex min-h-screen relative">
            {/* ── Left brand panel (desktop only) ── */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface items-center justify-center">
                {/* Floating orbs */}
                <div className="absolute top-[20%] left-[20%] w-[300px] h-[300px] rounded-full bg-primary/15 blur-[100px]" />
                <div className="absolute bottom-[20%] right-[20%] w-[250px] h-[250px] rounded-full bg-accent/10 blur-[100px]" />

                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px]" />

                <div className="relative z-10 text-center px-12 max-w-md">
                    <Link href="/" className="inline-flex items-center gap-2.5 mb-10">
                        <Image
                            src="/logo-icon.svg"
                            alt="TiltedPrompts"
                            width={32}
                            height={32}
                            className="w-8 h-8"
                        />
                        <span className="text-xl tracking-tight text-foreground">
                            <span className="font-normal">Tilted</span><span className="font-bold">Prompts</span>
                        </span>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
                        Shared Memory &amp; Tools for AI Teammates
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Production-grade MCP infrastructure for the vibe coding generation. Ship software at the speed of thought.
                    </p>
                </div>
            </div>

            {/* ── Right form panel ── */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 relative">
                {/* Mobile back button */}
                <Link
                    href="/"
                    className="absolute left-6 top-6 py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.05] flex items-center gap-1.5 text-sm transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back
                </Link>

                <div className="w-full max-w-sm">
                    {/* Mobile logo */}
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

                    {/* Glass card */}
                    <div className="p-8 rounded-2xl border border-white/[0.06] bg-surface/50 backdrop-blur-xl">
                        <form className="flex flex-col gap-1 text-foreground">
                            <h1 className="text-2xl font-bold mb-1">Welcome Back</h1>
                            <p className="text-sm text-muted-foreground mb-6">Sign in to your account to continue.</p>

                            <label className="text-sm font-medium mb-1.5" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="h-11 rounded-xl px-4 bg-background/50 border border-white/[0.08] text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all mb-4"
                                name="email"
                                placeholder="you@example.com"
                                required
                                type="email"
                            />

                            <label className="text-sm font-medium mb-1.5" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="h-11 rounded-xl px-4 bg-background/50 border border-white/[0.08] text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all mb-6"
                                type="password"
                                name="password"
                                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                                required
                            />

                            <div className="flex flex-col gap-3">
                                <button
                                    formAction={login}
                                    className="h-11 bg-primary text-white hover:bg-primary/90 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary/20"
                                >
                                    Sign In
                                </button>

                                {/* Divider */}
                                <div className="flex items-center gap-3 my-1">
                                    <div className="flex-1 h-px bg-white/[0.06]" />
                                    <span className="text-xs text-muted-foreground">or</span>
                                    <div className="flex-1 h-px bg-white/[0.06]" />
                                </div>

                                <button
                                    formAction={signup}
                                    className="h-11 border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] text-foreground rounded-xl text-sm font-medium transition-all"
                                >
                                    Create Account
                                </button>
                            </div>

                            {searchParams?.message && (
                                <p className="mt-6 p-3 bg-destructive/10 text-destructive text-center rounded-xl border border-destructive/20 text-sm">
                                    {searchParams.message}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
