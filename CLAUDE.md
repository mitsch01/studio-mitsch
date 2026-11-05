# Studio Mitsch – Website

Next.js + Tailwind + Sanity. Live at studio-mitsch.de.

## Critical Rules – Never Break These

- **Cursor switching:** The `useDarkCursor` hook is canonical. Never use `[data-theme="dark"]` CSS selectors (they fail against Tailwind specificity).
- **Anti-enumeration:** The subscribe API and forgot-password always return `200 { success: true }`, whether or not the email exists. This is intentional – never "fix" it.
- **Root layout:** `<main>` is `flex-1` only – no `flex-col` (it collapsed the project gallery width). Short pages handle their own layout with `min-h-screen flex flex-col` on their outer wrapper.
- **No staging database:** Local development and previews also write to `studio-mitsch-prod` (MongoDB Atlas). Every test write hits production data – clean up test data afterwards.
- **Blog GROQ query** must include `isPublished == true && !(_id in path("drafts.**"))`. Never use just `_type == "post"`.
- **Stripe keys:** Live keys for the Production environment only. Test keys for Preview and Development.
- **Node ≥ 22.12** required (Sanity v6). Run `nvm use` in the project root (`.nvmrc` present).

## Resend (E-Mail)

- The Resend SDK does **not** throw on API errors. It returns `{ data, error }` – always check `error`.
- Create `new Resend(...)` **inside** the handler function, never at module level. Otherwise the module crashes on import when the API key is missing.
- Known open issue: only `forgot-password` follows this so far. `contact`, `subscribe` and `newsletter/send` still create the client at module level, and other Resend calls may lack an `error` check.

## Portfolio Projects (Sanity + R2)

- The `slug` in the Sanity project document must exactly match the prefix of the R2 file names:
  `<slug>-desktop-N.webp`, `<slug>-mobile-N.webp`, `<slug>-preview.webp`, `<slug>-video.mp4`
- `docs/portfolio-asset-workflow.md` is the single source of truth for the asset terminal commands (shell functions for resizing, compressing, WebP conversion). Don't duplicate or rewrite those commands elsewhere – update that file instead.

## Working Style

Miriam is a frontend developer learning fullstack. She learns by doing.

- Explain and review; only implement when she explicitly asks.
- One step per message; wait for confirmation before the next.
- Ask clarifying questions before committing to an approach.
- Push back on overengineering is a good instinct – listen to it. Prefer the simplest solution.
- She commits via the VS Code GitHub extension: give commit messages only, not terminal commands.
- She uses nvm for Node version management.

## Repo & Deployment

- Repo: github.com/mitsch01/studio-mitsch
- Production branch: `main` (auto-deploys to studio-mitsch.de). All work goes directly to `main`.
- Sanity Studio: studio-mitsch.de/studio
- Admin newsletter: studio-mitsch.de/admin/newsletter

## Docs

- Handoff files for ongoing tasks live in `docs/` (e.g. `docs/handoff-leistungen.md`). Check them before starting a task.
