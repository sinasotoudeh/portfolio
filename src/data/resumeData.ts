// src/data/resumeData.ts
import React from "react";

export type CardContent = {
    title: string;
    desc: string;
    icon?: React.ReactNode | string;
    badge?: string;
};

export type SubSection = {
    id: string;
    title: string;
    content: React.ReactNode | any;
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
                background: "url('/images/Process/build/mechanical-gear.png')",

                content: {
                    name: "Sina Sotoudeh",
                    role: "Front-End Developer & Technical SEO Engineer",
                    contacts: ["s.sotudeh1@gmail.com", "+989027405145", "Tehran, Iran"],
                    links: ["linkedin.com/in/sina-sotoudeh", "Github.com/sinso", "Sinso.ir"],
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
                id: "sadr",
                title: "Sadr Andishan Novin",
                hideTitle: true,
                content: {
                    name: "Sadr Andishan Novin",
                    role: "Senior Technical SEO Engineer",
                    date: "2024 - Present | Tehran, Iran",
                    text: "Led technical SEO for enterprise marketplace and headless e-commerce migration platform.",
                    points: [
                        "Architected SEO infrastructure for marketplace with 200K+ products across 500+ merchants; built automated schema generation system for 50K+ pages.",
                        "Developed Edge SEO solution using Cloudflare Workers improving TTFB by ~400ms; created real-time monitoring dashboard reducing incident response from 36 hours to 15 minutes."
                    ]
                }
            },
            {
                id: "atajoy",
                title: "Atajoy",
                hideTitle: true,

                content: {
                    name: "Atajoy",
                    role: "Technical SEO Engineer",
                    date: "2023 - 2024 | Tehran, Iran",
                    points: [
                        "Managed technical SEO for 15+ WooCommerce stores generating 800K+ monthly sessions.",
                        "Built Python/Screaming Frog automation pipeline identifying and resolving 1,800+ critical errors; engineered a BigQuery-based log analysis system that reduced wasted crawls by 51% by identifying low-value and duplicate URL patterns.",
                        "Created custom WordPress plugin framework automating technical SEO across portfolio; implemented performance optimization reducing load time by 2.4s and improving Core Web Vitals pass rate from 23% to 78%.",
                        "Established monitoring system integrating GSC API, GA4, and crawl metrics; competitive analysis system tracking 5K+ keywords generated 95K+ incremental sessions."
                    ]
                }
            },
            {
                id: "steel_center",
                title: "Steel Center",
                hideTitle: true,

                content: {
                    name: "Steel Center",
                    role: "Technical SEO Specialist & Web Developer",
                    date: "2022 - 2023 | Tehran, Iran",
                    text: "Full-stack Developer & Technical SEO Engineer — owning the entire digital platform.",
                    points: [
                        "Architected custom web platform with SEO-first SSR architecture and comprehensive structured data implementation.",
                        "Implemented performance engineering achieving 90th percentile Core Web Vitals; developed faceted navigation with SEO-friendly canonicals improving crawl efficiency by 62%."
                    ]
                }
            }
        ]
    },
    {
        id: "projects",
        title: "Projects",
        subSections: [
            {
                id: "ai_seo_workflow",
                title: "AI-Powered SEO System",
                hideTitle: true,

                content: {
                    name: "AI-Powered SEO Workflow System",
                    role: "Personal Project",
                    text: "Designed multi-agent AI system orchestrating Claude 4.5 Sonnet, GPT-5, and Gemini 3 for automated SEO research, content analysis, and schema generation. Built Python orchestration layer with human-in-the-loop validation workflow, reducing manual research time by 70% across keyword analysis, competitor research, and structured data implementation."
                }
            },
            {
                id: "latam_thesis",
                title: "Data Platform Architecture",
                hideTitle: true,

                content: {
                    name: "Latin American Literature Bibliography Research Platform",
                    role: "Thesis Project",
                    text: "Designed and owned a microservices-based data platform with distributed scraping, API-driven ingestion, and multi-stage processing pipelines. Implemented scalable async workflows using Celery, RabbitMQ, Redis, and Docker (Linux & Windows), with monitoring via Prometheus and Grafana. Built a Go-based authentication layer and documented relational APIs (Prisma, Swagger), enabling secure, extensible data access and analysis."
                }
            },
            {
                id: "mapping_system",
                title: "Cross-Platform Mapping",
                hideTitle: true,

                content: {
                    name: "Cross-Platform Mapping & Localization System",
                    role: "Personal Project (Baidu → Open Maps)",
                    text: "Built a Dockerized Playwright-based web system to extract and rank nearby locations from Baidu Maps using user location and keyword inputs. Implemented coordinate transformation logic to convert Baidu map data into Google Maps and OpenStreetMap-compatible formats. Delivered an English-language web application with translated location data, allowing map usage without reliance on Chinese platforms."
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
