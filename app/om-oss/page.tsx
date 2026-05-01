"use client";
import Link from "next/link";
import { useLang } from "@/components/LangContext";
import { tr } from "@/lib/i18n";

export default function OmOssPage() {
  const { lang } = useLang();
  const stats = [
    { icon: "🌅", tk: "about_stat1" as const, sk: "about_stat1s" as const },
    { icon: "🌿", tk: "about_stat2" as const, sk: "about_stat2s" as const },
    { icon: "🎂", tk: "about_stat3" as const, sk: "about_stat3s" as const },
    { icon: "❤️", tk: "about_stat4" as const, sk: "about_stat4s" as const },
  ];
  const features = [
    { icon: "🌾", tk: "about_f1_title" as const, dk: "about_f1_desc" as const },
    { icon: "⏰", tk: "about_f2_title" as const, dk: "about_f2_desc" as const },
    { icon: "🎁", tk: "about_f3_title" as const, dk: "about_f3_desc" as const },
    { icon: "🏷️", tk: "about_f4_title" as const, dk: "about_f4_desc" as const },
  ];

  return (
    <div style={{ background: "var(--black)", minHeight: "100vh", padding: "88px 0 0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div className="section-label">{tr(lang, "about_label")}</div>
          <h1 className="section-title" style={{ marginBottom: 4 }}>{tr(lang, "about_h1")}</h1>
          <div className="gold-divider"><div className="gold-divider-dot" /></div>
        </div>

        {/* Story + stats */}
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center", marginBottom: 80 }}>
          <div>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 14 }}>{tr(lang, "about_region")}</div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.1rem", fontWeight: 600, color: "var(--text)", lineHeight: 1.15, marginBottom: 22, letterSpacing: "-0.01em" }}>{tr(lang, "about_h2")}</h2>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.85, marginBottom: 16, fontSize: "0.95rem" }}>{tr(lang, "about_p1")}</p>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.85, fontSize: "0.95rem" }}>{tr(lang, "about_p2")}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {stats.map(s => (
              <div key={s.tk} style={{ background: "var(--black-card)", border: "1px solid var(--black-border)", borderRadius: "var(--radius-lg)", padding: "28px 20px", textAlign: "center", transition: "border-color 0.25s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--gold-border)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--black-border)")}>
                <div style={{ fontSize: "2rem", marginBottom: 10 }}>{s.icon}</div>
                <strong style={{ display: "block", fontFamily: "var(--font-serif)", fontSize: "1.15rem", fontWeight: 600, color: "var(--gold-light)", marginBottom: 5 }}>{tr(lang, s.tk)}</strong>
                <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", lineHeight: 1.5 }}>{tr(lang, s.sk)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* History section */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,transparent,var(--gold-border))" }} />
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 600, color: "var(--gold-light)", whiteSpace: "nowrap" }}>
              {tr(lang, "about_history_h2")}
            </h2>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,var(--gold-border),transparent)" }} />
          </div>
          <div className="history-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.9, fontSize: "0.97rem" }}>{tr(lang, "about_history_p1")}</p>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.9, fontSize: "0.97rem" }}>{tr(lang, "about_history_p2")}</p>
          </div>
        </div>

        {/* Features */}
        <div style={{ background: "var(--black-card)", border: "1px solid var(--black-border)", borderRadius: "var(--radius-xl)", padding: "48px", position: "relative", overflow: "hidden", marginBottom: 80 }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,var(--gold-dim),transparent)" }} />
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", fontWeight: 600, color: "var(--gold-light)" }}>{tr(lang, "about_proud_h2")}</h2>
            <div className="gold-divider" style={{ marginTop: 12 }}><div className="gold-divider-dot" /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 32 }}>
            {features.map(f => (
              <div key={f.tk} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 46, height: 46, background: "var(--black-mid)", border: "1px solid var(--black-border)", borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 600, color: "var(--text-soft)", marginBottom: 5 }}>{tr(lang, f.tk)}</h4>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.65 }}>{tr(lang, f.dk)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Find us — full-width section */}
      <section style={{ background: "#0a0906", borderTop: "1px solid #1a1608", padding: "72px 0 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-label">{tr(lang, "about_find_us_h2")}</div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>{tr(lang, "about_find_us_h2")}</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>{tr(lang, "about_find_us_sub")}</p>
          </div>

          <div className="find-us-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
            {/* Info */}
            <div style={{ display: "grid", gap: 20 }}>
              {[
                { icon: "📍", title: tr(lang, "contact_address_title"), lines: ["Manhellervegen 859", "6854 Kaupanger"] },
                { icon: "⏰", title: tr(lang, "contact_hours_title"), lines: ["Måndag: Stengt", "Tysdag – Sundag: 09:00 – 18:00"] },
                { icon: "📞", title: tr(lang, "contact_phone_title"), lines: ["97 05 00 42"], href: "tel:97050042" },
                { icon: "✉️", title: tr(lang, "contact_email_title"), lines: ["post@tdbakeri.no"], href: "mailto:post@tdbakeri.no" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 42, height: 42, background: "var(--black-card)", border: "1px solid var(--black-border)", borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 5 }}>{item.title}</div>
                    {item.lines.map((line, j) => (
                      item.href
                        ? <a key={j} href={item.href} style={{ display: "block", fontSize: "0.9rem", color: "var(--text-soft)", lineHeight: 1.6, transition: "color 0.2s" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "var(--gold-light)")}
                          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-soft)")}>{line}</a>
                        : <p key={j} style={{ fontSize: "0.9rem", color: "var(--text-soft)", lineHeight: 1.6 }}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 8 }}>
                <a href="https://www.google.com/maps/search/Manhellervegen+859+Kaupanger" target="_blank" rel="noopener noreferrer"
                  className="btn btn-outline" style={{ fontSize: "0.78rem", padding: "10px 22px" }}>
                  Opne i Google Maps →
                </a>
              </div>
            </div>

            {/* Map placeholder / visual */}
            <div style={{ background: "var(--black-card)", border: "1px solid var(--black-border)", borderRadius: "var(--radius-xl)", overflow: "hidden", aspectRatio: "4/3", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%,rgba(184,150,12,0.05),transparent 70%)" }} />
              <div style={{ fontSize: "3rem", filter: "drop-shadow(0 0 20px rgba(184,150,12,0.3))" }}>📍</div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", color: "var(--gold-light)", fontWeight: 600 }}>Manhellervegen 859</p>
                <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginTop: 4 }}>6854 Kaupanger, Norway</p>
              </div>
              <Link href="/kontakt" className="btn btn-outline" style={{ fontSize: "0.78rem", padding: "10px 22px", position: "relative" }}>
                {tr(lang, "nav_contact")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:768px){
          .about-grid{grid-template-columns:1fr !important;gap:40px !important}
          .history-grid{grid-template-columns:1fr !important;gap:20px !important}
          .find-us-grid{grid-template-columns:1fr !important;gap:32px !important}
        }
      `}</style>
    </div>
  );
}
