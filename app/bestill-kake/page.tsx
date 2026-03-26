"use client";
import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLang } from "@/components/LangContext";
import { tr } from "@/lib/i18n";

interface FormValues {
  name:string;phone:string;email:string;pickupDate:string;
  pickupTime:string;description:string;size:string;message:string;
}
function CancelBanner() {
  const { lang } = useLang();
  const p = useSearchParams();
  if (!p.get("cancelled")) return null;
  return (
    <div style={{ background:"rgba(248,113,113,0.07)",border:"1px solid rgba(248,113,113,0.25)",borderRadius:"var(--radius)",padding:"13px 18px",marginBottom:24,color:"#f87171",textAlign:"center",fontSize:"0.88rem" }}>
      {tr(lang,"order_cancel_msg")}
    </div>
  );
}
export default function BestillKakePage() {
  const { lang } = useLang();
  const empty: FormValues = {name:"",phone:"",email:"",pickupDate:"",pickupTime:"10:00",description:"",size:"",message:""};
  const [form, setForm] = useState<FormValues>(empty);
  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string|null>(null);
  const [fname, setFname] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    const {name,value} = e.target;
    setForm(f=>({...f,[name]:value}));
    setErrors(er=>({...er,[name]:undefined}));
  };
  const validate = () => {
    const e: Partial<FormValues> = {};
    if (!form.name.trim()) e.name = tr(lang,"order_err_name");
    if (!/^[+\d\s]{8,}$/.test(form.phone)) e.phone = tr(lang,"order_err_phone");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = tr(lang,"order_err_email");
    if (!form.pickupDate) e.pickupDate = tr(lang,"order_err_date");
    if (form.description.trim().length < 10) e.description = tr(lang,"order_err_desc");
    setErrors(e);
    return !Object.keys(e).length;
  };
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setFname(f.name);
    const r = new FileReader(); r.onload = ev => setPreview(ev.target?.result as string); r.readAsDataURL(f);
  };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!validate()) return; setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      const d = await res.json();
      if (d.url) window.location.href = d.url;
      else alert("Noe gjekk gale. Prøv igjen.");
    } catch { alert("Nettverksfeil."); }
    finally { setLoading(false); }
  };
  const minD = new Date(); minD.setDate(minD.getDate()+3);
  const minDate = minD.toISOString().split("T")[0];
  const sizes = [
    tr(lang,"order_size_s"),tr(lang,"order_size_m"),
    tr(lang,"order_size_l"),tr(lang,"order_size_w"),
  ];

  const Field = ({label,err,children}:{label:string;err?:string;children:React.ReactNode}) => (
    <div>
      <label className="input-label">{label}</label>
      {children}
      {err && <p className="input-error">⚠ {err}</p>}
    </div>
  );

  return (
    <div style={{ background:"var(--black)",minHeight:"100vh",padding:"88px 0" }}>
      <div style={{ maxWidth:860,margin:"0 auto",padding:"0 28px" }}>
        <div style={{ textAlign:"center",marginBottom:56 }}>
          <div className="section-label">{tr(lang,"order_label")}</div>
          <h1 className="section-title" style={{ marginBottom:4 }}>{tr(lang,"order_h1")}</h1>
          <div className="gold-divider"><div className="gold-divider-dot"/></div>
          <p className="section-sub" style={{ margin:"10px auto 0",textAlign:"center" }}>{tr(lang,"order_sub")}</p>
        </div>
        <Suspense fallback={null}><CancelBanner/></Suspense>

        {/* Deposit notice */}
        <div style={{ background:"rgba(184,150,12,0.05)",border:"1px solid var(--gold-border)",borderRadius:"var(--radius)",padding:"16px 20px",marginBottom:32,display:"flex",gap:14,alignItems:"flex-start" }}>
          <span style={{ fontSize:"1.3rem",flexShrink:0 }}>💳</span>
          <div>
            <strong style={{ color:"var(--gold-light)",fontSize:"0.9rem",display:"block",marginBottom:4 }}>{tr(lang,"order_deposit_title")}</strong>
            <p style={{ color:"var(--text-muted)",fontSize:"0.83rem",lineHeight:1.6 }}>{tr(lang,"order_deposit_desc")}</p>
          </div>
        </div>

        <form onSubmit={submit} noValidate>
          <div style={{ background:"var(--black-card)",border:"1px solid var(--black-border)",borderRadius:"var(--radius-xl)",padding:"40px",display:"grid",gap:22,position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,var(--gold-dim),transparent)" }}/>

            <div className="form-row" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:18 }}>
              <Field label={tr(lang,"order_name")+" *"} err={errors.name}>
                <input name="name" value={form.name} onChange={set} className="input" placeholder="Ola Nordmann"/>
              </Field>
              <Field label={tr(lang,"order_phone")+" *"} err={errors.phone}>
                <input name="phone" value={form.phone} onChange={set} className="input" placeholder="+47 97 05 00 42" type="tel"/>
              </Field>
            </div>

            <Field label={tr(lang,"order_email")+" *"} err={errors.email}>
              <input name="email" value={form.email} onChange={set} className="input" placeholder="ola@eksempel.no" type="email"/>
            </Field>

            <div className="form-row" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:18 }}>
              <Field label={tr(lang,"order_date")+" *"} err={errors.pickupDate}>
                <input name="pickupDate" value={form.pickupDate} onChange={set} className="input" type="date" min={minDate}/>
              </Field>
              <Field label={tr(lang,"order_time")}>
                <input name="pickupTime" value={form.pickupTime} onChange={set} className="input" type="time" min="09:00" max="17:30"/>
              </Field>
            </div>

            <Field label={tr(lang,"order_size")}>
              <select name="size" value={form.size} onChange={set} className="input">
                <option value="">{tr(lang,"order_size_placeholder")}</option>
                {sizes.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </Field>

            <Field label={tr(lang,"order_desc")+" *"} err={errors.description}>
              <textarea name="description" value={form.description} onChange={set} className="input" rows={5} style={{ resize:"vertical" }} placeholder={tr(lang,"order_desc_placeholder")}/>
            </Field>

            <Field label={tr(lang,"order_message")}>
              <input name="message" value={form.message} onChange={set} className="input" placeholder={tr(lang,"order_message_placeholder")}/>
            </Field>

            <div>
              <label className="input-label">{tr(lang,"order_image")}</label>
              <div onClick={()=>fileRef.current?.click()}
                style={{ border:"1.5px dashed var(--black-border)",borderRadius:"var(--radius)",padding:"28px 20px",textAlign:"center",cursor:"pointer",background:"var(--black-mid)",transition:"border-color 0.2s,background 0.2s" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--gold-dim)";e.currentTarget.style.background=String(("#111206")); }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--black-border)";e.currentTarget.style.background="var(--black-mid)"; }}>
                {preview
                  ? <img src={preview} alt="Preview" style={{ maxHeight:140,maxWidth:"100%",objectFit:"cover",borderRadius:8,margin:"0 auto" }}/>
                  : <><div style={{ fontSize:"1.8rem",marginBottom:8 }}>📸</div><p style={{ fontSize:"0.83rem",color:"var(--text-dim)" }}>{tr(lang,"order_image_hint")}</p></>
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display:"none" }}/>
              {fname && <p style={{ fontSize:"0.75rem",color:"var(--text-dim)",marginTop:5 }}>✓ {fname}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-gold" style={{ width:"100%",padding:"15px",fontSize:"0.88rem" }}>
              {loading ? tr(lang,"order_submitting") : tr(lang,"order_submit")}
            </button>
          </div>
        </form>
        <p style={{ textAlign:"center",color:"var(--text-dim)",fontSize:"0.76rem",marginTop:18,letterSpacing:"0.02em" }}>
          🔒 {tr(lang,"order_secure")}
        </p>
      </div>
      <style>{`@media(max-width:640px){.form-row{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}
