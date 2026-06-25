# Changelog

All notable changes to studio-mitsch.de are documented here.
Format: [Phase] — [Date] — [Description]

---

## Phase 0 — Environment Setup & Repo Prep
**Date:** June 2026

### Repository
- Renamed GitHub repository from `mitsch-website` to `studio-mitsch`
- Created `refactor/v2` branch for all development work — `main` stays production
- Purged `.firebase/` build cache and `public/videos/` from entire git history using `git filter-repo`
- Removed `firebase-debug.log` from git tracking
- Cleaned up `.gitignore`: added `.firebase/`, `public/videos/`, `firebase-debug.log`, `*.mp4` — all large media and build artifacts now properly excluded

### Bug fix
- Fixed `ReferenceError: window is not defined` SSR crash in `app/page.js` — moved `window.innerHeight` call from module level into `useEffect` so it only runs in the browser, not during server-side pre-rendering

### Infrastructure
- Migrated hosting from Firebase Hosting → Vercel
- Connected `studio-mitsch.de` domain to Vercel
- Configured all environment variables in Vercel dashboard (Production + Preview + Development)

### Services connected
- **MongoDB Atlas** (M0 free tier) — existing cluster, added `studio-mitsch-prod` database
- **Cloudflare R2** — bucket `studio-mitsch-assets` created for media and asset storage
- **Resend** — account created, `studio-mitsch.de` domain verified for email sending
- **Stripe** — account created in test mode, webhook endpoint configured
- **GitHub Personal Access Token** — added for authenticated GitHub API calls (raises rate limit from 60 → 5,000 req/hour)

### Environment variables added
`MONGODB_URI`, `PAYLOAD_SECRET`, `CLOUDFLARE_R2_ACCESS_KEY_ID`, `CLOUDFLARE_R2_SECRET_ACCESS_KEY`, `CLOUDFLARE_R2_BUCKET`, `CLOUDFLARE_R2_ENDPOINT`, `RESEND_API_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `OPENAI_API_KEY`, `GITHUB_TOKEN`

---

