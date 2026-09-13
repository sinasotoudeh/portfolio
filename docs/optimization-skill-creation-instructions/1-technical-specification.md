# 🛠️ Master Architectural & Performance Specification

## 📋 Project Overview & Strategic Vision

The personal portfolio website is an elite, single-page interactive showcase designed to demonstrate mastery across front-end execution, backend systems, and technical SEO engineering. The current UI/UX layout is flawless in presentation but suffers from severe client-side main-thread blocking, rendering bottlenecks, and excessive hydration weights on mobile devices.

This specification enforces an absolute separation of structural static delivery from isolated runtime interaction nodes to hit an uncompromised **100/100 Core Web Vitals** layer.

---

## 🏗️ Architectural Core Principles

### 1. Hybrid Component Topography (RSC vs. RCC)

- **Server-First Default:** Every structural component, grid section, layout frame, and static asset wrapper must compile as an un-hydrated React Server Component (RSC).
- **Leaf-Node Client Isolation:** Client Components (`"use client"`) are strictly ring-fenced to low-level leaves of the DOM (interactive toggles, input nodes, micro-interaction state wrappers). Large parent blocks must never be marked as client components.

### 2. Next.js App Router Foundations

- **Streaming Engine:** Wrap dense portfolio components or external data integrations inside explicit `<Suspense />` boundaries to stream data and keep Time to Interactive (TTI) under sub-second thresholds.
- **Type Safety:** Maintain 100% strict TypeScript compliance across all modules. No raw `any` types or loose typecasts are permitted.

---

## 🎯 Target Performance & Quality Gates

| Metric                              | Target    | Enforcement Mechanism                                                               |
| :---------------------------------- | :-------- | :---------------------------------------------------------------------------------- |
| **LCP (Largest Contentful Paint)**  | `< 1.2s`  | Priority asset allocation, pre-sized dimension boxes, optimized edge routing.       |
| **CLS (Cumulative Layout Shift)**   | `0.000`   | Fixed aspect-ratio containers, dynamic font scaling controls, zero layout shifting. |
| **INP (Interaction to Next Paint)** | `< 50ms`  | Event loop decoupling, hardware-accelerated micro-tasks.                            |
| **Overall Performance Score**       | `100/100` | Code splitting, dead code elimination, edge runtime streaming.                      |
