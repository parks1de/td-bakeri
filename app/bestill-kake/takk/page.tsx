"use client";
import Link from "next/link";
import { useLang } from "@/components/LangContext";
import { tr } from "@/lib/i18n";
export default function TakkPage() {
  const { lang } = useLang();
  return (
    <div style={{ background:"var(--black)",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 28px" }}>
      <div style={{ maxWidth:580,textAlign:"center",width:"100%" }}>
        <div style={{ fontSize:"4.5rem",marginBottom:24,filter:"drop-shadow(0 0 24px rgba(184,150,12,0.3))" }}>🎂</div>
        <div className="section-label">{tr(lang,"takk_label")}</div>
        <h1 className="section-title" style={{ margin:"16px 0 8px" }}>{tr(lang,"takk_h1")}</h1>
        <div className="gold-divider"><div className="gold-divider-dot"/></div>
        <p style={{ color:"var(--text-muted)",fontSize:"1rem",lineHeight:1.8,margin:"20px 0 36px" }}>
          {tr(lang,"takk_sub")}{" "}
          {tr(lang,"takk_contact")}{" "}
          <a href="tel:97050042" style={{ color:"var(--gold-light)" }}>97 05 00 42</a>{" "}
          {tr(lang,"takk_or")}{" "}
          <a href="mailto:post@tdbakeri.no" style={{ color:"var(--gold-light)" }}>post@tdbakeri.no</a>.
        </p>
        <div style={{ display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap" }}>
          <Link href="/" className="btn btn-gold">{tr(lang,"takk_home")}</Link>
          <Link href="/meny" className="btn btn-outline">{tr(lang,"takk_menu")}</Link>
        </div>
        <div style={{ marginTop:48,background:"var(--black-card)",border:"1px solid var(--gold-border)",borderRadius:"var(--radius-lg)",padding:"24px 28px",position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,var(--gold-dim),transparent)" }}/>
          <h3 style={{ fontFamily:"var(--font-serif)",fontSize:"1.15rem",fontWeight:600,color:"var(--gold-light)",marginBottom:12 }}>{tr(lang,"takk_pickup_title")}</h3>
          <p style={{ color:"var(--text-muted)",fontSize:"0.9rem",lineHeight:1.75 }}>
            {tr(lang,"takk_pickup_addr")}<br/>
            {tr(lang,"takk_pickup_hours")}
          </p>
        </div>
      </div>
    </div>
  );
}
