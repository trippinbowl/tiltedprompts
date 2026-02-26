import { Card } from "@/components/indian-art/ui/card";
import { Button } from "@/components/indian-art/ui/button";

export default function AgentsPage() {
    return (
        <div className="w-full">
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-serif text-[#1C1C1A] mb-2">AI Agents</h1>
                    <p className="text-[#1C1C1A]/70 font-light">Manage your deployed autonomous companions.</p>
                </div>
                <Button>Deploy Agent</Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#E28743]/10 flex items-center justify-center text-[#E28743] font-serif text-lg">
                                Ag
                            </div>
                            <span className="text-xs font-mono px-2 py-1 bg-[#1C1C1A]/5 text-[#C84C31] rounded-sm uppercase">Active</span>
                        </div>
                        <h3 className="text-xl font-serif text-[#1C1C1A] mb-1">Creative Writer 0{i}</h3>
                        <p className="text-[#1C1C1A]/60 text-sm mb-6 font-light">Specialized in generating long-form copy and marketing materials.</p>
                        <div className="flex gap-2">
                            <Button variant="outline" className="w-full">Configure</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
