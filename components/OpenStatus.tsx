"use client";
import { useEffect, useState } from "react";
import { useLang } from "./LangContext";
import { tr } from "@/lib/i18n";

interface StatusData { isOpen: boolean; label: string; source: string; }

export default function OpenStatus({ compact=false }:{ compact?: boolean }) {
  const { lang } = useLang();
  const [status, setStatus] = useState<StatusData|null>(null);
  useEffect(() => {
    const load = () => fetch("/api/status").then(r=>r.json()).then(setStatus).catch(()=>{});
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, []);

  if (!status) return null;

  const color = status.isOpen ? "#4ade80" : "#f87171";
  const glowColor = status.isOpen ? "rgba(74,222,128,0.6)" : "rgba(248,113,113,0.6)";

  if (compact) return (
    <span style={{ display:"inline-flex",alignItems:"center",gap:6,fontSize:"0.72rem",fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color }}>
      <span style={{ width:6,height:6,borderRadius:"50%",background:color,display:"inline-block",boxShadow:`0 0 6px ${glowColor}`,animation:"statusPulse 2s infinite" }}/>
      {status.isOpen ? tr(lang,"status_open") : tr(lang,"status_closed")}
      <style>{`@keyframes statusPulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </span>
  );

  return (
    <div style={{ display:"inline-flex",alignItems:"center",gap:10,background:status.isOpen?"rgba(74,222,128,0.06)":"rgba(248,113,113,0.06)",border:`1px solid ${status.isOpen?"rgba(74,222,128,0.25)":"rgba(248,113,113,0.25)"}`,borderRadius:50,padding:"9px 18px" }}>
      <span style={{ width:8,height:8,borderRadius:"50%",background:color,display:"inline-block",boxShadow:`0 0 8px ${glowColor}`,animation:"statusPulse 2s infinite" }}/>
      <span style={{ fontSize:"0.82rem",fontWeight:600,letterSpacing:"0.04em",color }}>{status.label}</span>
      <style>{`@keyframes statusPulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}
