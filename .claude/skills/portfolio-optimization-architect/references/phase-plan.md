# Phase Plan — gated sub-tasks 0.1 → 6.4

Read the current phase's section at the start of every sub-task. Every sub-task ends with: gates run (see SKILL.md), STATE.md rewritten, one commit. **Sources** lists what must be read *in that session* before writing code — the evidence rule applies to code exactly as it does to docs.

Commit scopes: `chore(env)`, `chore(deps)`, `refactor(rsc)`, `perf(motion)`, `perf(assets)`, `feat(seo)`, `feat(work)`, `feat(contact)`, `docs(internals)`, `state` (optimization-state only changes ride along with their sub-task's commit).

Sequencing rationale (D-6): fonts and image config land **before** section rebuilds so every visual-parity review is judged against final typography/rendering — reviewing sections first and changing fonts after would invalidate every approval. RSC conversion and GSAP porting happen **per-section in one pass** so each section is reviewed once, not twice.

---

## Phase 0 — Environment, Continuity & Re-Audit

**0.1 Continuity verify & state bootstrap.**
Sources: `git remote -v`, `git log --oneline -10`, `git status`, `references/audit-baseline.md`.
Steps: confirm remote is `https://github.com/sinasotoudeh/portfolio.git` and branch `main` (any mismatch = hard stop, ask the user); create `docs/optimization-state/{STATE.md,LOG.md,DECISIONS.md}`; seed DECISIONS with D-1…D-4 (interview decisions, verbatim from SKILL.md's Locked Decisions), D-5 (Atajoy MongoDB correction), D-6 (phase-sequencing rationale above). Ask the user whether `docs/optimization-skill-creation-instructions/` and `.claude/skills/` get committed to the repo (default yes — they are project artifacts; record the answer).
Gate: state files exist and are internally consistent. Commit: `chore(env): 0.1 bootstrap optimization state` (includes the skill + instruction docs if approved).

**0.2 Toolchain & baseline.**
Sources: `package.json`; after install: `node_modules/next/dist/docs/` index.
Steps: `node --version` (need ≥ 20.9 for Next 16 — if not, stop and tell the user); `pnpm install --frozen-lockfile` against the committed `pnpm-lock.yaml` (D-7 — the audit's "no lockfile" finding was wrong; never generate `package-lock.json`). Commit the user's pending `next.config.ts` change (drops `output: 'export'`) as its own commit — it's the platform-target decision the whole run builds on. Run `pnpm build`; it must pass **before any refactor** — this is the baseline. Run `verify-portfolio.mjs budget` and paste its output into STATE.md as `BASELINE` (Next 16 removed First Load JS from the build output — D-8). Then satisfy the AGENTS.md gate: list `node_modules/next/dist/docs/`, read the guides covering: server/client components, `next/image`, `next/font`, Metadata API + metadata routes (sitemap/robots), Server Actions, `next/dynamic`/lazy loading, `next.config` images options. Record in STATE which guides were read (filenames).
Gate: build green; frozen install leaves `pnpm-lock.yaml` unchanged; docs-read list recorded. Commits: `chore(env): 0.2 pnpm toolchain baseline`, `chore(config): adopt serverful Vercel target (drop static export)`.
*If `pnpm build` fails at baseline:* fix only what's needed to compile (recording each fix), or stop and present if the failure implies a decision.

**0.3 WSL scrub.**
Sources: `verify-portfolio.mjs crlf casing assets` output; `.gitattributes` (absent at audit).
Steps: add `.gitattributes` (`* text=auto eol=lf` + explicit `-text` for `*.png *.jpg *.webp *.woff2 *.ico`); `git add --renormalize .`; confirm the 20 CRLF files normalize. Rename the two space-named assets (`logos-Google Analytics.png` → `logos-Google-Analytics.png`, `geometric shape.png` → `geometric-shape.png`) and update every reference (grep `logos-Google` and `geometric` across `src/` first — expect `src/data/processData.ts`). Run the `casing` check; fix any mismatch it finds.
Gate: `verify-portfolio.mjs crlf casing assets` — crlf+casing clean, assets check shows no extensionless or space-named files. Build green. Commit: `chore(env): 0.3 normalize line endings, asset names, add .gitattributes`.

**0.4 Safe dependency prune + audit delta.**
Sources: `postcss.config.mjs`, `verify-portfolio.mjs deps` output.
Steps: `pnpm remove @react-three/postprocessing lucide-react tailwind-merge` (+ `autoprefixer` only if `postcss.config.mjs` doesn't reference it). Do **not** touch `three`/`fiber`/`drei`/`use-gesture`/`framer-motion` (their consumers still compile — removal is 2.8) nor `@gsap/react` (becomes used in 2.0). Write the audit delta into STATE.md: everything found this phase that `references/audit-baseline.md` missed or got wrong.
Gate: build green; deps check shows no *newly* dead packages. Commit: `chore(deps): 0.4 prune dead dependencies`.
**⛔ PHASE GATE (hard stop):** present baseline numbers, audit delta, and the Phase 1–6 plan for re-confirmation. Before 1.1 starts, capture the visual baseline against a production build — `screenshot.mjs --label phase0-baseline --every 1vh` (desktop + mobile) — the reference every later parity review is compared with (D-10).

---

## Phase 1 — Global Foundations (fonts, image pipeline, chrome)

**1.1 Fonts (Invariant F-2).**
Sources: installed `next/font` guide; `globals.css` `@theme` typography block; `ResumeDashboard.module.css`; `Contact.module.css`.
Steps: per `references/cwv-invariants.md` F-2 recipe — Inter + JetBrains Mono via `next/font`, variables wired into `@theme`, hardcoded family drift removed, explicit serif stack for the Contact accent.
Coverage: body/mono tokens loaded ✓ display stack untouched ✓ Resume/Contact hardcodes replaced ✓.
Gate: build; CLS spot-check in dev (font swap invisible); parity notes list the *intended* visual change (real Inter appears). Commit: `perf(assets): 1.1 self-hosted fonts with zero-shift fallbacks`.

**1.2 Image pipeline config (Invariant F-1, config half).**
Sources: installed `next/image` + config guides; `next.config.ts`.
Steps: remove `unoptimized`, set `formats`; dev-render every page section and fix anything the config change breaks. Per-usage props are handled per-section in Phase 2.
Gate: build + all sections render. Commit: `perf(assets): 1.2 enable Vercel image optimization (AVIF/WebP)`.

**1.3 Semantic shell & chrome.**
Sources: `layout.tsx`, `Navigation.tsx` + module CSS, `Footer.tsx` + module CSS, `CustomCursor.tsx`, `LenisProvider.tsx`; installed Metadata guide.
Steps: real base metadata (title/description drafted per `references/seo-blueprint.md`, flagged for Phase 3 sign-off; `metadataBase` via `src/lib/site.ts`). Convert Footer to a section shell if its interactivity allows (read it first); split Navigation into server markup + client menu leaf; CustomCursor stays a client leaf but gains `(pointer: fine)` + `prefers-reduced-motion` guards (skip mounting on touch devices — INP win, no visual change on desktop). LenisProvider gains `autoRaf: false` + ref shape ready for 2.0's ticker wiring (keep behavior identical this sub-task).
Gate: build; census check (`verify-portfolio.mjs client`) shows Footer/Navigation shells server-side; parity review of chrome on desktop + touch. Commit: `refactor(rsc): 1.3 semantic chrome, server nav/footer shells`.
**⛔ PHASE GATE:** user parity approval of typography + chrome before any section is rebuilt, presented with before/after screenshot pairs (phase0 baseline vs current).

---

## Phase 2 — Section Rebuilds (one section = one sub-task = one parity review)

Shared contract for 2.1–2.7 — every sub-task: (a) read the component + its `.module.css` fully, write its **motion inventory** (every animated property, trigger, duration, ease/spring) and its **interaction inventory** into the sub-task's STATE section plan *before* editing; (b) split into section shell + minimal client leaves; (c) port motion per the GSAP contract in `references/cwv-invariants.md`; (d) apply F-1 props to every image; (e) fix the section's heading level/semantics per `references/seo-blueprint.md`; (f) `prefers-reduced-motion` degradation; (g) update the client-leaf allowlist (`docs/optimization-state/client-allowlist.json`); (h) gates: build + full `verify-portfolio.mjs` + before/after `screenshot.mjs` sets for every inventoried state (read them and fix visible regressions before asking) + **user parity approval against a running dev server** (list exactly what to look at, state by state). One commit per section: `refactor(rsc)+perf(motion): 2.x <Section>`.

**2.0 Motion foundation.** Create `src/lib/motion/` (gsap registration + ScrollTrigger, ease/duration constants, `useSectionReveal`-style shared helpers as they emerge); wire Lenis↔ScrollTrigger ticker per the recipe. Gate: ProcessSection (the existing GSAP consumer) behaves identically. Commit: `perf(motion): 2.0 single-engine foundation (gsap ticker drives lenis)`.

**2.1 Hero.** The engine stays client (per audit-baseline census) but: server shell renders **all** static markup (wordmark as the page's `<h1>`, tagline, scroll hint, burst cards, fluid list, connect CTA); a small client controller sets `data-state="0..3"` on the container and CSS keys visibility off it (replaces per-element JS classes — same classes' rules move to `[data-state]` selectors); canvas leaf gets the four hygiene fixes (IO pause, passive listeners, DPR cap ×2 — disclose the sharpness improvement, mobile particle reduction + reduced-motion static). Parity checklist: pin length, all four scroll states, burst-card timing, wordmark styling, colors, mouse parallax.

**2.2 Manifesto.** Port `useScroll`/`useTransform` scrubs to ScrollTrigger `scrub`; shell renders the text content server-side.

**2.3 WorkMinimal.** Port `useInView` reveals + `AnimatePresence` swaps; verify/repair every `next/image` usage (real `sizes` from the CSS, dims); consider AVIF-converting the 1MB work PNG *sources* only if Vercel-optimized output still exceeds budget (measure first).

**2.4 Capabilities — the CSS-3D rebuild (D-1).** Follow the cylinder recipe in `references/cwv-invariants.md` exactly; transplant card DOM from drei `<Html>`; drag inertia + scroll behavior parity; delete the three.js implementation files. **Longest parity stop of the run — schedule the user's attention.**

**2.5 ProcessSection.** GSAP timeline untouched (D-2). Shell for headings/copy; the raw `<img>` (line 186 at audit) and all ~90 icons → `next/image` with real dims + lazy; verify the timeline still targets the right elements after markup changes (GSAP selectors/refs inventory first).

**2.6 Resume.** `AnimatePresence` tab transitions → GSAP; shell imports `resumeData.ts` server-side and passes data as props to the interactive dashboard leaf.

**2.7 Contact (UI only).** Motion port + shell; the form becomes a client leaf shaped for Phase 5 (`useActionState`-ready markup, no transport yet); `contact/bg.png` (1.33MB) → `next/image fill` + `sizes` + lazy.

**2.8 Engine purge & measurement.**
Steps: `pnpm remove framer-motion three @react-three/fiber @react-three/drei @use-gesture/react @types/three`; `verify-portfolio.mjs deps` proves zero imports remain; build; paste the `verify-portfolio.mjs budget` output into STATE.md next to BASELINE with the delta.
Gate: build green; `budget` shows `/` first-load JS ≤ 140KB gz target. Commit: `perf(deps): 2.8 remove client rendering engines (−<n>KB first-load)`.
**⛔ PHASE GATE:** full-page parity pass (user scrolls the whole site top to bottom), census + budget review.

---

## Phase 3 — SEO Layer

**3.1 Metadata contract.** Full implementation per `references/seo-blueprint.md` (title/description drafts presented for sign-off — INTAKE-7), OG/Twitter, favicon/OG image (INTAKE-4 path chosen by user). Commit: `feat(seo): 3.1 metadata contract + social cards`.
**3.2 JSON-LD unified graph.** Server component in the root layout emitting the `@graph`; `knowsAbout` read from `src/data/capabilities.ts`; validate (parse + Rich Results on preview). Commit: `feat(seo): 3.2 unified JSON-LD graph`.
**3.3 Crawl surface.** `app/sitemap.ts` + `app/robots.ts` per blueprint (case-study URLs join in Phase 4 automatically via the schema import). Commit: `feat(seo): 3.3 sitemap + robots`.
**3.4 Page-wide semantic audit.** Heading order, `aria-labelledby` per section, authored alt text everywhere, landmark integrity — sweep what Phase 2 sub-tasks individually did and fix page-level order.
Gate for the phase: build; `verify-portfolio.mjs --all`; user sign-off on all outward-facing copy (title, description, alt texts).
**⛔ PHASE GATE.**

---

## Phase 4 — Case Studies & the Atajoy Showcase

**4.1 Case-study schema (D-4).** `src/data/case-studies.ts`: typed `CaseStudy` (slug, title, summary, role, period, stack facts *with evidence source strings*, body sections, links, `updated`). Seed the Atajoy entry strictly from `references/seo-blueprint.md`'s fact sheet — re-verify each fact against `/home/sina/projects/shop-platform/.meta/reference-agency-portfolio/` in-session; anything not provable waits for INTAKE-6. Commit: `feat(work): 4.1 case-study schema + atajoy data`.
**4.2 `/work/[slug]` routes.** `generateStaticParams` + RSC page + `generateMetadata` + per-page JSON-LD node (`@id` scheme per blueprint); designed inside the existing aesthetic (mercury palette, existing type scale — new surface, so the review is *aesthetic-coherence* approval rather than parity). Sitemap picks the routes up. Commit: `feat(work): 4.2 case-study routes`.
**4.3 Homepage Atajoy showcase.** Architecture Grid + Local-API SVG visualization per blueprint Section composition; entrance motion via the engine within budget. Decide with the user where it slots relative to WorkMinimal (and whether WorkMinimal's three items should reference the schema for future write-ups — flag, don't force). Commit: `feat(work): 4.3 atajoy showcase section`.
**⛔ PHASE GATE:** aesthetic approval + budget holds + Rich Results re-validate.

---

## Phase 5 — Contact Transport (D-3)

**5.1 Server Action.** `src/actions/contact.ts`: `"use server"`, Zod schema mirroring the real form fields (read `Contact.tsx` for field census), Resend delivery (`pnpm add resend`), honeypot field + minimum-fill-time trap (no CAPTCHA bloat), typed `ContactState` result. Env: `RESEND_API_KEY` (INTAKE-2), `CONTACT_TO_EMAIL` (INTAKE-3); create `.env.example`; unset key ⇒ action validates, logs, returns an honest failure message (documented seam). Commit: `feat(contact): 5.1 zod-validated server action via resend`.
**5.2 Wire the form.** `useActionState` + pending/success/error states using the section's existing visual language; works without JS (progressive enhancement — verify with JS disabled). Manual test in dev (validation path + missing-key path); live-send test deferred to Vercel once INTAKE-2 lands.
Gate: both tests demonstrated; build; parity of the form's visual states. Commit: `feat(contact): 5.2 form wired with progressive enhancement`.
**⛔ PHASE GATE.**

---

## Phase 6 — Verification & the Engineering Manual

**6.1 Full verification.** `verify-portfolio.mjs --all`; final build + budget table vs BASELINE; Lighthouse per the procedure in `references/cwv-invariants.md` (3× median, numbers pasted, Chromium via `CHROME_PATH` from the D-10 tools dir); deploy preview → PSI mobile+desktop. Anything short of 100/green: fix-loop as sub-sub-tasks (6.1a…), each with its own commit, before proceeding. **The run's success criterion lives here — no declaring victory from local runs alone.**
**6.2 Tier A manual.** `docs/portfolio-internals/core/architecture.md` then `core/performance.md`, per `references/doc-standards.md` (coverage: every checklist item in that file's tree description; gates G1–G5). One commit per file.
**6.3 Tier B playbook.** `playbook/seo.md`, `playbook/case-studies.md`, then `README.md` router. Same discipline.
**6.4 Close-out.** LOG completeness pass; STATE marked run-complete; handoff summary in-chat: Vercel env vars to set (INTAKE-1/2/3), domain wiring steps, PSI re-check cadence, where the manuals live. Final commit: `docs(internals): 6.4 run complete`.
