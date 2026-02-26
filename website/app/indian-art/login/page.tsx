import Link from "next/link";
import { Button } from "@/components/indian-art/ui/button";
import { Input } from "@/components/indian-art/ui/input";
import { Card } from "@/components/indian-art/ui/card";
import { ArrowLeft } from "lucide-react";

export default function Login() {
    return (
        <div className="flex-1 flex flex-col justify-center items-center px-4 md:py-24 py-12">
            <div className="w-full max-w-[400px]">
                <Link href="/indian-art" className="inline-flex items-center text-sm text-[#1C1C1A]/50 hover:text-[#C84C31] transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
                <Card className="p-8 md:p-12">
                    <div className="mb-8">
                        <h1 className="text-3xl font-serif text-[#1C1C1A] mb-2">Welcome Back</h1>
                        <p className="text-[#1C1C1A]/60 font-light text-sm">Sign in to your TiltedPrompts account.</p>
                    </div>

                    <form className="space-y-6">
                        <div className="space-y-1">
                            <label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-[#1C1C1A]/70">Email Address</label>
                            <Input id="email" type="email" placeholder="you@example.com" required />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="password" className="text-xs font-mono uppercase tracking-wider text-[#1C1C1A]/70 flex justify-between">
                                Password
                                <Link href="#" className="text-[#C84C31] hover:underline normal-case tracking-normal">Forgot?</Link>
                            </label>
                            <Input id="password" type="password" placeholder="••••••••" required />
                        </div>

                        <Button type="submit" className="w-full mt-8">
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-[#1C1C1A]/10 text-center">
                        <p className="text-[#1C1C1A]/60 text-sm font-light">
                            Don't have an account? <Link href="/indian-art/register" className="text-[#C84C31] hover:underline font-medium">Create one</Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
