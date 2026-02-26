import { Card } from "@/components/indian-art/ui/card";
import { Button } from "@/components/indian-art/ui/button";

export default function AssetsPage() {
    return (
        <div className="w-full">
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-serif text-[#1C1C1A] mb-2">Assets</h1>
                    <p className="text-[#1C1C1A]/70 font-light">Shared files, keys, and knowledge bases.</p>
                </div>
                <Button>Upload Asset</Button>
            </div>

            <Card className="p-12 text-center border-dashed">
                <div className="text-4xl mb-4 opacity-50">📁</div>
                <h3 className="text-xl font-serif text-[#1C1C1A] mb-2">No assets uploaded yet</h3>
                <p className="text-[#1C1C1A]/60 text-sm mb-6 font-light max-w-sm mx-auto">
                    Drag and drop your PDFs, markdown files, and datasets here to make them available to your agents.
                </p>
                <Button variant="outline">Select Files</Button>
            </Card>
        </div>
    );
}
