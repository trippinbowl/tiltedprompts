import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DocsPage() {
    return (
        <>
            <Link href="/indian-art" className="inline-flex items-center text-sm text-[#1C1C1A]/50 hover:text-[#C84C31] transition-colors mb-8 group not-prose">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Home
            </Link>

            <h1>Documentation</h1>
            <p className="text-xl text-[#1C1C1A]/60 mb-12">
                A comprehensive guide to building with TiltedPrompts' minimalist infra,
                combining modern capabilities with an appreciation for deep spatial aesthetics.
            </p>

            <h2>Introduction</h2>
            <p>
                Welcome to the official documentation. TiltedPrompts is designed for the vibe coding generation, offering an elegant approach to AI orchestration. Our infrastructure is completely editor-agnostic, allowing you to compose memory, voice, and tools seamlessly.
            </p>

            <h2>Setting Up</h2>
            <p>
                Begin by configuring your workspace. All interconnected services flow through a single, authenticated API layer designed for maximum throughput and minimum latency.
            </p>
            <pre className="bg-[#1C1C1A] text-[#FAF9F6] p-4 rounded-md font-mono text-sm overflow-x-auto not-prose shadow-lg shadow-[#1C1C1A]/10 mt-6 mb-8 border border-[#E28743]/20">
                <code>npm install @tiltedprompts/core</code>
            </pre>

            <h2>Core Concepts</h2>
            <ul>
                <li><strong>Agents:</strong> Autonomous entities that process sequences of prompts.</li>
                <li><strong>Memory:</strong> Shared contextual graph database for all your agents.</li>
                <li><strong>Extensions:</strong> External tool integrations utilizing the Model Context Protocol (MCP).</li>
            </ul>

            <p>
                For more detailed examples, please visit our <a href="#">GitHub Repository</a>.
            </p>
        </>
    );
}
