"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface HC { override: "open" | "closed" | null; schedule: Record<string, { open: string; close: string } | null>; }

const DAYS = ["mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lordag", "sondag"];
const DL: Record<string, string> = { mandag: "Måndag", tirsdag: "Tysdag", onsdag: "Onsdag", torsdag: "Torsdag", fredag: "Fredag", lordag: "Laurdag", sondag: "Sundag" };

export default function AdminMenyPage() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [hours, setHours] = useState<HC | null>(null);
  const [toast, setToast] = useState("");
  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({});
  const [editOpen, setEditOpen] = useState("09:00");
  const [editClose, setEditClose] = useState("18:00");

  const showToast = (msg: string, err = false) => { setToast((err ? "⚠ " : "✓ ") + msg); setTimeout(() => setToast(""), 5000); };
  const hdr = useCallback(() => ({ "Content-Type": "application/json", "x-admin-password": pw }), [pw]);

  const put = useCallback(async (body: object): Promise<boolean> => {
    const r = await fetch("/api/admin/hours", { method: "PUT", headers: hdr(), body: JSON.stringify(body) });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      showToast(err.error ?? `Feil ${r.status} — sjekk at ADMIN_PASSWORD og SANITY_WRITE_TOKEN er satt i Vercel`, true);
      return false;
    }
    return true;
  }, [hdr]);

  useEffect(() => {
    const p = sessionStorage.getItem("admin_pw");
    if (!p) { router.push("/admin"); return; }
    setPw(p);
    fetch("/api/admin/hours", { headers: { "x-admin-password": p } })
      .then(r => r.ok ? r.json() : null)
      .then(setHours)
      .catch(() => router.push("/admin"));
  }, [router]);

  const setOv = async (val: "open" | "closed" | null) => {
    const ok = await put({ override: val });
    if (!ok) return;
    setHours(h => h ? { ...h, override: val } : h);
    showToast(val === "open" ? "Satt til OPEN" : val === "closed" ? "Satt til STENGT" : "Override fjerna — følgjer timeplan");
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev => {
      const next = { ...prev, [day]: !prev[day] };
      // pre-fill time inputs from first selected day that has hours
      const firstActive = DAYS.find(d => (d === day ? !prev[day] : prev[d]) && hours?.schedule[d]);
      if (firstActive && hours?.schedule[firstActive]) {
        setEditOpen(hours.schedule[firstActive]!.open);
        setEditClose(hours.schedule[firstActive]!.close);
      }
      return next;
    });
  };

  const anySelected = DAYS.some(d => selectedDays[d]);

  const applyToSelected = async (closed: boolean) => {
    if (!hours || !anySelected) return;
    const newSchedule = { ...hours.schedule };
    const changed = DAYS.filter(d => selectedDays[d]);
    for (const d of changed) newSchedule[d] = closed ? null : { open: editOpen, close: editClose };
    const ok = await put({ schedule: newSchedule });
    if (!ok) return;
    setHours({ ...hours, schedule: newSchedule });
    setSelectedDays({});
    showToast(closed ? `${changed.length} dag(ar) sett som stengt` : `${changed.length} dag(ar): ${editOpen}–${editClose}`);
  };

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", padding: "60px 0" }}>
      {toast && (
        <div style={{ position: "fixed", top: 80, right: 24, background: "#1a1a1a", border: `1px solid ${toast.startsWith("⚠") ? "rgba(248,113,113,0.4)" : "rgba(184,150,12,0.4)"}`, borderRadius: 12, padding: "12px 20px", color: toast.startsWith("⚠") ? "#f87171" : "#d4a820", fontSize: "0.88rem", zIndex: 999, maxWidth: 340 }}>
          {toast}
        </div>
      )}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b8960c", marginBottom: 6 }}>Admin</div>
            <h1 style={{ fontFamily: "Georgia,serif", fontSize: "1.8rem", color: "#f0e6d0" }}>Administrasjon</h1>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/" style={{ fontSize: "0.82rem", color: "#5a4a3a", border: "1px solid #2a2a2a", borderRadius: 50, padding: "8px 16px" }}>Forside</Link>
            <button onClick={() => { sessionStorage.removeItem("admin_pw"); window.location.href = "/admin"; }}
              style={{ fontSize: "0.82rem", color: "#5a4a3a", background: "none", border: "1px solid #2a2a2a", borderRadius: 50, padding: "8px 16px", cursor: "pointer" }}>
              Logg ut
            </button>
          </div>
        </div>

        {/* Sanity Studio link */}
        <div style={{ background: "linear-gradient(135deg,#0e0c02,#060604)", border: "1px solid rgba(184,150,12,0.25)", borderRadius: 16, padding: "24px 28px", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#b8960c", marginBottom: 6 }}>Meny & produkt</div>
            <p style={{ fontSize: "0.84rem", color: "#5a4a3a" }}>Legg til og endre menyprodukt i Sanity Studio</p>
          </div>
          <Link href="https://tdbakeri.sanity.studio" target="_blank"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 50, background: "linear-gradient(135deg,#d4a820,#8b6914)", color: "#0a0a0a", fontWeight: 700, fontSize: "0.82rem", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            Opne Studio →
          </Link>
        </div>

        {hours && (
          <div style={{ display: "grid", gap: 20 }}>

            {/* ── OPEN / CLOSE NOW ── */}
            <div style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 20, padding: "32px 28px" }}>
              <div style={{ fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#5a4a3a", marginBottom: 6 }}>Rask overstyring</div>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "1.35rem", color: "#f0e6d0", marginBottom: 24 }}>Opne eller steng butikken no</h2>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <button onClick={() => setOv(hours.override === "open" ? null : "open")}
                  style={{
                    padding: "16px 36px", borderRadius: 50, fontSize: "1rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.04em",
                    border: `2px solid ${hours.override === "open" ? "#4ade80" : "#2a3a2a"}`,
                    background: hours.override === "open" ? "rgba(74,222,128,0.18)" : "rgba(74,222,128,0.04)",
                    color: hours.override === "open" ? "#4ade80" : "#3a6a3a",
                    boxShadow: hours.override === "open" ? "0 0 20px rgba(74,222,128,0.15)" : "none",
                  }}>
                  {hours.override === "open" ? "✅ OPEN NO" : "OPNE NO"}
                </button>
                <button onClick={() => setOv(hours.override === "closed" ? null : "closed")}
                  style={{
                    padding: "16px 36px", borderRadius: 50, fontSize: "1rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.04em",
                    border: `2px solid ${hours.override === "closed" ? "#f87171" : "#3a2a2a"}`,
                    background: hours.override === "closed" ? "rgba(248,113,113,0.18)" : "rgba(248,113,113,0.04)",
                    color: hours.override === "closed" ? "#f87171" : "#6a3a3a",
                    boxShadow: hours.override === "closed" ? "0 0 20px rgba(248,113,113,0.15)" : "none",
                  }}>
                  {hours.override === "closed" ? "❌ STENGT NO" : "STENG NO"}
                </button>
              </div>

              {hours.override && (
                <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ padding: "8px 16px", background: "rgba(184,150,12,0.07)", border: "1px solid rgba(184,150,12,0.2)", borderRadius: 8, fontSize: "0.84rem", color: "#b8960c" }}>
                    Aktiv overstyring: <strong>{hours.override === "open" ? "OPEN" : "STENGT"}</strong>
                  </div>
                  <button onClick={() => setOv(null)}
                    style={{ fontSize: "0.8rem", color: "#4a3a2a", background: "none", border: "1px solid #2a2a2a", borderRadius: 50, padding: "6px 16px", cursor: "pointer" }}>
                    Tilbake til timeplan
                  </button>
                </div>
              )}
            </div>

            {/* ── OPENING HOURS ── */}
            <div style={{ background: "#0f0f0f", border: "1px solid #1e1e1e", borderRadius: 20, padding: "32px 28px" }}>
              <div style={{ fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#5a4a3a", marginBottom: 6 }}>Timeplan</div>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "1.35rem", color: "#f0e6d0", marginBottom: 6 }}>Opningstider</h2>
              <p style={{ fontSize: "0.84rem", color: "#4a3a2a", marginBottom: 24 }}>Vel ein eller fleire dagar, set tid, trykk Lagre.</p>

              {/* Day selector */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {DAYS.map(day => {
                  const s = hours.schedule[day];
                  const sel = !!selectedDays[day];
                  return (
                    <button key={day} onClick={() => toggleDay(day)}
                      style={{
                        padding: "9px 18px", borderRadius: 50, fontSize: "0.84rem", fontWeight: 600, cursor: "pointer", transition: "all 0.18s",
                        border: `2px solid ${sel ? "#d4a820" : "#1e1e1e"}`,
                        background: sel ? "rgba(212,168,32,0.14)" : "#141414",
                        color: sel ? "#d4a820" : s ? "#6a5a3a" : "#3a2a2a",
                      }}>
                      {DL[day]}
                      <span style={{ marginLeft: 6, fontSize: "0.72rem", opacity: 0.7 }}>
                        {s ? `${s.open}–${s.close}` : "stengt"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Time editor — shown when days are selected */}
              {anySelected && (
                <div style={{ background: "#161410", border: "1px solid #2a2010", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.82rem", color: "#8a7a4a", marginRight: 4 }}>Tid:</span>
                  <input type="time" value={editOpen} onChange={e => setEditOpen(e.target.value)} className="input" style={{ width: 110 }} />
                  <span style={{ color: "#4a3a2a" }}>–</span>
                  <input type="time" value={editClose} onChange={e => setEditClose(e.target.value)} className="input" style={{ width: 110 }} />
                  <button onClick={() => applyToSelected(false)}
                    style={{ padding: "10px 24px", borderRadius: 50, background: "linear-gradient(135deg,#d4a820,#8b6914)", color: "#0a0a0a", fontWeight: 700, fontSize: "0.82rem", border: "none", cursor: "pointer" }}>
                    Lagre
                  </button>
                  <button onClick={() => applyToSelected(true)}
                    style={{ padding: "10px 20px", borderRadius: 50, border: "2px solid rgba(248,113,113,0.3)", background: "transparent", color: "#f87171", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}>
                    Stengt
                  </button>
                  <button onClick={() => setSelectedDays({})}
                    style={{ fontSize: "0.78rem", color: "#3a3a3a", background: "none", border: "none", cursor: "pointer", marginLeft: 4 }}>
                    Avbryt
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
