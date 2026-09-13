---
name: portfolio-optimization-architect
description: "The operating system for the one-time architectural rebuild of the personal portfolio in this repository: rewrite the runtime for a 100/100 Core Web Vitals score on Vercel while preserving the hand-crafted visuals pixel-for-pixel, then ship the SEO layer (unified JSON-LD graph, sitemap, robots, metadata), the /work case-study system with the Project Atajoy showcase, the Resend contact Server Action, and the Tier A/B engineering manual under docs/portfolio-internals/. Use it whenever the user asks to optimize, refactor, speed up, audit, or continue work on this portfolio — anything touching performance, Lighthouse, PageSpeed, Core Web Vitals, LCP/CLS/INP, hydration, bundle size, RSC/server-component conversion, GSAP/animation consolidation, next/image or next/font adoption, SEO, structured data, sitemap, case studies, the contact form, or the engineering manual — and for ANY session that reads or writes docs/optimization-state/, including 'continue', 'resume', or 'where were we'. This skill edits application source; it is not a generic writing aid."
---

# Portfolio-Optimization-Architect

This skill is the operating system for a **one-time engineering run** on this repository: take the finished, hand-crafted single-page portfolio and rebuild its runtime — not its face — until it holds a flawless 100/100 Core Web Vitals score on Vercel, carries a gold-standard technical-SEO layer, showcases Project Atajoy from verified facts, and leaves behind a manual precise enough that neither the owner nor a future Claude ever has to reverse-engineer it.

Two non-negotiables define every decision, in this order:

1. **Visual parity.** The UI/UX is the product of deliberate craft and is presumed correct. The runtime underneath it is disposable; the pixels are not. Any change a user could *see or feel* (other than "it got faster") must be listed in parity notes and approved by the user before its sub-task closes.
2. **100/100, honestly measured.** LCP < 1.2s, CLS 0.000, INP < 50ms, Lighthouse Performance 100 mobile+desktop — verified on the Vercel deployment via PageSpeed Insights, not just local runs. A score claimed without pasted numbers doesn't exist.

The run is executed once, for this repository only. Precision beats reusability everywhere: file names, component names, and findings in the references are *this repo's*, not generic examples.

## Reference files — load on demand, not all upfront

- `references/phase-plan.md` — phases 0–6 broken into gated sub-tasks, each with sources, steps, coverage, and commit shape. **The primary execution checklist.** Read the current phase's section at the start of every sub-task.
- `references/audit-baseline.md` — the audited ground truth of this repo as of 2026-07-11, commit `8828152`: hydration census, dependency verdicts, font/image/CRLF/SEO findings. **Orientation only — dated.** Phase 0 reconciles it; code is always written from a fresh read of the source.
- `references/cwv-invariants.md` — invariants F-1/F-2/F-3 as concrete recipes for this codebase, the GSAP porting contract, the CSS-3D cylinder recipe, Hero hygiene rules, budgets, and the Lighthouse/PSI measurement procedure. Read before any Phase 1–2 sub-task.
- `references/seo-blueprint.md` — metadata contract, the unified JSON-LD `@graph`, sitemap/robots shape, semantic-HTML contract, the verified Atajoy fact sheet, and the INTAKE register of user-owned values. Read before Phases 3–5.
- `references/doc-standards.md` — the Tier A/B manual contract for `docs/portfolio-internals/` (adapted from the sibling repo's documenter skill): tree, audience tests, gates G1–G5. Read before Phase 6.
- `scripts/verify-portfolio.mjs` — the mechanical gate runner. From the repo root: `node .claude/skills/portfolio-optimization-architect/scripts/verify-portfolio.mjs [--all | crlf casing img client placeholders assets deps docs]`.

## Locked decisions — settled 2026-07-11, cited not re-argued

The user chose these in a structured interview. They are the run's constitution; changing one requires a `DECISIONS.md` entry *and* explicit user approval, never a silent drift:

- **D-1** Capabilities cylinder → CSS 3D rebuild; the entire three.js stack (`three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `@use-gesture/react`) leaves the project.
- **D-2** One animation runtime: GSAP + ScrollTrigger via `useGSAP`. All framer-motion usage is ported with matched feel, then `framer-motion` is removed. ProcessSection's existing GSAP choreography stays untouched. Lenis stays (re-wired to GSAP's ticker).
- **D-3** Contact form → Zod-validated Server Action delivering via Resend, `useActionState` progressive enhancement.
- **D-4** Case studies → typed TS schema (`src/data/case-studies.ts`) rendering static RSC routes at `/work/[slug]`, Atajoy first; the JSON-LD graph links into them.
- **Accepted defaults:** self-hosted Inter + JetBrains Mono via `next/font` (the CSS already declares these families but never loads them); canonical URLs from `NEXT_PUBLIC_SITE_URL`; the Atajoy showcase states *verified* facts — Payload 3.84 on MongoDB (`mongooseAdapter`), correcting instruction File 3's Postgres claim (D-5).
- Open user-owned values live in the INTAKE register (`references/seo-blueprint.md`) and are tracked in STATE.md — never blocked on, never faked.

## The Next.js 16 gate — before any framework code

`AGENTS.md` in this repo is blunt: this is not the Next.js in anyone's training data. Therefore: **no session writes or edits code that touches a Next.js API until it has read the relevant guide under `node_modules/next/dist/docs/` in that same session.** If `node_modules` is missing, installing the toolchain (Phase 0.2) comes first — there is no memory-based fallback. The recipes in `references/cwv-invariants.md` define intent; the installed docs define the API. Where they disagree, the docs win and the delta is recorded in `DECISIONS.md`.

## Session Protocol — the first thing every session does

**Step 1, always:** attempt to read `docs/optimization-state/STATE.md`.

- **It exists** → resumed run. Read it, run `git log --oneline -5` and `git status`, and skim the tail of `docs/optimization-state/LOG.md`. The filesystem and git history are the truth; STATE.md is the pointer into them. If they disagree, say so, propose the correction, and fix STATE.md before producing anything new.
- **It doesn't exist** → bootstrap. Execute Phase 0 per `references/phase-plan.md`. The first turn produces no refactored code — continuity checks, toolchain, scrub, and the plan — and Phase 0 ends at a hard stop for plan approval.

**When the user says "Continue":** meaning depends on `Waiting on User Approval` in STATE.md — `yes` means the previous turn stopped deliberately at a gate and "Continue" *is* the approval; `no` means the turn was cut off mid-flight, so resume from exactly `Next Immediate Action` without re-planning or regenerating anything marked complete (files written via tools survived the cut; verify with a quick read, don't rewrite).

**Never trust conversation memory over the repo.** After compaction or a gap, recollection degrades; `STATE.md` + `git log` + the files do not.

## Durable state — `docs/optimization-state/`

**`STATE.md`** — single current pointer, overwritten at every update:

```
# OPTIMIZATION STATE
Updated: <ISO-8601>
Approval Mode: per-task            # per-task | per-phase
Phase: <n — name>
Sub-task: <n.n — name>
In Flight: <exact file(s) or deliverable>
Status: <in-progress | gates-running | done-awaiting-approval | blocked>
Waiting on User Approval: <yes | no>
Plan for the sub-task in flight:
  [x] <step done>
  [ ] <step pending>
Parity notes pending user review: <— or the list>
Open intake fields: <INTAKE-n list still unresolved>
Budget: BASELINE <first-load KB> | CURRENT <first-load KB> (from last `next build`)
Docs read this run (AGENTS.md gate): <node_modules/next/dist/docs/ filenames>
Completed sub-tasks: <n.n list>
Next Immediate Action: <specific enough to start cold>
Blockers / Open Questions: <— or the actual question>
Last Commit: <short-hash + message>
```

**`LOG.md`** — append-only, one line per completed sub-task:
`<date>  <sub-task>  done  <commit-hash>  <one-line summary incl. parity/budget result>`

**`DECISIONS.md`** — append-only mini-ADRs (`## D-<n> — <title>` / Context / Decision / Why / `Approved by user:`) for anything that deviates from or refines this skill, the instruction files, or the locked decisions. Seeded in Phase 0.1 with D-1…D-6. No deviation ships without an entry *and* user approval.

**Update timing:** write STATE.md with the sub-task's plan *before* the first edit; tick steps as they land; at sub-task end run gates → commit → append LOG → rewrite STATE pointing at what's next. The commit is the checkpoint the next session trusts.

**Git rules.** Continuity invariant (instruction File 2): never `git init`, never rewrite history; verify `origin` → `https://github.com/sinasotoudeh/portfolio.git` in Phase 0.1 and work on `main` atop the existing history. One commit per sub-task, conventional style per the scopes in `references/phase-plan.md`. Never push unless the user asks. Never end a turn leaving gate-passing work uncommitted.

## Execution cadence

**One sub-task per response, maximum.** Inside a sub-task, changes land file-by-file through edit tools (tool-written files survive a cut-off response). If a sub-task outgrows one response, split it (2.4a, 2.4b), record the split in STATE.md, and say so — never quietly compress.

**Research before code, every sub-task.** Each sub-task in `references/phase-plan.md` lists its sources; read them in that session. For Phase 2 sections this includes writing the motion/interaction inventory *before* editing — you cannot preserve what you haven't itemized.

**Approval Mode** (STATE.md line, default `per-task`): `per-task` stops after every sub-task's gates pass and it's committed; `per-phase` advances within a phase automatically. **Hard stops regardless of mode:** every ⛔ PHASE GATE in the plan; anything visual awaiting parity approval; anything needing a DECISIONS entry; gates failing twice on the same sub-task (present findings instead of thrashing); any temptation to touch history, push, or work outside the plan.

**Visual-parity protocol.** For every touched section: keep the dev server runnable, tell the user exactly what to look at (states, timings, hover/drag feel — from the inventory), list every intended visible difference explicitly (e.g. "Inter now actually loads; retina canvas is sharper"), and record approval in STATE.md before the sub-task closes. The user's eyes are the gate; never self-certify parity.

## Gates — a sub-task is complete only when these run green

- **V1 build:** `npm run build` passes (after Phase 0.2 this is non-negotiable at every sub-task).
- **V2 types/lint:** strict TypeScript — no new `any`, casts explained; `npm run lint` clean on touched files.
- **V3 mechanical:** `verify-portfolio.mjs` — the checks relevant to the sub-task, `--all` at phase gates. Paste the summary line into the response. If a gate can't run, say exactly which and why — silence equals green, so never be silent about a skipped gate.
- **V4 parity:** user-attested for anything visible (see protocol above).
- **V5 budget:** at phase gates, the `next build` route table lands in STATE.md; regression >5% without a DECISIONS entry fails the gate.

## Operating doctrines

**Parity is the prime rule.** When a performance tactic and the design conflict, the design wins and the tactic gets rethought — there is always a faster way that doesn't move pixels. "Roughly the same" is a failure; the standard is *the user cannot find the difference without being told*.

**Evidence over memory.** Every claim about this repo (a path, a prop, a bundle number, a font name) comes from a read or command in the current session, or from state files this run already verified. The references are testimony; the code is the witness. This applies to the Atajoy showcase doubly: it renders only facts the fact-sheet's cited files prove on re-read.

**Server-first, client-leaf.** Every component is a server component until an itemized interaction forces a directive — and then the directive lands on the smallest leaf that owns the interaction, tracked in `docs/optimization-state/client-allowlist.json` and enforced by the census check. Structural markup never rides in a client bundle because animating it was convenient; the shell renders it and a motion wrapper animates it.

**Dependency austerity.** Every runtime dependency is a standing cost. A new one requires a DECISIONS entry (Resend in Phase 5 is pre-approved by D-3). The purge order in the plan is deliberate: consumers are ported first, packages removed after — the build proves the removal, never the other way around.

**Zero placeholders, the engineering reading.** No stubbed handlers, no `// wire this later`, no fake data shipped to make a section render. Honest seams are allowed and documented (the contact action's no-key behavior); silent fakes are not.

**Instruction files are benchmarks, not scripture.** Files 1–3 set the targets and guardrails; where they're technically wrong (`PortfolioItem`, Postgres) the run implements the *intent* with correct engineering and records the correction. Where reality reveals a better sequencing (D-6), the plan says so openly.

## The phase roadmap

| # | Phase | Delivers | Ends with |
|---|-------|----------|-----------|
| 0 | Environment, Continuity & Re-Audit | lockfile + baseline build + docs-read, LF/casing/asset scrub, safe dep prune, state bootstrap | ⛔ plan re-confirmation |
| 1 | Global Foundations | `next/font` (F-2), image pipeline config (F-1), semantic chrome, server nav/footer shells | ⛔ typography+chrome parity |
| 2 | Section Rebuilds | per-section RSC shell + GSAP port + image props (2.1 Hero … 2.7 Contact), 2.8 engine purge | ⛔ full-page parity + budget |
| 3 | SEO Layer | metadata contract, JSON-LD graph, sitemap+robots, semantic audit | ⛔ copy sign-off + validation |
| 4 | Case Studies & Showcase | `case-studies.ts`, `/work/[slug]`, homepage Atajoy showcase | ⛔ aesthetic approval |
| 5 | Contact Transport | Resend Server Action + progressively-enhanced form | ⛔ tested flows |
| 6 | Verification & Manual | Lighthouse/PSI 100 evidence, Tier A+B manual under `docs/portfolio-internals/` | run complete |

## The chat checkpoint block

Every response that changes or concretely plans repo state ends with this exact block (skip only pure-discussion turns):

```
<!-- OPTIMIZATION_STATE_CHECKPOINT -->
### 📍 SKILL MEMORY CHECKPOINT
- **Current Phase:** [e.g., Phase 2: Section Rebuilds]
- **Sub-task In Flight:** [e.g., 2.4 Capabilities — CSS-3D rebuild]
- **Completed:** [sub-task list]
- **Pending in Phase:** [what remains]
- **Next Immediate Action:** [exact next file/step/command]
- **Waiting on User Approval:** [Yes/No — what for]
<!-- END_CHECKPOINT -->
```

## Definition of done — the whole run

- Phases 0–6 closed in LOG.md, every sub-task's commit on `main`'s original history, remote untouched (`origin` unchanged, nothing force-pushed).
- PSI on the Vercel deployment: Performance 100 mobile **and** desktop, CWV assessment green, numbers pasted into STATE.md.
- Zero raw `<img>`, zero unallowlisted `'use client'`, zero CRLF, zero casing hazards, zero placeholder survivors — `verify-portfolio.mjs --all` green.
- `framer-motion` and the three.js stack absent from `package.json`; first-load JS within budget.
- The JSON-LD graph validates; sitemap and robots serve; every INTAKE field either supplied and wired or explicitly documented as pending with its consequence.
- `docs/portfolio-internals/` complete per `references/doc-standards.md`, gates G1–G5 green, README routing both tiers.
- The user has scrolled the deployed site and said the words: it looks exactly like it did — only faster.
