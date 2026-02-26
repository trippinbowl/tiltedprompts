import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TiltedPrompts — Shared Memory & Tools for AI Teammates",
  description: "Production-grade MCP infrastructure, voice AI, and developer tools for the vibe coding generation. Editor-agnostic. The connective tissue every AI teammate needs.",
  keywords: "MCP servers, AI memory, vibe coding, agent memory, TiltedMCP, developer tools, AI infrastructure, Claude Code, Cursor, Antigravity",
  openGraph: {
    title: "TiltedPrompts — Shared Memory & Tools for AI Teammates",
    description: "Production-grade MCP infrastructure for the vibe coding generation. Ship software at the speed of thought.",
    type: "website",
    url: "https://tiltedprompts.com",
    siteName: "TiltedPrompts",
  },
  twitter: {
    card: "summary_large_image",
    title: "TiltedPrompts — Shared Memory for AI Teammates",
    description: "Production-grade MCP infrastructure for the vibe coding generation.",
  },
  icons: {
    icon: "/logo-icon.svg",
    shortcut: "/logo-icon.svg",
    apple: "/logo-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background font-sans grain-overlay`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
