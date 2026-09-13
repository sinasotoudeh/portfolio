# Audit Baseline — Repository Ground Truth

**Audited: 2026-07-11, at commit `8828152` ("capability section content changed. (personalized)"), branch `main`.**

> ⚠️ **Orientation only — dated.** This snapshot exists so a fresh session starts oriented instead of blind. Phase 0 reconciles it against the live repo; every implementation decision is made from a fresh read of the source at execution time, never from this file. If this file and the repo disagree, the repo wins and the delta is recorded in `docs/optimization-state/DECISIONS.md`.

## Git & environment

- Branch `main`, remote `origin` → `https://github.com/sinasotoudeh/portfolio.git` (fetch+push). History is healthy and linear; the continuity invariant (File 2, Step 0) applies: no re-init, no history rewrites, all work commits on top.
- Uncommitted at audit time: `next.config.ts` modified (removes `output: 'export'` — the deliberate move from static export to serverful Vercel); `docs/` untracked (the instruction bundle + this skill).
- **`node_modules/` absent** — the project cannot build until dependencies are installed. ~~No lockfile of any kind exists~~ — **wrong, corrected 2026-09-13 (D-7):** `pnpm-lock.yaml` + `pnpm-workspace.yaml` are tracked since the initial commit and match `package.json`; the repo is a pnpm project and installs with `pnpm install --frozen-lockfile`.
- Platform: WSL2 (repo migrated from Windows NTFS). 20 source files still carry CRLF line endings (all of `src/data/*`, most components — full list reproducible via `node .claude/skills/portfolio-optimization-architect/scripts/verify-portfolio.mjs crlf`).
- `out/` contains stale static-export artifacts (gitignored — harmless, delete at will).
- `package.json` `name` is still `"nonato"` — the template identity the site was rebranded away from (commits `01341fe`, `0367098`).

## Framework & config

- Next.js `16.2.1`, React `19.2.4`, Tailwind CSS v4 (CSS-first `@theme` in `src/app/globals.css`), TypeScript 5, ESLint 9 flat config.
- **AGENTS.md gate:** this repo's instructions state the installed Next.js has breaking changes vs. training data and that the relevant guide in `node_modules/next/dist/docs/` must be read before writing code. At audit time that path did not exist (deps not installed) — which is why toolchain install is Phase 0 and the doc-reading gate sits immediately after it.
- `next.config.ts`: `images: { unoptimized: true }` (a leftover requirement of the removed static export — violates Invariant F-1 on Vercel).

## Component census — the hydration problem

`src/app/layout.tsx` and `src/app/page.tsx` are the only server components. **All 12 component files under `src/components/` open with `'use client'`.** Composition:

| Component (lines) | Client engine(s) imported | Notes |
|---|---|---|
| `Hero/Hero.tsx` (364) | none — hand-rolled 2D `<canvas>` particle engine | 250 particles, always-on rAF loop, `mousemove`/`resize` listeners, scroll-pinned 4-state choreography (`uiState` 0–3), state-toggled DOM layers (wordmark, tagline, burst cards, fluid work list, connect CTA). No `<h1>` — wordmark is divs/spans. |
| `Capability/CapabilitiesSection.tsx` (127) | `@react-three/fiber` (Canvas), `framer-motion` (useScroll/useSpring/useTransform), `@use-gesture/react` (useDrag), `three` (Group) | The **only** consumer of the WebGL stack. |
| `Capability/CylinderCard.tsx` (135) | `@react-three/drei` (Html), `@react-three/fiber` (useFrame), `three` | Cards are DOM-in-canvas via drei `<Html>` — not crawlable as normal flow content. |
| `Manifesto/Manifesto.tsx` (169) | `framer-motion` (motion, useScroll, useTransform) | Scroll-linked transforms. |
| `workminimal/WorkMinimal.tsx` (409) | `framer-motion` (motion, AnimatePresence, useInView) | References `next/image` (no raw `<img>` found); verify usage quality at port time. |
| `ProcessSection/ProcessSection.tsx` (242) | `gsap` + `gsap/dist/ScrollTrigger`, `clsx` | The pinned GSAP timeline choreography — **stays byte-for-byte** per locked decision 2. Raw `<img>` at line 186 (~90 icon PNGs under `public/images/Process/`). |
| `Resume/ResumeDashboard.tsx` (473) | `framer-motion` (motion, AnimatePresence) | Tabbed dashboard; data in `src/data/resumeData.ts`. |
| `contact/Contact.tsx` (282) | `framer-motion` (motion, AnimatePresence) | Form is client-only, no transport today. |
| `navigation/Navigation.tsx` (155) | none heavy | Menu state client logic. |
| `footer/Footer.tsx` (215) | none heavy | Likely convertible to RSC (verify interactivity on read). |
| `cursor/CustomCursor.tsx` (93) | none heavy | Global pointer follower. |
| `providers/LenisProvider.tsx` (16) | `lenis/react` (ReactLenis root, `{ lerp: 0.1, duration: 1.5, smoothWheel: true }`) | Wraps `{children}` in layout — children remain RSC-capable (passed as props). |

Data modules (RSC-safe, no directive): `src/data/capabilities.ts`, `src/data/processData.ts`, `src/data/resumeData.ts`, `src/data/workminimal-projects.ts`, `src/config/capabilities.config.ts`.

## Dependency census (`package.json` at audit)

| Package | Verdict at audit | Fate per locked decisions |
|---|---|---|
| `three`, `@react-three/fiber`, `@react-three/drei`, `@use-gesture/react`, `@types/three` | used only by Capabilities | **Removed in Phase 2.8** after CSS-3D rebuild |
| `@react-three/postprocessing` | **zero imports — dead** | Prune in Phase 0.4 |
| `framer-motion` | 5 components | **Removed in Phase 2.8** after GSAP ports |
| `gsap` | ProcessSection | Keep — becomes the single engine |
| `@gsap/react` | **zero imports today** | Keep — `useGSAP` powers the Phase 2 ports |
| `lenis` | LenisProvider | Keep (re-wired for GSAP ticker sync) |
| `lucide-react`, `tailwind-merge` | **zero imports — dead** | Prune in Phase 0.4 |
| `clsx` | ProcessSection | Keep |
| `autoprefixer` | check `postcss.config.mjs` — Tailwind v4 handles prefixing | Prune in 0.4 if config doesn't reference it |

## Fonts — declared but never loaded

No `next/font`, no `@font-face`, no external font `<link>`/`@import` anywhere. Yet the CSS references, per family:

- `--font-body: 'Inter', 'Helvetica Neue', sans-serif` (globals.css:44) — **Inter never loaded**; renders OS fallback.
- `--font-mono: 'JetBrains Mono', 'Fira Code', monospace` — never loaded.
- `--font-display: 'Helvetica Neue', 'Arial', sans-serif` — system stack (intentionally no webfont).
- `Resume/ResumeDashboard.module.css` hardcodes `'Inter', 'SF Pro Display'` (line 33) and `'SF Mono'` (186, 295, 500) — macOS-only names, renders differently per OS.
- `contact/Contact.module.css` hardcodes `system-ui` (22) and bare `serif` (117 — an intentional serif accent; preserve it, but pick an explicit stack).

Locked default: self-host Inter + JetBrains Mono via `next/font` with size-adjusted fallbacks; `--font-display` stays a system stack.

## Images

~9 MB of PNG under `public/images/`. Heaviest: `contact/bg.png` 1.33 MB, `cv/content.png` 1.23 MB, `cv/bg.png` 1.16 MB, `work/{autodm,folad,sadr}.png` 0.83–1.10 MB each, 12 Process logo/icon PNGs 300–600 KB, ~75 Process step icons 15–60 KB. One `.webp`+`.jpg` pair exists (`capability/back.*`).

**Two files carry whitespace in their names** (URL-encoding hazard, reference-bug bait): `public/images/Process/discover/logos-Google Analytics.png` and `public/images/Process/design/geometric shape.png`. Rename to hyphenated + update references in Phase 0.3. (An earlier draft of this audit misread them as extensionless — corrected 2026-07-11 after `ls` verification.)

## SEO state — ground zero

- `layout.tsx` metadata: `title: "Create Next App"`, `description: "Generated by create next app"`.
- No sitemap, no robots, no JSON-LD, no OpenGraph/Twitter cards, no canonical, no favicon beyond the default.
- No `<h1>` on the page; heading levels inside sections start at `h2`–`h4` arbitrarily.
- Site copy is English; code comments partly Persian (fine — not in scope unless the user asks).

## Case-sensitivity exposure

Mixed directory casing under `src/components/` (`Capability/`, `Hero/`, `Manifesto/`, `ProcessSection/`, `Resume/` vs `contact/`, `cursor/`, `footer/`, `navigation/`, `providers/`, `workminimal/`) and `public/images/Process/` (capital P). Imports matched disk at audit time, but NTFS→Linux history makes this a standing hazard — the `casing` check in `verify-portfolio.mjs` runs in every gate pass.
