"use client";
import Link from "next/link";
import Image from "next/image";
import OpenStatus from "@/components/OpenStatus";
import { useLang } from "@/components/LangContext";
import { tr } from "@/lib/i18n";
import { useEffect, useState } from "react";
import type { MenuItem } from "@/lib/menu";

const CAT_ICON: Record<string,string> = { Kaker:"🎂", Bakverk:"🥐", Brod:"🍞" };

export default function HomePage() {
  const { lang } = useLang();
  const [items, setItems] = useState<MenuItem[]>([]);
  useEffect(() => {
    fetch("/api/menu/public").then(r=>r.json()).then(d=>setItems(d.slice(0,3))).catch(()=>{});
  },[]);

  return (
    <>
      {/* ── Hero ────────────────────────────────── */}
      <section style={{ background:"linear-gradient(160deg,#060606 0%,#0c0b04 100%)",padding:"108px 0 88px",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:"40%",left:"50%",transform:"translate(-50%,-50%)",width:800,height:800,background:"radial-gradient(ellipse,rgba(184,150,12,0.06) 0%,transparent 68%)",pointerEvents:"none" }}/>
        <div style={{ position:"absolute",bottom:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(184,150,12,0.2),transparent)" }}/>
        <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 28px",position:"relative" }}>
          <div className="hero-grid" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:72,alignItems:"center" }}>
            <div>
              <div className="section-label">{tr(lang,"hero_label")}</div>
              <h1 style={{ fontFamily:"var(--font-serif)",fontSize:"clamp(2.8rem,5.5vw,4.2rem)",fontWeight:600,lineHeight:1.1,color:"var(--text)",marginBottom:22,letterSpacing:"-0.01em" }}>
                {tr(lang,"hero_h1a")}{" "}
                <span style={{ background:"linear-gradient(135deg,#f0c040 0%,#b8960c 55%,#d4a820 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text" }}>
                  {tr(lang,"hero_h1b")}
                </span>
                {tr(lang,"hero_h1c")}
              </h1>
              <p style={{ color:"var(--text-muted)",fontSize:"1rem",maxWidth:450,marginBottom:36,lineHeight:1.8 }}>
                {tr(lang,"hero_sub")}
              </p>
              <div style={{ display:"flex",gap:14,flexWrap:"wrap",marginBottom:36 }}>
                <Link href="/bestill-kake" className="btn btn-gold">{tr(lang,"hero_cta1")}</Link>
                <Link href="/meny" className="btn btn-outline">{tr(lang,"hero_cta2")}</Link>
              </div>
              <OpenStatus />
            </div>
            <div style={{ display:"flex",justifyContent:"center",alignItems:"center",position:"relative" }}>
              <div style={{ width:360,height:360,borderRadius:"50%",border:"1px solid rgba(184,150,12,0.14)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
                <div style={{ width:296,height:296,borderRadius:"50%",border:"1px solid rgba(184,150,12,0.28)",display:"flex",alignItems:"center",justifyContent:"center",background:"radial-gradient(circle,rgba(184,150,12,0.04),transparent)" }}>
                  <div style={{ position:"relative",width:200,height:200 }}>
                    <Image src="/images/logo.png" alt="T&D Bakeri" fill style={{ objectFit:"contain",filter:"drop-shadow(0 0 32px rgba(184,150,12,0.28))",animation:"logoFloat 5s ease-in-out infinite" }}/>
                  </div>
                </div>
              </div>
              <div style={{ position:"absolute",top:"8%",left:"-2%",background:"#111",border:"1px solid #2a2010",borderRadius:14,padding:"13px 18px",textAlign:"center",boxShadow:"0 8px 28px rgba(0,0,0,0.6)" }}>
                <strong style={{ display:"block",fontFamily:"var(--font-serif)",fontSize:"1.35rem",fontWeight:600,color:"var(--gold-light)" }}>{tr(lang,"hero_stat1")}</strong>
                <small style={{ fontSize:"0.7rem",color:"var(--text-dim)",letterSpacing:"0.05em" }}>{tr(lang,"hero_stat1_sub")}</small>
              </div>
              <div style={{ position:"absolute",bottom:"8%",right:"-2%",background:"#111",border:"1px solid #2a2010",borderRadius:14,padding:"13px 18px",textAlign:"center",boxShadow:"0 8px 28px rgba(0,0,0,0.6)" }}>
                <strong style={{ display:"block",fontFamily:"var(--font-serif)",fontSize:"1.1rem",fontWeight:600,color:"var(--gold-light)" }}>Kaupanger</strong>
                <small style={{ fontSize:"0.7rem",color:"var(--text-dim)",letterSpacing:"0.05em" }}>{tr(lang,"hero_stat2_sub")}</small>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes logoFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}
          @media(max-width:860px){.hero-grid{grid-template-columns:1fr !important;}.hero-grid>div:last-child{display:none !important;}}
        `}</style>
      </section>

      {/* ── Info strip ──────────────────────────── */}
      <section style={{ background:"#0a0906",borderTop:"1px solid #1a1608",borderBottom:"1px solid #1a1608",padding:"18px 0" }}>
        <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 28px",display:"flex",alignItems:"center",justifyContent:"center",gap:36,flexWrap:"wrap" }}>
          {[
            { icon:<svg width="16" height="16" fill="none" stroke="var(--gold)" strokeWidth={1.5} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" d="M12 6v6l4 2"/></svg>, text: tr(lang,"hours_strip") },
            { icon:<svg width="16" height="16" fill="none" stroke="var(--gold)" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>, text:"Manhellervegen 859, Kaupanger" },
            { icon:<svg width="16" height="16" fill="none" stroke="var(--gold)" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>, text:"97 05 00 42", href:"tel:97050042" },
          ].map((item,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"center",gap:10 }}>
              {item.icon}
              {item.href
                ? <a href={item.href} style={{ fontSize:"0.82rem",color:"var(--text-muted)",letterSpacing:"0.02em" }}>{item.text}</a>
                : <span style={{ fontSize:"0.82rem",color:"var(--text-muted)",letterSpacing:"0.02em" }}>{item.text}</span>
              }
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured menu ───────────────────────── */}
      <section style={{ padding:"96px 0",background:"var(--black)" }}>
        <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 28px" }}>
          <div style={{ textAlign:"center",marginBottom:60 }}>
            <div className="section-label">{tr(lang,"menu_label")}</div>
            <h2 className="section-title">{tr(lang,"menu_h2")}</h2>
            <div className="gold-divider"><div className="gold-divider-dot"/></div>
            <p className="section-sub" style={{ margin:"0 auto" }}>{tr(lang,"menu_sub")}</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:24,marginBottom:48 }}>
            {items.map(item=>(
              <div key={item.id} className="card" style={{ padding:"28px 24px",display:"flex",flexDirection:"column",gap:0 }}>
                <div style={{ fontSize:"2.2rem",marginBottom:14 }}>{CAT_ICON[item.category]??"🍰"}</div>
                <div style={{ fontSize:"0.65rem",fontWeight:700,letterSpacing:"0.16em",textTransform:"uppercase",color:"var(--gold)",marginBottom:8 }}>{item.category}</div>
                <h3 style={{ fontFamily:"var(--font-serif)",fontSize:"1.25rem",fontWeight:600,marginBottom:8,color:"var(--text)" }}>{item.title}</h3>
                <p style={{ fontSize:"0.84rem",color:"var(--text-muted)",lineHeight:1.65,flex:1,marginBottom:20 }}>{item.description}</p>
                {item.allergies.length>0&&(
                  <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:18 }}>
                    {item.allergies.map(a=>(
                      <span key={a} style={{ fontSize:"0.64rem",fontWeight:600,color:"var(--text-dim)",background:"#0f0f0f",border:"1px solid #1e1e1e",borderRadius:50,padding:"2px 9px" }}>{a}</span>
                    ))}
                  </div>
                )}
                <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:16,borderTop:"1px solid var(--black-border)" }}>
                  <span style={{ fontFamily:"var(--font-serif)",fontSize:"1.4rem",fontWeight:600,color:"var(--gold-light)" }}>{tr(lang,"menu_from")} {item.price} kr</span>
                  <Link href="/bestill-kake" className="btn btn-outline" style={{ padding:"7px 18px",fontSize:"0.72rem" }}>{tr(lang,"menu_order_btn")}</Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center" }}>
            <Link href="/meny" className="btn btn-outline">{tr(lang,"menu_see_all")}</Link>
          </div>
        </div>
      </section>

      {/* ── Why us ──────────────────────────────── */}
      <section style={{ padding:"96px 0",background:"#0a0906" }}>
        <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 28px" }}>
          <div style={{ textAlign:"center",marginBottom:60 }}>
            <div className="section-label">{tr(lang,"why_label")}</div>
            <h2 className="section-title">{tr(lang,"why_h2")}</h2>
            <div className="gold-divider"><div className="gold-divider-dot"/></div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:20 }}>
            {([
              {icon:"🌿",tk:"why_1_title" as const,dk:"why_1_desc" as const},
              {icon:"🌅",tk:"why_2_title" as const,dk:"why_2_desc" as const},
              {icon:"🎂",tk:"why_3_title" as const,dk:"why_3_desc" as const},
              {icon:"🏷️",tk:"why_4_title" as const,dk:"why_4_desc" as const},
            ]).map(f=>(
              <div key={f.tk} style={{ background:"var(--black-mid)",border:"1px solid var(--black-border)",borderRadius:"var(--radius-lg)",padding:"32px 24px",transition:"border-color 0.25s" }}
                onMouseEnter={e=>(e.currentTarget.style.borderColor="var(--gold-border)")}
                onMouseLeave={e=>(e.currentTarget.style.borderColor="var(--black-border)")}>
                <div style={{ fontSize:"2rem",marginBottom:16,filter:"drop-shadow(0 2px 8px rgba(184,150,12,0.2))" }}>{f.icon}</div>
                <h3 style={{ fontFamily:"var(--font-serif)",fontSize:"1.1rem",fontWeight:600,color:"var(--text-soft)",marginBottom:8 }}>{tr(lang,f.tk)}</h3>
                <p style={{ fontSize:"0.84rem",color:"var(--text-muted)",lineHeight:1.7 }}>{tr(lang,f.dk)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────── */}
      <section style={{ background:"linear-gradient(160deg,#0e0c02 0%,#060604 50%,#0e0c02 100%)",borderTop:"1px solid rgba(184,150,12,0.12)",borderBottom:"1px solid rgba(184,150,12,0.12)",padding:"88px 28px",textAlign:"center",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(184,150,12,0.07),transparent 65%)",pointerEvents:"none" }}/>
        <div style={{ maxWidth:680,margin:"0 auto",position:"relative" }}>
          <div className="section-label">{tr(lang,"cta_label")}</div>
          <h2 style={{ fontFamily:"var(--font-serif)",fontSize:"clamp(1.9rem,3.5vw,2.7rem)",fontWeight:600,color:"var(--text)",margin:"18px 0 14px",lineHeight:1.15 }}>
            {tr(lang,"cta_h2")}
          </h2>
          <p style={{ color:"var(--text-muted)",fontSize:"1rem",marginBottom:36,lineHeight:1.8 }}>{tr(lang,"cta_sub")}</p>
          <div style={{ display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap" }}>
            <Link href="/bestill-kake" className="btn btn-gold">{tr(lang,"cta_btn1")}</Link>
            <Link href="/kontakt" className="btn btn-outline">{tr(lang,"cta_btn2")}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
