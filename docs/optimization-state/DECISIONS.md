# OPTIMIZATION DECISIONS

Append-only mini-ADRs for the portfolio-optimization-architect run. Anything that deviates from or refines the skill, the instruction files (`docs/optimization-skill-creation-instructions/`), or the locked decisions gets an entry here **and** explicit user approval before it ships.

D-1…D-4 were settled in the structured Technical Realignment Interview on 2026-07-11; D-5 and D-6 are corrections/refinements recorded by the skill at the same time. They are seeded verbatim from `.claude/skills/portfolio-optimization-architect/SKILL.md` (Locked Decisions) and `references/phase-plan.md`.

---

## D-1 — Capabilities cylinder → CSS 3D rebuild

**Context:** `Capability/CapabilitiesSection.tsx` + `Capability/CylinderCard.tsx` are the only consumers of the WebGL stack (`three`, `@react-three/fiber`, `@react-three/drei`, `@use-gesture/react`; `@react-three/postprocessing` is installed but unimported). The cards are DOM already (drei `<Html>`), so WebGL buys only the ring transform while costing the heaviest chunk of first-load JS and main-thread time.
**Decision:** Rebuild the cylinder as a CSS 3D ring (`rotateY`/`translateZ`); the entire three.js stack (`three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `@use-gesture/react`) leaves the project.
**Why:** Removes the largest client runtime on the page while keeping the cards as real, crawlable flow DOM. Pixel parity is gated on side-by-side user approval (Phase 2.4).
**Approved by user:** yes — 2026-07-11 interview.

## D-2 — One animation runtime: GSAP + ScrollTrigger

**Context:** Two animation engines ship today: `framer-motion` (Manifesto, WorkMinimal, Resume, Contact, Capabilities) and `gsap` (ProcessSection).
**Decision:** One animation runtime: GSAP + ScrollTrigger via `useGSAP`. All framer-motion usage is ported with matched feel, then `framer-motion` is removed. ProcessSection's existing GSAP choreography stays untouched. Lenis stays (re-wired to GSAP's ticker).
**Why:** A single engine halves motion JS, gives one ticker for Lenis + ScrollTrigger (no scroll/animation desync), and ProcessSection's already-approved choreography needs no re-review.
**Approved by user:** yes — 2026-07-11 interview.

## D-3 — Contact form → Resend Server Action

**Context:** `contact/Contact.tsx` renders a client-only form with no transport.
**Decision:** Zod-validated Server Action delivering via Resend, `useActionState` progressive enhancement. Resend is a pre-approved new runtime dependency.
**Why:** Server-side validation and delivery with no client transport code; the form works without JS. Requires `RESEND_API_KEY` (INTAKE-2) from the owner — the no-key path is an honest, documented failure, never a fake success.
**Approved by user:** yes — 2026-07-11 interview.

## D-4 — Case studies → typed TS schema + static RSC routes

**Context:** Project data already lives in typed modules under `src/data/*.ts`; there is no case-study surface and no crawlable deep content.
**Decision:** Typed TS schema (`src/data/case-studies.ts`) rendering static RSC routes at `/work/[slug]`, Atajoy first; the JSON-LD graph links into them.
**Why:** Extends the repo's existing data pattern (no CMS dependency), produces statically generated, indexable pages, and gives the `@graph` stable `@id` targets.
**Approved by user:** yes — 2026-07-11 interview.

## D-5 — Atajoy showcase states verified facts (MongoDB, not Postgres)

**Context:** Instruction File 3 (`3-seo-showcase-integration.md`) describes Project Atajoy as Payload on Postgres. The reference source at `/home/sina/projects/shop-platform/.meta/reference-agency-portfolio/` shows Payload 3.84 configured with `mongooseAdapter` (MongoDB).
**Decision:** The showcase and case study state only verified facts — Payload 3.84 on MongoDB (`mongooseAdapter`). The instruction file's Postgres claim is corrected, not repeated. Every fact is re-verified against its cited file in-session before it renders (Phase 4.1).
**Why:** Instruction files are benchmarks, not scripture; publishing a wrong stack claim on a portfolio is a credibility defect.
**Approved by user:** yes — accepted default, 2026-07-11 interview.

## D-6 — Phase sequencing: foundations before section rebuilds; RSC + motion in one pass

**Context:** The instruction files order work by concern (performance, then SEO, then showcase). Visual-parity reviews are the run's most expensive resource (the owner's attention).
**Decision:** Fonts and image config land **before** section rebuilds (Phase 1 before Phase 2) so every visual-parity review is judged against final typography/rendering. RSC conversion and GSAP porting happen **per section in one pass** so each section is reviewed once, not twice.
**Why:** Reviewing sections first and changing fonts after would invalidate every approval.
**Approved by user:** yes — accepted with the skill's phase plan, 2026-07-11; re-confirmed with the full Phase 1–6 plan at the Phase 0 gate, 2026-09-13.

## D-7 — Package manager: keep pnpm (the audit's "no lockfile" finding was wrong)

**Context:** `references/audit-baseline.md` states "no lockfile of any kind exists", and phase-plan 0.2 therefore prescribes `npm install` + committing a generated `package-lock.json`. Re-audit on 2026-09-13 found `pnpm-lock.yaml` (lockfileVersion 9.0) and `pnpm-workspace.yaml` tracked in git since `4ec3a44` (Initial commit), last updated in `8892c2f` (2026-04-05); history includes `05d1d3b pnpm add framer-motion`. All 26 `package.json` specifiers match the lockfile's importer entries exactly. pnpm 10.34.3 is installed locally. Vercel selects the package manager from the committed lockfile.
**Decision:** The run uses pnpm. Installs are `pnpm install --frozen-lockfile` (reproduces the committed resolution exactly, same as Vercel); dependency changes are `pnpm remove` / `pnpm add`, which update `pnpm-lock.yaml` in the same commit. No `package-lock.json` is ever created. Gates V1/V2 run the same `package.json` scripts via `pnpm build` / `pnpm lint`. The skill's npm commands (SKILL.md gates, phase-plan 0.2/0.4/2.8/5.1, cwv-invariants Lighthouse procedure) and `verify-portfolio.mjs`'s known-root-files list are updated to match. `pnpm-workspace.yaml`'s `ignoredBuiltDependencies: [sharp, unrs-resolver]` is kept as-is.
**Why:** Switching to npm would re-resolve every caret range before the baseline build (silent version drift) and leave two competing lockfiles; keeping pnpm makes the local baseline identical to what Vercel installs.
**Approved by user:** yes — 2026-09-13 (structured question in 0.2).

## D-8 — Next 16 doc deltas against the skill's recipes + gate-runner corrections

**Context:** Reading the installed guides in 0.2 (AGENTS.md gate) surfaced two places where the skill's recipes contradict Next.js 16.2.1, and running the gate runner surfaced a blind check:
1. `02-guides/upgrading/version-16.md`: "Next.js 16 removes the `size` and `First Load JS` metrics from the `next build` output." The skill's V5 gate, STATE `Budget:` line, `cwv-invariants.md` budget rule and phase-plan 0.2/2.8 all read budgets from that route table. The baseline build confirms it prints only the route list.
2. `03-api-reference/02-components/image.md`: "Starting with Next.js 16, the `priority` property has been deprecated in favor of the `preload` property"; the doc recommends `loading="eager"` or `fetchPriority="high"` in most cases and forbids combining `preload` with either. `cwv-invariants.md` F-1.4 prescribed `priority`.
3. `verify-portfolio.mjs deps` included `package.json` in the text it searched for references, so every declared dependency counted as used: the committed script reported 0 warnings while `lucide-react`, `tailwind-merge`, `@react-three/postprocessing` and `@gsap/react` have zero references in `src/`.
**Decision:**
- New `budget` check in `verify-portfolio.mjs`: for each prerendered `.next/server/app/**/*.html` (framework `_*` pages excluded) it collects every `static/chunks/*.js` the document references (script tags, preload links, inline RSC payload) minus `noModule` legacy polyfills, plus linked stylesheets, and reports raw / gzip-9 / brotli sums and the three largest chunks. It FAILs when no build output exists and warns when `/` exceeds the 140 KB gz target. The gzip-9 JS sum for `/` is the figure recorded as `BASELINE`/`CURRENT`. It measures the referenced assets, not Vercel's exact wire bytes; gates compare deltas between runs of the same method, and Lighthouse/PSI stay the authoritative performance evidence (the upgrade guide points there too).
- `cwv-invariants.md` F-1.4 now prescribes `preload` for a single unambiguous LCP image, otherwise `loading="eager"` / `fetchPriority="high"`.
- The `deps` check no longer searches `package.json`.
- SKILL.md V5, the STATE template, `cwv-invariants.md` budget rule and phase-plan 0.2/2.8 point at the `budget` check.
**Why:** SKILL.md's Next.js gate says where recipes and installed docs disagree, the docs win and the delta is recorded. A budget gate that cannot produce a number, or a dependency check that can never warn, would pass silently — and silence equals green.
**Approved by user:** docs-win deltas (1, 2) are pre-authorized by SKILL.md; the measurement method and the `deps` fix — yes, 2026-09-13 ("continue" at the end of 0.2, where it was stated that continuing approves D-8).

## D-9 — Commit authorship: the owner is the only author

**Context:** Commits 3632d32, e6e63da, 3023e40, d06608e and dfcfa7a (sub-tasks 0.1–0.2) were authored with the owner's git identity but carried `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` and `Claude-Session: …` trailers added by the agent harness's default attribution guidance. On 2026-09-13 the owner instructed: "the only author in the commits should be me and dont add claude as co-author", and asked for the rule to live in the skill permanently.
**Decision:** Every commit (and any PR description) created by this run carries only the owner's authorship: the repo's configured git identity (`Sina Sotoudeh`) and no attribution trailers — no `Co-Authored-By`, no `Claude-Session`, no "Generated with Claude Code" line. The rule is written into SKILL.md's Git rules as a permanent owner rule that overrides harness defaults, with a per-sub-task verification command. The five earlier commits keep their trailers: removing them would rewrite history, which the continuity invariant forbids; that changes only if the owner explicitly asks.
**Why:** Owner instruction; authorship of the repository's history is the owner's call.
**Approved by user:** yes — 2026-09-13, owner's own instruction.

## D-10 — Visual verification tooling: machine-level Chromium + `screenshot.mjs`

**Context:** Parity reviews (V4) and diagnosis relied on the owner's eyes alone; the agent could not see the page. The 0.3 casing bug (a background image returning 404 on Linux) showed the value of in-browser checks. On 2026-09-13 the owner asked for Chromium to be installed on this machine so the agent can verify and analyze visually through screenshots whenever needed, and for the skill files to say so. Findings: Playwright's Chrome for Testing 153.0.8010.12 (`chromium` v1243) was already in `~/.cache/ms-playwright/` (downloaded by the Shop Platform project) but failed to launch — `libnspr4`, `libnss3`, `libnssutil3`, `libsmime3`, `libasound` missing; installing system packages needs sudo (password), and the box has only DejaVu/Ubuntu fonts.
**Decision:**
- Playwright 1.63.0 is installed in a machine-level tools dir, `~/.local/share/portfolio-visual-tools` (own `package.json`), which uses the existing Chromium v1243. It is **not** a portfolio dependency: `package.json` / `pnpm-lock.yaml` are untouched, consistent with dependency austerity.
- System libraries + fonts come from Playwright's own `install-deps chromium` (26 apt packages incl. `libnss3`, `libnspr4`, `libasound2t64`, `fonts-liberation`), run once by the owner with sudo.
- New `scripts/screenshot.mjs`: viewport presets (desktop 1440×900, laptop, mobile 390×844@3), scroll targets (`--at`, `--every <n>vh`) reached by stepwise scrolling so Lenis / ScrollTrigger / IntersectionObserver see a real scroll path, element and full-page modes, reduced-motion emulation, and a `report.json` of console errors, page errors, failed requests and HTTP ≥ 400 responses. Output goes to gitignored `.visual/`.
- SKILL.md gains *Visual verification tooling* (install, usage against a production build, worktree for past states, font limits, process hygiene); the parity protocol requires before/after captures before asking the owner; phase-plan adds a `phase0-baseline` capture before 1.1, screenshot pairs at the Phase 1 gate and in the Phase 2 contract; `cwv-invariants.md` points Lighthouse's `CHROME_PATH` at this Chromium.
- Screenshots never self-certify parity: V4 stays owner-attested.
**Why:** The owner asked for it. It also catches visible regressions and broken assets before they cost review time, and makes each parity request concrete.
**Verification:** with the three missing library packages extracted to the session scratchpad (`apt-get download` + `dpkg -x`, `LD_LIBRARY_PATH`, no root) as a temporary stand-in, `screenshot.mjs` captured 10 shots (desktop + mobile × top/1vh/25%/50%/bottom) of the 0.3 production build in 37 s with 0 reported issues. The permanent fix is the owner's install-deps run.
**Approved by user:** yes — 2026-09-13, owner's own request.

## D-11 — Case-sensitivity check for public asset URLs

**Context:** The `casing` check in `verify-portfolio.mjs` only validated import specifiers. In 0.3 an ad-hoc scan found `src/components/ProcessSection/ProcessSection.tsx:175` requesting `/images/process/default.png` while the file is `public/images/Process/default.png`. NTFS served it; Linux and Vercel return 404, so the section's background layer was empty on every Linux deployment. No gate could have caught it. At the Phase 0 gate the owner approved adding the check.
**Decision:** `casing` now also scans `src/**/*.{ts,tsx,js,jsx,mjs,css}` for root-relative asset URLs (images, fonts, video, pdf) in string literals and CSS `url()` — comments blanked with offsets preserved, `/_next/` and protocol-relative URLs skipped, `%xx` decoded. An exact file under `public/` passes; a case-insensitive match FAILs as a Linux/Vercel 404; no match in any casing warns (a heuristic scan cannot tell dead data from a live 404, e.g. `src/data/resumeData.ts:80`). The check runs everywhere `casing` already runs (0.3-style gates and `--all`).
**Verification:** a temporary probe file produced FAIL for `url('/images/process/default.png')`, passed the correctly cased path, ignored a commented-out reference, and warned for the URL-encoded pre-0.3 filename; the real tree passes (87 references checked, 1 warning — the dead `profile.png`). Probe removed.
**Approved by user:** yes — 2026-09-13, Phase 0 gate answer 4.

## D-12 — Phase 0 gate: owner decisions outside the phase plan

**Context:** The Phase 0 gate (2026-09-13) presented the baseline, the audit delta and the Phase 1–6 plan with open housekeeping questions. None of these items were in `references/phase-plan.md`.
**Decision (owner answers):**
1. The Phase 1–6 plan is re-confirmed as presented (with D-7…D-11 folded in).
2. The stray Shop Platform `.env` at the repo root is to be deleted. When the run checked, it was already gone and no `.env*` files remained. `next build` no longer reports loading an environment file.
3. The five unused create-next-app SVGs (`public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) are removed. There were zero references anywhere in the repo.
4. The case-sensitivity check is added (D-11).
5. Approval Mode stays `per-task`.
6. `package.json` `name` changes from the template's `"nonato"` to `"personal-portfolio"`, the project's directory and working name (the GitHub repository is `sinasotoudeh/portfolio`). `pnpm-lock.yaml` is unaffected.
**Noted, not changed:** the "Nonato" template brand still appears in visible site copy — `src/components/Manifesto/Manifesto.tsx:22` ("At Nonato,"), `:35` (`NONATO`) and `src/components/footer/Footer.tsx:158` ("© … Nonato. All rights reserved."), plus a Windows path comment in `src/data/capabilities.ts:1`. Visible copy is the owner's call. It is raised for the owner and must be resolved before the Phase 3 copy sign-off, because the JSON-LD Person/brand must not contradict on-page text.
**Why:** Owner decisions at a hard-stop gate.
**Approved by user:** yes — 2026-09-13, Phase 0 gate answers.

## D-13 — CustomCursor guard: engine-only, keyed to the CSS hide rule

**Context:** phase-plan 1.3 says CustomCursor "gains `(pointer: fine)` + `prefers-reduced-motion` guards (skip mounting on touch devices — INP win, no visual change on desktop)". Reading the code in 1.3b showed that a literal implementation would break that promise. `Cursor.module.css` hides the cursor only under `(hover: none) and (pointer: coarse)`, while `globals.css` hides the native pointer (`body`/`button { cursor: none }`) on every device. On a device with hover but a coarse primary pointer, skip-mounting on `!(pointer: fine)` would remove the custom cursor where CSS still shows it, leaving no pointer at all. Unmounting would also drop the server-rendered cursor markup that is visible at the top-left corner on first paint.
**Decision:**
1. The markup keeps rendering on every device, unchanged.
2. The engine (window listeners + requestAnimationFrame loop) runs only while `(hover: none) and (pointer: coarse)` does not match, which is exactly where the cursor is visible. It follows that media query live.
3. The loop sleeps once the ring has settled: within 0.01 px it snaps onto the pointer. It wakes on mousemove. Rendered pixels are identical, and there are no idle frames.
4. With `prefers-reduced-motion: reduce`, the ring follows the pointer directly instead of trailing it (lerp 1 instead of 0.15). This is the only visible change, for reduced-motion users only.
**Why:** It keeps the INP/main-thread win the plan asked for (no loop or listeners on touch devices, no idle frames on desktop) with zero visual change where the cursor was visible. The reduced-motion behaviour is what the plan's guard is for.
**Approved by user:** yes — 2026-09-13 ("Sub-task 1.3b and decision D-13 are approved.").

## D-14 — Section links and back-to-top scroll through Lenis (lands in 2.0)

**Context:** While verifying 1.3b, a settle-based scroll probe showed smooth scrolling that already misbehaved before this run. The nav section links (`NavigationController.tsx`: `scrollIntoView({ behavior: 'smooth' })`) and the footer back-to-top (`BackToTopButton.tsx`: `window.scrollTo({ behavior: 'smooth' })`) get cut short on this page. Desktop "Process" stopped about 5,000 px before its section on both the pre- and post-1.3b builds. Back-to-top sometimes reached the top and sometimes stopped around 3.4–4 k px. The browser's native smooth scroll is most likely being interrupted by Lenis or the pinned ScrollTrigger sections.
**Decision:** In 2.0, once GSAP's ticker drives Lenis, section links and back-to-top call `lenis.scrollTo(target)` on the root Lenis instance (reachable through LenisProvider's ref or `useLenis`) instead of native smooth scrolling. The URL hash stays untouched and the mobile menu still closes first. This is a deliberate visible behaviour fix: the links now land on their targets. Scroll speed and easing are presented for parity review in 2.0.
**Why:** Section links that don't reach their section are a functional bug. Lenis already owns page scrolling, so routing programmatic scrolls through it removes the conflict instead of papering over it.
**Approved by user:** yes — 2026-09-13 ("routing section links and back-to-top through Lenis in 2.0 sounds good").

## D-16 — Mobile viewport overflow fixed now, at its source (pulled forward from 2.6)

**Context:** The owner reported on a real phone that "the mobile nav-header goes out of screen and makes every section viewport messed up". This is the 1.3a blocker. A probe on the production build of 8c0e8ab at 390×844 mobile emulation found a layout viewport of 466×1009 at every scroll position and a document scrollWidth of 466. The fixed nav ran from 20 to 446 px, so the hamburger was clipped. Every `vh`/`%`-of-viewport section was sized for 1009 px instead of 844 px, and a real phone zooms out to fit the 466 px width. The only unclipped offender is ResumeDashboard's `.introRight`, which starts at framer `x: 100` for its slide-in. body's existing `overflow-x: hidden` does not stop Chrome's mobile layout-viewport expansion.
**Decision:** `ResumeDashboard.module.css` `.root` gets `overflow-x: clip`. `clip` creates no scroll container, so sticky, ScrollTrigger and Lenis are unaffected, and overflow-y stays visible. `html { overflow-x: clip }` was also tested and fixes the width too. It was rejected because body's `overflow-x: hidden` would stop propagating to the viewport, and body would become a scroll container under the Hero's sticky pin. The 2.6 Resume port keeps this rule.
**Result:** mobile layout viewport 390×844 at every probed position, scrollWidth 390, nav 20→370, 0 unclipped offenders. The #cv section at rest is identical before and after. Desktop is unchanged (page 21219 px). Mobile emulated page height is 17764 → 17929 px because `vh` now means 844 px.
**Side effect (disclosed, authored behaviour):** the footer's back-to-top is `position: fixed` bottom-right under 768 px with no scroll condition. It has been that way since the footer was added in d1d072d. It was already visible on a zoomed-out real phone. It now sits at the true screen corner at normal size, including at the top of the page.
**Approved by user:** yes — requested by the owner 2026-09-22; result approved after testing production fdb7c39 ("approved, continue").

## D-17 — Hero wordmark leaves at state 1 instead of docking top-left

**Context:** The owner said of the Hero: "the big Sina Sotoudeh on hero on the stage it goes top-left seems unnecessary because the header has the same word mark up there". In states 1–2 the wordmark docked at top 12vh / left 6vw, expanded to the full two-line name (state 1) and then shrank to 40 % opacity (state 2). That duplicated the nav logo. On phones it also overlapped the BUILD card (audit observation, Phase 0).
**Decision:** State 0 is unchanged. From state 1 on, the wordmark keeps its state-0 look (same size, colours, position) and leaves with a short rise (top 50 % → 42 %) and a fade to opacity 0, on the existing 1.2 s cubic-bezier(0.19, 1, 0.22, 1) transition. Scrolling back to state 0 brings it back. The state-1/2 letter-reveal rules became unreachable and were removed. The "o" is now hidden in every state; it only ever showed while docked. The DOM is unchanged, so the h1 still reads "Sina Sotoudeh" to assistive tech and search engines.
**Approved by user:** yes — requested by the owner 2026-09-22; the rise-and-fade exit approved after testing production fdb7c39 ("approved, continue").

## D-15 — Hero keeps all 250 particles on phones

**Context:** cwv-invariants "Hero engine hygiene" item 4 asks for fewer particles under 768 px. That change is visible (a sparser sphere and field), so it conflicts with parity. In 2.1a the run recommended keeping 250 and measuring first. The owner did not ask for a reduction when they approved 2.1a/2.1c on 2026-09-22.
**Measurement (2.1b, production build, 390×844 mobile profile, 4× CPU throttle, this box):** the engine's frame costs 2.3–2.8 ms of script (mean; p95 3.5–5.1 ms), about 15 % of a 60 fps frame. Before 2.1b it ran 49–60 times a second for the whole page life. After 2.1b's IntersectionObserver pause it runs only while the hero is within 200 px of the viewport, and draws 0 frames/s elsewhere. Off-screen script time is 102 → 60 ms/s (mobile, 4×) and 93 → 55 ms/s (desktop, 4×).
**Decision:** keep 250 particles on every viewport. The per-frame cost is modest and now bounded to the hero, and it runs on the rAF path, not in input handlers or long tasks. Revisit only if Phase 6 PSI/field data shows the hero frame cost matters.
**Approved by user:** default applied 2026-09-22 (the recommendation stood without objection); confirm at the 2.1b review.

## D-18 — Canvas pixel ratio: cap 2 per the recipe, with a measured cost (owner call)

**Context:** cwv-invariants item 3 caps the canvas buffer at devicePixelRatio 2. Before 2.1b the buffer was CSS pixels, so it was blurry on retina and phones. 2.1b implements the cap: buffer = CSS size × min(DPR, 2) and a context transform. Desktop at DPR 1 is byte-for-byte the same buffer. Phones and retina screens get 4× the pixels.
**Measurement (this box renders through SwiftShader, a software GPU):** mobile 390×844 @3, 4× CPU, hero on screen. Frame rate on the same build: 60 fps with a 1× buffer vs 44/47/48 fps with the 2× buffer (three rounds). The 2.1b before/after runs show 58 → 43 fps. Script time per canvas frame is barely changed (2.45 → 2.76 ms mean); the extra cost is raster/compositing of the larger buffer. On real phones canvas raster runs on the GPU, so this box likely overstates it, but it can't be proven here. Raster is off the main thread, so TBT/INP/LCP are not expected to move.
**Decision:** ships as `MAX_DPR = 2` (the recipe). Alternatives are one constant in `HeroCanvas.tsx`: `1.5` (a compromise) or `1` (exactly the old softness and cost). Owner decides at the 2.1b review, ideally after looking at particle sharpness and smoothness on a real phone.
**Approved by user:** pending (2.1b review).
