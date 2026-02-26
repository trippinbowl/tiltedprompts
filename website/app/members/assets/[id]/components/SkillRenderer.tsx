'use client';

import { useState } from 'react';
import { Download, Terminal, FileCode2, Copy, Check } from 'lucide-react';

interface SkillRendererProps {
    content: any;
}

export default function SkillRenderer({ content }: SkillRendererProps) {
    const [copied, setCopied] = useState(false);
    const codeString = JSON.stringify(content, null, 2);

    const handleCopycmd = () => {
        navigator.clipboard.writeText("@Claw run skill");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8">
            {/* Deployment Instructions */}
            <div className="p-6 bg-accent/5 border border-accent/20 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-bold text-lg mb-4 text-accent flex items-center gap-2"><Terminal className="w-5 h-5" /> How to Deploy</h3>
                    <ol className="list-decimal ml-4 space-y-3 text-muted-foreground text-sm">
                        <li>Download the Skill `.zip` package.</li>
                        <li>Extract the contents into your OpenClaw `/skills` directory.</li>
                        <li>Restart your OpenClaw agent to register the new intents.</li>
                        <li>Ping your agent in Slack to trigger the workflow!</li>
                    </ol>
                </div>
                <div className="flex flex-col justify-center items-center p-6 border border-border border-dashed rounded-xl bg-background text-center">
                    <FileCode2 className="w-10 h-10 text-muted-foreground mb-4" />
                    <h4 className="font-bold mb-1">Skill Archive</h4>
                    <p className="text-xs text-muted-foreground mb-4">Contains `manifest.yaml` and logic files.</p>
                    <button className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition shadow-lg shadow-primary/20">
                        <Download className="w-4 h-4" /> Download .zip
                    </button>
                </div>
            </div>

            {/* Usage Example */}
            <div>
                <h4 className="font-bold mb-3">Example Trigger Command</h4>
                <div className="relative group">
                    <button
                        onClick={handleCopycmd}
                        className="absolute right-3 top-3 p-2 bg-secondary/80 hover:bg-secondary rounded-md"
                    >
                        {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <div className="p-4 bg-[#0a0a0a] border border-border rounded-xl font-mono text-sm text-green-400">
                        @Claw run skill
                    </div>
                </div>
            </div>

            {/* Inspect Payload */}
            <div>
                <h4 className="font-bold mb-3">Skill Configuration Payload</h4>
                <div className="p-4 bg-[#0a0a0a] border border-border rounded-xl overflow-x-auto">
                    <pre className="text-sm text-gray-400 font-mono whitespace-pre-wrap">
                        {codeString}
                    </pre>
                </div>
            </div>
        </div>
    );
}
