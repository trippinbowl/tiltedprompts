import Link from "next/link";
import { Button } from "@/components/indian-art/ui/button";
import { Input } from "@/components/indian-art/ui/input";
import { Card } from "@/components/indian-art/ui/card";
import { ArrowLeft } from "lucide-react";

export default function Register() {
    return (
        <div className="flex-1 flex flex-col justify-center items-center px-4 md:py-24 py-12">
            <div className="w-full max-w-[440px]">
                <Link href="/indian-art" className="inline-flex items-center text-sm text-[#1C1C1A]/50 hover:text-[#C84C31] transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
                <Card className="p-8 md:p-12">
                    <div className="mb-8">
                        <h1 className="text-3xl font-serif text-[#1C1C1A] mb-2">Create Account</h1>
                        <p className="text-[#1C1C1A]/60 font-light text-sm">Join TiltedPrompts and start building with AI.</p>
                    </div>

                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label htmlFor="firstName" className="text-xs font-mono uppercase tracking-wider text-[#1C1C1A]/70">First Name</label>
                                <Input id="firstName" type="text" placeholder="John" required />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="lastName" className="text-xs font-mono uppercase tracking-wider text-[#1C1C1A]/70">Last Name</label>
                                <Input id="lastName" type="text" placeholder="Doe" required />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-[#1C1C1A]/70">Email Address</label>
                            <Input id="email" type="email" placeholder="you@example.com" required />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="password" className="text-xs font-mono uppercase tracking-wider text-[#1C1C1A]/70">
                                Password
                            </label>
                            <Input id="password" type="password" placeholder="••••••••" required />
                        </div>

                        <Button type="submit" className="w-full mt-8">
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-[#1C1C1A]/10 text-center">
                        <p className="text-[#1C1C1A]/60 text-sm font-light">
                            Already have an account? <Link href="/indian-art/login" className="text-[#C84C31] hover:underline font-medium">Sign in</Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
