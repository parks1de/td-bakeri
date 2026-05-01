# T&D Bakeri — Pending Items

## Must do before launch

### 1. Populate Sanity with menu data
Go to /studio and create the following before the site shows any menu:

**Categories (create these first, in order):**
- Kaker | slug: kaker | icon: 🎂 | sortOrder: 1
- Bakverk | slug: bakverk | icon: 🥐 | sortOrder: 2
- Brød | slug: brod | icon: 🍞 | sortOrder: 3

**Menu items (link each to its category):**
- Sjokoladekake — Kaker — 450 kr — variants: Liten (6 pers), Medium (10 pers), Stor (16 pers) — allergies: Gluten, Egg, Melk, Soya
- Vaniljekake — Kaker — 400 kr — variants: Liten (6 pers), Medium (10 pers), Stor (16 pers) — allergies: Gluten, Egg, Melk
- Croissant — Bakverk — 45 kr — allergies: Gluten, Melk, Egg
- Kanelsnurr — Bakverk — 35 kr — allergies: Gluten, Melk, Egg
- Surdeigbrød — Brød — 120 kr — variants: Halvt, Heilt — allergies: Gluten
- Grovbrød — Brød — 95 kr — allergies: Gluten, Nøtter

### 2. Create opening hours document in Sanity
Go to /studio → Opningstider → the document opens directly (singleton).
Set the schedule:
- Måndag: Stengt (toggle "Stengt denne dagen")
- Tysdag–Sundag: 09:00–18:00
- Manual override: Auto (use schedule)

The manual override toggle (Auto / Tving OPEN / Tving STENGT) is the quick switch
for days when hours differ from the standard schedule.

### 3. Set SANITY_WRITE_TOKEN in .env.local
Required for the admin panel to toggle open/closed.
- Go to sanity.io → project u7hre29r → API → Tokens
- Create token with "Editor" permissions
- Add to .env.local: SANITY_WRITE_TOKEN=sk...

### 4. Set BREVO_API_KEY and OWNER_PHONE in .env.local
Required for SMS notifications on new orders.
- Sign up at brevo.com, go to Settings → API Keys
- Phone must be E.164 format: +47XXXXXXXX
- Add: BREVO_API_KEY=xkeysib-...
- Add: OWNER_PHONE=+47XXXXXXXX

### 5. Set remaining env vars
- STRIPE_SECRET_KEY — for custom cake deposit payments
- STRIPE_WEBHOOK_SECRET — for Stripe webhook
- ADMIN_PASSWORD — to access /admin
- RESEND_API_KEY — for order confirmation emails

### 6. Upload product photos
Add photos to each menu item via /studio → Menyprodukt → Bilete

---

## Later / future features

### Payment aggregation for regular orders
Currently regular orders (spis her / ta med) are free-flow — owner is notified
by email + SMS but no payment is collected. Need to add Stripe/Vipps checkout
to the cart flow before launch if payment at time of order is required.

### Possible missing features (compare with existing site)
- Product image carousel in hero section (existing site has one)
- Online table reservation system (eat-in)
- Loyalty / repeat-customer system
- Integration with POS/kitchen display system for order management
