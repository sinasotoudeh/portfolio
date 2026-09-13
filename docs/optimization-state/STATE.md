# OPTIMIZATION STATE
Updated: 2026-09-13T21:40:00Z
Approval Mode: per-task
Phase: 0 — Environment, Continuity & Re-Audit
Sub-task: 0.2 — Toolchain & baseline
In Flight: — (0.2 committed)
Status: done-awaiting-approval
Waiting on User Approval: yes — "Continue" starts 0.3 WSL scrub and confirms D-8 (budget measurement method + deps-check fix)
Plan for the sub-task in flight:
  [x] node --version → v24.18.0 (Next 16 needs ≥ 20.9 ✓); pnpm 10.34.3
  [x] Re-audit finding: pnpm-lock.yaml + pnpm-workspace.yaml tracked since 4ec3a44, in sync with package.json → user chose pnpm → D-7
  [x] `pnpm install --frozen-lockfile` → 422 packages, zero lockfile diff
  [x] Commit next.config.ts alone → 3023e40 `chore(config): adopt serverful Vercel target (drop static export)`
  [x] `pnpm build` passes unmodified (Next 16.2.1 Turbopack; compile 4.1s, TS 2.6s; `/` and `/_not-found` static)
  [x] Next 16 removed First Load JS from build output → new `verify-portfolio.mjs budget` check → BASELINE recorded (D-8)
  [x] AGENTS.md gate: guides read (list below)
  [x] Skill text npm→pnpm (D-7), `priority`→`preload` + budget method (D-8), deps-check blind spot fixed (D-8)
  [x] `pnpm lint` baseline: clean (exit 0)
  [x] Commit `chore(env): 0.2 pnpm toolchain baseline`
Parity notes pending user review: —
Open intake fields: all INTAKE fields unresolved (register in .claude/skills/portfolio-optimization-architect/references/seo-blueprint.md)
Budget: BASELINE 504.4 KB gz first-load JS on `/` | CURRENT 504.4 KB gz (verify-portfolio.mjs budget, build of 3023e40 source)
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
Completed sub-tasks: 0.1, 0.2
Next Immediate Action: 0.3 — run `verify-portfolio.mjs crlf casing assets`; add `.gitattributes` (`* text=auto eol=lf` + `-text` for png/jpg/webp/woff2/ico); `git add --renormalize .`; convert working-tree CRLF files; rename `public/images/Process/discover/logos-Google Analytics.png` → `logos-Google-Analytics.png` and `public/images/Process/design/geometric shape.png` → `geometric-shape.png` after grepping `src/` for references; `pnpm build`; commit `chore(env): 0.3 normalize line endings, asset names, add .gitattributes`.
Blockers / Open Questions:
  - Stray `.env` at repo root (gitignored, never committed/deployed) is the Shop Platform's env template (Postgres/Redis/Meili/S3/SMTP/auth/payment keys, dated 2026-07-07). `next build` loads it ("Environments: .env"). Portfolio source reads no env vars today, so the baseline is unaffected, but Phase 1.3 introduces `NEXT_PUBLIC_SITE_URL` and Phase 5 `RESEND_API_KEY`/`CONTACT_TO_EMAIL`. Owner decision for the Phase 0 gate: delete/move it, or keep it. Not touched by the run.
Audit delta (accumulating for 0.4):
  - WRONG: "no lockfile of any kind exists" — pnpm-lock.yaml (lockfileVersion 9.0) + pnpm-workspace.yaml are tracked and in sync → D-7 (audit-baseline.md corrected in place).
  - WRONG: CRLF count — 30 files, not 20: 26 under src/ (every component + module CSS, all src/data/*, src/config/capabilities.config.ts), 3 instruction-bundle docs, pnpm-workspace.yaml.
  - MISSED: pnpm-workspace.yaml `ignoredBuiltDependencies: [sharp, unrs-resolver]` (install scripts skipped for both).
  - MISSED: stray Shop Platform `.env` at repo root (see Blockers).
  - MISSED (Next 16): `next build` no longer reports First Load JS; `next/image` `priority` deprecated for `preload`; `images.qualities` defaults to `[75]` → D-8 / relevant to 1.2.
  - TOOLING: verify-portfolio.mjs `deps` check was blind (scanned package.json) — fixed → D-8; now warns on @gsap/react, @react-three/postprocessing, lucide-react, tailwind-merge (matches the audit).
Continuity notes:
  - Local main is ahead of origin/main by 9 owner commits + this run's commits. Run never pushes unless asked.
  - .claude/settings.local.json is a per-machine settings file — deliberately left uncommitted.
  - .gitignore ignores `.env*` — Phase 5.1's `.env.example` needs a `!.env.example` negation.
Last Commit: see LOG — `chore(env): 0.2 pnpm toolchain baseline` (+ follow-up state commit recording the LOG line)
