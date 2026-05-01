"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import OpenStatus from "./OpenStatus";
import LangSwitcher from "./LangSwitcher";
import { useLang } from "./LangContext";
import { useCart } from "./CartContext";
import { tr } from "@/lib/i18n";

export default function Navbar() {
  const { lang } = useLang();
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { href: "/meny", label: tr(lang, "nav_menu"), highlight: true },
    { href: "/bestill-kake", label: tr(lang, "nav_order"), highlight: false },
    { href: "/om-oss", label: tr(lang, "nav_about"), highlight: false },
    { href: "/kontakt", label: tr(lang, "nav_contact"), highlight: false },
  ];

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 200,
      background: scrolled ? "rgba(8,8,8,0.98)" : "rgba(8,8,8,0.82)",
      backdropFilter: "blur(20px)",
      borderBottom: scrolled ? "1px solid #1e1a0e" : "1px solid transparent",
      transition: "all 0.3s",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ position: "relative", width: 40, height: 40 }}>
              <Image src="/images/logo.png" alt="T&D Bakeri" fill style={{ objectFit: "contain", filter: "drop-shadow(0 0 8px rgba(184,150,12,0.4))" }} />
            </div>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", fontWeight: 600, letterSpacing: "0.03em", background: "linear-gradient(135deg,#f0c040 0%,#b8960c 55%,#d4a820 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              T&amp;D Bakeri
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="nav-desktop" style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {links.map(l => (
              <li key={l.href}>
                <Link href={l.href}
                  style={{ fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: l.highlight ? "var(--gold-light)" : "var(--text-muted)", transition: "color 0.2s", position: "relative" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#d4a820")}
                  onMouseLeave={e => (e.currentTarget.style.color = l.highlight ? "var(--gold-light)" : "var(--text-muted)")}>
                  {l.label}
                  {l.href === "/meny" && count > 0 && (
                    <span style={{ position: "absolute", top: -8, right: -12, background: "var(--gold)", color: "var(--black)", borderRadius: "50%", width: 16, height: 16, fontSize: "0.6rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {count}
                    </span>
                  )}
                </Link>
              </li>
            ))}
            <li><OpenStatus compact /></li>
            <li><LangSwitcher /></li>
            <li>
              <Link href="/meny" className="btn btn-gold" style={{ padding: "9px 22px", fontSize: "0.75rem" }}>
                {tr(lang, "nav_cta")}
              </Link>
            </li>
          </ul>

          {/* Mobile toggle */}
          <div style={{ display: "none" }} className="nav-mobile-right">
            {count > 0 && (
              <Link href="/meny" style={{ position: "relative", marginRight: 12, color: "var(--gold-light)" }}>
                🛒
                <span style={{ position: "absolute", top: -6, right: -8, background: "var(--gold)", color: "var(--black)", borderRadius: "50%", width: 16, height: 16, fontSize: "0.6rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{count}</span>
              </Link>
            )}
            <button onClick={() => setOpen(!open)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#d4a820", padding: 6 }}
              aria-label="Toggle menu">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2}>
                {open
                  ? <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
                  : <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ background: "#0a0a0a", borderTop: "1px solid #1e1a0e", padding: "20px 28px 28px" }}>
          <ul style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 20 }}>
            {links.map(l => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", fontSize: "0.95rem", fontWeight: 500, color: l.highlight ? "var(--gold-light)" : "var(--text-muted)", borderBottom: "1px solid #181818", letterSpacing: "0.03em" }}>
                  {l.label}
                  {l.href === "/meny" && count > 0 && (
                    <span style={{ background: "var(--gold)", color: "var(--black)", borderRadius: 50, padding: "2px 8px", fontSize: "0.72rem", fontWeight: 700 }}>{count}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
            <OpenStatus compact />
            <LangSwitcher />
          </div>
          <Link href="/meny" onClick={() => setOpen(false)} className="btn btn-gold"
            style={{ width: "100%", padding: "14px 0", fontSize: "0.85rem" }}>
            {tr(lang, "nav_cta")}
          </Link>
        </div>
      )}

      <style>{`
        @media(max-width:900px){
          .nav-desktop{display:none !important;}
          .nav-mobile-right{display:flex !important;align-items:center;}
        }
      `}</style>
    </nav>
  );
}
