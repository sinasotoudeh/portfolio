# OPTIMIZATION STATE
Updated: 2026-09-13T18:30:00Z
Approval Mode: per-task
Phase: 1 — Global Foundations (fonts, image pipeline, chrome)
Sub-task: 1.1 — Fonts (Invariant F-2)
In Flight: — (1.1 implemented, gates green, committed; parity review pending)
Status: done-awaiting-approval
Waiting on User Approval: yes — V4 parity of 1.1 typography (see parity notes) + the CLS residual question under Blockers; "Continue" = approve both as recommended and start 1.2
Plan for the sub-task in flight (1.1):
  [x] AGENTS.md gate, same session: `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` + `03-api-reference/02-components/font.md`; also read next/font internals (validate-google-font-function-call.js, loader.js preload, server/font-utils.js fallback metrics)
  [x] Sources read fresh: globals.css `@theme` lines 41–43; layout.tsx; font-family grep of src/ — hardcodes at ResumeDashboard.module.css:33/186/295/500, Contact.module.css:22 (system-ui) + :117 (bare serif); `font-mono` utility in CylinderCard.tsx:109; no <code>/<pre>/<kbd>. Body-font italic above the fold: Hero.tsx:300 tagline `<span>mark</span>` (Hero.module.css:282) → Inter loads `style: ['normal','italic']` (Resume `.quote` italic is dead — resumeData.ts:67 commented out). JetBrains Mono: normal only.
  [x] Before-measurement (untouched build, port 4310, scratch CLS/font probe: Lighthouse-like 150ms RTT / 1.6 Mbps / 4× CPU): CLS 0.0000 desktop + mobile, 0 font requests, every body/mono text node rendered in DejaVu Sans / DejaVu Sans Mono / DejaVu Serif
  [x] Implement F-2: layout.tsx — `Inter({ subsets:['latin'], style:['normal','italic'], display:'swap', variable:'--font-inter' })` + `JetBrains_Mono({ subsets:['latin'], display:'swap', variable:'--font-jetbrains-mono' })`, both `.variable` classes on `<html>` (names distinct from the Tailwind `--font-mono` token they feed); globals.css `--font-body: var(--font-inter), 'Helvetica Neue', sans-serif` / `--font-mono: var(--font-jetbrains-mono), 'Fira Code', monospace`; `--font-display` untouched; Resume `.root` → var(--font-body), 3× 'SF Mono' → var(--font-mono); Contact `.contactSection` system-ui → var(--font-body); `.titleItalic` serif → `Times, 'Times New Roman', serif`
  [x] Gates: `pnpm build` ✓ (Next 16.2.1; 3 latin preloads emitted — Inter normal 48 KB, Inter italic 52 KB, JetBrains Mono 40 KB; other subsets emitted but unicode-range-gated); `pnpm lint` ✓ clean; `verify-portfolio.mjs crlf casing client assets budget` → `VERIFY: 5 passed, 0 failed, 17 warning(s)` (warnings = 15 known asset sizes + census informational + budget target); after-probe: every body/mono node renders `Inter [web]` / `JetBrains Mono [web]`, display + serif unchanged; screenshots `.visual/20260913-182411-1.1-fonts-after/` 24 desktop + 22 mobile, page heights identical to baseline (21219 / 17764 px), 0 console/HTTP issues; before|after composites reviewed — no regression beyond the intended font change
  [x] Commit `perf(assets): 1.1 self-hosted fonts with zero-shift fallbacks` — owner-only authorship (D-9)
  [ ] Owner parity review (V4) → record approval below, then 1.2
Parity notes pending user review (1.1):
  - Body text is now real Inter everywhere (nav, hero tagline, Works copy, Capabilities copy, Process panel copy, Resume, Contact, footer). Before, it was whatever each OS substituted for the never-loaded 'Inter': Arial on Windows, Helvetica on macOS, Roboto on Android, DejaVu Sans on Linux — unless the visitor had Inter installed locally. Inter is a little narrower than those, so some paragraphs re-wrap (visible: Resume "About Me" paragraph, Process LAUNCH copy on mobile, the hero burst cards' third line). No section height or position changed (page heights identical).
  - Hero tagline "that leave a *mark*." — "mark" is a true Inter Italic (costs the 52 KB italic file, preloaded). Alternative if you prefer lighter: drop the italic file and let the browser slant regular Inter (a more steeply faux-slanted "mark").
  - Monospace text (Manifesto eyebrow + marquee, section numbers, Capabilities card numbers, Resume window title / sidebar label / profile date) is now JetBrains Mono. Resume's three 'SF Mono' spots previously rendered SF Mono only on macOS; Windows showed Consolas/Courier New.
  - Resume section: was 'Inter' → 'SF Pro Display' → system-ui, i.e. Segoe UI on Windows, SF Pro on macOS. Now Inter like the rest of the page.
  - Contact section: was system-ui (Segoe UI on Windows, SF Pro on macOS). Now Inter. The italic accent "Something" gets `Times, 'Times New Roman', serif` — the same face browsers pick for bare `serif` on macOS/iOS (Times) and Windows (Times New Roman), so it should look unchanged; Android keeps Noto Serif.
  - Unchanged by design: all headings/wordmarks using `--font-display` ('Helvetica Neue', Arial) — including the hero "Sina Sotoudeh" wordmark (the LCP element) and the footer "NONATO".
  - What to look at (production build or Vercel preview, desktop + phone): hero first screen (tagline + nav), scroll to the burst cards, Works/Capabilities copy, Resume window (title bar, sidebar, About Me text), Contact heading "Let's Build *Something*", footer.
Parity approvals (recorded):
  - 0.3 ProcessSection default background now loads (`/images/Process/default.png` casing fix) — approved by owner 2026-09-13 ("background verified").
Visual baseline (D-10): `.visual/20260913-180311-phase0-baseline/` — production build of commit 84d1f3e source, Chromium 153.0.8010.12, `--every 1vh`: desktop 1440×900 24 shots (page 21219px), mobile 390×844@3 22 shots (page 17764px), 0 console/HTTP issues. Gitignored and local to this box; regenerate from a worktree at 84d1f3e if lost.
  Latest set: `.visual/20260913-182411-1.1-fonts-after/` (same shot grid, 0 issues).
  Font rendering on this box — corrected 1.1 by CSS.getPlatformFontsForNode (fc-match was misleading): Chromium renders `'Helvetica Neue', Arial, sans-serif` (display) AND the old body stack in DejaVu Sans; mono → DejaVu Sans Mono; bare serif → DejaVu Serif. Chromium's `local()` resolves neither Arial nor "Liberation Sans" here (only e.g. "DejaVu Sans"), so next/font's `Inter Fallback` (`src: local(Arial)`) reports `error` on this box.
Open intake fields: INTAKE-1…7 all unresolved (register in .claude/skills/portfolio-optimization-architect/references/seo-blueprint.md) — none block Phase 1
Budget: BASELINE 504.4 KB gz first-load JS on `/` | CURRENT 504.4 KB gz (verify-portfolio.mjs budget after the 1.1 build)
  1.1 detail: /  JS 10 files: 504.4 KB gz / 424.5 KB br / 1763.5 KB raw | CSS 2 files: 18.3 KB gz (+1.2, @font-face rules) | HTML 10.6 KB gz (+0.3, 3 font preload links). Font bytes preloaded on `/`: 140 KB (not counted in the JS budget).
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
  1.1 session (2026-09-13): re-read 01-getting-started/13-fonts.md, 03-api-reference/02-components/font.md
  Not yet read: 04-functions/generate-metadata.md (1.3/3.1), 02-guides/json-ld.md (3.2), 02-guides/forms.md (5.2)
Completed sub-tasks: 0.1, 0.2, 0.3, 0.4, ⛔ Phase 0 gate (plan re-confirmed; D-9 authorship, D-10 visual tooling, D-11 casing check, D-12 gate decisions); 1.1 implemented + committed (parity approval pending)
Next Immediate Action: owner reviews 1.1 parity notes + answers the CLS question below. On approval: record it under "Parity approvals", then start 1.2 — re-read `next.config.ts`, `node_modules/next/dist/docs/01-app/01-getting-started/12-images.md` + `03-api-reference/02-components/image.md` + `03-api-reference/05-config/01-next-config-js/images.md`, remove `images.unoptimized`, set `formats`, render every section on a production build, `verify-portfolio.mjs casing img assets`.
Blockers / Open Questions:
  - 1.1 CLS residual (owner call; recommendation: accept now, re-judge with PSI numbers in Phase 6). Scratch probe, throttled cold load, no input:
      · as shipped on this box (no local Arial → fallback metrics not applied): desktop 0.0004, mobile 0.0008 — one shift when Inter swaps in; sources: nav links row / Start Project button / logo line + the right-aligned hero tagline.
      · simulated Windows/macOS (fallback face served from Arial-metric Liberation Sans): mobile 0.0000; desktop 0.0004 remains (nav links row + tagline — average-width matching can't make every string identical).
      · implication: Android (no Arial; Roboto) behaves like this box ≈ 0.0008 in the field. Lighthouse lab likely loads the three preloaded fonts before first paint (no swap), but that's unverified until Phase 6.
      · Option if Phase 6 isn't 0.000: D-13 refinement — an extra Roboto-metric fallback @font-face (local(Roboto), overrides from next's capsize metrics) after next/font's Arial one; and/or JetBrains Mono `preload: false` (not used in the first viewport) to cut 40 KB of early font bytes. Neither is applied — both would need a DECISIONS entry + approval. Nav is rebuilt in 1.3, which may move the desktop shift sources anyway.
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
  - MISSED: body font stack has no metric-compatible fallback — fixed in 1.1 (next/font size-adjusted fallback).
  - CONFIRMED: @react-three/postprocessing, lucide-react, tailwind-merge dead; autoprefixer unreferenced → removed in 0.4. @gsap/react unimported (kept for 2.0).
  - MISSED (Phase 5): `zod` not installed — added with Resend in 5.1 under D-3.
  - OBSERVED: mobile 390×844 at scrollY 844 — hero wordmark "Sina Sotoudeh" overlaps the BUILD burst card. Still present after 1.1, but 1.1 can't decide it: the wordmark uses `--font-display` (not Inter), which renders as DejaVu Sans Bold on this box — much wider than the Arial/Helvetica real phones use. Needs the owner's eyes on a real phone; belongs to 2.1 Hero if real.
  - TOOLING: verify-portfolio.mjs `deps` check was blind (scanned package.json) → fixed (D-8).
Continuity notes:
  - Remote: `origin/main` == local `main` at 110d7f0 when 1.1 started — the owner pushed the Phase 0 commits after the gate (the run itself never pushes). Everything from 1.1 on is local-only until the owner pushes.
  - Commits 3632d32…dfcfa7a (0.1–0.2) carry Claude trailers from before D-9; left as-is (no history rewrite unless the owner asks).
  - .claude/settings.local.json is per-machine — deliberately uncommitted. `.visual/` is gitignored.
  - .gitignore ignores `.env*` — Phase 5.1's `.env.example` needs a `!.env.example` negation.
  - Machine: Playwright 1.63.0 tools at ~/.local/share/portfolio-visual-tools, Chromium 153 system deps installed (D-10). Other servers run on this box (owner's next-servers on :3000 and :3001): stop only your own PIDs. This run used :4310.
  - `pnpm build` needs network for next/font/google (fonts are downloaded at build time); Vercel builds have it.
Last Commit: (1.1 commit — hash recorded in LOG.md by the follow-up state commit)
