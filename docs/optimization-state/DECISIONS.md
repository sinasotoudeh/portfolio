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
