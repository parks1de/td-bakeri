# Next Steps Before Launch

## PRIORITY — do first

### 1. Set env vars in Vercel
Vercel dashboard → Project → Settings → Environment Variables

| Variable | Where to get it | Required for |
|---|---|---|
| `SANITY_WRITE_TOKEN` | sanity.io → project u7hre29r → API → Tokens → Create (Editor) | /admin to save hours |
| `ADMIN_PASSWORD` | Choose any password | Logging in to /admin |
| `BREVO_API_KEY` | brevo.com → Settings → API Keys | SMS to owner on new order |
| `OWNER_PHONE` | Your number in E.164 format: +4797050042 | SMS to owner |
| `RESEND_API_KEY` | resend.com → API Keys | Order confirmation emails |
| `STRIPE_SECRET_KEY` | stripe.com → Developers → API Keys | Custom cake deposit |
| `STRIPE_WEBHOOK_SECRET` | stripe.com → Webhooks | Custom cake deposit |

After adding env vars → redeploy (or Vercel does it automatically).

---

### 2. Create opening-hours document in Sanity
Go to **tdbakeri.sanity.studio** → Opningstider (opens directly)
- Manual override: **Auto**
- Add each day:
  - Måndag → tick "Stengt denne dagen"
  - Tysdag–Sundag → 09:00–18:00

Once this is done, the /admin panel open/close toggle will work end-to-end.

---

### 3. Populate menu in Sanity
Go to **tdbakeri.sanity.studio**

**Categories first (Kategoriar):**
- Kaker | 🎂 | sortOrder 1
- Bakverk | 🥐 | sortOrder 2
- Brød | 🍞 | sortOrder 3

**Menu items (Menyprodukt):**
| Name | Category | Price | Variants | Allergens |
|---|---|---|---|---|
| Sjokoladekake | Kaker | 450 | Liten 6p, Medium 10p, Stor 16p | Gluten, Egg, Melk, Soya |
| Vaniljekake | Kaker | 400 | Liten 6p, Medium 10p, Stor 16p | Gluten, Egg, Melk |
| Croissant | Bakverk | 45 | — | Gluten, Melk, Egg |
| Kanelsnurr | Bakverk | 35 | — | Gluten, Melk, Egg |
| Surdeigbrød | Brød | 120 | Halvt, Heilt | Gluten |
| Grovbrød | Brød | 95 | — | Gluten, Nøtter |

---

### 4. Upload product photos
tdbakeri.sanity.studio → Menyprodukt → open each item → Bilete field

---

## Later / future
- Payment for regular orders (Stripe or Vipps) — currently free-flow, owner notified by email + SMS only
- Product image carousel on homepage
- Online table reservation
