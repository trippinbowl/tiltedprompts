import { Card } from "@/components/indian-art/ui/card";
import { Button } from "@/components/indian-art/ui/button";

export default function SkillsPage() {
    return (
        <div className="w-full">
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-serif text-[#1C1C1A] mb-2">Skills Studio</h1>
                    <p className="text-[#1C1C1A]/70 font-light">Custom tools and capabilities for your agents.</p>
                </div>
                <Button>Create Skill</Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-6">
                        <h3 className="text-xl font-serif text-[#1C1C1A] mb-2">Web Scraper {i}</h3>
                        <p className="text-[#1C1C1A]/60 text-sm mb-6 font-light">
                            Puppeteer-based web scraping to extract semantic HTML from arbitrary URLs.
                        </p>
                        <div className="flex gap-2">
                            <span className="text-xs font-mono px-2 py-1 bg-[#1C1C1A]/5 rounded-sm uppercase">Node.js</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
