"use client";
import { useEffect, useState } from "react";
import { useLang } from "./LangContext";
import { tr } from "@/lib/i18n";

interface StatusData {
  isOpen: boolean;
  statusKey: string;
  time?: string;
  source: string;
}

function buildLabel(lang: Parameters<typeof tr>[0], data: StatusData): string {
  const base = tr(lang, data.statusKey as Parameters<typeof tr>[1]);
  if (data.statusKey === "status_open" && data.time) {
    return `${base} ${tr(lang, "status_closes_at")} ${data.time}`;
  }
  if (data.statusKey === "status_closed" && data.time) {
    return `${base} — ${tr(lang, "status_opens_at")} ${data.time}`;
  }
  return base;
}

export default function OpenStatus({ compact = false }: { compact?: boolean }) {
  const { lang } = useLang();
  const [data, setData] = useState<StatusData | null>(null);

  useEffect(() => {
    const load = () =>
      fetch("/api/status")
        .then((r) => r.json())
        .then(setData)
        .catch(() => {});
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!data) return null;

  const label = buildLabel(lang, data);
  const color = data.isOpen ? "#4ade80" : "#f87171";
  const glow  = data.isOpen ? "rgba(74,222,128,0.6)" : "rgba(248,113,113,0.6)";

  if (compact) return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block", boxShadow: `0 0 6px ${glow}`, animation: "sp 2s infinite" }} />
      {data.isOpen ? tr(lang, "status_open") : tr(lang, "status_closed")}
      <style>{`@keyframes sp{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </span>
  );

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: data.isOpen ? "rgba(74,222,128,0.06)" : "rgba(248,113,113,0.06)", border: `1px solid ${data.isOpen ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`, borderRadius: 50, padding: "9px 18px" }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block", boxShadow: `0 0 8px ${glow}`, animation: "sp 2s infinite" }} />
      <span style={{ fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.04em", color }}>{label}</span>
      <style>{`@keyframes sp{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}
