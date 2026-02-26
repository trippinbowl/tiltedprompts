import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden selection:bg-[#E28743]/30">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <h1 className="text-5xl md:text-7xl font-serif font-light text-[#1C1C1A] leading-tight tracking-tight mb-8">
                    Intelligent infra for the <br />
                    <span className="italic text-[#C84C31]">vibe coding</span> generation.
                </h1>
                <p className="mt-6 text-xl text-[#1C1C1A]/70 max-w-2xl mx-auto font-sans font-light leading-relaxed">
                    Production-grade MCP infrastructure, voice AI, and developer tools.
                    The connective tissue every AI teammate needs to build software at the speed of thought.
                </p>
                <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link
                        href="/register"
                        className="group px-8 py-4 bg-[#C84C31] text-[#FAF9F6] text-lg font-serif italic hover:bg-[#A33D27] transition-all flex items-center gap-2 rounded-tr-xl rounded-bl-xl shadow-[4px_4px_0px_0px_#1C1C1A] hover:shadow-[2px_2px_0px_0px_#1C1C1A] hover:translate-x-[2px] hover:translate-y-[2px]"
                    >
                        Start Building
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/docs"
                        className="px-8 py-4 border border-[#E28743] text-[#1C1C1A] text-lg hover:bg-[#E28743]/10 transition-colors rounded-sm"
                    >
                        Read the Docs
                    </Link>
                </div>
            </div>

            {/* Decorative Gond-inspired circles */}
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full border border-[#C84C31]/20 -z-10 pattern-dots" />
            <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#E28743]/5 blur-3xl -z-10" />
        </section>
    );
}
