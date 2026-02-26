'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Prompt {
    title: string;
    description: string;
    use_case: string;
    prompt_text: string;
}

interface PromptRendererProps {
    content: any;
}

export default function PromptRenderer({ content }: PromptRendererProps) {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    // Extract the prompts array, or fallback logic
    const prompts: Prompt[] = content?.prompts || [];

    // If it's the old format, let's artificially wrap it so we don't break existing bundles
    if (prompts.length === 0) {
        const fallbackText = content.prompt || (content.templates && content.templates[0]?.body) || JSON.stringify(content, null, 2);
        prompts.push({
            title: "Prompt",
            use_case: "General",
            description: "Here is your copy-paste ready template:",
            prompt_text: fallbackText
        });
    }

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleCopyAll = () => {
        const allText = prompts.map(p => p.prompt_text).join('\n\n---\n\n');
        navigator.clipboard.writeText(allText);
        setCopiedIndex(-1);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="space-y-12 w-full max-w-4xl text-gray-100">
            {prompts.map((prompt, idx) => {
                const encodedPrompt = encodeURIComponent(prompt.prompt_text);
                const chatGptLink = `https://chatgpt.com/?model=gpt-4&prompt=${encodedPrompt}`;

                return (
                    <div key={idx} className="flex flex-col gap-4">
                        {/* The description text above the box */}
                        <p className="text-gray-100 text-[15px] font-medium leading-relaxed font-sans">
                            {prompt.description || prompt.use_case || prompt.title}
                        </p>

                        {/* The Prompt Box */}
                        <div className="relative rounded-xl border border-[#2a2a2a] bg-[#141414] shadow-2xl overflow-hidden">

                            {/* Toolbar inside the box (Top Right) */}
                            <div className="flex justify-end p-3 gap-2 pb-0">
                                <a
                                    href={chatGptLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 px-2.5 py-1 bg-transparent hover:bg-[#2a2a2a] border border-[#333] text-gray-300 rounded text-[11px] font-bold uppercase tracking-wider transition-colors"
                                >
                                    <span className="w-2 h-2 rounded-full bg-[#10a37f] shadow-[0_0_6px_#10a37f]"></span>
                                    ChatGPT
                                </a>
                                <a
                                    href="https://claude.ai/new"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 px-2.5 py-1 bg-transparent hover:bg-[#2a2a2a] border border-[#333] text-gray-300 rounded text-[11px] font-bold uppercase tracking-wider transition-colors"
                                >
                                    <span className="w-2 h-2 rounded-full bg-[#D97757] shadow-[0_0_6px_#D97757]"></span>
                                    Claude
                                </a>
                                <a
                                    href="https://www.perplexity.ai/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 px-2.5 py-1 bg-transparent hover:bg-[#2a2a2a] border border-[#333] text-gray-300 rounded text-[11px] font-bold uppercase tracking-wider transition-colors"
                                >
                                    <span className="w-2.5 h-2.5 rounded-sm bg-gray-200 flex items-center justify-center">
                                        <span className="text-black text-[9px] font-black leading-none mt-[1px]">#</span>
                                    </span>
                                    Perplexity
                                </a>
                                <button
                                    onClick={() => handleCopy(prompt.prompt_text, idx)}
                                    className="flex items-center gap-1.5 px-2.5 py-1 bg-transparent hover:bg-[#2a2a2a] border border-[#333] text-gray-300 rounded text-[11px] font-bold uppercase tracking-wider transition-colors"
                                >
                                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copiedIndex === idx ? 'Copied' : 'Copy'}
                                </button>
                            </div>

                            {/* Prompt Content */}
                            <div className="p-6 pt-4 overflow-x-auto">
                                <pre className="text-[13px] text-gray-200 font-mono whitespace-pre-wrap leading-relaxed tracking-wide">
                                    {prompt.prompt_text}
                                </pre>
                            </div>
                        </div>
                    </div>
                );
            })}

            <div className="pt-8">
                <hr className="border-[#2a2a2a] mb-8" />
                <button
                    onClick={handleCopyAll}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors shadow-lg"
                >
                    {copiedIndex === -1 ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    Copy All Content
                </button>
            </div>
        </div>
    );
}
