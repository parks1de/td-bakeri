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
          <p style="margin-top: 16px;">Vi har motteke bestillinga di og gler oss til aa bake kaka di!</p>
          <div style="background: rgba(184,150,12,0.1); border: 1px solid rgba(184,150,12,0.3); border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p><strong style="color: #d4a820;">Henting:</strong> ${order.pickupDate} kl. ${order.pickupTime}</p>
            <p style="margin-top: 8px;"><strong style="color: #d4a820;">Adresse:</strong> Manhellervegen 859, 6854 Kaupanger</p>
          </div>
          <p>Har du sporsmal? Ring oss pa <a href="tel:97050042" style="color: #d4a820;">97 05 00 42</a> eller svar pa denne e-posten.</p>
          <p style="margin-top: 24px;">Med venleg helsing,<br><strong>T&D Bakeri</strong></p>
        </div>
      </div>
    `,
  });
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
