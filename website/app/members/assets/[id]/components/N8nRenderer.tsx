'use client';

import { useState } from 'react';
import { Copy, Check, Info } from 'lucide-react';

interface N8nRendererProps {
    content: any;
}

export default function N8nRenderer({ content }: N8nRendererProps) {
    const [copied, setCopied] = useState(false);
    const jsonString = JSON.stringify(content, null, 2);

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8">

            {/* Implementation Guide */}
            <div className="p-6 bg-accent/5 border border-accent/20 rounded-2xl">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-accent/20 rounded-lg shrink-0">
                        <Info className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-2 text-accent">How to import this workflow</h3>
                        <ol className="list-decimal ml-4 space-y-2 text-muted-foreground text-sm">
                            <li>Copy the giant JSON payload below.</li>
                            <li>Open your n8n instance and create a new blank workflow.</li>
                            <li>Click anywhere on the blank canvas and press <kbd className="font-mono bg-secondary px-1 py-0.5 rounded text-xs text-foreground">Ctrl/Cmd + V</kbd> to paste.</li>
                            <li>The visual nodes will instantly populate. Double click the credential nodes to add your API keys.</li>
                        </ol>
                    </div>
                </div>
            </div>

            {/* The JSON Viewer */}
            <div className="relative group">
                <div className="absolute right-4 top-4 flex gap-2 z-10">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1.5 bg-secondary/80 hover:bg-secondary backdrop-blur-md border border-border rounded-lg text-sm font-medium transition-colors"
                    >
                        {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy n8n JSON'}
                    </button>
                </div>

                <div className="p-6 bg-[#0a0a0a] border border-border rounded-2xl overflow-x-auto shadow-inner max-h-[500px]">
                    <pre className="text-sm text-blue-300 font-mono whitespace-pre-wrap leading-relaxed">
                        {jsonString}
                    </pre>
                </div>
            </div>

            {/* Credential Checklist Hook (Stub for later) */}
            <div className="p-6 border border-border border-dashed rounded-2xl flex justify-between items-center">
                <div>
                    <h4 className="font-bold mb-1">Implementation Checklist</h4>
                    <p className="text-sm text-muted-foreground">Download the exact API dependencies needed to run this flow.</p>
                </div>
                <button className="px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-xl font-medium transition">
                    Download PDF
                </button>
            </div>
        </div>
    );
}
