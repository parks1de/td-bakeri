# T&D Bakeri

Full-stack bakery website built with Next.js 15 (App Router), TypeScript, and Tailwind CSS.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS + inline styles |
| Payments | Stripe Checkout + Webhook |
| Email | Resend |
| SMS | Twilio (optional) |
| Deployment | Vercel |
| Menu CMS | Local JSON + Admin UI |

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local` and fill in your keys:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend - resend.com)
RESEND_API_KEY=re_...
OWNER_EMAIL=post@tdbakeri.no

# SMS (Twilio - optional)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=+1...
OWNER_PHONE=+47...

# Admin panel
ADMIN_PASSWORD=YourSecurePassword

# App URL
NEXT_PUBLIC_BASE_URL=https://tdbakeri.no
```

### 3. Add logo

Place your logo file at:
```
public/images/logo.png
```
Both the main logo (full) and the icon logo work here. The navbar and footer will display it automatically.

### 4. Run locally
```bash
npm run dev
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage with hero, menu preview, features, CTA |
| `/meny` | Full menu with categories, allergens, variants |
| `/bestill-kake` | Custom cake order form + Stripe payment |
| `/bestill-kake/takk` | Order confirmation page |
| `/om-oss` | About page |
| `/kontakt` | Contact page with map info |
| `/admin` | Admin login |
| `/admin/meny` | Full admin dashboard |

---

## Admin Dashboard (`/admin/meny`)

Login with your `ADMIN_PASSWORD` from `.env.local`.

### Managing the Menu
- **Add** products with title, description, price, category, allergens, variants, image
- **Edit** any product inline
- **Delete** products (with confirmation)
- **Toggle visibility** — hide/show items without deleting

Changes are saved instantly to `data/menu.json`.

### Managing Opening Hours

**Static schedule:** Set open/close times for each day of the week. Set a day to null = closed.

**Manual override (IMPORTANT for unexpected closures):**
- Press "Sett som APEN" — site shows green "Apen" regardless of schedule
- Press "Sett som STENGT" — site shows red "Stengt" regardless of schedule  
- Press "Tilbake til normal" — reverts to the schedule

The status dot in the navbar and on the homepage updates every 60 seconds automatically.

---

## How Orders Work

1. Customer fills out `/bestill-kake` form
2. Clicks submit → redirected to **Stripe Checkout** (200 kr deposit)
3. On successful payment → Stripe fires webhook to `/api/stripe/webhook`
4. Webhook sends:
   - **SMS** to owner via Twilio (instant)
   - **Email** to owner via Resend (instant)
   - **Confirmation email** to customer via Resend
5. Customer lands on `/bestill-kake/takk`

### Stripe Webhook Setup (required for notifications)
```bash
# Install Stripe CLI
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Copy the webhook secret to `STRIPE_WEBHOOK_SECRET` in `.env.local`.

On Vercel, add the webhook URL in Stripe Dashboard:
```
https://tdbakeri.no/api/stripe/webhook
```

---

## Deployment (Vercel)

```bash
# Push to GitHub first, then:
vercel --prod
```

Or connect the GitHub repo to Vercel and it deploys automatically on push.

**Add all environment variables in Vercel Dashboard > Project Settings > Environment Variables.**

---

## Logo File

Place your logo at: `public/images/logo.png`

Recommended: PNG with transparent background, minimum 200x200px.
The SVG logo can also be used: `public/images/logo.svg`

---

## Structure

```
tdbakeri/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout (Navbar + Footer)
│   ├── globals.css           # Global styles + design tokens
│   ├── meny/page.tsx         # Menu page
│   ├── bestill-kake/
│   │   ├── page.tsx          # Order form
│   │   └── takk/page.tsx     # Confirmation
│   ├── om-oss/page.tsx       # About
│   ├── kontakt/page.tsx      # Contact
│   ├── admin/
│   │   ├── page.tsx          # Login
│   │   └── meny/page.tsx     # Dashboard
│   └── api/
│       ├── status/route.ts   # Open/closed status
│       ├── stripe/
│       │   ├── checkout/     # Create Stripe session
│       │   └── webhook/      # Handle payment success
│       └── admin/
│           ├── menu/         # CRUD menu items
│           └── hours/        # Read/write opening hours
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── OpenStatus.tsx
├── lib/
│   ├── menu.ts               # Menu file helpers
│   ├── hours.ts              # Hours logic + open status
│   └── notify.ts             # Email + SMS notifications
├── data/
│   ├── menu.json             # Menu data (edit here or via admin)
│   └── hours.json            # Hours + override state
└── public/
    └── images/
        └── logo.png          # <-- Place your logo here
```

