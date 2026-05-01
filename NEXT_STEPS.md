# Next Steps Before Launch

## 1. Sanity write token
- sanity.io → project u7hre29r → API → Tokens → Create token (Editor permissions)
- Paste into `.env.local`: `SANITY_WRITE_TOKEN=sk...`
- Required for the admin panel (/admin) to save opening-hours changes.

## 2. Create opening-hours document in Sanity
- Go to /studio → Opningstider (opens directly — no list)
- Set manual override: **Auto**
- Add schedule entries:
  - Måndag → Stengt (tick "Stengt denne dagen")
  - Tysdag through Sundag → 09:00 – 18:00

## 3. Populate menu in Sanity
- Go to /studio → Kategoriar, create: Kaker (🎂, order 1), Bakverk (🥐, order 2), Brød (🍞, order 3)
- Go to /studio → Menyprodukt, create all 6 items (see PENDING.md for full list with prices and allergens)

## 4. Fill remaining env vars in .env.local
- `BREVO_API_KEY` — brevo.com → Settings → API Keys
- `OWNER_PHONE` — complete the +47 number (E.164 format, e.g. +4797050042)
- `ADMIN_PASSWORD` — any password, used to log in to /admin
- `RESEND_API_KEY` — resend.com → API Keys (for order confirmation emails)
- `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` — for custom cake deposit payments

## 5. Upload product photos
- /studio → Menyprodukt → open each item → Bilete field
