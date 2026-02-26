"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/brand/Logo";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@/lib/constants";

const productIcons: Record<string, string> = {
  "tilted-mcp": "⚡",
  "tilted-code": "💻",
  "tilted-space": "🌐",
  "tilted-voice": "🎙️",
  "tilted-coin": "💰",
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-[var(--glass-bg-solid)] backdrop-blur-2xl border-b border-[var(--glass-border)] shadow-[0_1px_40px_rgba(0,0,0,0.3)]"
            : "bg-transparent"
        )}
      >
        <div className="container-standard flex items-center justify-between h-[72px]">
          <Logo />

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Products Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button
                className={cn(
                  "px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 flex items-center gap-1.5",
                  productsOpen
                    ? "text-white bg-white/[0.06]"
                    : "text-[var(--text-2)] hover:text-white hover:bg-white/[0.04]"
                )}
              >
                Products
                <svg
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200",
                    productsOpen && "rotate-180"
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {productsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[380px] rounded-[var(--radius-lg)] overflow-hidden"
                  >
                    {/* Glass card with stronger effect */}
                    <div className="bg-[var(--glass-bg-solid)] backdrop-blur-3xl border border-[var(--glass-border)] rounded-[var(--radius-lg)] p-2 shadow-[var(--shadow-xl)]">
                      {/* Product Grid */}
                      {PRODUCTS.map((product) => (
                        <Link
                          key={product.id}
                          href={product.href}
                          className="flex items-start gap-3.5 p-3.5 rounded-[var(--radius-md)] hover:bg-white/[0.04] transition-all duration-200 group"
                        >
                          <div
                            className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center text-lg shrink-0 transition-transform duration-200 group-hover:scale-110"
                            style={{
                              background: product.color + "15",
                              color: product.color,
                            }}
                          >
                            {productIcons[product.id] || "⚙️"}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold text-[var(--text-0)] group-hover:text-white transition-colors">
                              {product.name}
                            </div>
                            <div className="text-[12px] text-[var(--text-3)] mt-0.5 leading-relaxed">
                              {product.description}
                            </div>
                          </div>
                        </Link>
                      ))}

                      {/* Bottom CTA */}
                      <div className="border-t border-[var(--border-subtle)] mt-1.5 pt-2 px-1">
                        <Link
                          href="/products"
                          className="flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-sm)] text-[12px] font-medium text-[var(--text-2)] hover:text-[var(--primary-light)] hover:bg-white/[0.03] transition-all"
                        >
                          <span>View all products</span>
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/vibeathon"
              className="px-4 py-2 rounded-lg text-[13px] font-medium text-[var(--text-2)] hover:text-white hover:bg-white/[0.04] transition-all duration-200"
            >
              Vibeathon
            </Link>
            <Link
              href="/pricing"
              className="px-4 py-2 rounded-lg text-[13px] font-medium text-[var(--text-2)] hover:text-white hover:bg-white/[0.04] transition-all duration-200"
            >
              Pricing
            </Link>

            <div className="ml-4 flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-[13px] font-medium text-[var(--text-2)] hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Button href="/signup" variant="gradient" size="sm">
                Get Started
              </Button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-[var(--text-1)] hover:bg-white/[0.06] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <motion.div
              animate={mobileOpen ? "open" : "closed"}
              className="w-5 h-5 relative"
            >
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 6 },
                }}
                className="absolute left-0 top-1 w-5 h-[1.5px] bg-current block"
              />
              <motion.span
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 },
                }}
                className="absolute left-0 top-[9px] w-5 h-[1.5px] bg-current block"
              />
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -6 },
                }}
                className="absolute left-0 bottom-1 w-5 h-[1.5px] bg-current block"
              />
            </motion.div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu — Full Screen Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-[var(--bg-0)] border-l border-[var(--border-subtle)] lg:hidden overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 h-[72px] border-b border-[var(--border-subtle)]">
                <Logo />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-[var(--text-2)] hover:text-white hover:bg-white/[0.06] transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-6 py-8 flex flex-col gap-2">
                <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--text-3)] px-3 mb-3">
                  Products
                </p>
                {PRODUCTS.map((product) => (
                  <Link
                    key={product.id}
                    href={product.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3.5 px-3 py-3 rounded-[var(--radius-md)] hover:bg-white/[0.04] transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center text-lg"
                      style={{ background: product.color + "15", color: product.color }}
                    >
                      {productIcons[product.id] || "\u2699\uFE0F"}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-0)]">{product.name}</div>
                      <div className="text-xs text-[var(--text-3)]">{product.tagline}</div>
                    </div>
                  </Link>
                ))}

                <Link href="/vibeathon" onClick={() => setMobileOpen(false)} className="px-3 py-3 rounded-[var(--radius-sm)] text-[15px] font-medium text-[var(--text-1)] hover:text-white hover:bg-white/[0.04] transition-all">
                  Vibeathon
                </Link>
                <Link href="/pricing" onClick={() => setMobileOpen(false)} className="px-3 py-3 rounded-[var(--radius-sm)] text-[15px] font-medium text-[var(--text-1)] hover:text-white hover:bg-white/[0.04] transition-all">
                  Pricing
                </Link>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="px-3 py-3 rounded-[var(--radius-sm)] text-[15px] font-medium text-[var(--text-1)] hover:text-white hover:bg-white/[0.04] transition-all">
                  Log In
                </Link>

                <div className="mt-6">
                  <Button href="/signup" variant="gradient" size="lg" className="w-full justify-center">
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
