import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="w-full border-b border-[#E28743]/20 bg-[#FAF9F6]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/indian-art" className="text-xl font-medium tracking-tight font-serif text-[#1C1C1A]">
                        TiltedPrompts
                    </Link>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#C84C31] bg-[#C84C31]/10 px-2 py-1 rounded-sm ml-2 rounded-tl-md rounded-br-md">
                        Mata Ni Pachedi
                    </span>
                </div>
                <div className="hidden md:flex gap-8 items-center text-sm font-medium">
                    <Link href="#features" className="text-[#1C1C1A]/70 hover:text-[#C84C31] transition-colors">Features</Link>
                    <Link href="#pricing" className="text-[#1C1C1A]/70 hover:text-[#C84C31] transition-colors">Pricing</Link>
                    <Link href="#docs" className="text-[#1C1C1A]/70 hover:text-[#C84C31] transition-colors">Docs</Link>
                    <Link href="/login" className="px-5 py-2.5 bg-[#1C1C1A] text-[#FAF9F6] rounded-sm hover:bg-[#C84C31] transition-colors font-serif italic text-sm">
                        Sign In
                    </Link>
                </div>
            </div>
        </nav>
    );
}
