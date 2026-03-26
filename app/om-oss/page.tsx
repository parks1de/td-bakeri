"use client";
import { useLang } from "@/components/LangContext";
import { tr } from "@/lib/i18n";
export default function OmOssPage() {
  const { lang } = useLang();
  const stats = [
    {icon:"🌅",tk:"about_stat1" as const,sk:"about_stat1s" as const},
    {icon:"🌿",tk:"about_stat2" as const,sk:"about_stat2s" as const},
    {icon:"🎂",tk:"about_stat3" as const,sk:"about_stat3s" as const},
    {icon:"❤️",tk:"about_stat4" as const,sk:"about_stat4s" as const},
  ];
  const features = [
    {icon:"🌾",tk:"about_f1_title" as const,dk:"about_f1_desc" as const},
    {icon:"⏰",tk:"about_f2_title" as const,dk:"about_f2_desc" as const},
    {icon:"🎁",tk:"about_f3_title" as const,dk:"about_f3_desc" as const},
    {icon:"🏷️",tk:"about_f4_title" as const,dk:"about_f4_desc" as const},
  ];
  return (
    <div style={{ background:"var(--black)",minHeight:"100vh",padding:"88px 0" }}>
      <div style={{ maxWidth:1100,margin:"0 auto",padding:"0 28px" }}>
        <div style={{ textAlign:"center",marginBottom:72 }}>
          <div className="section-label">{tr(lang,"about_label")}</div>
          <h1 className="section-title" style={{ marginBottom:4 }}>{tr(lang,"about_h1")}</h1>
          <div className="gold-divider"><div className="gold-divider-dot"/></div>
        </div>

        {/* Story */}
        <div className="about-grid" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"center",marginBottom:80 }}>
          <div>
            <div style={{ fontSize:"0.65rem",fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:"var(--gold)",marginBottom:14 }}>{tr(lang,"about_region")}</div>
            <h2 style={{ fontFamily:"var(--font-serif)",fontSize:"2.1rem",fontWeight:600,color:"var(--text)",lineHeight:1.15,marginBottom:22,letterSpacing:"-0.01em" }}>{tr(lang,"about_h2")}</h2>
            <p style={{ color:"var(--text-muted)",lineHeight:1.85,marginBottom:16,fontSize:"0.95rem" }}>{tr(lang,"about_p1")}</p>
            <p style={{ color:"var(--text-muted)",lineHeight:1.85,fontSize:"0.95rem" }}>{tr(lang,"about_p2")}</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
            {stats.map(s=>(
              <div key={s.tk} style={{ background:"var(--black-card)",border:"1px solid var(--black-border)",borderRadius:"var(--radius-lg)",padding:"28px 20px",textAlign:"center",transition:"border-color 0.25s" }}
                onMouseEnter={e=>(e.currentTarget.style.borderColor="var(--gold-border)")}
                onMouseLeave={e=>(e.currentTarget.style.borderColor="var(--black-border)")}>
                <div style={{ fontSize:"2rem",marginBottom:10 }}>{s.icon}</div>
                <strong style={{ display:"block",fontFamily:"var(--font-serif)",fontSize:"1.15rem",fontWeight:600,color:"var(--gold-light)",marginBottom:5 }}>{tr(lang,s.tk)}</strong>
                <p style={{ fontSize:"0.75rem",color:"var(--text-dim)",lineHeight:1.5 }}>{tr(lang,s.sk)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{ background:"var(--black-card)",border:"1px solid var(--black-border)",borderRadius:"var(--radius-xl)",padding:"48px",position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,var(--gold-dim),transparent)" }}/>
          <div style={{ textAlign:"center",marginBottom:40 }}>
            <h2 style={{ fontFamily:"var(--font-serif)",fontSize:"1.8rem",fontWeight:600,color:"var(--gold-light)" }}>{tr(lang,"about_proud_h2")}</h2>
            <div className="gold-divider" style={{ marginTop:12 }}><div className="gold-divider-dot"/></div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:32 }}>
            {features.map(f=>(
              <div key={f.tk} style={{ display:"flex",gap:16,alignItems:"flex-start" }}>
                <div style={{ width:46,height:46,background:"var(--black-mid)",border:"1px solid var(--black-border)",borderRadius:"var(--radius)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",flexShrink:0 }}>{f.icon}</div>
                <div>
                  <h4 style={{ fontFamily:"var(--font-serif)",fontSize:"1rem",fontWeight:600,color:"var(--text-soft)",marginBottom:5 }}>{tr(lang,f.tk)}</h4>
                  <p style={{ fontSize:"0.82rem",color:"var(--text-muted)",lineHeight:1.65 }}>{tr(lang,f.dk)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.about-grid{grid-template-columns:1fr !important;gap:40px !important}}`}</style>
    </div>
  );
}
