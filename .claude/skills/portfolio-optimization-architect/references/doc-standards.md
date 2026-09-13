# Documentation Standards — the Tier A / Tier B contract for `docs/portfolio-internals/`

This adapts the documentation discipline of the sibling repo's `ecommerce-platform-documenter` skill (`/home/sina/projects/shop-platform/.claude/skills/ecommerce-platform-documenter/`) to this portfolio. Same doctrine, smaller surface: **zero placeholders, evidence over memory, nothing summarized into vagueness.** A manual that says "optimize your images appropriately" has failed; the manual says which component, which prop, which config line, and what breaks when it's absent.

## The deliverable tree

```
docs/portfolio-internals/
├── README.md                    # audience router: who reads what, doc map, run artifacts
├── core/                        # Tier A — the engineer evolving this codebase
│   ├── architecture.md          # RSC/RCC boundary map, hydration isolation, motion system,
│   │                            # font pipeline, contact transport, data schemas, route map
│   └── performance.md           # CWV invariants as implemented, budgets + baseline numbers,
│                                # Lighthouse/PSI verification procedure, regression playbook
└── playbook/                    # Tier B — the future content editor (usually Sina, months later)
    ├── seo.md                   # updating the JSON-LD graph, metadata, sitemap entries,
    │                            # OG assets — with exact file/line recipes
    └── case-studies.md          # appending a new case-study node end-to-end: schema entry,
                                 # route output, JSON-LD linkage, images, validation steps
```

## Audience contracts

**Tier A (core/)** — persona: a senior engineer (possibly Claude in a future session) changing runtime behavior. Self-sufficiency test: *from `core/` alone, they can state where every `'use client'` boundary is and why, add a new animated section without breaking budgets, and run the full verification procedure.* Internals are never diluted for accessibility.

**Tier B (playbook/)** — persona: someone updating content who must not need to understand hydration to ship a case study safely. Self-sufficiency test: *from `playbook/` alone, they can add a case study, update the schema graph, and prove via the documented Lighthouse/PSI procedure that the score did not degrade.* Playbook docs may link core docs as background, **never as prerequisite steps**. Core docs never link playbook docs as steps.

## Writing standard

Every deliverable starts with this frontmatter:

```markdown
---
title: <document title>
tier: A | B
verified-against: <short commit hash the claims were read from>
updated: <ISO date>
---
```

- **Evidence rule.** Every factual claim (a path, an export, a prop, an env var, a number) comes from a read or command run in the session that writes it — never from memory of an earlier session and never from this skill's own dated references. Cite paths in backticks; they are machine-checked (gate G1).
- **Zero placeholders (G2).** No TODO/TBD/FIXME/lorem/`???`/`<your-value-here>`. Unknowables that belong to the user are *named intake fields* from `references/seo-blueprint.md` ("set `RESEND_API_KEY` — intake INTAKE-2"), each with a home and a consequence-when-absent.
- **Links resolve (G3).** Every relative link and anchor points at a real file and a real heading.
- **Commands are runnable.** Verify each documented command against `package.json` scripts and installed binaries before citing it. Include expected output shape where it matters.
- **Reality, not aspiration.** Document what the code does, including honest seams (e.g. "the contact action logs instead of sending when `RESEND_API_KEY` is unset"). If a doc claim can't be made true, that's a code defect: record it in `DECISIONS.md`, tell the user — never silently patch code during a documentation sub-task.
- **Settled decisions are cited, not re-argued.** The interview decisions (D-1…D-4 in `docs/optimization-state/DECISIONS.md`) and later decision entries are summarized and linked, never re-litigated inside a manual.

## Terminology registry (use these words, exactly)

| Term | Meaning here |
|---|---|
| **section shell** | The server component rendering a section's static markup |
| **client leaf** | The minimal `'use client'` component owning one interaction concern |
| **motion wrapper** | A client leaf whose only job is GSAP animation of shell-rendered DOM |
| **the engine** | GSAP + ScrollTrigger via `useGSAP` — the single animation runtime |
| **parity** | Side-by-side visual/behavioral equivalence, user-attested |
| **budget** | The recorded first-load-JS ceiling in `docs/optimization-state/STATE.md` |
| **intake field** | A user-owned value named `INTAKE-n` in `references/seo-blueprint.md` |

## Gates for documentation sub-tasks

- **G1 path-evidence** + **G2 zero-placeholder** + **G3 link/anchor integrity** — mechanical, via `node .claude/skills/portfolio-optimization-architect/scripts/verify-portfolio.mjs docs`.
- **G4 coverage** — every item in the sub-task's coverage checklist (`references/phase-plan.md`, Phase 6) is present; tick the list explicitly in the closing response.
- **G5 tier fitness** — the file passes its audience's self-sufficiency test above and uses the terminology registry. Attested in the response, with one sentence of justification.

Documentation sub-tasks follow the same cadence as code sub-tasks: sections land one at a time through file tools, STATE.md tracks the section plan, and each finished deliverable is one commit (`docs(internals): <file> — <coverage summary>`).
