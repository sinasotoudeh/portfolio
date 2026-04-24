// src/data/resumeData.ts
import React from "react";

export type CardContent = {
    title: string;
    desc: string;
    icon?: React.ReactNode | string;
    badge?: string;
};

// ۱. تعریف تایپ برای محتوای پروفایل و تجربیات (آبجکت تکی)
export type ProfileContent = {
    name: string;
    role: string;
    date?: string;
    text?: string;
    points?: string[];
    contacts?: string[];
    links?: string[];
    githublink?: string; // اضافه شده
    techStack?: string[]; // اضافه شده
};

// ۲. تعریف تایپ برای لیست مهارت‌ها و تحصیلات (آیتم‌های داخل آرایه)
export type ListContentItem = {
    title: string;
    desc: string;
    badge?: string;
};

export type SubSection = {
    id: string;
    title: string;
    // ۳. جایگزینی any با یک Union Type دقیق و ساختاریافته
    content: React.ReactNode | ProfileContent | ListContentItem[];
    background?: string;
    mobileTitle?: string;
    hideTitle?: boolean;
};


export type TabData = {
    id: string;
    title: string;
    subSections: SubSection[];

};

export const resumeData: TabData[] = [
    {
        id: "about",
        title: "About Me",
        subSections: [
            {
                id: "summary",
                title: "Professional Summary",
                                hideTitle: true,

                background: "url('/images/cv/content.png')",

                content: {
                    name: "Sina Sotoudeh",
                    role: "Front-End Developer & Technical SEO Engineer",
                    contacts: ["s.sotudeh1@gmail.com", "+989027405145", "Tehran, Iran"],
                    links: ["linkedin.com/in/sinasotoudeh", "Github.com/sinasotoudeh", "sinasotoudeh.ir"],
                    text: "Product-minded Front-End Developer with 3+ years of experience translating sophisticated UI/UX designs into high-performance, interactive web applications. Armed with deep expertise in core web technologies (JavaScript, HTML/CSS) and modern frameworks (React, Next.js, TypeScript), alongside a rare, advanced background in Technical SEO. I specialize in building dynamic e-commerce solutions and advanced admin dashboards, ensuring products are functionally robust, visually compelling, and architecturally optimized for search engines.",
                    // quote: "I don’t just optimize for search engines—I architect systems where exceptional user experience and search visibility emerge as natural byproducts of quality engineering."
                }
            }
        ]
    },
    {
        id: "expertise",
        title: "Technical Expertise",
        subSections: [
            {
                id: "core",
                title: "Core Technologies & Languages",
                mobileTitle: "Core Tech",
                background: "url('/images/cv/profile.png')",

                content: [
                    { title: "JavaScript (ES6+)", badge: "Expert", desc: "Deep understanding of core mechanisms including Asynchronous Programming (Promises, Async/Await, Event Loop), Closures, Hoisting, Prototypal Inheritance, DOM manipulation and JS engine execution contexts (V8)." },
                    { title: "TypeScript", badge: "Expert", desc: "Advanced static typing, Interfaces, Generics, Utility Types, and ensuring type safety across large-scale applications." },
                    { title: "HTML5 & CSS3", badge: "Expert", desc: "Semantic HTML, Web Accessibility (A11y/WCAG guidelines), Technical SEO fundamentals, CSS Variables, Flexbox, and CSS Grid architecture." }
                ]
            },
            {
                id: "frameworks",
                title: "Frontend Frameworks & Libraries",
                mobileTitle: "Frontend Tools",
                content: [
                    { title: "React.js", badge: "Primary Expert", desc: "Advanced component architecture, React Hooks (Custom Hooks, useMemo, useCallback), Component Lifecycle, Context API, Higher-Order Components (HOCs), and performance optimization techniques (Code Splitting, Lazy Loading)." },
                    { title: "Next.js", badge: "SSR / SSG", desc: "Proficient in Server-Side Rendering, Static Site Generation, Incremental Static Regeneration (ISR), App/Pages Router, and API routes for scalable web applications." },
                    { title: "Vue.js", badge: "Secondary", desc: "Working knowledge of Vue 3, Composition API, Nuxt.js fundamentals, and state management using Pinia." }
                ]
            },
            {
                id: "state_data",
                title: "State Management & Data Fetching",
                mobileTitle: "State Management",
                content: [
                    { title: "Client State", desc: "Zustand (Highly proficient), Redux / Redux Toolkit (practical experience)." },
                    { title: "Server State", desc: "React Query (TanStack Query) for efficient data fetching, caching, and synchronization. Familiar with SWR and Apollo GraphQL." },
                    { title: "API Integration", desc: "Deep knowledge of RESTful APIs, HTTP protocols, Axios, Fetch API. Familiar with WebSockets (Real-time communication), and handling JWT/OAuth token authentication securely." }
                ]
            },
            {
                id: "styling_ui",
                title: "Styling, UI/UX & Design Systems",
                mobileTitle: "UI/UX",
                content: [
                    { title: "CSS Frameworks", badge: "Expert", desc: "Mastery of Tailwind CSS as the primary utility-first framework, alongside solid experience with CSS preprocessors like SCSS/Sass." },
                    { title: "UI Libraries", badge: "Proficient", desc: "Familiar with Material UI (MUI), Ant Design, Radix UI, Storybook (for documenting reusable component libraries)." },
                    { title: "UI/UX Implementation", badge: "Expert", desc: "Pixel-perfect and Mobile-First responsive design, precise Figma-to-Code translation, and implementation of complex UI animations (using Framer Motion / GSAP)." }
                ]
            },
            {
                id: "architecture_perf",
                title: "Architecture, Performance & Security",
                mobileTitle: "Architecture",
                content: [
                    { title: "Software Architecture", desc: "Clean Code principles, SOLID, DRY, YAGNI, Component-Driven Development (CDD), and awareness of Micro-frontends and Monorepo architectures (Nx / Turborepo)." },
                    { title: "Performance Optimization", desc: "Monitoring and improving Core Web Vitals (LCP, FID, CLS), utilizing Lighthouse, efficient bundle size management, and caching strategies." },
                    { title: "Web Security & PWA", desc: "Implementing defensive coding against XSS, CSRF, and secure cookie/token management. Service Workers, offline functionality, and caching resources for PWAs." }
                ]
            },
            {
                id: "testing_tools",
                title: "Testing, Build Tools & Version Control",
                mobileTitle: "Dev Tools",
                content: [
                    { title: "Quality Assurance (E2E & Unit Testing)", desc: "Jest, React Testing Library (RTL), Vitest, and familiarity with Cypress/Playwright." },
                    { title: "Build Tools & Bundlers", desc: "Vite, Webpack, Babel, and ESLint/Prettier configuration." },
                    { title: "Version Control", desc: "Git, Git Flow methodology, resolving complex merge conflicts, and managing Pull Requests via GitHub/GitLab." }
                ]
            },
            {
                id: "cross_functional",
                title: "Cross-Functional & Complementary",
                mobileTitle: "Complementary",
                content: [
                    { title: "Technical SEO & Search Systems", badge: "Expert", desc: "Deep understanding of Googlebot behavior, crawl budget, log file analysis, SSR/CSR rendering strategies, complex Hreflang architecture, and dynamic JSON-LD schema generation." },
                    { title: "CMS & Platform Architecture", badge: "Expert", desc: "Implementation of Headless CMS architectures, deep expertise in WordPress (core optimization, custom development), URL rewrite engineering, and secure platform migrations." },
                    { title: "Advanced AI & Automation", badge: "Expert", desc: "High-level expertise in LLM prompt orchestration (GPT, Claude, Gemini) for debugging, refactoring, large-scale intent clustering, entity normalization pipelines, and automated SEO QA." },
                    { title: "Backend & Data", badge: "Personal Perojects", desc: "Data modeling (MySQL, PostgreSQL, MongoDB), Docker containerization, CDN configurations, and building automated data pipelines/scraping with Puppeteer/Playwright and n8n." }
                ]
            }
        ]
    },
    {
        id: "experience",
        title: "Experience",
        subSections: [
            {
                id: "atajoy",
                title: "Atajoy",
                hideTitle: true,
                content: {
                    name: "Atajoy.com",
                    role: "Front-End Developer",
                    date: "2025 - Present | Tehran, Iran",
                    githublink: "Github.com/sinasotoudeh/autodm", // لینک گیت‌هاب
                    text: "Engineered the client-side architecture for an Instagram automation SaaS, delivering a high-performance dashboard for automated DM/comment workflows and product management.",
                    points: [
                        "**Complex UI & State Architecture:** Built a dynamic, multi-step rule builder (Trigger-Action) and custom form generator. Managed deeply nested states using Zustand, drastically reducing unnecessary re-renders and optimizing UI thread performance.",
                        "**Hybrid Rendering (Next.js):** Strategically leveraged CSR for complex dashboard interactions alongside SSR/ISR for public-facing product showcases, perfectly balancing dynamic user experience with Technical SEO requirements.",
                        "**Server-State & Caching:** Integrated React Query (TanStack) for efficient data fetching, aggressive caching, and seamless synchronization of user automation rules via RESTful APIs.",
                        "**Scalable Design System:** Developed a responsive, pixel-perfect UI using Tailwind CSS and Headless components, ensuring an accessible, SPA-like experience with smooth micro-interactions."
                    ],
                    techStack: ["Next.js", "TypeScript", "React.js", "Tailwind CSS", "Zustand", "React Query"] // تک‌استک

                }
            },
            {
                id: "sadr",
                title: "Sadr",
                hideTitle: true,

                content: {
                    name: "Sadrhub.com",
                    role: "Front-End Engineer",
                    date: "2024 - 2025 | Tehran, Iran",
                    githublink: "Github.com/sinasotoudeh/sadrhub", // لینک گیت‌هاب
                    text: "Developed a high-performance SaaS landing page and user portal, utilizing WordPress strictly as a secure middleware routing layer.",
                    points: [
                        "**Authentication Flow:** Engineered a secure passwordless OTP authentication flow utilizing a Backend-for-Frontend (BFF) cookie proxy to seamlessly bridge external APIs.",
                        "**Scalable UI Foundation:** Architected a scalable, breakpoint-free CSS foundation using HSL design tokens and GPU-accelerated animations to ensure smooth 60FPS UI performance.",
                        "**Complex State Management:** Implemented a modular, dependency-free JavaScript architecture to build a responsive, multi-step asynchronous store creation wizard with debounced network requests."
                    ],
                    techStack: ["WordPress (Middleware Layer)", "PHP", "Vanilla JavaScript (ES6+)", "Modern CSS3", "REST API Integration"]
                }
            },
            {
                id: "steel_center",
                title: "Steel Center",
                hideTitle: true,

                content: {
                    name: "Foladmarket.com",
                    role: "Full-Stack Web Developer",
                    date: "2023 - 2024 | Tehran, Iran",
                    githublink: "Github.com/sinasotoudeh/foladmarket",
                    text: "Developed a high-performance, Elementor-free WordPress theme and a suite of custom B2B e-commerce plugins for the steel industry.",
                    points: [
                        "**Advanced Plugin Architecture:** Engineered over 15 OOP-based custom plugins, featuring complex multi-stage pricing calculators and a session-based B2B cart utilizing O(1)queries.",
                        "**Core Web Vitals Optimization:** Architected a blazing-fast theme relying on native PHP templates, critical CSS routing, and transient-based caching instead of heavy page builders.",
                        "**Technical SEO & Routing Security:** Implemented transient-based JSON-LD schema caching and engineered a custom query interceptor that sanitizes malicious URL parameters to prevent SERP index bloat"

                    ],
                    techStack: ["Custom WordPress Development (Themes & Plugins)", "PHP (OOP)", "Vanilla JavaScript (ES6+)", "Modern CSS3", "REST API"]
                }
            }
        ]
    },
    {
        id: "projects",
        title: "Projects",
        subSections: [
            {
                id: "portfolio",
                title: "Portfolio",
                hideTitle: true,

                content: {
                    name: "Sinasotoudeh.ir",
                    role: "Interactive Developer Portfolio ",
                    githublink: "Github.com/sinasotoudeh/portfolio",
                    text: "Designed and engineered a fully custom, high-performance portfolio application to demonstrate deep expertise in modern React ecosystems, advanced UI/UX principles, and complex web animations.",
                    points: [
                        "**Modern Architecture:** Architected a scalable front-end utilizing Next.js, TypeScript, and Tailwind CSS, strictly adhering to Component-Driven Development (CDD) and type safety.",
                        "**Advanced UI & Animations:** Engineered complex, hardware-accelerated micro-interactions, page transitions, and scroll-linked animations (using Framer Motion / GSAP), maintaining a flawless 60FPS rendering performance across all breakpoints.",
                        "**Performance & Technical SEO:** Optimized Core Web Vitals through aggressive image/font optimization, dynamic rendering, and automated JSON-LD structured data, achieving a near-perfect 100/100 Lighthouse score."

                    ],
                    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion/GSAP", "Technical SEO"]
                }
            },
            {
                id: "bibliograph",
                title: "BiblioGraph AI",
                hideTitle: true,

                content: {
                    name: "BiblioGraph AI",
                    role: "Distributed Bibliographic Platform",
                    githublink: "Github.com/sinasotoudeh/bibliograph",
                    text: "A scalable microservices monorepo designed for scraping, normalizing, and serving Persian bibliographic data.",
                    points: [
                        "**Polyglot Architecture & Messaging:** Orchestrated a Turborepo monorepo containing a stateless Auth Service (Go) and an asynchronous scraping pipeline (Python/FastAPI) powered by Celery and RabbitMQ.",
                        "**Data Strategy & Observability:** Engineered a multi-database architecture (PostgreSQL, MongoDB, Elasticsearch) and implemented a complete observability stack from scratch using Prometheus, Grafana, and Loki.",
                        "**DevOps & Security:** Containerized the infrastructure using Docker Compose with multi-stage builds, implementing JWT-based RBAC and strict network isolation."

                    ],
                    techStack: ["Go", "Python (FastAPI, Celery)", "PostgreSQL", "MongoDB", "Redis", "RabbitMQ", "Docker", "Prometheus", "Microservices Architecture"]
                }
            }
        ]
    },
    {
        id: "education",
        title: "Education & Certs",
        subSections: [
            {
                id: "academic",
                title: "Academic Background",
                content: [
                    { title: "Master of Arts in Latin American Studies", desc: "University of Tehran | Tehran, Iran | 2022 - 2024" },
                    { title: "Bachelor of Arts in Spanish Language and Literature", desc: "University of Tehran | Tehran, Iran | 2018 - 2022" }
                ]
            },
            {
                id: "certifications",
                title: "Professional Certifications",
                content: [
                    { title: "Google Digital Marketing & E-commerce", desc: "Professional Certificate – Coursera, 2025" },
                    { title: "Google Data Analytics", desc: "Professional Certificate – Coursera, 2025" },
                    { title: "Microsoft Power BI Data Analyst", desc: "Professional Certificate – Coursera, 2025" }
                ]
            }
        ]
    }
];
