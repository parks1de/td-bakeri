"use client";
import{useLang}from"./LangContext";
import type{Lang}from"@/lib/i18n";

const FLAGS:Record<Lang,string>={nn:"🇳🇴",en:"🇬🇧",ro:"🇷🇴"};
const LABELS:Record<Lang,string>={nn:"NN",en:"EN",ro:"RO"};

export default function LangSwitcher(){
  const{lang,setLang}=useLang();
  return(
    <div style={{display:"flex",gap:4,alignItems:"center",background:"rgba(255,255,255,0.04)",border:"1px solid #2a2a2a",borderRadius:50,padding:"3px 6px"}}>
      {(["nn","en","ro"] as Lang[]).map(l=>(
        <button key={l} onClick={()=>setLang(l)}
          title={l==="nn"?"Nynorsk":l==="en"?"English":"Română"}
          style={{
            background:lang===l?"rgba(184,150,12,0.2)":"transparent",
            border:lang===l?"1px solid rgba(184,150,12,0.5)":"1px solid transparent",
            borderRadius:50,padding:"4px 10px",cursor:"pointer",
            fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.04em",
            color:lang===l?"#d4a820":"#5a4a3a",
            transition:"all 0.15s",
            lineHeight:1,
          }}>
          {FLAGS[l]} {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
