import { Card } from "@/components/indian-art/ui/card";
import { Button } from "@/components/indian-art/ui/button";
import Image from "next/image";

export default function DashboardOverview() {
    return (
        <div className="w-full">
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-serif text-[#1C1C1A] mb-2">Welcome, Admin</h1>
                    <p className="text-[#1C1C1A]/70 font-light">Here is an overview of your AI infrastructure.</p>
                </div>
                <Button>New Resource</Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <Card className="p-8 group relative overflow-hidden">
                    <div className="w-16 h-16 mb-6 relative mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity">
                        <Image src="/indian-art-icons/gond_agents_1772136809991.png" alt="Agents" fill className="object-cover" />
                    </div>
                    <h3 className="text-2xl font-serif text-[#1C1C1A] mb-2">Active Agents</h3>
                    <div className="text-5xl font-light font-serif text-[#C84C31]">4</div>
                    <p className="text-[#1C1C1A]/60 text-sm mt-4 font-light">Running seamlessly across workspaces.</p>
                </Card>

                <Card className="p-8 group relative overflow-hidden">
                    <div className="w-16 h-16 mb-6 relative mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity">
                        <Image src="/indian-art-icons/gond_prompts_1772136823942.png" alt="Prompts" fill className="object-cover" />
                    </div>
                    <h3 className="text-2xl font-serif text-[#1C1C1A] mb-2">Saved Prompts</h3>
                    <div className="text-5xl font-light font-serif text-[#E28743]">128</div>
                    <p className="text-[#1C1C1A]/60 text-sm mt-4 font-light">Available in your shared memory.</p>
                </Card>

                <Card className="p-8 group relative overflow-hidden">
                    <div className="w-16 h-16 mb-6 relative mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity">
                        <Image src="/indian-art-icons/gond_extensions_1772136837503.png" alt="Extensions" fill className="object-cover" />
                    </div>
                    <h3 className="text-2xl font-serif text-[#1C1C1A] mb-2">Extensions</h3>
                    <div className="text-5xl font-light font-serif text-[#1C1C1A]/80">12</div>
                    <p className="text-[#1C1C1A]/60 text-sm mt-4 font-light">Connected tools and APIs.</p>
                </Card>
            </div>
        </div>
    );
}
