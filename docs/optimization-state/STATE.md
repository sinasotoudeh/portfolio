# OPTIMIZATION STATE
Updated: 2026-09-14T00:15:00Z
Approval Mode: per-task
Phase: 1 — Global Foundations (fonts, image pipeline, chrome)
Sub-task: 1.1 — Fonts (Invariant F-2) — not started
In Flight: — (Phase 0 closed; owner asked to stop before Phase 1)
Status: done-awaiting-approval
Waiting on User Approval: yes — "Continue" starts 1.1 Fonts
Plan for the sub-task in flight (1.1 — drafted from phase-plan 1.1 + cwv-invariants F-2; re-verify every file/line on fresh read):
  [ ] AGENTS.md gate, in the same session: read `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` + `03-api-reference/02-components/font.md`
  [ ] Sources: `src/app/globals.css` (`@theme` typography: lines 41–43 at 0.4 — `--font-display: 'Helvetica Neue', 'Arial', sans-serif`, `--font-body: 'Inter', 'Helvetica Neue', sans-serif`, `--font-mono: 'JetBrains Mono', 'Fira Code', monospace`); `src/app/layout.tsx`; `src/components/Resume/ResumeDashboard.module.css` (hardcoded 'Inter','SF Pro Display' / 'SF Mono'); `src/components/contact/Contact.module.css` (system-ui, bare serif); grep every `font-family` in src/
  [ ] Implement F-2: `next/font/google` Inter + JetBrains Mono (variable, `subsets: ['latin']`, `display: 'swap'`, default size-adjusted fallback), `variable` classes on `<html>`, wired into `--font-body` / `--font-mono`; `--font-display` stays the system stack; Resume/Contact hardcodes → tokens; explicit serif stack for the Contact accent
  [ ] Gates: `pnpm build`, `pnpm lint`, `verify-portfolio.mjs crlf casing client assets budget`; CLS spot-check; `screenshot.mjs --label 1.1-fonts-after --every 1vh` on a production build vs `phase0-baseline`; re-check the mobile hero overlap (conclusive once Inter renders identically on every machine)
  [ ] Parity notes for the owner: Inter actually loads for the first time (until now body text used the OS fallback — Arial on Windows, Helvetica on macOS, DejaVu Sans on Linux); JetBrains Mono loads; Contact serif accent gets an explicit stack
  [ ] Commit `perf(assets): 1.1 self-hosted fonts with zero-shift fallbacks` — owner-only authorship (D-9)
Parity notes pending user review: —
Parity approvals (recorded):
  - 0.3 ProcessSection default background now loads (`/images/Process/default.png` casing fix) — approved by owner 2026-09-13 ("background verified").
Visual baseline (D-10): `.visual/20260913-180311-phase0-baseline/` — production build of commit 84d1f3e source, Chromium 153.0.8010.12, `--every 1vh`: desktop 1440×900 24 shots (page 21219px), mobile 390×844@3 22 shots (page 17764px), 0 console/HTTP issues. Gitignored and local to this box; regenerate from a worktree at 84d1f3e if lost.
  Font rendering on this box (fc-match): `Arial` → Liberation Sans; `Inter`, `Helvetica Neue`, `JetBrains Mono`, `sans-serif` → DejaVu Sans; `monospace` → DejaVu Sans Mono. So the baseline's body text is DejaVu Sans; display text using the `--font-display` stack is Liberation Sans.
Open intake fields: INTAKE-1…7 all unresolved (register in .claude/skills/portfolio-optimization-architect/references/seo-blueprint.md) — none block Phase 1
Budget: BASELINE 504.4 KB gz first-load JS on `/` | CURRENT 504.4 KB gz (verify-portfolio.mjs budget after the Phase 0 gate build)
  BASELINE detail (2026-09-13, Next 16.2.1 Turbopack):
    /  JS 10 files: 504.4 KB gz / 424.6 KB br / 1763.5 KB raw | CSS 2 files: 17.1 KB gz | HTML 10.3 KB gz
       349.6 KB gz  static/chunks/0lnsunwr~u0_..js   (1223 KB raw — contains the three.js stack)
        62.5 KB gz  static/chunks/0e_u.-q7b.y8o.js
        37.8 KB gz  static/chunks/0braoh90xzq68.js
    Routes: ○ /   ○ /_not-found   (both prerendered static)
    Target: ≤ 140 KB gz after 2.8 (stretch 120) → −364 KB gz to go
  Verify at Phase 0 close (--all): 8 passed, 1 failed (img, ProcessSection.tsx:186 → 2.5), 18 warnings (15 asset-size, casing: dead `profile.png` ref, deps: @gsap/react kept for 2.0, budget target)
Docs read this run (AGENTS.md gate) — Phase 0 session; every later session re-reads what it uses:
  under node_modules/next/dist/docs/01-app/: 02-guides/upgrading/version-16.md, 01-getting-started/05-server-and-client-components.md, 01-getting-started/12-images.md, 03-api-reference/02-components/image.md, 03-api-reference/05-config/01-next-config-js/images.md, 01-getting-started/13-fonts.md, 03-api-reference/02-components/font.md, 01-getting-started/14-metadata-and-og-images.md, 03-api-reference/03-file-conventions/01-metadata/robots.md, 03-api-reference/03-file-conventions/01-metadata/sitemap.md, 01-getting-started/07-mutating-data.md, 03-api-reference/01-directives/use-server.md, 02-guides/lazy-loading.md, 02-guides/package-bundling.md, 03-api-reference/06-cli/next.md
  Not yet read: 04-functions/generate-metadata.md (1.3/3.1), 02-guides/json-ld.md (3.2), 02-guides/forms.md (5.2)
Completed sub-tasks: 0.1, 0.2, 0.3, 0.4, ⛔ Phase 0 gate (plan re-confirmed; D-9 authorship, D-10 visual tooling, D-11 casing check, D-12 gate decisions)
Next Immediate Action: on "Continue": re-read this STATE + `git log --oneline -5`; read `references/phase-plan.md` Phase 1 + `references/cwv-invariants.md` F-2; read the two installed next/font docs in-session; then work the 1.1 plan above top to bottom.
Blockers / Open Questions:
  - None blocking Phase 1.
  - Owner call before the Phase 3 copy sign-off (D-12): the template brand "Nonato" is still visible on the page — `src/components/Manifesto/Manifesto.tsx:22` ("At Nonato,"), `:35` (`NONATO`), `src/components/footer/Footer.tsx:158` ("© … Nonato. All rights reserved."). The run does not change visible copy without the owner's instruction.
Audit delta (final, Phase 0 — vs references/audit-baseline.md @ 8828152):
  - WRONG: "no lockfile of any kind exists" — pnpm-lock.yaml (lockfileVersion 9.0) + pnpm-workspace.yaml tracked and in sync → D-7 (audit-baseline.md corrected in place).
  - WRONG: CRLF count — 30 files, not 20, and working-tree-only (git stored LF via core.autocrlf=input; Vercel never received CRLF) → normalized + .gitattributes in 0.3.
  - MISSED: pnpm-workspace.yaml `ignoredBuiltDependencies: [sharp, unrs-resolver]`.
  - MISSED: stray Shop Platform `.env` at repo root → gone by the Phase 0 gate (D-12).
  - MISSED (Next 16): `next build` no longer reports First Load JS; `next/image` `priority` deprecated for `preload`; `images.qualities` defaults to `[75]` → D-8 / relevant to 1.2.
  - MISSED: runtime casing 404 invisible to the import-only `casing` check (ProcessSection.tsx:175) → fixed in 0.3, check extended (D-11).
  - MISSED: dead data `src/data/resumeData.ts:80` → nonexistent `/images/cv/profile.png`, consumer commented out (ResumeDashboard.tsx:256); `casing` warns; left as-is.
  - MISSED: five unused create-next-app SVGs → removed at the gate (D-12).
  - MISSED: visible "Nonato" copy in Manifesto + Footer (see Blockers) — the audit only noted the package name, which is now `personal-portfolio` (D-12).
  - MISSED: body font stack has no metric-compatible fallback — until 1.1, body text renders in each visitor's OS default sans-serif (visual baseline note above).
  - CONFIRMED: @react-three/postprocessing, lucide-react, tailwind-merge dead; autoprefixer unreferenced → removed in 0.4. @gsap/react unimported (kept for 2.0).
  - MISSED (Phase 5): `zod` not installed — added with Resend in 5.1 under D-3.
  - OBSERVED: mobile 390×844 at scrollY 844 — hero wordmark "Sina Sotoudeh" overlaps the BUILD burst card; unchanged after install-deps (body font still DejaVu via generic sans-serif). Pre-existing; re-check after 1.1, when Inter renders the same everywhere.
  - TOOLING: verify-portfolio.mjs `deps` check was blind (scanned package.json) → fixed (D-8).
Continuity notes:
  - Local main is ahead of origin/main by 9 owner commits + this run's commits. Nothing pushed; the run never pushes unless asked.
  - Commits 3632d32…dfcfa7a (0.1–0.2) carry Claude trailers from before D-9; left as-is (no history rewrite unless the owner asks).
  - .claude/settings.local.json is per-machine — deliberately uncommitted. `.visual/` is gitignored.
  - .gitignore ignores `.env*` — Phase 5.1's `.env.example` needs a `!.env.example` negation.
  - Machine: Playwright 1.63.0 tools at ~/.local/share/portfolio-visual-tools, Chromium 153 system deps installed (D-10). Other servers run on this box (owner's `next dev`, Shop Platform next-servers): stop only your own PIDs.
Last Commit: 84d1f3e chore(env): phase 0 gate housekeeping (unused SVGs, package name) (+ follow-up state commit pointing to Phase 1)
