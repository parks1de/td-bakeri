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
  const [bulkDays, setBulkDays] = useState<Record<string, boolean>>({ mandag: false, tirsdag: true, onsdag: true, torsdag: true, fredag: true, lordag: true, sondag: true });
  const [bulkOpen, setBulkOpen] = useState("09:00");
  const [bulkClose, setBulkClose] = useState("18:00");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const hdr = useCallback(() => ({ "Content-Type": "application/json", "x-admin-password": pw }), [pw]);

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
    await fetch("/api/admin/hours", { method: "PUT", headers: hdr(), body: JSON.stringify({ override: val }) });
    setHours(h => h ? { ...h, override: val } : h);
    showToast(val === "open" ? "Satt til OPEN" : val === "closed" ? "Satt til STENGT" : "Override fjerna");
  };

  const applyBulk = async (closed: boolean) => {
    if (!hours) return;
    const selected = DAYS.filter(d => bulkDays[d]);
    if (selected.length === 0) { showToast("Ingen dagar valt"); return; }
    const newSchedule = { ...hours.schedule };
    for (const d of selected) newSchedule[d] = closed ? null : { open: bulkOpen, close: bulkClose };
    const u = { ...hours, schedule: newSchedule };
    setHours(u);
    await fetch("/api/admin/hours", { method: "PUT", headers: hdr(), body: JSON.stringify({ schedule: newSchedule }) });
    showToast(closed ? `${selected.length} dagar sett som stengt` : `${selected.length} dagar oppdatert til ${bulkOpen}–${bulkClose}`);
  };

  const toggleBulkDay = (day: string) => setBulkDays(prev => ({ ...prev, [day]: !prev[day] }));

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", padding: "60px 0" }}>
      {toast && (
        <div style={{ position: "fixed", top: 80, right: 24, background: "#1a1a1a", border: "1px solid rgba(184,150,12,0.4)", borderRadius: 12, padding: "12px 20px", color: "#d4a820", fontSize: "0.88rem", zIndex: 999 }}>
          ✓ {toast}
        </div>
      )}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
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
        <div style={{ background: "linear-gradient(135deg,#0e0c02,#060604)", border: "1px solid rgba(184,150,12,0.25)", borderRadius: 16, padding: "28px 32px", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#b8960c", marginBottom: 8 }}>Meny & produktar</div>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "1.2rem", color: "#f0e6d0", marginBottom: 6 }}>Sanity Studio</h2>
            <p style={{ fontSize: "0.84rem", color: "#5a4a3a", maxWidth: 420 }}>
              Alle menyprodukt og kategoriar vert redigert i Sanity Studio.
            </p>
          </div>
          <Link href="https://tdbakeri.sanity.studio" target="_blank"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", borderRadius: 50, background: "linear-gradient(135deg,#d4a820,#8b6914)", color: "#0a0a0a", fontWeight: 700, fontSize: "0.84rem", letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            Opne Studio →
          </Link>
        </div>

        {hours && (
          <div style={{ display: "grid", gap: 24 }}>

            {/* Manual override */}
            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: "28px" }}>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "1.2rem", color: "#d4a820", marginBottom: 8 }}>Manuell overstyring</h2>
              <p style={{ color: "#5a4a3a", fontSize: "0.86rem", marginBottom: 20 }}>Overstyrer opningstidene umiddelbart — uavhengig av timeplanen under.</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button onClick={() => setOv("open")}
                  style={{ padding: "12px 24px", borderRadius: 50, border: `2px solid ${hours.override === "open" ? "#4ade80" : "#2a2a2a"}`, background: hours.override === "open" ? "rgba(74,222,128,0.15)" : "transparent", color: hours.override === "open" ? "#4ade80" : "#5a4a3a", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s" }}>
                  ✅ Tving OPEN
                </button>
                <button onClick={() => setOv("closed")}
                  style={{ padding: "12px 24px", borderRadius: 50, border: `2px solid ${hours.override === "closed" ? "#f87171" : "#2a2a2a"}`, background: hours.override === "closed" ? "rgba(248,113,113,0.15)" : "transparent", color: hours.override === "closed" ? "#f87171" : "#5a4a3a", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s" }}>
                  ❌ Tving STENGT
                </button>
                {hours.override && (
                  <button onClick={() => setOv(null)}
                    style={{ padding: "12px 24px", borderRadius: 50, border: "2px solid #2a2a2a", background: "transparent", color: "#7a6a4a", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}>
                    Tilbake til normal
                  </button>
                )}
              </div>
              {hours.override && (
                <div style={{ marginTop: 16, padding: "10px 16px", background: "rgba(184,150,12,0.07)", border: "1px solid rgba(184,150,12,0.2)", borderRadius: 8, fontSize: "0.84rem", color: "#b8960c" }}>
                  Aktiv overstyring: <strong>{hours.override === "open" ? "OPEN" : "STENGT"}</strong>
                </div>
              )}
            </div>

            {/* Bulk set */}
            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: "28px" }}>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "1.2rem", color: "#d4a820", marginBottom: 8 }}>Sett fleire dagar samtidig</h2>
              <p style={{ color: "#5a4a3a", fontSize: "0.86rem", marginBottom: 20 }}>Huk av dagane du vil endre, set tid og trykk «Bruk».</p>

              {/* Day checkboxes */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
                {DAYS.map(day => (
                  <button key={day} onClick={() => toggleBulkDay(day)}
                    style={{ padding: "8px 16px", borderRadius: 50, border: `2px solid ${bulkDays[day] ? "#d4a820" : "#2a2a2a"}`, background: bulkDays[day] ? "rgba(212,168,32,0.12)" : "transparent", color: bulkDays[day] ? "#d4a820" : "#4a3a2a", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", transition: "all 0.18s" }}>
                    {DL[day]}
                  </button>
                ))}
              </div>

              {/* Time inputs + actions */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <input type="time" value={bulkOpen} onChange={e => setBulkOpen(e.target.value)}
                  className="input" style={{ width: 110 }} />
                <span style={{ color: "#4a3a2a" }}>–</span>
                <input type="time" value={bulkClose} onChange={e => setBulkClose(e.target.value)}
                  className="input" style={{ width: 110 }} />
                <button onClick={() => applyBulk(false)}
                  style={{ padding: "10px 22px", borderRadius: 50, background: "linear-gradient(135deg,#d4a820,#8b6914)", color: "#0a0a0a", fontWeight: 700, fontSize: "0.82rem", border: "none", cursor: "pointer" }}>
                  Bruk på valde
                </button>
                <button onClick={() => applyBulk(true)}
                  style={{ padding: "10px 22px", borderRadius: 50, border: "2px solid rgba(248,113,113,0.3)", background: "transparent", color: "#f87171", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer" }}>
                  Merk stengt
                </button>
              </div>
            </div>

            {/* Per-day schedule */}
            <div style={{ background: "#111", border: "1px solid #1e1e1e", borderRadius: 16, padding: "28px" }}>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "1.2rem", color: "#d4a820", marginBottom: 20 }}>Vekeplan</h2>
              <div style={{ display: "grid", gap: 12 }}>
                {DAYS.map(day => {
                  const s = hours.schedule[day];
                  return (
                    <div key={day} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: "1px solid #161616", flexWrap: "wrap" }}>
                      <span style={{ minWidth: 90, fontSize: "0.88rem", fontWeight: 600, color: "#8a7a5a" }}>{DL[day]}</span>
                      {s ? (
                        <>
                          <input type="time" value={s.open} onChange={async e => {
                            const u = { ...hours, schedule: { ...hours.schedule, [day]: { open: e.target.value, close: s.close } } };
                            setHours(u);
                            await fetch("/api/admin/hours", { method: "PUT", headers: hdr(), body: JSON.stringify({ schedule: u.schedule }) });
                          }} className="input" style={{ width: 110 }} />
                          <span style={{ color: "#4a3a2a" }}>–</span>
                          <input type="time" value={s.close} onChange={async e => {
                            const u = { ...hours, schedule: { ...hours.schedule, [day]: { open: s.open, close: e.target.value } } };
                            setHours(u);
                            await fetch("/api/admin/hours", { method: "PUT", headers: hdr(), body: JSON.stringify({ schedule: u.schedule }) });
                          }} className="input" style={{ width: 110 }} />
                          <button onClick={async () => {
                            const u = { ...hours, schedule: { ...hours.schedule, [day]: null } };
                            setHours(u);
                            await fetch("/api/admin/hours", { method: "PUT", headers: hdr(), body: JSON.stringify({ schedule: u.schedule }) });
                          }} style={{ fontSize: "0.78rem", color: "#f87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, padding: "4px 12px", cursor: "pointer" }}>
                            Stengt
                          </button>
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: "0.84rem", color: "#3a3030" }}>Stengt</span>
                          <button onClick={async () => {
                            const u = { ...hours, schedule: { ...hours.schedule, [day]: { open: "09:00", close: "18:00" } } };
                            setHours(u);
                            await fetch("/api/admin/hours", { method: "PUT", headers: hdr(), body: JSON.stringify({ schedule: u.schedule }) });
                          }} style={{ fontSize: "0.78rem", color: "#4ade80", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 8, padding: "4px 12px", cursor: "pointer" }}>
                            + Opne
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
