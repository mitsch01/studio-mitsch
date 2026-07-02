# Studio Mitsch

Personal portfolio site for Miriam Schwartz — Hamburg-based fullstack web and app developer.

**Live:** [studio-mitsch.de](https://studio-mitsch.de)  
**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Sanity CMS, MongoDB Atlas, Cloudflare R2, Resend, Stripe

---

## Tech Stack

| Service | Role | Cost |
|---|---|---|
| Vercel (Hobby) | Hosting & CI/CD | Free |
| Sanity (free tier) | CMS + Studio UI | Free |
| MongoDB Atlas M0 | Non-CMS data (subscribers, orders, auth) | Free |
| Cloudflare R2 | Shop product downloads | Free up to 10GB |
| Resend | Email + newsletters | Free |
| Stripe | Payments | Free (per transaction) |

---

## Local Setup

### Prerequisites
- Node.js ≥ 22.12
- npm ≥ 10

### Installation

```bash
git clone https://github.com/mitsch01/studio-mitsch.git
cd studio-mitsch
git checkout refactor/v2
npm install
```

### Environment variables

Create `.env.local` at the project root:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://...

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=v6oxqy1t
NEXT_PUBLIC_SANITY_DATASET=production

# Cloudflare R2
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_BUCKET=studio-mitsch-assets
CLOUDFLARE_R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com

# Resend
RESEND_API_KEY=...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Auth
JWT_SECRET=...

# GitHub API
NEXT_PUBLIC_GITHUB_TOKEN=...

# OpenAI (Playground)
OPENAI_API_KEY=...

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Run locally

```bash
npm run dev
```

- Site: [localhost:3000](http://localhost:3000)
- Sanity Studio: [localhost:3000/studio](http://localhost:3000/studio)

---

## Deployment

The site deploys automatically to Vercel on every push to `refactor/v2`.

All environment variables must also be set in the Vercel dashboard under **Settings → Environment Variables**.

For production, set:
```bash
NEXT_PUBLIC_BASE_URL=https://studio-mitsch.de
```

---

## Adding Shop Products

### Step 1 — Upload the download file to R2

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → R2 → `studio-mitsch-assets`
2. Upload your file (illustration, PDF, etc.)
3. Note the file key — this is the path within the bucket, e.g. `downloads/love.png`

### Step 2 — Create the product in Sanity Studio

1. Open [studio-mitsch.de/studio](https://studio-mitsch.de/studio) (or `localhost:3000/studio` locally)
2. Click **Product** in the left sidebar
3. Click **Create new**
4. Fill in:
   - **Name** — e.g. `Love`
   - **Slug** — click Generate (auto-fills from name)
   - **Description** — short description shown on product card
   - **Price** — `0` for free, or the price in euros
   - **Product Image** — upload a preview image
   - **Download Key** — paste the R2 file key from Step 1 (e.g. `downloads/love.png`)
   - **Active** — toggle on to make it visible in the shop
5. Click **Publish**

The product appears in the shop immediately. Logged-in customers who purchase it will see a Download button in their account dashboard.

### Step 3 — Test the download

1. Add the product to cart at `/shop`
2. Complete checkout
3. Go to `/account/dashboard`
4. Click **Download** — the file should stream directly from R2

---

## How Downloads Work

**Logged-in customers:**
- Download links go through `/api/download?slug=...`
- Every request verifies the JWT cookie and checks the order exists in MongoDB
- Links never expire — customers can re-download anytime from their dashboard

**Guest customers:**
- Get a 7-day pre-signed R2 URL on the success page
- Encouraged to create an account for permanent access

---

## Key Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, about, skills, projects |
| `/blog` | Blog post list |
| `/blog/[slug]` | Individual blog post |
| `/shop` | Product grid |
| `/shop/cart` | Cart |
| `/shop/success` | Order confirmation + downloads |
| `/contact` | Contact form |
| `/playground` | AI Haiku generator |
| `/studio` | Sanity Studio (admin only) |
| `/account/login` | Client login |
| `/account/register` | Client registration |
| `/account/dashboard` | Client dashboard — orders + downloads |

---

## Content Management

All blog posts, projects, and shop products are managed via **Sanity Studio** at `/studio`.

### Adding a blog post
1. Open Studio → **Post** → **Create new**
2. Fill in title, slug, excerpt, cover image, body
3. Set **Published At** date
4. Click **Publish**

### Adding a CMS project
1. Open Studio → **Project** → **Create new**
2. Fill in title, slug, description, cover image, tags, live URL
3. Set **Order** (lower = appears first in grid)
4. Toggle **Visible** on
5. Click **Publish**

---

## Newsletter

Subscribers are stored in MongoDB (`studio-mitsch-prod` → `subscribers` collection).

- Subscribe: POST `/api/newsletter/subscribe`
- Unsubscribe: GET `/api/newsletter/unsubscribe?email=...`
- Welcome email sent automatically via Resend on subscribe

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production — never commit directly |
| `refactor/v2` | Active development |

Always work on `refactor/v2` and merge to `main` when ready to deploy a stable version.
