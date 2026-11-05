Critical Rules — Never Break These

useDarkCursor hook is canonical for cursor switching — never use [data-theme="dark"] CSS selectors (they fail against Tailwind specificity)
Subscribe API always returns success — never return different responses based on whether email exists (prevents enumeration)
Root layout <main className="flex-1"> only — no flex-col. Short pages handle their own layout with min-h-screen flex flex-col on their outer wrapper
Blog GROQ query must include isPublished == true && !(_id in path("drafts.**")) — never just _type == "post"
Stripe live/test key separation — live keys for Production env only, test keys for Preview + Development
Node ≥ 22.12 required — Sanity v6 dependency. Run nvm use in project root (.nvmrc present)


Working Style
Miriam is a frontend developer learning fullstack. She:

Prefers code first, explanation after
Asks clarifying questions before committing to an approach
Actively pushes back on overengineering (good instinct — listen to it)
Uses VS Code GitHub extension for commits (give commit messages only, not full terminal commands)
Uses nvm for Node version management


Repo & Deployment

Repo: github.com/mitsch01/studio-mitsch
Production branch: main (auto-deploys to studio-mitsch.de)
All work goes directly to main — refactor/v2 was merged and is no longer the active branch
Sanity Studio: studio-mitsch.de/studio
Admin newsletter: studio-mitsch.de/admin/newsletter


Implementation Plan & Docs
Full implementation plan, CHANGELOG, README, and ARCHITECTURE docs are in the project files. Always check the implementation plan before starting a new phase — it has the full field-by-field schema spec for Phase 10 and all architectural decisions for Phase 11.
