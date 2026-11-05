# studio-mitsch.de — Refactor & Feature Implementation Plan

**Owner:** Miriam Schwartz  
**Last updated:** July 2026  
**Goal:** Modernise the codebase, improve UX/UI, and add CMS, CRM, Shop, and User Login — staying under €2/month.

---

## Context & Decisions Made

### Stack (finalised)
| Service | Role | Cost |
|---|---|---|
| **Vercel** (Hobby) | Hosting & CI/CD | Free |
| **Sanity** (free tier) | CMS + Studio UI (embedded at `/studio`) | Free (10 GB, 500k req/mo) |
| **MongoDB Atlas** (M0) | Non-CMS data — newsletter subscribers, orders, client auth | Free (512 MB) |
| **Cloudflare R2** | Shop product download files only | Free up to 10 GB, then €0.015/GB |
| **Resend** | Transactional email + newsletters | Free (3,000 emails/mo, 1,000 contacts) |
| **Stripe** | Payments | Free (1.5% + €0.25 per transaction) |

### Key decisions
- **Sanity for CMS, MongoDB for everything else.** Payload CMS was the original plan but causes cold start delays, connection pool exhaustion, and timeouts on Vercel serverless. Sanity's hosted Content Lake works perfectly — queries are simple HTTP fetches.
- **Sanity Studio at `/studio`** — same repo, one deployment. Split into server + client components to satisfy Next.js 16 server/client boundary.
- **TypeScript throughout** — migrated incrementally as each file was touched. Complete as of Phase 8.
- **Shop launches with free products.** Free art downloads (Love, Hug, Good Vibes, A Spark of Joy) test the full cart → checkout → download flow. Paid products added later.
- **R2 scoped to shop downloads only.** Sanity handles CMS media natively.
- **Custom auth** — MongoDB + bcryptjs + jsonwebtoken + jose. No third-party auth service.
- **Permanent downloads for logged-in users** — authenticated API route streams from R2, no expiry. Guests get 7-day pre-signed URLs.
- **Stripe live/test key separation** — live keys for Production environment, test keys for Preview and Development in Vercel.
- **`useDarkCursor` hook is canonical** for dark-section cursor switching — `[data-theme="dark"]` CSS selectors fail against Tailwind specificity and must not be revisited.
- **Subscribe API always returns success** — security best practice to prevent email enumeration.
- **Root layout `<main>` is `flex-1` only** — no `flex-col`. Individual short pages use `min-h-screen flex flex-col` on their outer wrapper.
- **Blog drafts use `isPublished` boolean field** — Sanity's built-in draft toggle not sufficient on free plan.
- **Email forwarding** — `hello@studio-mitsch.de` → `studiomitsch@gmail.com` via do.de E-Mail-Weiterleitung.
- **Phase 10 before Phase 11** — complete CMS content management in English first, then extend with i18n.

---

## Phases Overview

| Phase | What | Status |
|---|---|---|
| 0 | Environment setup & repo prep | ✅ Complete |
| 1 | Codebase refactor (safety + modernisation) | ✅ Complete |
| 2 | UX/UI improvements | ✅ Complete |
| 3 | CMS — Sanity setup + blog | ✅ Complete |
| 4 | Asset storage — Cloudflare R2 (merged into Phase 6) | ✅ Complete |
| 5 | CRM — Newsletter with Resend | ✅ Complete |
| 6 | Shop + R2 — Products, cart, Stripe, downloads | ✅ Complete |
| 7 | User login — Auth + dashboard + downloads | ✅ Complete |
| 8 | Cleanup & deferred tasks | ✅ Complete |
| 9 | Documentation | ✅ Complete |
| 10 | CMS content management (About, Skills, Contact) | ⬜ Todo |
| 11 | Internationalisation (DE/EN) | ⬜ Todo |

---

## Phase 0 — Environment Setup & Repo Prep ✅

### Completed
- Renamed GitHub repo `mitsch-website` → `studio-mitsch`
- Created `refactor/v2` branch — `main` stays production
- Purged `.firebase/` build cache and `public/videos/` from git history via `git filter-repo`
- Migrated hosting from Firebase → Vercel, domain `studio-mitsch.de` pointed to Vercel
- Connected all services: MongoDB Atlas M0, Cloudflare R2, Resend, Stripe
- All env vars configured in `.env.local` and Vercel dashboard

### Environment variables
```bash
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_SANITY_PROJECT_ID=v6oxqy1t
NEXT_PUBLIC_SANITY_DATASET=production
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...
CLOUDFLARE_R2_BUCKET=studio-mitsch-assets
CLOUDFLARE_R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
RESEND_API_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (pk_test_... for Preview/Dev)
STRIPE_SECRET_KEY=sk_live_... (sk_test_... for Preview/Dev)
STRIPE_WEBHOOK_SECRET=whsec_...
OPENAI_API_KEY=...
NEXT_PUBLIC_GITHUB_TOKEN=...
JWT_SECRET=...
NEWSLETTER_SECRET=...
NEXT_PUBLIC_BASE_URL=https://studio-mitsch.de
```

---

## Phase 1 — Codebase Refactor ✅

### Completed
- Fixed SSR crash (`window.innerHeight` moved into `useEffect`)
- GitHub API auth token — rate limit raised 60 → 5,000 req/hour
- Fixed deprecated Next.js Image props (`layout="fill"` → `fill`, `objectFit` → `className`)
- TypeScript with `tsconfig.json` and `@/*` path aliases
- `components/ErrorBoundary.tsx` — wraps RepoGallery and ProjectGallery
- Replaced EmailJS with server-side Resend route (`app/api/contact/route.ts`)
- RepoGallery filtered to `portfolio`-tagged non-fork repos
- SEO metadata added to all pages via Next.js Metadata API
- `"use client"` audit — Footer converted to server component
- Removed: `emailjs`, `firebase`, `axios`, `sweetalert2`, `react-slick`, FontAwesome (3 packages)
- Added: `typescript`, `resend`, `lucide-react`, `motion`

---

## Phase 2 — UX/UI Improvements ✅

### Completed
- Design tokens: `raspberry` (#e8175d), `raspberry-hover`, `section` (96px)
- `components/About.tsx` — two-column layout, skill badges with motion/react animations, Einstein quote
- `components/Skills.tsx` — 2×2 bento grid with progress bars, dark editorial panel
- `components/Header.tsx` — unified smart navbar (hides/shows on scroll, shrinks after hero)
  - Cart icon with item count badge, account icon with logged-in dot indicator
  - Icons hidden below `sm` on mobile — shown in NavModal instead
- `components/NavModal.tsx` — React Portal, scroll lock, Escape key, login/logout removed
  - Account + cart icons at bottom of modal on mobile only (`sm:hidden`)
- `components/Hero.tsx` — extracted with `priority` loading
- Homepage simplified — server component, scroll state machine removed
- Project detail overlay in `RepoGallery.tsx` — replaced intercepting routes
- RepoGallery skeleton loaders with `animate-pulse`
- Contact page — social links, personal intro text
- `Footer.tsx` — 5-column weighted grid, nav links, newsletter form, inline SVGs
- Mobile audit at 375px — all pages checked
- Custom cursors: raspberry dot default, black/pink arrow on dark sections via `useDarkCursor` hook
- Playground mobile: "desktop only" message below `md` breakpoint
- `HindSiliguri-Bold.ttf` added — `font-bold` renders correctly everywhere
- All short pages: `min-h-screen flex flex-col` on outer wrapper, footer always at bottom

---

## Phase 3 — CMS (Sanity) ✅

### Completed
- Sanity project `studio-mitsch` (projectId: `v6oxqy1t`, dataset: `production`)
- Installed `next-sanity`, `@sanity/image-url`, `@sanity/vision`, `@portabletext/react`
- Upgraded React 18 → 19, Node 20 → 22 (required by Sanity v6)
- Studio at `/studio` — split into server + client components
- Schemas: `post.ts`, `project.ts`, `product.ts`
- `post.ts` includes `isPublished` boolean for manual publish control
- Blog: `app/blog/page.tsx` + `app/blog/[slug]/page.tsx`
  - GROQ query: `isPublished == true && !(_id in path("drafts.**"))`
  - Cover images on list (horizontal layout) and detail pages
  - "← All Articles" link at bottom of detail page

---

## Phase 4 — Asset Storage (Cloudflare R2) ✅

Merged into Phase 6. R2 used for shop downloads only.

### Completed
- `lib/r2.ts` — shared S3Client for Cloudflare R2
- `lib/getDownloadUrl.ts` — pre-signed URLs (7-day expiry for guests)
- `app/api/download/route.ts` — permanent authenticated download, streams from R2

---

## Phase 5 — CRM / Newsletter (Resend) ✅

### Completed
- `app/api/newsletter/subscribe/route.ts` — validates, deduplicates, reactivates, saves, sends welcome email
- `app/api/newsletter/unsubscribe/route.ts` — sets `isActive: false`
- `app/api/newsletter/send/route.ts` — bearer token protected, batch send via Resend
- `app/newsletter/unsubscribed/page.tsx` — confirmation page
- `components/NewsletterForm.tsx` — 5 states, wired into Footer
- `react-email` templates: `WelcomeEmail`, `NewsletterEmail`, `OrderConfirmationEmail`
- Admin send UI at `/admin/newsletter` — subject + HTML body + subscriber count + recent signups
- Subscribe API always returns success (prevents email enumeration)

---

## Phase 6 — Shop + R2 ✅

### Completed
- Products in Sanity Studio (Love, Hug, Good Vibes, A Spark of Joy — all €0.00)
- Product images via `@sanity/image-url`
- R2 download files at `downloads/Love.jpg`, `downloads/Hug.jpg`, `downloads/Good_Vibes.jpg`
- `Content-Disposition: attachment` + `ResponseContentDisposition` on pre-signed URLs
- `context/CartContext.tsx` — client-side cart state, duplicate guard
- `app/shop/page.tsx` + `components/ProductCard.tsx`
- `app/shop/cart/page.tsx` — free checkout bypass active, Stripe path ready
- `app/api/checkout/route.ts` — Stripe Checkout Session for paid products
- `app/api/orders/route.ts` — saves orders (free checkout path)
- `app/api/webhooks/stripe/route.ts` — saves orders from Stripe (paid path)
- `app/shop/success/page.tsx` — downloads, guest account prompt
- Order confirmation email with Sanity product thumbnails
- Stripe: live keys for Production, test keys for Preview/Development

---

## Phase 7 — User Login ✅

### Completed
- Custom auth: MongoDB + bcryptjs + jsonwebtoken + jose
- JWT in `httpOnly` cookie (XSS protected)
- API routes: register, login, logout, me, forgot-password, reset-password
- `middleware.ts` — protects `/account/*`, excludes forgot/reset pages
- `context/AuthContext.tsx` — user state across app
- Account pages: login, register, dashboard, settings
- `app/account/forgot-password/page.tsx` + `app/account/reset-password/page.tsx`
  - Reset token: signed JWT (1 hour expiry)
  - Auto-login after successful password reset
  - `useSearchParams` wrapped in `Suspense` for production build
- `components/Tooltip.tsx` — on header account + cart icons
- `components/LogoutButton.tsx`

---

## Phase 8 — Cleanup & Polish ✅

### Completed
- All `.js` files migrated to `.tsx` / `.ts` — TypeScript 100% complete
- `parseInt` radix bug fixed in `check-images` route
- Swiper upgraded to v14
- `npm audit` — undici/ws vulnerabilities fixed
- Image `sizes` props added to all `fill` images
- Lighthouse: 96/100 Accessibility, 100/100 SEO
- `robots.txt` + `sitemap.xml` added to `/public`
- Stripe live keys configured for Production in Vercel
- Footer always at bottom — `min-h-screen flex flex-col` sweep across all short pages
- Root layout `<main className="flex-1">` — `flex-col` removed (was collapsing project gallery width)
- Blog `isPublished` field + GROQ query updated
- NavModal: login/logout removed, mobile icons at bottom
- All JPG/JPEG → WebP (quality 90) — ~93% smaller
- All MP4 videos → H.264 CRF23 — ~95% smaller (836MB → 41MB total)
- `.nvmrc` added (Node 22), README updated with Node version note
- `hello@studio-mitsch.de` → `studiomitsch@gmail.com` forwarding via do.de
- OpenAI: `gpt-4o-mini`, $1/month hard spend limit
- `refactor/v2` merged to `main` — studio-mitsch.de live ✅

---

## Phase 9 — Documentation ✅

### Completed
- `CHANGELOG.md` — Phases 0–9 fully documented
- `README.md` — setup, env vars, deployment, shop guide, download flow, branch strategy
- `ARCHITECTURE.md` — system overview, all data flows, auth, payments, downloads, newsletter, CMS
- `REFLEXION.md` — Abschluss-Reflexion in German (~500 words) for course assessment
- `.nvmrc` added to repo root

---

## Phase 10 — CMS Content Management ⬜

**Goal:** Move hardcoded site content (About bio, Skills, Tech Stack, Contact intro) into Sanity so it can be updated without touching code.

### Architecture
One `siteContent` singleton document in Sanity containing all editable site copy. Build in English first — Phase 11 adds German translations.

### 10.1 — Sanity schema (`sanity/schemaTypes/siteContent.ts`)

**About section:**
- `bioHeading` (string) — "Hi, I'm Miriam"
- `bioParagraph1`, `bioParagraph2`, `bioParagraph3` (text)
- `availabilityStatus` (string) — "Available for Freelance"
- `skillBadges` (array of strings) — the raspberry tag pills

**Contact section:**
- `contactIntro` (text) — intro paragraph on the contact page

**Skills section:**
- `skillGroups` (array of objects: `category` string + `skills` array of `{name, level 1–5}`)
- `stackHeading` (string) — "Modern Web & App Stack"
- `stackBody` (text) — dark editorial panel copy
- `stackTags` (array of strings) — ["TypeScript", "Tailwind CSS", "Next.js", "Flutter"]
- `artMeetsCodeBody` (text) — light panel copy

### 10.2 — Register in Sanity config
Add `siteContent` to `sanity/schemaTypes/index.ts`

### 10.3 — Fetch and inject into components
- `components/About.tsx` — convert from hardcoded to async server component fetching from Sanity
- `app/contact/page.tsx` — fetch `contactIntro`
- `components/Skills.tsx` — convert from hardcoded to async server component fetching from Sanity

### 10.4 — Populate content in Sanity Studio
- Create the `siteContent` document
- Fill in all fields with current hardcoded values
- Verify all three components render identically

### Important note
`Skills.tsx` and `About.tsx` currently use `"use client"` for `motion/react` animations. When converting to server components to fetch from Sanity, the fetch should happen in a parent server component and the animated child stays client-side. Pattern:
```
app/page.tsx (server) → fetches siteContent → passes as props →
  <About data={aboutData} /> (client, keeps animations)
  <Skills data={skillsData} /> (client, keeps animations)
```

---

## Phase 11 — Internationalisation (i18n) ⬜

**Goal:** Full German/English support. German default at `studio-mitsch.de`, English at `studio-mitsch.de/en/`. Visible DE/EN toggle in header. All content and UI strings translated.

### Key decisions
- **Default language:** German (`studio-mitsch.de`)
- **English:** `studio-mitsch.de/en/`
- **Toggle:** visible DE/EN switcher in Header
- **Scope:** all CMS content (Sanity) + all hardcoded UI strings
- **Phase 10 must be complete first** — content needs to be in Sanity before i18n is added

### Architecture

**Routing:** Next.js App Router locale-based routing
- `app/[locale]/` — wraps all pages
- Middleware detects locale from URL prefix, defaults to `de`
- No built-in Next.js i18n config needed — App Router handles it via folder structure

**CMS content:** Sanity i18n plugin
- Install `@sanity/document-internationalization`
- Adds DE/EN language tabs to `siteContent`, `post`, `product` documents
- Studio shows both language versions side by side

**UI strings:** `lib/strings.ts`
- Typed dictionary: `{ de: {...}, en: {...} }`
- All hardcoded labels: "Read more →", "Subscribe", "Add to cart", "Back to Home", nav items, form labels, error messages, footer copy etc.
- Used via `strings[locale].xxx` pattern — passed as props or via context

### Steps

**11.1 — Next.js locale routing**
- Create `app/[locale]/` folder structure
- Move all pages into `[locale]`
- Update `middleware.ts` — handle locale detection alongside existing auth protection
- Add `generateStaticParams` returning `['de', 'en']` to root layout

**11.2 — Sanity i18n plugin**
- `npm install @sanity/document-internationalization`
- Configure in `sanity.config.ts`
- Add i18n support to `siteContent`, `post`, `product` schemas
- Populate German content in Studio

**11.3 — UI strings dictionary**
- Create `lib/strings.ts`
- Covers: navigation items, buttons, form labels, placeholders, error messages, footer copy, success/error states

**11.4 — Language toggle in Header**
- Add DE/EN toggle to `Header.tsx` (top right, near burger)
- Links: `/` (DE) and `/en/` (EN) — or uses `router.push` with locale prefix
- Active language highlighted

**11.5 — Update all components**
- Pass `locale` prop down from page level or use a locale context
- Replace all hardcoded strings with `strings[locale].xxx`
- Fetch Sanity content with locale parameter: `*[_type == "post" && language == $locale]`

**11.6 — SEO**
- Add `hreflang` tags: `<link rel="alternate" hreflang="de" href="https://studio-mitsch.de" />`
- Update `sitemap.xml` to include both locales
- Update `generateMetadata` exports with locale-specific titles and descriptions

---

## Working Principles

- **Code first, explain after.** Understanding built alongside implementation.
- **Commit after every meaningful step.** Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`.
- **Test on mobile.** Every new page checked at 375px.
- **Claude writes the CHANGELOG** at the end of each completed phase.
- **Simplify every file touched** — flag and remove unnecessary complexity.
- **Ask before committing to complexity** — if something feels overengineered, it probably is.

---

*This document is a living plan. Update it as decisions change.*
