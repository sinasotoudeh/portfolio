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
        desc: "We build brand systems that think, breathe and evolve — from verbal identity to living design language.",
        tags: ["Visual Identity", "Typography", "Color Systems"],
        color: "#c8a97e", // var(--accent-gold)
        icon: "brand"
    },
    {
        id: 1,
        number: "02",
        title: "Experience Design",
        desc: "We map human behaviour with surgical precision, then design flows that feel like thinking.",
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
        desc: "We write code like poetry — clean, performant, alive — bridging design intent to pixel-perfect reality.",
        tags: ["Performance", "Accessibility", "No-framework"],
        color: "#f472b6", // var(--accent-rose)
        icon: "web"
    },
    {
        id: 4,
        number: "05",
        title: "Digital Strategy",
        desc: "Data + intuition + vision. We see where brands need to be before they do.",
        tags: ["Market Research", "Positioning", "Growth"],
        color: "#34d399", // var(--accent-emerald)
        icon: "strategy"
    },
    {
        id: 5,
        number: "06",
        title: "Spatial & AR",
        desc: "We design for dimensions beyond the screen — AR, spatial computing, and the interfaces of tomorrow.",
        tags: ["AR Interfaces", "Spatial UI", "3D Environments"],
        color: "#fbbf24", // yellow/amber
        icon: "spatial"
    }
];
