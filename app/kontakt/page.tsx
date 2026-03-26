"use client";
import { useState } from "react";
import OpenStatus from "@/components/OpenStatus";
import { useLang } from "@/components/LangContext";
import { tr, trArr } from "@/lib/i18n";

export default function KontaktPage() {
  const { lang } = useLang();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name:"",email:"",message:"" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:post@tdbakeri.no?subject=${encodeURIComponent("Kontakt: "+form.name)}&body=${encodeURIComponent(form.message+"\n\n"+form.name+" <"+form.email+">")}`;
    setSent(true);
  };
  const hours = trArr(lang,"contact_hours_lines");
  return (
    <div style={{ background:"var(--black)",minHeight:"100vh",padding:"88px 0" }}>
      <div style={{ maxWidth:1100,margin:"0 auto",padding:"0 28px" }}>
        <div style={{ textAlign:"center",marginBottom:72 }}>
          <div className="section-label">{tr(lang,"contact_label")}</div>
          <h1 className="section-title" style={{ marginBottom:4 }}>{tr(lang,"contact_h1")}</h1>
          <div className="gold-divider"><div className="gold-divider-dot"/></div>
          <p className="section-sub" style={{ margin:"8px auto 0",textAlign:"center" }}>{tr(lang,"contact_sub")}</p>
        </div>

        <div className="contact-grid" style={{ display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:48,alignItems:"start" }}>
          {/* Info cards */}
          <div style={{ display:"grid",gap:16 }}>
            {[
              { icon:"📍",title:tr(lang,"contact_address_title"),lines:["Manhellervegen 859","6854 Kaupanger"] },
              { icon:"📞",title:tr(lang,"contact_phone_title"),lines:["97 05 00 42"],href:"tel:97050042" },
              { icon:"📧",title:tr(lang,"contact_email_title"),lines:["post@tdbakeri.no"],href:"mailto:post@tdbakeri.no" },
              { icon:"🕘",title:tr(lang,"contact_hours_title"),lines:hours.length?hours:["Tysdag – Sundag","Kl. 09:00 – 18:00"] },
            ].map(c=>(
              <div key={c.title} style={{ background:"var(--black-card)",border:"1px solid var(--black-border)",borderRadius:"var(--radius-lg)",padding:"22px 22px",display:"flex",gap:16,alignItems:"flex-start" }}>
                <span style={{ fontSize:"1.4rem",marginTop:2 }}>{c.icon}</span>
                <div>
                  <h3 style={{ fontFamily:"var(--font-serif)",fontSize:"0.95rem",fontWeight:600,color:"var(--gold-light)",marginBottom:8 }}>{c.title}</h3>
                  {c.lines.map((l:string,i:number)=>(
                    <p key={i} style={{ fontSize:"0.86rem",color:"var(--text-muted)",lineHeight:1.65 }}>
                      {c.href&&i===0?<a href={c.href} style={{ color:"var(--text-muted)",transition:"color 0.2s" }}
                        onMouseEnter={e=>(e.currentTarget.style.color="var(--gold-light)")}
                        onMouseLeave={e=>(e.currentTarget.style.color="var(--text-muted)")}>{l}</a>:l}
                    </p>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ background:"var(--black-card)",border:"1px solid var(--black-border)",borderRadius:"var(--radius-lg)",padding:"22px" }}>
              <h3 style={{ fontFamily:"var(--font-serif)",fontSize:"0.95rem",fontWeight:600,color:"var(--gold-light)",marginBottom:12 }}>{tr(lang,"contact_status_title")}</h3>
              <OpenStatus/>
            </div>
          </div>

          {/* Form */}
          <div style={{ background:"var(--black-card)",border:"1px solid var(--black-border)",borderRadius:"var(--radius-xl)",padding:"36px",position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,var(--gold-dim),transparent)" }}/>
            <h2 style={{ fontFamily:"var(--font-serif)",fontSize:"1.5rem",fontWeight:600,color:"var(--text)",marginBottom:28 }}>{tr(lang,"contact_form_h2")}</h2>
            {sent?(
              <div style={{ textAlign:"center",padding:"48px 0" }}>
                <div style={{ fontSize:"3rem",marginBottom:16 }}>✉️</div>
                <p style={{ color:"var(--gold-light)",fontWeight:600,fontFamily:"var(--font-serif)",fontSize:"1.1rem",marginBottom:8 }}>{tr(lang,"contact_sent_title")}</p>
                <p style={{ color:"var(--text-muted)",fontSize:"0.9rem" }}>
                  {tr(lang,"contact_sent_sub")}{" "}
                  <a href="tel:97050042" style={{ color:"var(--gold-light)" }}>97 05 00 42</a>
                </p>
              </div>
            ):(
              <form onSubmit={submit} style={{ display:"grid",gap:20 }}>
                <div>
                  <label className="input-label">{tr(lang,"contact_name")}</label>
                  <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className="input" placeholder={tr(lang,"contact_placeholder_name")} required/>
                </div>
                <div>
                  <label className="input-label">{tr(lang,"contact_email_field")}</label>
                  <input value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} className="input" type="email" placeholder={tr(lang,"contact_placeholder_email")} required/>
                </div>
                <div>
                  <label className="input-label">{tr(lang,"contact_message")}</label>
                  <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} className="input" rows={5} style={{ resize:"vertical" }} placeholder={tr(lang,"contact_placeholder_msg")} required/>
                </div>
                <button type="submit" className="btn btn-gold" style={{ width:"100%",padding:"14px",fontSize:"0.85rem" }}>
                  {tr(lang,"contact_send")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.contact-grid{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}
