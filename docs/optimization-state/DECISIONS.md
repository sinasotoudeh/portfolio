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
**Approved by user:** yes — accepted with the skill's phase plan, 2026-07-11; re-confirmation due at the Phase 0 gate.

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
**Approved by user:** docs-win deltas (1, 2) are pre-authorized by SKILL.md; the measurement method and the `deps` fix were presented at the end of 0.2 — confirmation pending (recorded when given).
