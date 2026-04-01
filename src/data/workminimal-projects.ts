// src/data/workminimal-projects.ts

export interface Annotation {
    id: string;
    x: string;
    y: string;
    title: string;
    description: string;
    lineDirection: 'left' | 'right' | 'top' | 'bottom';
}

export interface Project {
    id: string;
    title: string;
    generalDesc: string;
    tags: string[];
    image: string;
    coverImage?: string;
    annotations: Annotation[];
}

export const PROJECTS_DATA: Project[] = [
    {
        id: 'foladmarket',
        title: 'FoladMarket',
        generalDesc: 'Designing the brand identity and integrated B2B steel platform. Equipped with specialized weight and price calculators, a real-time inquiry system, and an automatic price update engine.',
        tags: ['Brand Identity', 'B2B Platform', 'Complex Tools', 'Real-time Data'],
        image: '/images/work/folad-main.png',
        coverImage: '/images/work/folad-blur.png',
        annotations: [
            {
                id: 'fm-anno-1',
                x: '25%',
                y: '30%',
                title: 'B2B Price Inquiry',
                description: 'Optimized user flow for metal price inquiries. Reduces inquiry time by 60% using a Real-time API.',
                lineDirection: 'left'
            },
            {
                id: 'fm-anno-2',
                x: '70%',
                y: '45%',
                title: 'Specialized Calculators',
                description: 'Engineering tools for precise calculation of steel profile weights utilizing standard DIN formulas.',
                lineDirection: 'right'
            },
            {
                id: 'fm-anno-3',
                x: '40%',
                y: '80%',
                title: 'Automated Price Engine',
                description: 'Management dashboard ensuring Live market synchronization and automated global price updates.',
                lineDirection: 'bottom'
            }
        ]
    },
    {
        id: 'sadrhub',
        title: 'SadrHub',
        generalDesc: 'Comprehensive store builder service. Complete UI/UX design including an advanced management panel, secure login pages, and an integrated, engaging website creation flow.',
        tags: ['SaaS UI/UX', 'Dashboard', 'Website Builder', 'User Flow'],
        image: '/images/work/sadr-main.png',
        coverImage: '/images/work/sadr-blur.png',
        annotations: [
            {
                id: 'sh-anno-1',
                x: '20%',
                y: '25%',
                title: 'Onboarding Flow',
                description: 'Interactive, step-by-step process enabling everyday users to build an online store in just 3 clicks.',
                lineDirection: 'left'
            },
            {
                id: 'sh-anno-2',
                x: '75%',
                y: '55%',
                title: 'Integrated Dashboard',
                description: 'Comprehensive panel for managing products, orders, and finances, achieving a 98% user satisfaction rate.',
                lineDirection: 'right'
            },
            {
                id: 'sh-anno-3',
                x: '50%',
                y: '20%',
                title: 'Smart Authentication',
                description: 'Highly secure SSO integrated login system providing a frictionless user experience.',
                lineDirection: 'top'
            }
        ]
    },
    {
        id: 'autodm',
        title: 'AutoDM',
        generalDesc: 'Visual identity design and modern features for an automation platform. Includes an interactive simulator, user panel mocks, and an automated chatbot system.',
        tags: ['Visual Identity', 'Automation', 'Interactive Mocks', 'Chatbot'],
        image: '/images/work/auto-main.png',
        coverImage: '/images/work/auto-blur.png',
        annotations: [
            {
                id: 'ad-anno-1',
                x: '18%',
                y: '40%',
                title: 'Design System V2.0',
                description: 'Creation of a modern visual language, custom typography, and a cybernetic color palette.',
                lineDirection: 'left'
            },
            {
                id: 'ad-anno-2',
                x: '80%',
                y: '35%',
                title: 'Interactive Simulator',
                description: 'Live environment to test Direct Message scenarios prior to publishing, ensuring 100% accuracy.',
                lineDirection: 'right'
            },
            {
                id: 'ad-anno-3',
                x: '65%',
                y: '75%',
                title: 'Node-based Editor',
                description: 'Drag & Drop user interface for building, editing, and visualizing the automated chatbot conversation tree.',
                lineDirection: 'right'
            }
        ]
    }
];
