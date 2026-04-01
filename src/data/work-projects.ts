// src/data/work-projects.ts

export interface Highlight {
    type: 'stat' | 'badge' | 'btn-ghost' | 'tooltip';
    label?: string;
    value?: string;
    text?: string;
    pos: {
        top?: string;
        bottom?: string;
        left?: string;
        right?: string;
    };
}

export interface Feature {
    id: string;
    title: string;
    desc: string;
    image: string;
    highlights: Highlight[];
}

export interface Project {
    id: string;
    title: string;
    generalDesc: string;
    tags: string[];
    features: Feature[];
}

export interface FlatFeature extends Feature {
    projectTitle: string;
    projectId: string;
    globalIndex: number;
}

export const PROJECTS_DATA: Project[] = [
    {
        id: 'foladmarket',
        title: 'FoladMarket',
        generalDesc: 'Designing the brand identity and integrated B2B steel platform. Equipped with specialized weight and price calculators, a real-time inquiry system, and an automatic price update engine.',
        tags: ['Brand Identity', 'B2B Platform', 'Complex Tools', 'Real-time Data'],
        features: [
            {
                id: 'fm-1',
                title: 'B2B Price Inquiry System',
                desc: 'Optimized user flow for submitting requests and receiving metal price inquiries in a fraction of a second.',
                image: '/images/work/folad-1.png', // If there is no image, a CSS gradient will be used as a fallback
                highlights: [
                    { type: 'stat', label: 'Inquiry Time', value: '-60%', pos: { top: '10%', left: '5%' } },
                    { type: 'badge', text: 'Real-time API', pos: { bottom: '15%', right: '5%' } },
                ]
            },
            {
                id: 'fm-2',
                title: 'Specialized Weight & Price Calculators',
                desc: 'Engineering tools for precise calculation of steel profile weights using complex formulas.',
                image: '/images/work/folad-2.png',
                highlights: [
                    { type: 'tooltip', text: 'Standard DIN Formulas', pos: { top: '40%', right: '-5%' } },
                ]
            },
            {
                id: 'fm-3',
                title: 'Automated Price Update System',
                desc: 'Management dashboard and automated price synchronization system with the global market.',
                image: '/images/work/folad-3.png',
                highlights: [
                    { type: 'stat', label: 'Update Rate', value: 'Live', pos: { bottom: '10%', left: '10%' } },
                ]
            }
        ]
    },
    {
        id: 'sadrhub',
        title: 'SadrHub',
        generalDesc: 'Comprehensive store builder service. Complete UI/UX design including an advanced management panel, secure login pages, and an integrated, engaging website creation flow.',
        tags: ['SaaS UI/UX', 'Dashboard', 'Website Builder', 'User Flow'],
        features: [
            {
                id: 'sh-1',
                title: 'Website Creation Flow (Onboarding)',
                desc: 'Interactive, step-by-step process enabling everyday users to easily create an online store.',
                image: '/images/work/sadr-1.png',
                highlights: [
                    { type: 'badge', text: '3 Clicks to Build', pos: { top: '20%', right: '10%' } },
                ]
            },
            {
                id: 'sh-2',
                title: 'Integrated Management Panel',
                desc: 'Comprehensive dashboard for managing products, orders, and financial reporting.',
                image: '/images/work/sadr-2.png',
                highlights: [
                    { type: 'stat', label: 'User Satisfaction', value: '98%', pos: { bottom: '25%', left: '-5%' } },
                ]
            },
            {
                id: 'sh-3',
                title: 'Smart Authentication System',
                desc: 'Highly secure login and registration pages with a seamless, frictionless user experience.',
                image: '/images/work/sadr-3.png',
                highlights: [
                    { type: 'badge', text: 'SSO Integration', pos: { top: '15%', left: '15%' } },
                ]
            }
        ]
    },
    {
        id: 'autodm',
        title: 'AutoDM',
        generalDesc: 'Visual identity design and modern features for an automation platform. Includes an interactive simulator, user panel mocks, and an automated chatbot system.',
        tags: ['Visual Identity', 'Automation', 'Interactive Mocks', 'Chatbot'],
        features: [
            {
                id: 'ad-1',
                title: 'Visual Identity & Design System',
                desc: 'Creation of a modern visual language, custom typography, and a cybernetic color palette.',
                image: '/images/work/auto-1.png',
                highlights: [
                    { type: 'tooltip', text: 'Design System V2.0', pos: { top: '30%', left: '-8%' } },
                ]
            },
            {
                id: 'ad-2',
                title: 'Interactive Simulator',
                desc: 'An environment to test Direct Message automation scenarios prior to publishing.',
                image: '/images/work/auto-2.png',
                highlights: [
                    { type: 'badge', text: 'Interactive Demo', pos: { bottom: '10%', right: '15%' } },
                    { type: 'stat', label: 'Simulation Accuracy', value: '100%', pos: { top: '10%', left: '10%' } },
                ]
            },
            {
                id: 'ad-3',
                title: 'Automated Chatbot Flow Design',
                desc: 'Drag & Drop user interface for building and visualizing the chatbot conversation tree.',
                image: '/images/work/auto-3.png',
                highlights: [
                    { type: 'badge', text: 'Node-based Editor', pos: { bottom: '40%', right: '-10%' } },
                ]
            }
        ]
    }
];

// Adding a global index for more accurate mathematical calculations
export const ALL_FEATURES: FlatFeature[] = PROJECTS_DATA.flatMap((p: Project, pIndex) =>
    p.features.map((f: Feature) => ({ ...f, projectTitle: p.title, projectId: p.id }))
).map((f, index) => ({ ...f, globalIndex: index }));

export const TOTAL_FEATURES = ALL_FEATURES.length;
