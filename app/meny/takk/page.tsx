"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLang } from "@/components/LangContext";
import { tr } from "@/lib/i18n";

function TakkContent() {
  const { lang } = useLang();
  const params = useSearchParams();
  const orderId = params.get("id");
  const type = params.get("type") as "eat-in" | "take-away" | null;

  return (
    <div style={{ background: "var(--black)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "88px 28px" }}>
      <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", fontSize: "2rem" }}>
          ✓
        </div>
        <div className="section-label" style={{ marginBottom: 16 }}>{tr(lang, "regular_takk_label")}</div>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 600, color: "var(--text)", marginBottom: 16, lineHeight: 1.1 }}>
          {tr(lang, "regular_takk_h1")}
        </h1>
        <div className="gold-divider"><div className="gold-divider-dot" /></div>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", lineHeight: 1.8, margin: "20px 0 36px" }}>
          {tr(lang, "regular_takk_sub")}
        </p>

        {type && (
          <div style={{ background: "var(--black-card)", border: "1px solid var(--black-border)", borderRadius: "var(--radius-lg)", padding: "20px 24px", marginBottom: 32, textAlign: "left" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 8 }}>
              {type === "eat-in" ? tr(lang, "regular_takk_type_eat_in") : tr(lang, "regular_takk_type_take_away")}
            </div>
            {type === "take-away" && (
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                Manhellervegen 859, 6854 Kaupanger
              </p>
            )}
            {type === "eat-in" && (
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                {tr(lang, "regular_takk_eat_in_msg")}
              </p>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/meny" className="btn btn-gold">{tr(lang, "regular_takk_back")}</Link>
          <Link href="/" className="btn btn-outline">{tr(lang, "takk_home")}</Link>
        </div>

        <p style={{ marginTop: 32, fontSize: "0.84rem", color: "var(--text-dim)" }}>
          {tr(lang, "takk_contact")} <a href="tel:97050042" style={{ color: "var(--gold-light)" }}>97 05 00 42</a>
        </p>
        {orderId && (
          <p style={{ marginTop: 8, fontSize: "0.72rem", color: "var(--text-dim)", fontFamily: "monospace" }}>
            #{orderId}
          </p>
        )}
      </div>
    </div>
  );
}

export default function RegularTakkPage() {
  return (
    <Suspense>
      <TakkContent />
    </Suspense>
  );
}
