import type { Metadata } from "next";
import { inter, sora, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "TiltedPrompts — Ship Software at the Speed of Thought",
  description:
    "The Vibe Coded Product AI Agency. High-performance MCP servers, Voice AI agents, vibe coding templates, and automated workflows. From intent to production.",
  keywords: [
    "MCP servers",
    "Voice AI",
    "vibe coding",
    "AI agency",
    "Model Context Protocol",
    "Next.js templates",
    "n8n workflows",
    "agentic AI",
  ],
  openGraph: {
    title: "TiltedPrompts — Ship Software at the Speed of Thought",
    description:
      "The Vibe Coded Product AI Agency. From intent to production.",
    url: "https://tiltedprompts.com",
    siteName: "TiltedPrompts",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TiltedPrompts — Ship Software at the Speed of Thought",
    description:
      "The Vibe Coded Product AI Agency. From intent to production.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
