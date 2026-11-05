# Studio Mitsch — Handoff for Phase 10 + 11
**Date:** July 2026  
**Picking up from:** Phase 9 complete — site live at studio-mitsch.de  
**Next:** Phase 10 (CMS content management) → Phase 11 (i18n DE/EN)

---

## Project Overview
Personal portfolio site for Miriam Schwartz — Hamburg-based fullstack web + app developer. Repo: `github.com/mitsch01/studio-mitsch`, working branch: `main` (production). Vercel Hobby deployment, budget under €2/month.

---

## Stack
| Service | Role |
|---|---|
| Next.js 16, React 19, TypeScript | Frontend framework |
| Tailwind CSS | Styling (tokens: `raspberry` #e8175d, `raspberry-hover` #c3144f, `py-section` 96px) |
| Sanity CMS (projectId: `v6oxqy1t`, dataset: `production`) | Blog, products, projects |
| MongoDB Atlas M0 | Subscribers, orders, client auth |
| Cloudflare R2 | Shop product downloads |
| Resend | Email — all sending from `hello@studio-mitsch.de` → `studiomitsch@gmail.com` |
| Stripe | Payments (live keys on Production, test keys on Preview/Dev) |
| Vercel Hobby | Hosting |

---

## Current State (end of Phase 9)

Everything is live and working at `studio-mitsch.de`:

- ✅ Homepage with hero, about, skills, projects
- ✅ Blog with Sanity CMS (publish/unpublish via `isPublished` field)
- ✅ Shop with cart, free checkout, R2 downloads
- ✅ User auth (register, login, dashboard, settings, password reset)
- ✅ Newsletter (subscribe, unsubscribe, admin send UI at `/admin/newsletter`)
- ✅ Contact form (sends to studiomitsch@gmail.com via Resend)
- ✅ Playground haiku generator (OpenAI gpt-4o-mini, $1/month hard limit)
- ✅ TypeScript 100% complete
- ✅ Lighthouse: 96% accessibility, 100% SEO
- ✅ All images WebP (q90), all videos H.264 CRF23
- ✅ README, CHANGELOG, ARCHITECTURE docs complete

### Key files
```
app/
├── layout.tsx              — root layout (AuthProvider, CartProvider, <main className="flex-1">)
├── page.tsx                — homepage (server component)
├── blog/page.tsx           — blog list (GROQ: isPublished == true)
├── blog/[slug]/page.tsx    — blog detail
├── shop/page.tsx           — product grid
├── shop/cart/page.tsx      — cart (free bypass active, Stripe path commented in)
├── shop/success/page.tsx   — order confirmation + downloads
├── contact/page.tsx        — contact form
├── playground/             — haiku generator (desktop only)
├── studio/                 — Sanity Studio
├── admin/newsletter/       — newsletter admin UI
└── account/                — login, register, dashboard, settings, forgot/reset password

components/
├── About.tsx               — hardcoded bio + skill badges (Phase 10 target)
├── Skills.tsx              — hardcoded skill groups + stack copy (Phase 10 target)
├── Header.tsx              — unified smart navbar
├── NavModal.tsx            — full-screen nav overlay (Portal)
├── Hero.tsx                — full-screen hero image
├── RepoGallery.tsx         — GitHub repos + project overlay
├── Footer.tsx              — newsletter form + nav links
├── NewsletterForm.tsx      — subscribe form
└── ProductCard.tsx         — shop product card

sanity/schemaTypes/
├── post.ts                 — title, slug, excerpt, coverImage, body, isPublished
├── product.ts              — name, slug, description, price, image, downloadKey, isActive
└── project.ts              — title, slug, description, coverImage, tags, liveUrl, order, isVisible

lib/
├── r2.ts                   — Cloudflare R2 S3 client
└── getDownloadUrl.ts       — pre-signed URL generator (7-day expiry)

hooks/
└── useDarkCursor.ts        — adds body.dark-cursor class for dark-section cursor switching
```

---

## What Needs Doing

### Phase 10 — CMS Content Management
Move hardcoded content from `About.tsx`, `Skills.tsx`, and `app/contact/page.tsx` into a Sanity `siteContent` singleton document. Build in English — Phase 11 adds German.

**The challenge:** `About.tsx` and `Skills.tsx` use `"use client"` for `motion/react` animations. The correct pattern when converting to Sanity-fed components is:

```
app/page.tsx (server) → fetches siteContent from Sanity → passes as props ↓
  <About data={aboutData} />   — stays "use client" for animations
  <Skills data={skillsData} /> — stays "use client" for animations
```

Do NOT make About/Skills server components — they need to stay client-side for animations. Fetch the data in the parent server component (`app/page.tsx`) and pass it down as props.

**Steps:**
1. Create `sanity/schemaTypes/siteContent.ts` — singleton document with all fields (see implementation plan for full field list)
2. Register in `sanity/schemaTypes/index.ts`
3. Fetch in `app/page.tsx` and `app/contact/page.tsx`
4. Update `About.tsx` and `Skills.tsx` to accept props instead of using hardcoded data
5. Create the `siteContent` document in Sanity Studio and fill in all current values
6. Verify all three components render identically

### Phase 11 — Internationalisation (DE/EN)
German default at `studio-mitsch.de`, English at `studio-mitsch.de/en/`. Full scope: all CMS content + all UI strings.

**Requires Phase 10 to be complete first.**

Key steps:
1. Next.js App Router locale routing (`app/[locale]/`)
2. Sanity `@sanity/document-internationalization` plugin
3. `lib/strings.ts` — typed dictionary for all hardcoded UI strings
4. DE/EN toggle in `Header.tsx`
5. All components updated to use `strings[locale].xxx`
6. SEO: `hreflang` tags, locale-specific metadata, updated sitemap

---

## Critical Rules — Never Break These

- **`useDarkCursor` hook is canonical** for cursor switching — never use `[data-theme="dark"]` CSS selectors (they fail against Tailwind specificity)
- **Subscribe API always returns success** — never return different responses based on whether email exists (prevents enumeration)
- **Root layout `<main className="flex-1">` only** — no `flex-col`. Short pages handle their own layout with `min-h-screen flex flex-col` on their outer wrapper
- **Blog GROQ query must include** `isPublished == true && !(_id in path("drafts.**"))` — never just `_type == "post"`
- **Stripe live/test key separation** — live keys for Production env only, test keys for Preview + Development
- **Node ≥ 22.12 required** — Sanity v6 dependency. Run `nvm use` in project root (`.nvmrc` present)

---

## Working Style

Miriam is a frontend developer learning fullstack. She:
- Prefers code first, explanation after
- Asks clarifying questions before committing to an approach
- Actively pushes back on overengineering (good instinct — listen to it)
- Uses VS Code GitHub extension for commits (give commit messages only, not full terminal commands)
- Uses `nvm` for Node version management

---

## Repo & Deployment

- **Repo:** `github.com/mitsch01/studio-mitsch`
- **Production branch:** `main` (auto-deploys to studio-mitsch.de)
- **All work goes directly to main** — `refactor/v2` was merged and is no longer the active branch
- **Sanity Studio:** `studio-mitsch.de/studio`
- **Admin newsletter:** `studio-mitsch.de/admin/newsletter`

---

## Implementation Plan & Docs

Full implementation plan, CHANGELOG, README, and ARCHITECTURE docs are in the project files. Always check the implementation plan before starting a new phase — it has the full field-by-field schema spec for Phase 10 and all architectural decisions for Phase 11.
