# Core Web Vitals Invariants — enforcement recipes for this codebase

The targets (File 1) are absolute: **LCP < 1.2s, CLS 0.000, INP < 50ms, Lighthouse Performance 100/100 (mobile and desktop)** on Vercel. This file maps each target onto the *specific* threats in this repo and gives the implementation recipe for invariants F-1…F-3 plus the engine-consolidation and budget rules.

> ⚠️ **Next.js 16 verification gate.** Per `AGENTS.md`, every API named below (`next/font`, `next/image` props and config, `next/dynamic`, Metadata API, `sitemap.ts`/`robots.ts` conventions, Server Actions) must be verified against the installed guides in `node_modules/next/dist/docs/` **in the session that implements it**. The recipes here define intent and shape; the installed docs define the exact current API. Where they differ, the installed docs win and the delta is noted in `DECISIONS.md`.

## What threatens each metric *here*

| Metric | Concrete threats in this repo |
|---|---|
| **LCP** | The LCP element is the hero wordmark text (there is no above-the-fold image). Threats: fonts loaded late/never (today: silent fallbacks), the all-client tree deferring first paint of *everything* behind hydration, render-blocking main-thread work at load. Server-rendering the hero shell + `next/font` preloading makes sub-1.2s straightforward. |
| **CLS** | Web-font swap once Inter actually loads (today there's no swap only because the font never arrives); images without reserved boxes (ProcessSection raw `<img>`, any `next/image` without proper sizing); scroll-pinned sections must own fixed viewport-unit heights (they already do via CSS — preserve). Target is 0.000, not "small". |
| **INP** | Always-on Hero rAF loop (250 particles, runs even when off-screen), `mousemove` handlers, Lenis smooth-scroll doing per-frame work, three.js pointer handling (removed by decision D-1), hydration cost of 12 client components delaying first interactivity. |
| **Score/TBT** | Sheer client JS: three+fiber+drei+use-gesture+framer-motion all die (D-1/D-2); what remains must fit the budget below. |

## Invariant F-1 — Image pipeline

1. `next.config.ts`: delete `images.unoptimized` entirely; set `images.formats = ['image/avif', 'image/webp']`. (Serverful Vercel does on-demand optimization; the giant source PNGs stay in the repo and are served transformed.)
2. **Every** raster asset renders through `next/image` — the `img` check in `verify-portfolio.mjs` fails the gate on any raw `<img>` in `src/`.
3. Sizing contract: fixed-dimension images get real `width`/`height` (from the rendered layout, not the file's intrinsic pixels); container-driven images get `fill` inside a positioned box with an explicit `aspect-ratio` in CSS, plus a `sizes` attribute that tells the truth about the rendered width per breakpoint (read the section's CSS to write it — a lazy `100vw` on a 300px card wastes bandwidth and is a gate failure).
4. Above-the-fold/LCP-adjacent images get eager, high-priority loading. **Next 16 deprecated the `priority` prop** (installed `02-components/image.md`): use `preload` for a single, unambiguous LCP image, otherwise `loading="eager"` or `fetchPriority="high"` — never `preload` together with `loading`/`fetchPriority` (D-8). At audit there is none (hero is text+canvas); re-check after every layout change — if a section moves above the fold, its image inherits eager loading.
5. Below-fold sections keep default lazy loading. The ~90 ProcessSection icons are small and GSAP-animated: give each real dimensions; they may keep `loading="lazy"` since the section is deep below the fold.
6. The two space-named files (`public/images/Process/discover/logos-Google Analytics.png`, `public/images/Process/design/geometric shape.png`) are renamed to hyphenated form in Phase 0.3 along with every reference (grep `src/data/processData.ts` and components before renaming).

## Invariant F-2 — Typography without shift

1. Self-host via `next/font/google` (build-time download → served first-party): **Inter** (variable) as `--font-body`, **JetBrains Mono** (variable) as `--font-mono`. `--font-display` remains the intentional system stack (`'Helvetica Neue', 'Arial', sans-serif`) — no webfont, no swap, zero risk.
2. Configure each with `display: 'swap'` and the size-adjusted automatic fallback enabled (the default `adjustFontFallback`) so the swap is metrically invisible — that combination is what buys CLS 0.000 while guaranteeing the brand font paints.
3. Expose via the `variable` option and wire into Tailwind's `@theme` in `globals.css` (replace the raw family lists at the `--font-body` / `--font-mono` token definitions). Apply the variable classNames on `<html>`/`<body>` in `layout.tsx`.
4. Kill hardcoded family drift: `ResumeDashboard.module.css` lines 33/186/295/500 (`'Inter', 'SF Pro Display'`, `'SF Mono'`) → `var(--font-body)` / `var(--font-mono)`; `Contact.module.css:117`'s bare `serif` becomes an explicit serif stack (preserving the serif look — parity note for the user).
5. `subsets: ['latin']`; no preload of weights the CSS never uses — variable fonts cover it.

## Invariant F-3 — Code splitting & lazy resolution

File 2's rule: any interactive block or animation utility >15KB of client JS must not ride the critical path. In App Router terms:

- The default mechanism is the RSC boundary itself: section shells are server components; client leaves are separate modules Next code-splits automatically.
- For heavy leaves (the CSS-3D cylinder controller, the Hero particle engine), the *shell* renders full static markup immediately and the leaf mounts via `next/dynamic` from a client wrapper. File 2's `{ ssr: true }` snippet expresses "keep SSR while splitting" — in current App Router SSR-on is the default for `dynamic()`; verify exact semantics in the installed docs before use (`ssr: false` is only legal inside client components).
- **Mount-on-approach pattern** for below-fold engines: a tiny client wrapper holds an `IntersectionObserver` (`rootMargin: '200px'` or similar) and renders the static shell until the section approaches, then mounts the interactive leaf. The shell and leaf must be visually identical at the mount instant (no pop — parity checklist item).

## The engine — GSAP consolidation contract (decision D-2)

- One runtime: `gsap` + `ScrollTrigger` + `@gsap/react`'s `useGSAP` (scoped, auto-cleanup). Register plugins once in `src/lib/motion/gsap.ts`; every motion wrapper imports from there.
- **Lenis ↔ ScrollTrigger wiring** (replaces `ReactLenis` default rAF): drive Lenis from GSAP's ticker so there is exactly one frame loop —

  ```tsx
  // LenisProvider: options={{ autoRaf: false, ... }} + ref
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    lenis?.on('scroll', ScrollTrigger.update);
    const update = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(update); lenis?.off('scroll', ScrollTrigger.update); };
  }, []);
  ```

  Verify against the installed `lenis` version's README (`node_modules/lenis/README.md`) — the existing options (`lerp: 0.1, duration: 1.5, smoothWheel: true`) carry over unchanged.
- **Porting framer-motion with parity:** before porting a component, write down its exact motion inventory (initial/animate/exit values, transition type, duration, ease, spring config, viewport margins for `useInView`). Map: `duration`+`ease` tweens → same numbers in GSAP (`power2.out` ≈ framer's default `easeOut`; use `CustomEase` only if a numeric cubic-bezier appears); framer default *spring* → measure the settle feel and approximate with `back.out`/`elastic.out` or a duration-matched `power3.out`, then let the parity review judge; `AnimatePresence` exit animations → GSAP timeline that plays exit, then swaps React state in `onComplete`; `useInView`/`whileInView` → `ScrollTrigger` with `start` mirroring the viewport margin, `once: true` where framer used `once`; `useScroll`+`useTransform` scrubs → `ScrollTrigger` with `scrub: true` mapping the same input range to the same output values.
- `prefers-reduced-motion`: every motion wrapper checks `gsap.matchMedia()` and degrades to opacity-only or static — this is new behavior (an accessibility & CWV courtesy), disclosed in parity notes rather than silently added.

## CSS-3D cylinder rebuild recipe (decision D-1)

Read `CapabilitiesSection.tsx` + `CylinderCard.tsx` fully first and extract: card count N (from `src/data/capabilities.ts`), card dimensions, cylinder radius, rotation-to-scroll/drag mapping, spring feel, active-card styling (drei `<Html>` content is the card DOM — it transplants almost 1:1).

- Geometry: container with `perspective` (match apparent depth; start ~1200px and tune against the WebGL original), ring element `transform-style: preserve-3d`, card *i* at `transform: rotateY(${i * 360 / N}deg) translateZ(${r}px)` where `r = (cardWidth / 2) / Math.tan(Math.PI / N)` plus the gap the original spacing implies. `backface-visibility` per the original's card visibility behavior.
- Rotation state is one number (degrees) on the ring: drag (Pointer Events; capture, accumulate `dx * sensitivity`) feeds a GSAP quickTo/inertia tween on release (match the current `useSpring` feel); scroll-linked rotation via ScrollTrigger scrub if the original ties rotation to scroll (verify on read).
- The cards become real flow DOM: crawlable text, focusable links, correct heading levels — an SEO win that the WebGL version structurally could not provide.
- Depth cues the WebGL version got for free (per-card scale/dimming by z) are recreated with a per-frame class/custom-property update from the rotation value (cos of each card's angle → opacity/brightness). Budget: this whole section's client JS should land under ~6KB.
- Kill list after parity approval: `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` (dead already), `@use-gesture/react`, `@types/three`.

## Hero engine hygiene (kept, disciplined)

The particle engine stays (it's the centerpiece and dependency-free), with these mandatory fixes, each parity-neutral:

1. **Pause off-screen:** IntersectionObserver on the pin container — `cancelAnimationFrame` when not intersecting, resume on re-entry. (Today it burns CPU for the entire page life.)
2. `{ passive: true }` on `mousemove`/`resize`/scroll listeners.
3. Cap canvas backing resolution: `devicePixelRatio` clamped to 2 (and size the canvas buffer × DPR — at audit it renders at CSS pixels, which is also a *sharpness* bug on retina; flag the sharpness change in parity notes as an improvement).
4. Reduce particle count under `matchMedia('(max-width: 768px)')` and honor `prefers-reduced-motion` with a static composition.
5. `setUiState` stays threshold-gated (already correct) — never per-frame state.

## Budgets & verification

- **Budget (recorded in STATE.md at every phase gate):** homepage First Load JS ≤ **140 KB gzipped** after Phase 2.8 (stretch: 120 KB); no route may regress >5% between phase gates without a DECISIONS entry. Next 16 removed the `size`/`First Load JS` columns from `next build` (installed `upgrading/version-16.md`), so numbers come from `verify-portfolio.mjs budget` after `pnpm build` — it sums every non-legacy JS chunk and stylesheet the prerendered HTML references (gzip -9 is the budget figure; brotli shown for reference). Paste its output into STATE.md (D-8).
- **Lighthouse procedure (local proxy):** `pnpm build && pnpm start`, then against `http://localhost:3000`: `pnpm dlx lighthouse http://localhost:3000 --preset=perf --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate --output=json --output-path=<scratch>` — run 3×, take the median. WSL2 caveat: requires a Chrome/Chromium binary; if none is available, use `pnpm dlx playwright install chromium` and point `CHROME_PATH` at it, or fall back to the authoritative check below. Never claim a score without pasting the run's numbers.
- **Authoritative check:** the Vercel deployment (preview or production) measured with PageSpeed Insights — local runs are the fast loop, PSI on the deployed URL is the number that counts, and the run isn't "done" (Phase 6) until PSI mobile+desktop read 100 with all CWV green.
- **CLS 0.000 check:** Lighthouse trace + manual: hard-reload with devtools Performance → Layout Shift regions while fonts/images load, and once mid-scroll through every pinned section.
