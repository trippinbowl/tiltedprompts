import { Card } from "@/components/indian-art/ui/card";
import { Button } from "@/components/indian-art/ui/button";

export default function ExtensionsPage() {
    return (
        <div className="w-full">
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-serif text-[#1C1C1A] mb-2">Extensions</h1>
                    <p className="text-[#1C1C1A]/70 font-light">Connect external APIs, Databases, and MCP Servers.</p>
                </div>
                <Button>Browse Directory</Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-sm bg-[#1C1C1A]/5 flex items-center justify-center font-serif text-lg">GH</div>
                    <div className="flex-1">
                        <h3 className="text-xl font-serif text-[#1C1C1A] mb-1">GitHub Integration</h3>
                        <p className="text-[#1C1C1A]/60 text-sm mb-4 font-light">Read and write to repositories securely.</p>
                        <Button variant="outline" className="text-xs">Configure</Button>
                    </div>
                </Card>

                <Card className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-sm bg-[#1C1C1A]/5 flex items-center justify-center font-serif text-lg">N8</div>
                    <div className="flex-1">
                        <h3 className="text-xl font-serif text-[#1C1C1A] mb-1">n8n Workflow hook</h3>
                        <p className="text-[#1C1C1A]/60 text-sm mb-4 font-light">Trigger low-code automation pipelines.</p>
                        <Button variant="outline" className="text-xs">Configure</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
