# OPTIMIZATION STATE
Updated: 2026-09-13T18:50:00Z
Approval Mode: per-task
Phase: 1 — Global Foundations (fonts, image pipeline, chrome)
Sub-task: 1.2 — Image pipeline config (Invariant F-1, config half)
In Flight: — (1.2 implemented, gates run, committed; parity review pending)
Status: done-awaiting-approval
Waiting on User Approval: yes — V4 parity of 1.2 (Works images now AVIF/WebP via the optimizer; see parity notes); "Continue" = approve and start 1.3
Plan for the sub-task in flight (1.2):
  [x] AGENTS.md gate, same session: 01-getting-started/12-images.md, 03-api-reference/02-components/image.md (props + configuration options), 03-api-reference/05-config/01-next-config-js/images.md; defaults confirmed in node_modules/next/dist/shared/lib/image-config.js (formats ['image/webp'], qualities [75], deviceSizes 640…3840, minimumCacheTTL 14400)
  [x] Sources: next.config.ts (`images.unoptimized: true` only); `next/image` consumers = WorkMinimal.tsx only (4 × `fill`: :114 bg `sizes="100vw"` + `priority`, :208 center `(max-width: 1024px) 100vw, 60vw` + `priority`, :274 mobile bg `100vw`, :307 mobile center `(max-width: 1024px) 100vw, 50vw`); srcs /images/work/{folad 1585×759, sadr 1346×753, autodm 1443×756}.png; raw <img> ProcessSection.tsx:186 and CSS url() backgrounds are untouched by this config (→ Phase 2); sharp 0.34.5 + @img/sharp-linux-x64 present for `next start`
  [x] Edit next.config.ts: deleted `unoptimized`, set `formats: ['image/avif', 'image/webp']` (qualities stay default [75] — no consumer passes `quality`; `priority` → `preload`/`loading` is per-usage work for 2.3)
  [x] Gates: `pnpm build` ✓; `pnpm lint` ✓; `verify-portfolio.mjs casing img assets budget crlf` → `VERIFY: 4 passed, 1 failed, 17 warning(s)` — the one failure is the known raw <img> at ProcessSection.tsx:186 (recorded at Phase 0 close, owned by 2.5; not introduced here); production server log clean; all 27 probes of /_next/image (3 images × w 828/1200/1920 × Accept avif/webp/*) → 200 with the negotiated type: AVIF 21.7–56.2 KB, WebP 25.4–77.6 KB, PNG fallback 103–319 KB vs 828–1105 KB originals; screenshots `.visual/20260913-184421-1.2-images-after/` 24 desktop + 22 mobile, page heights 21219 / 17764 px (unchanged), 0 console/HTTP issues; zoomed ~1:1 before|after crops of the Works center images (FoladMarket, AutoDM) show no visible difference incl. small Persian UI text
  [x] Commit `perf(assets): 1.2 enable Vercel image optimization (AVIF/WebP)` — owner-only authorship (D-9)
  [ ] Owner parity review (V4) → record approval below, then 1.3
1.1 — closed 2026-09-13 (commits 9d3e03a + 2619c24): next/font Inter (normal only, owner dropped italic) + JetBrains Mono feeding --font-body/--font-mono; Resume/Contact family hardcodes → tokens; Contact accent serif stack. Details: LOG.md + commit bodies; parity notes approved (see approvals).
Parity notes pending user review (1.2):
  - Works section images (desktop: blurred full-bleed background + center project screenshot for FoladMarket / SadrHub / AutoDM; mobile: background + screenshot inside the project sheet that opens on tap) are now served by the image optimizer at the width the layout needs, as AVIF quality 75 (WebP for browsers without AVIF) instead of the original 0.8–1.1 MB PNGs — typically 22–56 KB each. At 1:1 on this box no difference is visible, including the small Persian UI text in the screenshots; an optimizer artifact would show first there.
  - Nothing else moves: ProcessSection's icons (raw <img>) and every CSS `background-image` (Contact, Resume, Process) are not touched by this config — they are Phase 2 work.
  - First request for each size on a fresh deploy is slower (on-demand encode), then cached (minimumCacheTTL default 4 h, longer if the upstream header is longer). On Vercel this counts toward image-optimization usage: 3 source images × a handful of widths × 2 formats.
  - What to look at (Vercel preview or `pnpm build && pnpm next start`, ideally a retina/hi-DPI screen + a phone): desktop Works — hover/switch through all three projects, check the center screenshot's text crispness and the background; phone — tap each project to open its sheet and check both images.
Parity approvals (recorded):
  - 0.3 ProcessSection default background now loads (`/images/Process/default.png` casing fix) — approved by owner 2026-09-13 ("background verified").
  - 1.1 typography (all 1.1 parity notes above) — approved by owner 2026-09-13 with one change: "Drop the 52 KB italic font file and continue" → Inter loads normal only; CLS residual accepted as recommended (re-judge with PSI in Phase 6). Amendment verified: build + lint green, verify 5 passed / 0 failed, 2 font preloads (Inter normal 48 KB + JetBrains Mono 40 KB), probe CLS unchanged (desktop 0.0004 / mobile 0.0008 on this box), hero shots `.visual/20260913-184013-1.1b-no-italic/` 0 issues.
Visual baseline (D-10): `.visual/20260913-180311-phase0-baseline/` — production build of commit 84d1f3e source, Chromium 153.0.8010.12, `--every 1vh`: desktop 1440×900 24 shots (page 21219px), mobile 390×844@3 22 shots (page 17764px), 0 console/HTTP issues. Gitignored and local to this box; regenerate from a worktree at 84d1f3e if lost.
  Later sets (same shot grid, 0 issues each): `.visual/20260913-182411-1.1-fonts-after/` (1.1, with the since-dropped Inter italic), `.visual/20260913-184013-1.1b-no-italic/` (top only), `.visual/20260913-184421-1.2-images-after/` (latest — current typography + optimized images). Mobile Works images live in the tap-to-open sheet and are not in any set.
  Font rendering on this box — corrected 1.1 by CSS.getPlatformFontsForNode (fc-match was misleading): Chromium renders `'Helvetica Neue', Arial, sans-serif` (display) AND the old body stack in DejaVu Sans; mono → DejaVu Sans Mono; bare serif → DejaVu Serif. Chromium's `local()` resolves neither Arial nor "Liberation Sans" here (only e.g. "DejaVu Sans"), so next/font's `Inter Fallback` (`src: local(Arial)`) reports `error` on this box.
Open intake fields: INTAKE-1…7 all unresolved (register in .claude/skills/portfolio-optimization-architect/references/seo-blueprint.md) — none block Phase 1
Budget: BASELINE 504.4 KB gz first-load JS on `/` | CURRENT 504.4 KB gz (verify-portfolio.mjs budget after the 1.2 build)
  1.2 detail: /  JS 10 files: 504.4 KB gz / 424.7 KB br / 1763.5 KB raw | CSS 2 files: 18.1 KB gz | HTML 10.7 KB gz (srcSet URLs). Not in the JS budget but relevant to LCP contention: WorkMinimal's two `priority` images are preloaded on `/` although deep below the fold — now ~AVIF 45–56 KB each instead of the ~1 MB PNG (fix the preload itself in 2.3).
  1.1 detail (after italic drop): /  JS 10 files: 504.4 KB gz / 424.5 KB br / 1763.5 KB raw | CSS 2 files: 18.1 KB gz (+1.0, @font-face rules) | HTML 10.6 KB gz (+0.3, font preload links). Font bytes preloaded on `/`: 88 KB (Inter 48 + JetBrains Mono 40; not counted in the JS budget).
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
  1.2 session (2026-09-13): re-read 01-getting-started/12-images.md, 03-api-reference/02-components/image.md, 03-api-reference/05-config/01-next-config-js/images.md
  Not yet read: 04-functions/generate-metadata.md (1.3/3.1), 02-guides/json-ld.md (3.2), 02-guides/forms.md (5.2)
Completed sub-tasks: 0.1, 0.2, 0.3, 0.4, ⛔ Phase 0 gate (plan re-confirmed; D-9 authorship, D-10 visual tooling, D-11 casing check, D-12 gate decisions); 1.1 (owner-approved, italic dropped); 1.2 implemented + committed (parity approval pending)
Next Immediate Action: owner reviews 1.2 parity notes. On approval: record it under "Parity approvals", then start 1.3 — read phase-plan 1.3 + seo-blueprint.md metadata contract; AGENTS.md gate: re-read 01-getting-started/14-metadata-and-og-images.md, 01-getting-started/05-server-and-client-components.md and read 03-api-reference/04-functions/generate-metadata.md; sources layout.tsx, navigation/Navigation.tsx + .module.css, footer/Footer.tsx + .module.css, cursor/CustomCursor.tsx, providers/LenisProvider.tsx; write the chrome interaction inventory before editing. Likely split 1.3a (Navigation + Footer server shells) / 1.3b (base metadata + site.ts, CustomCursor guards, Lenis autoRaf:false) — decide after the inventory and record it here.
Blockers / Open Questions:
  - 1.1 CLS residual — ACCEPTED by owner 2026-09-13 as recommended; re-judge with PSI numbers in Phase 6 (kept here as the Phase 6 input). Scratch probe, throttled cold load, no input:
      · as shipped on this box (no local Arial → fallback metrics not applied): desktop 0.0004, mobile 0.0008 — one shift when Inter swaps in; sources: nav links row / Start Project button / logo line + the right-aligned hero tagline.
      · simulated Windows/macOS (fallback face served from Arial-metric Liberation Sans): mobile 0.0000; desktop 0.0004 remains (nav links row + tagline — average-width matching can't make every string identical).
      · implication: Android (no Arial; Roboto) behaves like this box ≈ 0.0008 in the field. Lighthouse lab likely loads the three preloaded fonts before first paint (no swap), but that's unverified until Phase 6.
      · Option if Phase 6 isn't 0.000: D-13 refinement — an extra Roboto-metric fallback @font-face (local(Roboto), overrides from next's capsize metrics) after next/font's Arial one; and/or JetBrains Mono `preload: false` (not used in the first viewport) to cut 40 KB of early font bytes. (Inter italic already dropped by the owner.) Neither is applied — both would need a DECISIONS entry + approval. Nav is rebuilt in 1.3, which may move the desktop shift sources anyway.
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
Last Commit: 1.2 commit `perf(assets): 1.2 enable Vercel image optimization (AVIF/WebP)` (hash in LOG.md; previous: 2619c24 perf(assets): 1.1 drop the Inter italic file)
