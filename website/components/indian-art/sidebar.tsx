"use client"

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const routes = [
    { name: "Dashboard", path: "/indian-art/members", icon: "gond_dashboard_1772136895862.png" },
    { name: "Agents", path: "/indian-art/members/agents", icon: "gond_agents_1772136809991.png" },
    { name: "Prompts", path: "/indian-art/members/prompts", icon: "gond_prompts_1772136823942.png" },
    { name: "Skills", path: "/indian-art/members/skills", icon: "gond_skills_1772136823942.png" }, // reusing prompts for skills for now if not generated
    { name: "Extensions", path: "/indian-art/members/extensions", icon: "gond_extensions_1772136837503.png" },
    { name: "Assets", path: "/indian-art/members/assets", icon: "gond_assets_1772136881090.png" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 border-r border-[#1C1C1A]/10 bg-[#FAF9F6]/80 backdrop-blur-md h-full flex flex-col pt-8 pb-4">
            <div className="px-6 mb-12">
                <Link href="/indian-art" className="text-xl font-medium tracking-tight font-serif text-[#1C1C1A] flex items-center gap-2">
                    TiltedPrompts
                    <span className="w-2 h-2 rounded-full bg-[#C84C31]" />
                </Link>
                <div className="text-[10px] uppercase tracking-widest text-[#1C1C1A]/50 mt-1 font-mono">Workspace</div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {routes.map((route) => {
                    const isActive = pathname === route.path;
                    return (
                        <Link
                            key={route.path}
                            href={route.path}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-md transition-all group relative overflow-hidden",
                                isActive ? "bg-[#1C1C1A]/5 text-[#C84C31]" : "text-[#1C1C1A]/70 hover:bg-[#1C1C1A]/5 hover:text-[#1C1C1A]"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C84C31]" />
                            )}
                            <div className="w-6 h-6 relative rounded-sm overflow-hidden flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity mix-blend-multiply">
                                <Image src={`/indian-art-icons/${route.icon}`} alt={route.name} fill className="object-cover" />
                            </div>
                            <span className="font-medium text-sm">{route.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="px-6 mt-auto">
                <div className="pt-6 border-t border-[#1C1C1A]/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E28743] flex items-center justify-center text-[#FAF9F6] font-serif italic text-sm">
                            AD
                        </div>
                        <div className="text-sm font-medium text-[#1C1C1A]">Admin User</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
