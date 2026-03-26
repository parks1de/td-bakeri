"use client";
import React,{createContext,useContext,useState,useEffect} from "react";
import type{Lang} from "@/lib/i18n";

interface LangCtx{lang:Lang;setLang:(l:Lang)=>void;}
const Ctx=createContext<LangCtx>({lang:"nn",setLang:()=>{}});
export const useLang=()=>useContext(Ctx);

export function LangProvider({children}:{children:React.ReactNode}){
  const[lang,setLangState]=useState<Lang>("nn");
  useEffect(()=>{
    const stored=localStorage.getItem("td_lang") as Lang|null;
    if(stored&&["nn","en","ro"].includes(stored)) setLangState(stored);
  },[]);
  const setLang=(l:Lang)=>{setLangState(l);localStorage.setItem("td_lang",l);};
  return<Ctx.Provider value={{lang,setLang}}>{children}</Ctx.Provider>;
}
