"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangContext";
import { tr } from "@/lib/i18n";
import type { MenuItem } from "@/lib/menu";

const AI: Record<string,string> = {Gluten:"🌾",Melk:"🥛",Egg:"🥚",Notter:"🥜",Soya:"🫘",Sesam:"🌱",Fisk:"🐟",Skalldyr:"🦐"};
const CAT_ICON: Record<string,string> = {Kaker:"🎂",Bakverk:"🥐",Brod:"🍞"};

export default function MenyPage() {
  const { lang } = useLang();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/menu/public").then(r=>r.json()).then(d=>{setItems(d);setLoading(false);}).catch(()=>setLoading(false));
  },[]);
  const cats = [...new Set(items.map(i=>i.category))];

  return (
    <div style={{ background:"var(--black)",minHeight:"100vh",padding:"88px 0" }}>
      <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 28px" }}>
        <div style={{ textAlign:"center",marginBottom:72 }}>
          <div className="section-label">{tr(lang,"meny_label")}</div>
          <h1 className="section-title" style={{ marginBottom:4 }}>{tr(lang,"meny_h1")}</h1>
          <div className="gold-divider"><div className="gold-divider-dot"/></div>
          <p className="section-sub" style={{ margin:"8px auto 0",textAlign:"center" }}>{tr(lang,"meny_sub")}</p>
        </div>

        {loading&&(
          <div style={{ textAlign:"center",padding:"80px 0",color:"var(--text-dim)" }}>
            <div style={{ fontSize:"2rem",animation:"spin 1s linear infinite",display:"inline-block",marginBottom:12 }}>⟳</div>
          </div>
        )}

        {cats.map(cat=>(
          <section key={cat} style={{ marginBottom:80 }}>
            <div style={{ display:"flex",alignItems:"center",gap:16,marginBottom:36 }}>
              <span style={{ fontSize:"1.3rem",filter:"drop-shadow(0 0 6px rgba(184,150,12,0.3))" }}>{CAT_ICON[cat]??"🍰"}</span>
              <h2 style={{ fontFamily:"var(--font-serif)",fontSize:"1.7rem",fontWeight:600,color:"var(--gold-light)",letterSpacing:"0.02em" }}>{cat}</h2>
              <div style={{ flex:1,height:1,background:"linear-gradient(90deg,var(--gold-border),transparent)" }}/>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:20 }}>
              {items.filter(i=>i.category===cat).map(item=>(
                <div key={item.id} className="card" style={{ overflow:"hidden",display:"flex",flexDirection:"column" }}>
                  <div style={{ height:190,background:"#0e0e0e",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
                    <div style={{ position:"absolute",inset:0,background:"radial-gradient(circle at 50% 40%,rgba(184,150,12,0.07),transparent 65%)" }}/>
                    <span style={{ fontSize:"4rem",position:"relative",zIndex:1,filter:"drop-shadow(0 4px 12px rgba(184,150,12,0.2))" }}>
                      {CAT_ICON[cat]??"🍰"}
                    </span>
                    <div style={{ position:"absolute",bottom:0,left:0,right:0,height:60,background:"linear-gradient(to top,var(--black-card),transparent)" }}/>
                  </div>
                  <div style={{ padding:"22px 22px 20px",flex:1,display:"flex",flexDirection:"column" }}>
                    <div style={{ fontSize:"0.65rem",fontWeight:700,letterSpacing:"0.16em",textTransform:"uppercase",color:"var(--gold)",marginBottom:7 }}>{item.category}</div>
                    <h3 style={{ fontFamily:"var(--font-serif)",fontSize:"1.2rem",fontWeight:600,color:"var(--text)",marginBottom:8,lineHeight:1.2 }}>{item.title}</h3>
                    <p style={{ fontSize:"0.84rem",color:"var(--text-muted)",lineHeight:1.65,marginBottom:14,flex:1 }}>{item.description}</p>
                    {item.variants.length>0&&(
                      <div style={{ display:"flex",flexWrap:"wrap",gap:5,marginBottom:12 }}>
                        {item.variants.map(v=>(
                          <span key={v} style={{ fontSize:"0.7rem",color:"var(--text-muted)",background:"#101010",border:"1px solid #222",borderRadius:50,padding:"3px 10px" }}>{v}</span>
                        ))}
                      </div>
                    )}
                    {item.allergies.length>0&&(
                      <div style={{ display:"flex",flexWrap:"wrap",gap:4,marginBottom:14 }}>
                        {item.allergies.map(a=>(
                          <span key={a} title={a} style={{ fontSize:"0.68rem",color:"var(--text-dim)",background:"#0a0a0a",border:"1px solid #1a1a1a",borderRadius:50,padding:"2px 8px" }}>
                            {AI[a]??"⚠️"} {a}
                          </span>
                        ))}
                      </div>
                    )}
                    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",borderTop:"1px solid var(--black-border)",paddingTop:14,marginTop:"auto" }}>
                      <span style={{ fontFamily:"var(--font-serif)",fontSize:"1.3rem",fontWeight:600,color:"var(--gold-light)" }}>{tr(lang,"menu_from")} {item.price} kr</span>
                      <Link href="/bestill-kake" className="btn btn-outline" style={{ padding:"7px 16px",fontSize:"0.7rem" }}>{tr(lang,"meny_order")}</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {!loading&&items.length===0&&(
          <div style={{ textAlign:"center",padding:"80px 0",color:"var(--text-dim)" }}>
            <p style={{ fontSize:"1.1rem",fontFamily:"var(--font-serif)" }}>{tr(lang,"menu_empty")}</p>
          </div>
        )}

        {/* CTA */}
        <div style={{ background:"linear-gradient(135deg,#0e0c02,#060604)",border:"1px solid var(--gold-border)",borderRadius:"var(--radius-xl)",padding:"52px 40px",textAlign:"center",marginTop:24,position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(184,150,12,0.07),transparent 65%)",pointerEvents:"none" }}/>
          <h2 style={{ fontFamily:"var(--font-serif)",fontSize:"1.9rem",fontWeight:600,color:"var(--text)",marginBottom:10,position:"relative" }}>{tr(lang,"meny_cta_h2")}</h2>
          <p style={{ color:"var(--text-muted)",marginBottom:28,fontSize:"0.95rem",position:"relative" }}>{tr(lang,"meny_cta_sub")}</p>
          <Link href="/bestill-kake" className="btn btn-gold" style={{ position:"relative" }}>{tr(lang,"meny_cta_btn")}</Link>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
