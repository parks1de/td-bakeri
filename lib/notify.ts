import { Resend } from "resend";

export interface OrderData {
  name: string;
  phone: string;
  email: string;
  pickupDate: string;
  pickupTime: string;
  description: string;
  size?: string;
  message?: string;
  orderId: string;
  amount: number;
}

export interface RegularOrderItem {
  title: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface RegularOrderData {
  name: string;
  phone: string;
  orderType: "eat-in" | "take-away";
  items: RegularOrderItem[];
  total: number;
  pickupTime?: string;
  notes?: string;
  orderId: string;
}

async function sendBrevoSms(content: string): Promise<void> {
  const { BREVO_API_KEY, BREVO_SENDER_NAME, OWNER_PHONE } = process.env;
  if (!BREVO_API_KEY || !OWNER_PHONE || OWNER_PHONE === "+47") return;

  try {
    const res = await fetch("https://api.brevo.com/v3/transactionalSMS/sms", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        type: "transactional",
        unicodeEnabled: false,
        sender: BREVO_SENDER_NAME ?? "TDBakeri",
        recipient: OWNER_PHONE,
        content,
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.warn("Brevo SMS error:", err);
    }
  } catch (e) {
    console.warn("Brevo SMS failed (best-effort):", e);
  }
}

export async function sendOwnerNotification(order: OrderData): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("sendOwnerNotification: RESEND_API_KEY not set, skipping email.");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const ownerEmail = process.env.OWNER_EMAIL ?? "post@tdbakeri.no";

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #f0e6d0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #b8960c, #8b6914); padding: 32px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; color: #fff;">Ny kakebestilling betalt!</h1>
        <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8);">Ordre #${order.orderId}</p>
      </div>
      <div style="padding: 32px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #b8960c; font-weight: bold; width: 40%;">Namn:</td><td style="padding: 8px 0;">${order.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #b8960c; font-weight: bold;">Telefon:</td><td style="padding: 8px 0;"><a href="tel:${order.phone}" style="color: #d4a820;">${order.phone}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #b8960c; font-weight: bold;">E-post:</td><td style="padding: 8px 0;"><a href="mailto:${order.email}" style="color: #d4a820;">${order.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #b8960c; font-weight: bold;">Henting:</td><td style="padding: 8px 0;">${order.pickupDate} kl. ${order.pickupTime}</td></tr>
          <tr><td style="padding: 8px 0; color: #b8960c; font-weight: bold;">Storleik:</td><td style="padding: 8px 0;">${order.size ?? "Ikkje spesifisert"}</td></tr>
          <tr><td style="padding: 8px 0; color: #b8960c; font-weight: bold;">Skildring:</td><td style="padding: 8px 0;">${order.description}</td></tr>
          ${order.message ? `<tr><td style="padding: 8px 0; color: #b8960c; font-weight: bold;">Helsing:</td><td style="padding: 8px 0;">${order.message}</td></tr>` : ""}
          <tr><td style="padding: 8px 0; color: #b8960c; font-weight: bold;">Betalt:</td><td style="padding: 8px 0; color: #4ade80; font-weight: bold;">NOK ${(order.amount / 100).toFixed(0)} kr (depositum)</td></tr>
        </table>
      </div>
      <div style="background: rgba(184,150,12,0.15); padding: 20px 32px; font-size: 13px; color: rgba(240,230,208,0.6);">
        T&D Bakeri &bull; Manhellervegen 859, 6854 Kaupanger
      </div>
    </div>
  `;

  await resend.emails.send({
    from: "T&D Bakeri <bestilling@tdbakeri.no>",
    to: ownerEmail,
    subject: `Ny kakebestilling fra ${order.name} - ${order.pickupDate}`,
    html,
  });

  await resend.emails.send({
    from: "T&D Bakeri <bestilling@tdbakeri.no>",
    to: order.email,
    subject: "Bestillinga di er motteken - T&D Bakeri",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #f0e6d0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #b8960c, #8b6914); padding: 32px; text-align: center;">
          <h1 style="margin: 0; color: #fff;">Takk for bestillinga!</h1>
        </div>
        <div style="padding: 32px;">
          <p>Hei ${order.name},</p>
          <p style="margin-top: 16px;">Vi har motteke bestillinga di og gler oss til å bake kaka di!</p>
          <div style="background: rgba(184,150,12,0.1); border: 1px solid rgba(184,150,12,0.3); border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p><strong style="color: #d4a820;">Henting:</strong> ${order.pickupDate} kl. ${order.pickupTime}</p>
            <p style="margin-top: 8px;"><strong style="color: #d4a820;">Adresse:</strong> Manhellervegen 859, 6854 Kaupanger</p>
          </div>
          <p>Har du spørsmål? Ring oss på <a href="tel:97050042" style="color: #d4a820;">97 05 00 42</a> eller svar på denne e-posten.</p>
          <p style="margin-top: 24px;">Med venleg helsing,<br><strong>T&D Bakeri</strong></p>
        </div>
      </div>
    `,
  });

  await sendBrevoSms(
    `NY KAKEBESTILLING! Fra: ${order.name} (${order.phone}). Henting: ${order.pickupDate} kl. ${order.pickupTime}. Betalt depositum. Sjekk e-post.`
  );
}

export async function sendRegularOrderNotification(order: RegularOrderData): Promise<void> {
  const ownerEmail = process.env.OWNER_EMAIL ?? "post@tdbakeri.no";
  const typeLabel = order.orderType === "eat-in" ? "Spis her" : "Ta med / Henting";

  const itemsHtml = order.items
    .map(i => `<tr><td style="padding:6px 0;color:#f0e6d0;">${i.title}${i.variant ? ` (${i.variant})` : ""}</td><td style="padding:6px 0;color:#d4a820;text-align:right;">${i.quantity} × ${i.price} kr</td></tr>`)
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#1a1a1a;color:#f0e6d0;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#b8960c,#8b6914);padding:32px;text-align:center;">
        <h1 style="margin:0;font-size:22px;color:#fff;">Ny bestilling!</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);">${typeLabel} · Ordre #${order.orderId}</p>
      </div>
      <div style="padding:32px;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr><td style="padding:8px 0;color:#b8960c;font-weight:bold;width:40%;">Namn:</td><td>${order.name}</td></tr>
          <tr><td style="padding:8px 0;color:#b8960c;font-weight:bold;">Telefon:</td><td><a href="tel:${order.phone}" style="color:#d4a820;">${order.phone}</a></td></tr>
          <tr><td style="padding:8px 0;color:#b8960c;font-weight:bold;">Type:</td><td>${typeLabel}</td></tr>
          ${order.pickupTime ? `<tr><td style="padding:8px 0;color:#b8960c;font-weight:bold;">Tidspunkt:</td><td>${order.pickupTime}</td></tr>` : ""}
          ${order.notes ? `<tr><td style="padding:8px 0;color:#b8960c;font-weight:bold;">Merknad:</td><td>${order.notes}</td></tr>` : ""}
        </table>
        <table style="width:100%;border-collapse:collapse;border-top:1px solid #2a2a2a;padding-top:16px;">
          <thead><tr><th style="padding:8px 0;color:#b8960c;text-align:left;">Produkt</th><th style="padding:8px 0;color:#b8960c;text-align:right;">Pris</th></tr></thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot>
            <tr style="border-top:1px solid #2a2a2a;">
              <td style="padding:12px 0;font-weight:bold;color:#f0c040;font-size:1.1em;">Totalt</td>
              <td style="padding:12px 0;font-weight:bold;color:#f0c040;font-size:1.1em;text-align:right;">${order.total} kr</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div style="background:rgba(184,150,12,0.15);padding:20px 32px;font-size:13px;color:rgba(240,230,208,0.6);">
        T&D Bakeri &bull; Manhellervegen 859, 6854 Kaupanger
      </div>
    </div>
  `;

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "T&D Bakeri <bestilling@tdbakeri.no>",
      to: ownerEmail,
      subject: `Ny bestilling (${typeLabel}) frå ${order.name}`,
      html,
    }).catch(e => console.warn("Resend error:", e));
  }

  const smsItems = order.items.map(i => `${i.quantity}x ${i.title}`).join(", ");
  await sendBrevoSms(
    `NY BESTILLING (${typeLabel})! ${order.name} (${order.phone}): ${smsItems}. Totalt: ${order.total} kr.${order.pickupTime ? ` Tid: ${order.pickupTime}.` : ""}`
  );
}

export async function sendSmsNotification(order: OrderData): Promise<void> {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, OWNER_PHONE } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER || !OWNER_PHONE) return;

  const body = `NY KAKEBESTILLING! Fra: ${order.name} (${order.phone}). Henting: ${order.pickupDate} kl. ${order.pickupTime}. Betalt depositum. Sjekk e-post for detaljar.`;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");

  await fetch(url, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: OWNER_PHONE, From: TWILIO_FROM_NUMBER, Body: body }),
  });
}
