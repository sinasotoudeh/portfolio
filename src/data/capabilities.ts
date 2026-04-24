// A:\NEXT\Development\Projects\nonato\src\data\capabilities.ts

export interface Capability {
    id: number;
    number: string;
    title: string;
    desc: string;
    tags: string[];
    color: string;
    icon: string;
}

export const CAPABILITIES: Capability[] = [
    {
        id: 0,
        number: "01",
        title: "Brand Architecture",
        desc: "I build brand systems that think, breathe and evolve — from verbal identity to living design language.",
        tags: ["Visual Identity", "Typography", "Color Systems"],
        color: "#c8a97e", // var(--accent-gold)
        icon: "brand"
    },
    {
        id: 1,
        number: "02",
        title: "Experience Design",
        desc: "I design intuitive user journeys based on real human behavior, crafting digital experiences that feel natural, accessible, and effortless for your audience.",
        tags: ["UX Research", "Information Arch", "Prototyping"],
        color: "#4fc3f7", // var(--accent-secondary)
        icon: "ux"
    },
    {
        id: 2,
        number: "03",
        title: "Motion & Interaction",
        desc: "Physics-based choreography that blurs the boundary between interface and reality.",
        tags: ["Micro-interactions", "3D / WebGL", "Animation"],
        color: "#a78bfa", // var(--accent-primary)
        icon: "motion"
    },
    {
        id: 3,
        number: "04",
        title: "Web Engineering",
        desc: "I write clean, highly performant code bridging design intent to a flawless, pixel-perfect digital reality.",
        tags: ["Performance", "Accessibility", "No-framework"],
        color: "#f472b6", // var(--accent-rose)
        icon: "web"
    },
    {
        id: 4,
        number: "05",
        title: "Digital Strategy",
        desc: "Combining technical insight with your business goals. I help define a strategic roadmap that ensures your product stands out and is built for sustainable growth.",
        tags: ["Market Research", "Positioning", "Growth"],
        color: "#34d399", // var(--accent-emerald)
        icon: "strategy"
    },
    {
        id: 5,
        number: "06",
        title: "Spatial & AR",
        desc: "I like pushing the boundaries of the traditional screen — AR, spatial computing, and the interfaces of tomorrow.",
        tags: ["AR Interfaces", "Spatial UI", "3D Environments"],
        color: "#fbbf24", // yellow/amber
        icon: "spatial"
    }
];
