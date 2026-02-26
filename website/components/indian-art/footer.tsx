export default function Footer() {
    return (
        <footer className="bg-[#FAF9F6] py-12 border-t border-[#1C1C1A]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-serif text-[#1C1C1A]">Tilted</span>
                    <span className="w-2 h-2 rounded-full bg-[#C84C31]" />
                </div>
                <p className="text-sm text-[#1C1C1A]/50 font-light">
                    © {new Date().getFullYear()} TiltedPrompts. Minimalist UI Version.
                </p>
                <div className="flex gap-6 text-sm">
                    <a href="#" className="text-[#1C1C1A]/60 hover:text-[#C84C31] transition-colors">Twitter</a>
                    <a href="#" className="text-[#1C1C1A]/60 hover:text-[#E28743] transition-colors">GitHub</a>
                    <a href="#" className="text-[#1C1C1A]/60 hover:text-[#2F4842] transition-colors">Discord</a>
                </div>
            </div>
        </footer>
    );
}
