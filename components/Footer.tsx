"use client";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "./LangContext";
import { tr, trArr } from "@/lib/i18n";

export default function Footer() {
  const { lang } = useLang();
  const links = [
    { href:"/meny", key:"nav_menu" as const },
    { href:"/bestill-kake", key:"nav_order" as const },
    { href:"/om-oss", key:"nav_about" as const },
    { href:"/kontakt", key:"nav_contact" as const },
  ];
  const hoursLines = tr(lang,"footer_hours_lines") as unknown as string[];
  return (
    <footer style={{ background:"#060606",borderTop:"1px solid #181408",paddingTop:64,paddingBottom:32 }}>
      <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 28px" }}>

        {/* Top ornament */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginBottom:56 }}>
          <div style={{ flex:1,height:"1px",background:"linear-gradient(90deg,transparent,#2a2010)" }}/>
          <div style={{ width:6,height:6,borderRadius:"50%",background:"var(--gold)",boxShadow:"0 0 8px var(--gold)" }}/>
          <div style={{ flex:1,height:"1px",background:"linear-gradient(90deg,#2a2010,transparent)" }}/>
        </div>

        {/* Logo centre */}
        <div style={{ textAlign:"center",marginBottom:48 }}>
          <Link href="/" style={{ display:"inline-flex",alignItems:"center",gap:14,marginBottom:14 }}>
            <div style={{ position:"relative",width:48,height:48 }}>
              <Image src="/images/logo.png" alt="T&D Bakeri" fill style={{ objectFit:"contain",filter:"drop-shadow(0 0 10px rgba(184,150,12,0.35))" }}/>
            </div>
            <span style={{ fontFamily:"var(--font-serif)",fontSize:"1.7rem",fontWeight:600,background:"linear-gradient(135deg,#f0c040,#b8960c,#d4a820)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",letterSpacing:"0.04em" }}>
              T&amp;D Bakeri
            </span>
          </Link>
          <p style={{ fontSize:"0.84rem",color:"var(--text-dim)",lineHeight:1.7,maxWidth:320,margin:"0 auto" }}>
            {tr(lang,"footer_tagline")}
          </p>
        </div>

        {/* Grid */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:36,marginBottom:48 }}>
          <div>
            <h4 style={{ color:"var(--gold)",fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:18 }}>
              {tr(lang,"footer_nav_title")}
            </h4>
            <ul style={{ display:"grid",gap:11 }}>
              {links.map(l=>(
                <li key={l.href}>
                  <Link href={l.href} style={{ fontSize:"0.84rem",color:"var(--text-dim)",transition:"color 0.2s",letterSpacing:"0.02em" }}
                    onMouseEnter={e=>(e.currentTarget.style.color="var(--gold-light)")}
                    onMouseLeave={e=>(e.currentTarget.style.color="var(--text-dim)")}>
                    {tr(lang,l.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ color:"var(--gold)",fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:18 }}>
              {tr(lang,"footer_contact_title")}
            </h4>
            <ul style={{ display:"grid",gap:11 }}>
              <li><a href="tel:97050042" style={{ fontSize:"0.84rem",color:"var(--text-dim)",transition:"color 0.2s" }}
                onMouseEnter={e=>(e.currentTarget.style.color="var(--gold-light)")}
                onMouseLeave={e=>(e.currentTarget.style.color="var(--text-dim)")}>97 05 00 42</a></li>
              <li><a href="mailto:post@tdbakeri.no" style={{ fontSize:"0.84rem",color:"var(--text-dim)",transition:"color 0.2s" }}
                onMouseEnter={e=>(e.currentTarget.style.color="var(--gold-light)")}
                onMouseLeave={e=>(e.currentTarget.style.color="var(--text-dim)")}>post@tdbakeri.no</a></li>
              <li><span style={{ fontSize:"0.84rem",color:"var(--text-dim)" }}>Manhellervegen 859</span></li>
              <li><span style={{ fontSize:"0.84rem",color:"var(--text-dim)" }}>6854 Kaupanger</span></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color:"var(--gold)",fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:18 }}>
              {tr(lang,"footer_hours_title")}
            </h4>
            <ul style={{ display:"grid",gap:8 }}>
              {trArr(lang,"footer_hours_lines").map((line:string,i:number)=>(
                    <li key={i} style={{ fontSize:"0.84rem",color:i===2?"var(--gold-light)":"var(--text-dim)",fontWeight:i===2?600:400 }}>{line}</li>
                  ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop:"1px solid #181408",paddingTop:24,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16 }}>
          <span style={{ fontSize:"0.76rem",color:"#2a2010" }}>
            &copy; {new Date().getFullYear()} T&amp;D Bakeri. {tr(lang,"footer_copy")}
          </span>
          <div style={{ display:"flex",gap:12 }}>
            {[
              { href:"https://www.instagram.com/tdbakeri", label:"Instagram", path:"M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
              { href:"https://www.facebook.com/tdbakeri", label:"Facebook", path:"M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
            ].map(s=>(
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                style={{ width:34,height:34,borderRadius:"50%",border:"1px solid #2a2010",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-dim)",transition:"all 0.2s" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--gold-dim)";e.currentTarget.style.color="var(--gold-light)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="#2a2010";e.currentTarget.style.color="var(--text-dim)"; }}>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d={s.path}/></svg>
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
