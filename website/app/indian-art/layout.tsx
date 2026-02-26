import { Playfair_Display } from "next/font/google";
import Navbar from "@/components/indian-art/navbar";
import Footer from "@/components/indian-art/footer";

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

function AbstractBackground() {
    return (
        <div className="fixed inset-0 min-w-full min-h-full pointer-events-none z-0 overflow-hidden opacity-[0.2]">
            <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M-100,500 C400,300 800,900 1500,200" fill="none" stroke="#C84C31" strokeWidth="2" />
                <path d="M-200,800 C300,900 900,100 1800,400" fill="none" stroke="#E28743" strokeWidth="1.5" strokeOpacity="0.7" />
                <path d="M0,200 C500,600 1000,150 1600,800" fill="none" stroke="#1C1C1A" strokeWidth="1" strokeOpacity="0.4" />

                <path d="M1000,-100 C1200,300 1400,700 800,1200" fill="none" stroke="#C84C31" strokeWidth="0.5" strokeOpacity="0.5" strokeDasharray="10, 10" />

                <circle cx="15%" cy="30%" r="40vw" fill="url(#grad1)" opacity="0.15" />
                <circle cx="85%" cy="80%" r="50vw" fill="url(#grad2)" opacity="0.15" />
                <defs>
                    <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#C84C31" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                    <radialGradient id="grad2" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#E28743" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>
            </svg>
        </div>
    );
}

export default function IndianArtLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${playfair.variable} bg-[#FAF9F6] text-[#1C1C1A] min-h-screen relative z-10 flex flex-col font-sans selection:bg-[#E28743]/30`}>
            <AbstractBackground />
            <Navbar />
            <main className="flex-1 flex flex-col relative z-10">{children}</main>
            <Footer />
        </div>
    );
}
