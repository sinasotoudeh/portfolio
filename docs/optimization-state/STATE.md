# OPTIMIZATION STATE
Updated: 2026-09-13T23:10:00Z
Approval Mode: per-task
Phase: 0 — Environment, Continuity & Re-Audit
Sub-task: 0.4 — Safe dependency prune + audit delta
In Flight: — (0.4 committed) → ⛔ PHASE 0 GATE
Status: done-awaiting-approval
Waiting on User Approval: yes — ⛔ PHASE 0 GATE: re-confirm Phase 1–6 plan + answer gate questions; owner runs install-deps (D-10)
Plan for the sub-task in flight:
  [x] Sources: postcss.config.mjs loads only `@tailwindcss/postcss` → autoprefixer unreferenced; `verify-portfolio.mjs deps` warns on @gsap/react, @react-three/postprocessing, lucide-react, tailwind-merge; `pnpm why` shows all four prune candidates are direct-only (no dependents)
  [x] `pnpm remove @react-three/postprocessing lucide-react tailwind-merge autoprefixer` → package.json −4 entries, pnpm-lock.yaml −101 lines / +0 (no re-resolution of anything else)
  [x] `pnpm install --frozen-lockfile` clean; `pnpm build` green (compile 4.6s, TS 3.2s); `pnpm lint` exit 0
  [x] Gates: `deps` → only @gsap/react flagged (kept for 2.0); `--all` → 8 passed, 1 failed (img ProcessSection.tsx:186 → 2.5), 17 warnings (15 asset-size, deps @gsap/react, budget target); `budget` unchanged 504.4 KB gz
  [x] Audit delta finalized (below)
  [x] Commit `chore(deps): 0.4 prune dead dependencies` (owner-only authorship, D-9)
Parity notes pending user review: —
Parity approvals (recorded):
  - 0.3 ProcessSection default background now loads (`/images/Process/default.png` casing fix) — approved by owner 2026-09-13 ("background verified").
Open intake fields: all INTAKE fields unresolved (register in .claude/skills/portfolio-optimization-architect/references/seo-blueprint.md)
Budget: BASELINE 504.4 KB gz first-load JS on `/` | CURRENT 504.4 KB gz (verify-portfolio.mjs budget after the 0.4 build — pruned packages were never bundled)
  BASELINE detail (2026-09-13, Next 16.2.1 Turbopack):
    /  JS 10 files: 504.4 KB gz / 424.6 KB br / 1763.5 KB raw | CSS 2 files: 17.1 KB gz | HTML 10.3 KB gz
       349.6 KB gz  static/chunks/0lnsunwr~u0_..js   (1223 KB raw — contains the three.js stack)
        62.5 KB gz  static/chunks/0e_u.-q7b.y8o.js
        37.8 KB gz  static/chunks/0braoh90xzq68.js
    Routes: ○ /   ○ /_not-found   (both prerendered static)
    Target: ≤ 140 KB gz after 2.8 (stretch 120) → −364 KB gz to go
  Verify baseline (--all): 7 passed, 2 failed, 22 warnings — crlf FAIL (30 files), img FAIL (ProcessSection.tsx:186); both pre-existing, scheduled 0.3 / 2.5
Docs read this run (AGENTS.md gate), all under node_modules/next/dist/docs/01-app/:
  02-guides/upgrading/version-16.md
  01-getting-started/05-server-and-client-components.md
  01-getting-started/12-images.md
  03-api-reference/02-components/image.md
  03-api-reference/05-config/01-next-config-js/images.md
  01-getting-started/13-fonts.md
  03-api-reference/02-components/font.md
  01-getting-started/14-metadata-and-og-images.md
  03-api-reference/03-file-conventions/01-metadata/robots.md
  03-api-reference/03-file-conventions/01-metadata/sitemap.md
  01-getting-started/07-mutating-data.md
  03-api-reference/01-directives/use-server.md
  02-guides/lazy-loading.md
  02-guides/package-bundling.md
  03-api-reference/06-cli/next.md
  Not yet read (read in the session that uses them): 04-functions/generate-metadata.md (1.3/3.1), 02-guides/json-ld.md (3.2), 02-guides/forms.md (5.2)
Completed sub-tasks: 0.1, 0.2, 0.3, 0.4 (+ D-9 authorship rule, D-10 visual tooling)
Next Immediate Action: after owner re-confirms the plan at the Phase 0 gate and install-deps has run: start the portfolio production build on a free port, `screenshot.mjs --label phase0-baseline --every 1vh` (desktop + mobile), read the set (re-check the mobile hero wordmark/burst-card overlap with real fallback fonts), record in STATE; then 1.1 Fonts — read installed next/font guides in-session first.
Blockers / Open Questions:
  - OWNER ACTION (D-10): install Chromium's system libraries + fonts once — `sudo env "PATH=$PATH" ~/.local/share/portfolio-visual-tools/node_modules/.bin/playwright install-deps chromium`. Until then `screenshot.mjs` only runs with the session-scratchpad libs (LD_LIBRARY_PATH) and DejaVu fonts. Then capture `phase0-baseline` before 1.1.
  - Stray `.env` at repo root (gitignored, never committed/deployed) is the Shop Platform's env template (Postgres/Redis/Meili/S3/SMTP/auth/payment keys, dated 2026-07-07). `next build` loads it ("Environments: .env"). Portfolio source reads no env vars today, so the baseline is unaffected, but Phase 1.3 introduces `NEXT_PUBLIC_SITE_URL` and Phase 5 `RESEND_API_KEY`/`CONTACT_TO_EMAIL`. Owner decision for the Phase 0 gate: delete/move it, or keep it. Not touched by the run.
Audit delta (final, Phase 0 — vs references/audit-baseline.md @ 8828152):
  - WRONG: "no lockfile of any kind exists" — pnpm-lock.yaml (lockfileVersion 9.0) + pnpm-workspace.yaml are tracked and in sync → D-7 (audit-baseline.md corrected in place).
  - WRONG: CRLF count — 30 files, not 20: 26 under src/ (every component + module CSS, all src/data/*, src/config/capabilities.config.ts), 3 instruction-bundle docs, pnpm-workspace.yaml.
  - MISSED: pnpm-workspace.yaml `ignoredBuiltDependencies: [sharp, unrs-resolver]` (install scripts skipped for both).
  - MISSED: stray Shop Platform `.env` at repo root (see Blockers).
  - MISSED (Next 16): `next build` no longer reports First Load JS; `next/image` `priority` deprecated for `preload`; `images.qualities` defaults to `[75]` → D-8 / relevant to 1.2.
  - WRONG (0.3): CRLF was a working-tree-only condition — every one of the 30 files was already LF in git (`i/lf w/crlf`), so Vercel never received CRLF.
  - MISSED (0.3): runtime casing bug not visible to the `casing` check (it covers imports only, not public URL strings) — ProcessSection.tsx:175 `/images/process/default.png` → fixed. Candidate for the Phase 0 gate: extend `verify-portfolio.mjs` with a public-path existence check (needs a DECISIONS entry).
  - MISSED (0.3): dead data — `src/data/resumeData.ts:80` `background: "url('/images/cv/profile.png')"` references a nonexistent file; its only consumer (ResumeDashboard.tsx:256) is commented out. No runtime effect; left as-is.
  - MISSED (0.3): five create-next-app SVGs in `public/` (file, globe, next, vercel, window) have zero references. Candidate removal at the Phase 0 gate.
  - CONFIRMED (0.4): @react-three/postprocessing, lucide-react, tailwind-merge dead; autoprefixer unreferenced by postcss.config.mjs → all four removed. @gsap/react zero imports as audited (kept for 2.0).
  - MISSED (Phase 5 impact): `zod` is not installed — D-3's "Zod-validated" action adds it in 5.1 alongside Resend (both under D-3).
  - OBSERVED (0.4 screenshots, D-10): at mobile 390×844 scrollY 844 the hero wordmark "Sina Sotoudeh" overlaps the BUILD burst card; captured with DejaVu fallback fonts only — re-check after install-deps (fonts-liberation) before calling it a defect. Pre-existing; not introduced by the run.
  - UNCHANGED: package.json `name` is still "nonato" (template identity) — owner call, not in plan.
  - TOOLING: verify-portfolio.mjs `deps` check was blind (scanned package.json) — fixed → D-8; now warns on @gsap/react, @react-three/postprocessing, lucide-react, tailwind-merge (matches the audit).
Continuity notes:
  - Local main is ahead of origin/main by 9 owner commits + this run's commits. Run never pushes unless asked.
  - .claude/settings.local.json is a per-machine settings file — deliberately left uncommitted.
  - .gitignore ignores `.env*` — Phase 5.1's `.env.example` needs a `!.env.example` negation.
Last Commit: see LOG — `chore(deps): 0.4 prune dead dependencies` (+ follow-up state commit)
