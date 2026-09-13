# SEO Blueprint — metadata contract, JSON-LD graph, crawl surface, Atajoy facts

## Canonical URL wiring (no blocker)

All absolute URLs derive from one place: `NEXT_PUBLIC_SITE_URL`. Resolution order: the env var if set → `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` on Vercel → `http://localhost:3000`. Implement once in `src/lib/site.ts` (`siteUrl` + `absoluteUrl(path)`), consume everywhere (`metadataBase`, JSON-LD `@id`s, sitemap, robots). When Sina supplies the production domain (**INTAKE-1**), it's a one-env-var change on Vercel — no code edit.

## Metadata contract (root `layout.tsx`, Metadata API)

Verify field names against the installed Next 16 docs, then implement:

- `metadataBase: new URL(siteUrl)`
- `title`: `{ default: 'Sina Sotoudeh — <positioning>', template: '%s — Sina Sotoudeh' }`. The `<positioning>` phrase is **authored from the site's real copy** (hero tagline, `src/data/capabilities.ts`, Manifesto text — read them in-session), not invented. It's outward-facing: present to the user for sign-off at the Phase 3 gate.
- `description`: same sourcing rule, ≤160 chars.
- `alternates.canonical: '/'` (and per-route canonicals on `/work/[slug]` via `generateMetadata`).
- `openGraph` (type `website`/`profile` on home, `article` on case studies) + `twitter` card `summary_large_image`.
- **OG image + favicon — INTAKE-4.** Options, user's pick: (a) supply artwork; (b) we generate a static OG image and favicon from the wordmark's existing CSS styling (SinSO mark, mercury palette). No default Vercel triangle survives Phase 3.
- `robots` meta: index/follow defaults; nothing noindexed.

## The unified JSON-LD graph (File 3, Section 1)

One `<script type="application/ld+json">` server-rendered in the root layout, a single `@graph` with stable `@id` anchors:

```
@graph
├── Person        @id: ${siteUrl}/#person
│     name, url, jobTitle (INTAKE-7), sameAs [GitHub: https://github.com/sinasotoudeh (verified
│     from git remote), LinkedIn/others — INTAKE-5], knowsAbout: from src/data/capabilities.ts
│     (read in-session), image: OG portrait if provided (INTAKE-4)
├── WebSite       @id: ${siteUrl}/#website
│     name "Sina Sotoudeh", url, inLanguage "en", publisher → #person
├── ProfilePage   @id: ${siteUrl}/#profilepage
│     url, isPartOf → #website, mainEntity → #person, dateModified (build time)
└── per case study: CreativeWork/TechArticle nodes linked via Person.workExample
      @id: ${siteUrl}/work/<slug>#work — name, url, about, author → #person
```

**Honesty note on "PortfolioItem":** File 3 names a `PortfolioItem` schema — schema.org has no such type. The intent (showcase elements interlinked with dedicated write-ups) is implemented with real vocabulary: `Person.workExample → CreativeWork` nodes on the home graph, and each `/work/[slug]` page emitting its own `TechArticle`/`CreativeWork` JSON-LD whose `@id` matches the home graph's node, `author`/`mainEntityOfPage` linking back. Record this substitution in `DECISIONS.md` (it corrects the instruction file, deliberately).

Email/phone do **not** go into JSON-LD unless Sina explicitly opts in (scraper bait). The contact email lives where it already lives — in the rendered contact section.

Validation: JSON parses (mechanical, in `verify-portfolio.mjs docs` scope only for docs; for the component, unit-verify by rendering + `JSON.parse`), then Google Rich Results Test + Schema.org validator on the deployed preview — paste results into the Phase 3 gate response.

## Crawl surface

- **`app/sitemap.ts`:** `/` (priority 1.0, changeFrequency `monthly`, `lastModified` build date) + every `/work/<slug>` from the case-study schema (priority 0.8, `lastModified` from each entry's `updated` field — the schema includes it so the sitemap never lies).
- **`app/robots.ts`:** allow all user agents on everything; `sitemap: absoluteUrl('/sitemap.xml')`; no crawl-delay, no disallows (there is nothing to hide — no admin surface exists).
- Both files use the installed docs' current convention (metadata routes) — verify shape before writing.

## Semantic HTML contract (page-wide, enforced in Phases 2–4)

- Exactly one `<h1>`: the hero wordmark ("Sina Sotoudeh"), preserving the letter-span styling inside it.
- Every section: `<section aria-labelledby>` with a real heading (`h2` per section; `h3+` nested in order — audit Hero's `h4` burst cards and every section's current levels during its Phase 2 sub-task).
- Case-study pages: `<article>` with `<header>`; landmarks `<nav>`/`<main>`/`<footer>` already exist structurally — keep them real (one `<main>` per page).
- Every image gets *authored* alt text (describe the content, not the filename); decorative layers get `alt=""` + `aria-hidden`.
- No div-soup replacements: when a Phase 2 rebuild touches markup, prefer the semantic element that already means the thing (`<ul>` for the fluid work list, `<figure>` for work screenshots, `<address>` for contact email).

## Project Atajoy — verified fact sheet (evidence lines)

Facts below were read from `/home/sina/projects/shop-platform/.meta/reference-agency-portfolio/` on 2026-07-11. **Re-verify each before rendering it in the showcase** (evidence-over-memory) — the showcase states only what a cited file proves:

| Claim for the showcase | Evidence |
|---|---|
| Next.js 16 App Router (16.2.4), React 19.2.4 | `package.json` |
| Payload CMS 3.84 embedded in the same Next app | `payload.config.ts`, `@payloadcms/next` in `package.json` |
| **MongoDB** via `mongooseAdapter` — *not* Postgres (corrects File 3; recorded as D-5) | `payload.config.ts:3` |
| 4-locale i18n (en/es/tr/ar) via next-intl 4 | `messages/{en,es,tr,ar}.json`, `next-intl.config.ts`, `i18n/routing.ts` |
| Contact flow: `"use server"` Server Action + Zod + **Payload Local API** (`getPayload` → `payload.create`) — zero REST/fetch hop | `actions/contact.ts` |
| Server-generated sitemap + robots, JSON-LD structured data | `app/sitemap.ts`, `app/robots.ts`, `components/BlogPostStructuredData.tsx` |
| Self-hosted variable fonts (DM Sans, Cal Sans woff2) | `app/fonts.ts`, `public/fonts/` |
| Theming (next-themes), email via nodemailer adapter | `package.json`, `@payloadcms/email-nodemailer` |

**Showcase composition (File 3, Section 2):**
1. **Architecture Grid** — server-rendered fact grid built from the table above (each cell a claim the fact sheet proves). No client JS required beyond an entrance motion wrapper.
2. **Performance visualization** — a server-rendered CSS/SVG diagram contrasting `Browser → REST API → DB` hops vs Atajoy's `RSC → Payload Local API → DB` in-process path, with a GSAP-scrubbed reveal. No chart library (budget rule); the diagram is hand-built SVG in the section's aesthetic.
3. Links to `/work/atajoy` (the full case study) and `https://atajoy.com` (live, `rel="noopener"`).

## Intake register (user-owned values; STATE.md tracks which are still open)

| ID | Value | Consumed by | Absent ⇒ |
|---|---|---|---|
| INTAKE-1 | Production domain | `NEXT_PUBLIC_SITE_URL` env | Vercel URL used; all SEO artifacts still valid, swap = env change |
| INTAKE-2 | `RESEND_API_KEY` | contact Server Action (Phase 5) | Action validates + logs, returns success:false with honest message |
| INTAKE-3 | Contact destination inbox | contact Server Action | Falls back to the address rendered in the contact section (read in-session) |
| INTAKE-4 | Favicon/OG artwork (or approval to generate from wordmark) | Phase 3 metadata | Generated-from-wordmark route, user approves visually |
| INTAKE-5 | `sameAs` profile URLs (LinkedIn, X, …) | Person node | GitHub only |
| INTAKE-6 | Atajoy public claims sign-off (role, launch window, any metrics) | showcase + case study | Only repo-provable facts render |
| INTAKE-7 | Exact `jobTitle`/positioning phrase | Person node + title tag | Drafted from site copy, needs sign-off at Phase 3 gate |
