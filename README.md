# UNIQUE — Watches & Jewelry (demo)

Mobile-first luxury watch boutique built with React + TypeScript + Vite + Framer Motion.

## Run

```bash
npm install
npm run dev
```

Deploy on Vercel as a Vite project (SPA rewrites are in `vercel.json`).

## Where things live

- **Inventory** — `src/data/watches.ts`: one object per watch (brand, model, ref, year, price, condition, box & papers, specs, bilingual description, card tone). Set `price: null` for "Price on request".
- **Copy (EN / ES)** — `src/lib/i18n.ts`, including WhatsApp number and prefilled messages.
- **Stripe** — the checkout buttons open a demo sheet (`CheckoutSheet` in `src/components/Chrome.tsx`). For the live store, replace it with a redirect to a Stripe Checkout Session or Payment Link.

## Pages

`/` home · `/shop` collection with search, brand, condition and sort · `/watch/:slug` product page (gallery, specs, condition report, what's included, Product JSON-LD) · `/bag` · `/saved` · `/sell` sell/trade form to WhatsApp · `/about` · `/care` shipping, returns, warranty, authenticity, payments.
