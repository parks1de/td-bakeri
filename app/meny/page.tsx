"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/components/LangContext";
import { tr } from "@/lib/i18n";
import { useCart } from "@/components/CartContext";
import type { SanityMenuItem } from "@/lib/sanityClient";

const AI: Record<string, string> = { Gluten: "🌾", Melk: "🥛", Egg: "🥚", Notter: "🥜", Soya: "🫘", Sesam: "🌱", Fisk: "🐟", Skalldyr: "🦐" };

type OrderType = "eat-in" | "take-away";

export default function MenyPage() {
  const { lang } = useLang();
  const { items: cartItems, addItem, removeItem, updateQty, clear, total, count } = useCart();
  const router = useRouter();

  const [items, setItems] = useState<SanityMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderType, setOrderType] = useState<OrderType>("eat-in");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const [form, setForm] = useState({ name: "", phone: "", pickupTime: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const orderFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/menu/public")
      .then(r => r.json())
      .then(d => { setItems(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = items.filter(i => orderType === "eat-in" ? i.eatIn !== false : i.takeAway !== false);
  const cats = [...new Map(filtered.map(i => [i.category?.title, i.category])).values()].filter(Boolean)
    .sort((a, b) => (a!.sortOrder ?? 0) - (b!.sortOrder ?? 0));

  const handleAdd = (item: SanityMenuItem) => {
    const variant = selectedVariants[item._id];
    addItem({ id: item._id, title: item.title, price: item.price, variant });
  };

  const getItemCount = (id: string, variant?: string) =>
    cartItems.find(i => i.id === id && i.variant === variant)?.quantity ?? 0;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = tr(lang, "regular_order_err_name");
    if (!form.phone.trim()) e.phone = tr(lang, "regular_order_err_phone");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          orderType,
          items: cartItems.map(i => ({ title: i.title, price: i.price, quantity: i.quantity, variant: i.variant })),
          total,
          pickupTime: form.pickupTime || undefined,
          notes: form.notes || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        clear();
        router.push(`/meny/takk?id=${data.orderId}&type=${orderType}`);
      }
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "var(--black)", minHeight: "100vh", paddingBottom: count > 0 ? 120 : 40 }}>
      {/* Header */}
      <div style={{ padding: "88px 0 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <div className="section-label">{tr(lang, "meny_label")}</div>
          <h1 className="section-title" style={{ marginBottom: 4 }}>{tr(lang, "meny_h1")}</h1>
          <div className="gold-divider"><div className="gold-divider-dot" /></div>
          <p className="section-sub" style={{ margin: "8px auto 0", textAlign: "center" }}>{tr(lang, "meny_sub")}</p>
        </div>
      </div>

      {/* Order type selector */}
      <div style={{ background: "#0a0906", borderTop: "1px solid #1a1608", borderBottom: "1px solid #1a1608", padding: "24px 0", marginBottom: 64 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)", flexShrink: 0 }}>
              {tr(lang, "order_type_label")}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              {(["eat-in", "take-away"] as OrderType[]).map(t => (
                <button key={t} onClick={() => setOrderType(t)}
                  style={{
                    padding: "10px 22px", borderRadius: 50, fontWeight: 600, fontSize: "0.82rem",
                    letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s",
                    border: `1.5px solid ${orderType === t ? "var(--gold-dim)" : "#2a2a1a"}`,
                    background: orderType === t ? "linear-gradient(135deg,var(--gold-light),var(--gold-dim))" : "transparent",
                    color: orderType === t ? "var(--black)" : "var(--text-muted)",
                  }}>
                  {t === "eat-in"
                    ? `🪑 ${tr(lang, "order_type_eat_in")}`
                    : `🥡 ${tr(lang, "order_type_take_away")}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-dim)" }}>
            <div style={{ fontSize: "2rem", animation: "spin 1s linear infinite", display: "inline-block", marginBottom: 12 }}>⟳</div>
          </div>
        )}

        {cats.map(cat => (
          <section key={cat!.title} style={{ marginBottom: 80 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
              <span style={{ fontSize: "1.3rem", filter: "drop-shadow(0 0 6px rgba(184,150,12,0.3))" }}>{cat!.icon ?? "🍰"}</span>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.7rem", fontWeight: 600, color: "var(--gold-light)", letterSpacing: "0.02em" }}>{cat!.title}</h2>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,var(--gold-border),transparent)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20 }}>
              {filtered.filter(i => i.category?.title === cat!.title).map(item => {
                const qty = getItemCount(item._id, selectedVariants[item._id]);
                return (
                  <div key={item._id} className="card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <div style={{ height: 190, background: "#0e0e0e", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      {item.image ? (
                        <Image src={item.image} alt={item.title} fill style={{ objectFit: "cover" }} sizes="400px" />
                      ) : (
                        <>
                          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 40%,rgba(184,150,12,0.07),transparent 65%)" }} />
                          <span style={{ fontSize: "4rem", position: "relative", zIndex: 1, filter: "drop-shadow(0 4px 12px rgba(184,150,12,0.2))" }}>{cat!.icon ?? "🍰"}</span>
                        </>
                      )}
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "linear-gradient(to top,var(--black-card),transparent)" }} />
                    </div>
                    <div style={{ padding: "22px 22px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 7 }}>{cat!.title}</div>
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", fontWeight: 600, color: "var(--text)", marginBottom: 8, lineHeight: 1.2 }}>{item.title}</h3>
                      <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", lineHeight: 1.65, marginBottom: 14, flex: 1 }}>{item.description}</p>

                      {item.variants && item.variants.length > 0 && (
                        <div style={{ marginBottom: 12 }}>
                          <label style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Variant</label>
                          <select value={selectedVariants[item._id] ?? ""} onChange={e => setSelectedVariants(v => ({ ...v, [item._id]: e.target.value }))}
                            className="input" style={{ padding: "8px 12px", fontSize: "0.82rem" }}>
                            <option value="">— vel variant —</option>
                            {item.variants.map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </div>
                      )}

                      {item.allergies && item.allergies.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
                          {item.allergies.map(a => (
                            <span key={a} title={a} style={{ fontSize: "0.68rem", color: "var(--text-dim)", background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 50, padding: "2px 8px" }}>
                              {AI[a] ?? "⚠️"} {a}
                            </span>
                          ))}
                        </div>
                      )}

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--black-border)", paddingTop: 14, marginTop: "auto" }}>
                        <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", fontWeight: 600, color: "var(--gold-light)" }}>
                          {item.variants && item.variants.length > 0 ? `${tr(lang, "menu_from")} ` : ""}{item.price} kr
                        </span>
                        {qty === 0 ? (
                          <button onClick={() => handleAdd(item)} className="btn btn-gold" style={{ padding: "8px 18px", fontSize: "0.72rem" }}>
                            + {tr(lang, "cart_place_order").split(" ")[0]}
                          </button>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <button onClick={() => updateQty(item._id, selectedVariants[item._id], qty - 1)}
                              style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(184,150,12,0.15)", border: "1px solid var(--gold-dim)", color: "var(--gold-light)", fontWeight: 700, cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                            <span style={{ minWidth: 24, textAlign: "center", fontFamily: "var(--font-serif)", fontSize: "1.1rem", color: "var(--gold-light)", fontWeight: 600 }}>{qty}</span>
                            <button onClick={() => handleAdd(item)}
                              style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold-light),var(--gold-dim))", border: "none", color: "var(--black)", fontWeight: 700, cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-dim)" }}>
            <p style={{ fontSize: "1.1rem", fontFamily: "var(--font-serif)" }}>{tr(lang, "menu_empty")}</p>
          </div>
        )}

        {/* Order form */}
        {showOrderForm && (
          <div ref={orderFormRef} style={{ background: "var(--black-card)", border: "1px solid var(--gold-border)", borderRadius: "var(--radius-xl)", padding: "48px 40px", marginBottom: 32, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,var(--gold-dim),transparent)" }} />
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.9rem", fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>{tr(lang, "regular_order_h1")}</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 32 }}>{tr(lang, "regular_order_sub")}</p>

            {/* Order summary */}
            <div style={{ background: "#0a0906", border: "1px solid #1a1608", borderRadius: "var(--radius-lg)", padding: "20px 24px", marginBottom: 28 }}>
              {cartItems.map(i => (
                <div key={i.id + (i.variant ?? "")} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #141210" }}>
                  <span style={{ fontSize: "0.88rem", color: "var(--text-soft)" }}>{i.quantity}× {i.title}{i.variant ? ` (${i.variant})` : ""}</span>
                  <span style={{ fontSize: "0.88rem", color: "var(--gold-light)", fontFamily: "var(--font-serif)" }}>{i.price * i.quantity} kr</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, fontWeight: 700 }}>
                <span style={{ color: "var(--gold)", fontSize: "0.9rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>{tr(lang, "cart_total")}</span>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", color: "var(--gold-light)" }}>{total} kr</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20, marginBottom: 20 }}>
              <div>
                <label className="input-label">{tr(lang, "regular_order_name")}</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input" placeholder="Ola Nordmann" />
                {errors.name && <div className="input-error">⚠ {errors.name}</div>}
              </div>
              <div>
                <label className="input-label">{tr(lang, "regular_order_phone")}</label>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input" placeholder="+47 97 05 00 42" type="tel" />
                {errors.phone && <div className="input-error">⚠ {errors.phone}</div>}
              </div>
              {orderType === "take-away" && (
                <div>
                  <label className="input-label">{tr(lang, "regular_order_time")}</label>
                  <input value={form.pickupTime} onChange={e => setForm(f => ({ ...f, pickupTime: e.target.value }))} className="input" type="time" min="09:00" max="17:45" />
                </div>
              )}
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="input-label">{tr(lang, "regular_order_notes")}</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="input" rows={2} style={{ resize: "vertical" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
              <button onClick={handleSubmit} disabled={submitting} className="btn btn-gold" style={{ padding: "14px 36px" }}>
                {submitting ? tr(lang, "regular_order_submitting") : tr(lang, "regular_order_submit")}
              </button>
              <button onClick={() => setShowOrderForm(false)} className="btn btn-outline" style={{ padding: "14px 24px" }}>
                Avbryt
              </button>
            </div>
          </div>
        )}

        {/* Custom cake CTA */}
        {!showOrderForm && (
          <div style={{ background: "linear-gradient(135deg,#0e0c02,#060604)", border: "1px solid var(--gold-border)", borderRadius: "var(--radius-xl)", padding: "52px 40px", textAlign: "center", marginTop: 24, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%,rgba(184,150,12,0.07),transparent 65%)", pointerEvents: "none" }} />
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.9rem", fontWeight: 600, color: "var(--text)", marginBottom: 10, position: "relative" }}>{tr(lang, "meny_cta_h2")}</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 28, fontSize: "0.95rem", position: "relative" }}>{tr(lang, "meny_cta_sub")}</p>
            <Link href="/bestill-kake" className="btn btn-gold" style={{ position: "relative" }}>{tr(lang, "meny_cta_btn")}</Link>
          </div>
        )}
      </div>

      {/* Floating cart bar */}
      {count > 0 && !showOrderForm && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,9,6,0.97)", backdropFilter: "blur(16px)", borderTop: "1px solid var(--gold-border)", padding: "16px 28px", boxShadow: "0 -8px 40px rgba(0,0,0,0.7)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,var(--gold-light),var(--gold-dim))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--black)", fontWeight: 700, fontSize: "0.85rem" }}>
                {count}
              </div>
              <div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{tr(lang, "cart_title")}</div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", color: "var(--gold-light)", fontWeight: 600 }}>{total} kr</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={clear} style={{ background: "none", border: "1px solid #2a2010", borderRadius: 50, color: "var(--text-dim)", padding: "8px 16px", fontSize: "0.78rem", cursor: "pointer" }}>
                {tr(lang, "cart_clear")}
              </button>
              <button onClick={() => { setShowOrderForm(true); setTimeout(() => orderFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50); }}
                className="btn btn-gold" style={{ padding: "10px 28px", fontSize: "0.84rem" }}>
                {tr(lang, "cart_place_order")} →
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
