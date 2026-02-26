import { Card } from "@/components/indian-art/ui/card";
import { Button } from "@/components/indian-art/ui/button";

export default function PromptsPage() {
    return (
        <div className="w-full">
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-serif text-[#1C1C1A] mb-2">Prompt Library</h1>
                    <p className="text-[#1C1C1A]/70 font-light">Shared memory of all your system and user prompts.</p>
                </div>
                <Button>New Prompt</Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="p-6">
                        <h3 className="text-xl font-serif text-[#1C1C1A] mb-2">System Initializer {i}</h3>
                        <p className="text-[#1C1C1A]/60 text-sm mb-6 font-light line-clamp-2">
                            You are a helpful, expert AI assistant. Your responses should be concise, highly analytical, and follow the vibe coding principles strictly.
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" className="text-xs py-2 px-4">Edit</Button>
                            <Button variant="ghost" className="text-xs py-2 px-4">Copy</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
