import Link from "next/link";
import Logo from "@/components/brand/Logo";

const footerLinks = {
  Products: [
    { label: "TiltedMCP", href: "/products/tilted-mcp" },
    { label: "TiltedVoice", href: "/products/tilted-voice" },
    { label: "TiltedCode", href: "/products/tilted-code" },
    { label: "The Laboratory", href: "/products/laboratory" },
  ],
  Explore: [
    { label: "Docs", href: "#" },
    { label: "Vibeathon", href: "/vibeathon" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Merch", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Roadmap", href: "#" },
    { label: "Contact Us", href: "/contact" },
    { label: "Sitemap", href: "#" },
  ],
  Community: [
    { label: "Discord", href: "#" },
    { label: "Affiliate Program", href: "#" },
    { label: "Partners", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--border-subtle)] bg-[var(--bg-1)]">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/20 to-transparent" />

      <div className="container-standard py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="text-[13px] text-[var(--text-3)] mt-6 leading-relaxed max-w-[280px]">
              Ship Software at the Speed of Thought. The agentic platform for builders who deploy, not debate.
            </p>
            <div className="flex gap-2.5 mt-8">
              {[
                { label: "X", icon: "X" },
                { label: "LinkedIn", icon: "in" },
                { label: "GitHub", icon: "GH" },
                { label: "YouTube", icon: "YT" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-9 h-9 rounded-[var(--radius-sm)] bg-white/[0.03] border border-[var(--border-subtle)] flex items-center justify-center text-[10px] uppercase font-bold text-[var(--text-3)] hover:text-white hover:border-[var(--border-hover)] hover:bg-white/[0.06] transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white mb-6">
                {heading}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[var(--text-2)] hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-[11px] font-medium text-[var(--text-3)] uppercase tracking-wider">
            &copy; {new Date().getFullYear()} TiltedPrompts. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <span className="text-[11px] font-medium text-[var(--text-3)] uppercase tracking-wider">
              Terms
            </span>
            <span className="text-[11px] font-medium text-[var(--text-3)] uppercase tracking-wider">
              Privacy
            </span>
            <span className="text-[11px] font-medium text-[var(--text-3)] flex items-center gap-2 uppercase tracking-wider">
              <span className="w-1 h-1 rounded-full bg-[var(--accent)] animate-pulse" />
              Systems Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
