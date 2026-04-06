// data/processData.ts

export type ImageConfig = {
    top: number;    // فاصله از بالا بر اساس درصد (0 تا 100)
    right: number;  // فاصله از راست بر اساس درصد (0 تا 100 - ترجیحا زیر 45 تا روی متن نیاید)
    scale: number;  // مقیاس عکس (1 اندازه پایه، کمتر از 1 کوچکتر، بیشتر از 1 بزرگتر)
    delay?: number; // تاخیر اختصاصی برای ورود
    priority: 1 | 2 | 3; // 1: Mobile+, 2: Tablet+, 3: Desktop only
    mobileOverride?: {
        top?: number;
        right?: number;
        scale?: number;
    };
};

export type ProcessImage = {
    src: string;
    alt: string;
    config: ImageConfig;
};

export type ProcessNode = {
    id: string;
    title: string;
    description: string;
    bgColor: string;
    textColor: string;
    images: ProcessImage[];
};

export const processNodes: ProcessNode[] = [
    {
        id: '01',
        title: 'Discover',
        description: 'We immerse in your world — stakeholder interviews, competitive landscape, cultural context — until we see what others miss.',
        bgColor: '#FF3366',
        textColor: '#000000',
        images: [
            { src: '/images/Process/discover/binoculars.png', alt: 'Looking closely to find hidden gems!', config: { priority: 1, top: 12, right: 15, scale: 1.2, delay: 0.1, mobileOverride: { top: 60, right: 15, scale: 1.1 } } },
            { src: '/images/Process/discover/checked-form.png', alt: 'Ticking off project goals.', config: { priority: 2, top: 35, right: 30, scale: 0.9, delay: 0.2 } },
            { src: '/images/Process/discover/heat-map.png', alt: 'Tracking user behavior with heatmaps.', config: { priority: 1, top: 65, right: 25, scale: 1.1, delay: 0.3, mobileOverride: { top: 75, right: 65, scale: 0.9 } } },
            { src: '/images/Process/discover/ID-card.png', alt: 'Understanding the user persona.', config: { priority: 3, top: 80, right: 10, scale: 0.8, delay: 0.4 } },
            { src: '/images/Process/discover/logos-Dovetail.png', alt: 'Dovetail - Organizing research data.', config: { priority: 2, top: 20, right: 40, scale: 0.7, delay: 0.15 } },
            { src: '/images/Process/discover/logos-FigJam.png', alt: 'FigJam - Team brainstorming.', config: { priority: 1, top: 45, right: 10, scale: 1.0, delay: 0.25, mobileOverride: { top: 55, right: 40, scale: 1.0 } } },
            { src: '/images/Process/discover/logos-Google Analytics.png', alt: 'Google Analytics - Data never lies!', config: { priority: 3, top: 55, right: 45, scale: 0.85, delay: 0.35 } },
            { src: '/images/Process/discover/logos-Hotjar.png', alt: 'Hotjar - Watching real user journeys.', config: { priority: 2, top: 10, right: 25, scale: 0.95, delay: 0.05 } },
            { src: '/images/Process/discover/logos-Maze.png', alt: 'Maze - Rapid testing and validation.', config: { priority: 3, top: 75, right: 35, scale: 0.8, delay: 0.45 } },
            { src: '/images/Process/discover/logos-Microsoft-Clarity.png', alt: 'Clarity - Analyzing user interactions.', config: { priority: 2, top: 28, right: 8, scale: 1.05, delay: 0.12 } },
            { src: '/images/Process/discover/logos-Miro-2.png', alt: 'Miro - Our infinite whiteboard.', config: { priority: 1, top: 50, right: 20, scale: 1.3, delay: 0.22, mobileOverride: { top: 88, right: 20, scale: 1.1 } } },
            { src: '/images/Process/discover/logos-Miro.png', alt: 'Miro - Where ideas take shape.', config: { priority: 3, top: 85, right: 22, scale: 0.75, delay: 0.32 } },
            { src: '/images/Process/discover/logos-SurveyMonkey.png', alt: 'SurveyMonkey - Targeted Q&A.', config: { priority: 2, top: 18, right: 35, scale: 0.9, delay: 0.18 } },
            { src: '/images/Process/discover/logos_Typeform.png', alt: 'Typeform - Beautiful, interactive forms.', config: { priority: 3, top: 60, right: 5, scale: 1.15, delay: 0.28 } },
            { src: '/images/Process/discover/magnifying-glass.png', alt: 'Magnifying user pain points!', config: { priority: 1, top: 40, right: 38, scale: 1.4, delay: 0.38, mobileOverride: { top: 85, right: 75, scale: 1.2 } } },
            { src: '/images/Process/discover/mind-map.png', alt: 'Mind mapping our thoughts.', config: { priority: 2, top: 5, right: 18, scale: 0.85, delay: 0.08 } },
            { src: '/images/Process/discover/navigational-compass.png', alt: 'Project compass - guiding the way.', config: { priority: 3, top: 70, right: 42, scale: 1.25, delay: 0.42 } },
            { src: '/images/Process/discover/sticky-notes-1.png', alt: 'Colorful notes full of ideas.', config: { priority: 2, top: 32, right: 18, scale: 0.95, delay: 0.14 } },
            { src: '/images/Process/discover/sticky-notes-2.png', alt: 'Brainstorming with sticky notes.', config: { priority: 3, top: 88, right: 30, scale: 0.7, delay: 0.48 } },
            { src: '/images/Process/discover/survey-form.png', alt: 'Crafting precise user surveys.', config: { priority: 2, top: 52, right: 32, scale: 1.0, delay: 0.24 } },
            { src: '/images/Process/discover/user-research.png', alt: 'Deep diving into user interviews.', config: { priority: 1, top: 15, right: 5, scale: 1.1, delay: 0.06, mobileOverride: { top: 68, right: 45, scale: 1.0 } } },
            { src: '/images/Process/discover/whiteboard.png', alt: 'A blank canvas for starting out.', config: { priority: 3, top: 78, right: 15, scale: 0.88, delay: 0.36 } }
        ]
    },
    {
        id: '02',
        title: 'Define',
        description: 'From chaos, we extract clarity. We define the north star — the single truth that will guide every decision forward.',
        bgColor: '#00FFCC',
        textColor: '#000000',
        images: [
            { src: '/images/Process/define/bullseye-target.png', alt: 'Hitting the golden target!', config: { priority: 1, top: 10, right: 20, scale: 1.3, delay: 0.1, mobileOverride: { top: 55, right: 15, scale: 1.1 } } },
            { src: '/images/Process/define/calender.png', alt: 'Scheduling and project planning.', config: { priority: 3, top: 30, right: 40, scale: 0.9, delay: 0.2 } },
            { src: '/images/Process/define/chess-knight.png', alt: 'Smart strategies and bold moves!', config: { priority: 1, top: 60, right: 15, scale: 1.1, delay: 0.3, mobileOverride: { top: 85, right: 70, scale: 1.0 } } },
            { src: '/images/Process/define/documentation.png', alt: 'Documenting everything precisely.', config: { priority: 3, top: 85, right: 35, scale: 0.8, delay: 0.4 } },
            { src: '/images/Process/define/exclamation-mark.png', alt: 'Spotting the crucial details.', config: { priority: 2, top: 20, right: 10, scale: 1.0, delay: 0.15 } },
            { src: '/images/Process/define/filtering-funnel.png', alt: 'Filtering ideas down to the best.', config: { priority: 1, top: 45, right: 25, scale: 1.2, delay: 0.25, mobileOverride: { top: 70, right: 45, scale: 1.1 } } },
            { src: '/images/Process/define/flowchart-diagram.png', alt: 'Designing clear logical flows.', config: { priority: 3, top: 75, right: 5, scale: 0.85, delay: 0.35 } },
            { src: '/images/Process/define/logos-Asana.png', alt: 'Asana - Joyful task management.', config: { priority: 2, top: 15, right: 30, scale: 0.75, delay: 0.05 } },
            { src: '/images/Process/define/logos-Confluence.png', alt: 'Confluence - The team knowledge base.', config: { priority: 3, top: 50, right: 45, scale: 0.95, delay: 0.45 } },
            { src: '/images/Process/define/logos-Jira.png', alt: 'Jira - Precise issue tracking.', config: { priority: 2, top: 35, right: 12, scale: 1.05, delay: 0.12 } },
            { src: '/images/Process/define/logos-Linear.png', alt: 'Linear - Lightning-fast product management.', config: { priority: 1, top: 65, right: 30, scale: 1.15, delay: 0.22, mobileOverride: { top: 88, right: 25, scale: 1.0 } } },
            { src: '/images/Process/define/logos-Lucidchart.png', alt: 'Lucidchart - Drawing clear diagrams.', config: { priority: 3, top: 5, right: 15, scale: 0.8, delay: 0.32 } },
            { src: '/images/Process/define/logos-Notion.png', alt: 'Notion - Our team second brain!', config: { priority: 1, top: 80, right: 22, scale: 1.25, delay: 0.18, mobileOverride: { top: 60, right: 75, scale: 1.1 } } },
            { src: '/images/Process/define/logos-Slack.png', alt: 'Slack - Seamless team communication.', config: { priority: 2, top: 25, right: 35, scale: 0.9, delay: 0.28 } },
            { src: '/images/Process/define/logos-Whimsical.png', alt: 'Whimsical - Rapid visual ideation.', config: { priority: 3, top: 55, right: 8, scale: 1.0, delay: 0.38 } },
            { src: '/images/Process/define/logos_26.png', alt: 'Handy auxiliary tools.', config: { priority: 3, top: 40, right: 20, scale: 0.85, delay: 0.08 } },
            { src: '/images/Process/define/mind-book.png', alt: 'The rulebook and definitions.', config: { priority: 3, top: 70, right: 40, scale: 1.1, delay: 0.42 } },
            { src: '/images/Process/define/Moleskine-notebook.png', alt: 'Strategy notebook.', config: { priority: 2, top: 18, right: 5, scale: 0.95, delay: 0.14 } },
            { src: '/images/Process/define/North-Star.png', alt: 'The North Star - Our guiding light!', config: { priority: 1, top: 88, right: 15, scale: 1.4, delay: 0.48, mobileOverride: { top: 75, right: 15, scale: 1.2 } } },
            { src: '/images/Process/define/task-management.png', alt: 'Organizing and managing tasks.', config: { priority: 2, top: 48, right: 32, scale: 0.7, delay: 0.24 } },
            { src: '/images/Process/define/Venn-diagram.png', alt: 'Finding the sweet spot of needs.', config: { priority: 2, top: 32, right: 28, scale: 1.05, delay: 0.36 } }
        ]
    },
    {
        id: '03',
        title: 'Design',
        description: 'This is where intuition meets craft. We prototype at the speed of thought — 3D, motion, typography, colour.',
        bgColor: '#E6FF00',
        textColor: '#000000',
        images: [
            { src: '/images/Process/design/bezier-curves.png', alt: 'Drawing flawless curves.', config: { priority: 1, top: 15, right: 25, scale: 1.1, delay: 0.1, mobileOverride: { top: 58, right: 75, scale: 1.0 } } },
            { src: '/images/Process/design/Figma-logo.png', alt: 'Figma - Our main design playground!', config: { priority: 1, top: 40, right: 15, scale: 1.3, delay: 0.2, mobileOverride: { top: 70, right: 15, scale: 1.2 } } },
            { src: '/images/Process/design/geometric shape.png', alt: 'Mixing forms and geometry in design.', config: { priority: 2, top: 70, right: 35, scale: 0.9, delay: 0.3 } },
            { src: '/images/Process/design/logos-Adobe-Illustrator.png', alt: 'Illustrator - Crafting magical vectors.', config: { priority: 2, top: 25, right: 5, scale: 1.0, delay: 0.4 } },
            { src: '/images/Process/design/logos-After-Effects.png', alt: 'After Effects - Bringing visuals to life.', config: { priority: 3, top: 55, right: 45, scale: 0.85, delay: 0.15 } },
            { src: '/images/Process/design/logos-Blender.png', alt: 'Blender - Entering the 3D world.', config: { priority: 3, top: 10, right: 40, scale: 1.2, delay: 0.25 } },
            { src: '/images/Process/design/logos-figma.png', alt: 'Figma - Collaborative design.', config: { priority: 3, top: 80, right: 10, scale: 0.8, delay: 0.35 } },
            { src: '/images/Process/design/logos-LottieFiles.png', alt: 'Lottie - Smooth, lightweight animations.', config: { priority: 2, top: 35, right: 30, scale: 1.05, delay: 0.05 } },
            { src: '/images/Process/design/logos-Principle.png', alt: 'Principle - Engaging interactive prototypes.', config: { priority: 3, top: 65, right: 20, scale: 0.95, delay: 0.45 } },
            { src: '/images/Process/design/logos-ProtoPie.png', alt: 'ProtoPie - Advanced interaction simulation.', config: { priority: 3, top: 5, right: 15, scale: 0.75, delay: 0.12 } },
            { src: '/images/Process/design/logos-Spline.png', alt: 'Spline - Web-based 3D design.', config: { priority: 1, top: 45, right: 8, scale: 1.15, delay: 0.22, mobileOverride: { top: 85, right: 40, scale: 1.0 } } },
            { src: '/images/Process/design/logos-UI-UX.png', alt: 'Focusing on unparalleled user experience.', config: { priority: 2, top: 85, right: 28, scale: 1.0, delay: 0.32 } },
            { src: '/images/Process/design/logos-Zeplin.png', alt: 'Zeplin - Bridging design and code.', config: { priority: 3, top: 20, right: 35, scale: 0.9, delay: 0.18 } },
            { src: '/images/Process/design/magic-wand.png', alt: 'The designer magic wand!', config: { priority: 1, top: 50, right: 25, scale: 1.25, delay: 0.28, mobileOverride: { top: 60, right: 45, scale: 1.1 } } },
            { src: '/images/Process/design/motion-design.png', alt: 'Crafting buttery smooth motions.', config: { priority: 1, top: 75, right: 42, scale: 0.85, delay: 0.38, mobileOverride: { top: 88, right: 75, scale: 0.9 } } },
            { src: '/images/Process/design/Pantone-color-swatch.png', alt: 'Gorgeous Pantone color palettes.', config: { priority: 2, top: 30, right: 10, scale: 1.1, delay: 0.08 } },
            { src: '/images/Process/design/stylus-pen.png', alt: 'Digital pen for crafting masterpieces.', config: { priority: 3, top: 60, right: 38, scale: 0.95, delay: 0.42 } },
            { src: '/images/Process/design/typography-block.png', alt: 'Obsessing over typography and fonts.', config: { priority: 2, top: 12, right: 20, scale: 1.05, delay: 0.14 } },
            { src: '/images/Process/design/wireframe-layout.png', alt: 'Wireframing the core structure.', config: { priority: 1, top: 88, right: 15, scale: 1.2, delay: 0.36, mobileOverride: { top: 75, right: 20, scale: 1.1 } } }
        ]
    },
    {
        id: '04',
        title: 'Build',
        description: 'We engineer our designs with the same obsession as we design them. Every animation frame. Every breakpoint.',
        bgColor: '#FF3300',
        textColor: '#FFFFFF',
        images: [
            { src: '/images/Process/build/bug-prohibition.png', alt: 'Bugs are strictly prohibited!', config: { priority: 1, top: 10, right: 15, scale: 1.1, delay: 0.1, mobileOverride: { top: 55, right: 75, scale: 1.0 } } },
            { src: '/images/Process/build/code-editor.png', alt: 'Code editor - where the magic happens.', config: { priority: 1, top: 35, right: 35, scale: 1.3, delay: 0.2, mobileOverride: { top: 65, right: 15, scale: 1.1 } } },
            { src: '/images/Process/build/logos-Docker.png', alt: 'Docker - Secure and stable containers.', config: { priority: 2, top: 65, right: 10, scale: 0.9, delay: 0.3 } },
            { src: '/images/Process/build/logos-GitHub.png', alt: 'GitHub - The safe home for our code.', config: { priority: 2, top: 20, right: 25, scale: 1.0, delay: 0.4 } },
            { src: '/images/Process/build/logos-GitLab.png', alt: 'GitLab - Seamless development integration.', config: { priority: 3, top: 80, right: 40, scale: 0.85, delay: 0.15 } },
            { src: '/images/Process/build/logos-Next.png', alt: 'Next.js - Our fast and powerful framework!', config: { priority: 1, top: 50, right: 20, scale: 1.25, delay: 0.25, mobileOverride: { top: 85, right: 20, scale: 1.1 } } },
            { src: '/images/Process/build/logos-NPM.png', alt: 'NPM - An ocean of handy packages.', config: { priority: 3, top: 15, right: 45, scale: 0.8, delay: 0.35 } },
            { src: '/images/Process/build/logos-Postman.png', alt: 'Postman - Precise API testing.', config: { priority: 2, top: 45, right: 5, scale: 1.05, delay: 0.05 } },
            { src: '/images/Process/build/logos-WebStorm.png', alt: 'WebStorm - Professional JS coding.', config: { priority: 2, top: 75, right: 28, scale: 0.95, delay: 0.45 } },
            { src: '/images/Process/build/mechanical-gear.png', alt: 'The gears of software engineering.', config: { priority: 3, top: 5, right: 30, scale: 1.15, delay: 0.12 } },
            { src: '/images/Process/build/microchip.png', alt: 'Processing complex logic and code.', config: { priority: 3, top: 60, right: 42, scale: 0.75, delay: 0.22 } },
            { src: '/images/Process/build/React-logo.png', alt: 'React - Building lovely components.', config: { priority: 1, top: 25, right: 10, scale: 1.2, delay: 0.32, mobileOverride: { top: 75, right: 45, scale: 1.1 } } },
            { src: '/images/Process/build/server-stack.png', alt: 'Robust server infrastructure.', config: { priority: 3, top: 85, right: 18, scale: 1.0, delay: 0.18 } },
            { src: '/images/Process/build/software-container.png', alt: 'Isolating execution environments.', config: { priority: 2, top: 40, right: 28, scale: 0.9, delay: 0.28 } },
            { src: '/images/Process/build/syntax-tags.png', alt: 'Clean tags and perfect syntax.', config: { priority: 2, top: 70, right: 12, scale: 1.1, delay: 0.38 } },
            { src: '/images/Process/build/terminal-command.png', alt: 'Terminal - Talking directly to the system.', config: { priority: 3, top: 30, right: 40, scale: 0.85, delay: 0.08 } },
            { src: '/images/Process/build/version-control-branch.png', alt: 'Managing versions and clean branches.', config: { priority: 1, top: 55, right: 15, scale: 1.05, delay: 0.42, mobileOverride: { top: 88, right: 75, scale: 1.0 } } }
        ]
    },
    {
        id: '05',
        title: 'Launch',
        description: 'We don’t hand off. We launch together, measure obsessively, and iterate until the work exceeds the vision.',
        bgColor: '#CC00FF',
        textColor: '#FFFFFF',
        images: [
            { src: '/images/Process/launch/confetti-popper.png', alt: 'Launch party! Popping the confetti!', config: { priority: 1, top: 12, right: 20, scale: 1.2, delay: 0.1, mobileOverride: { top: 55, right: 15, scale: 1.1 } } },
            { src: '/images/Process/launch/Earth.png', alt: 'Ready to show the world.', config: { priority: 1, top: 45, right: 35, scale: 1.3, delay: 0.2, mobileOverride: { top: 70, right: 40, scale: 1.1 } } },
            { src: '/images/Process/launch/gear.png', alt: 'Final tweaks and optimization.', config: { priority: 2, top: 75, right: 10, scale: 0.9, delay: 0.3 } },
            { src: '/images/Process/launch/growth-chart.png', alt: 'Product growth and success chart.', config: { priority: 1, top: 25, right: 5, scale: 1.0, delay: 0.4, mobileOverride: { top: 85, right: 75, scale: 0.9 } } },
            { src: '/images/Process/launch/infinity-loop.png', alt: 'The infinite loop of continuous improvement.', config: { priority: 2, top: 60, right: 45, scale: 0.85, delay: 0.15 } },
            { src: '/images/Process/launch/logos-Amplitude.png', alt: 'Amplitude - Deep product analytics.', config: { priority: 2, top: 18, right: 40, scale: 1.1, delay: 0.25 } },
            { src: '/images/Process/launch/logos-cloud-deployment.png', alt: 'Deploying to the cloud.', config: { priority: 3, top: 85, right: 25, scale: 0.95, delay: 0.35 } },
            { src: '/images/Process/launch/logos-Lighthouse.png', alt: 'Lighthouse - Scoring 100 on performance!', config: { priority: 3, top: 35, right: 15, scale: 1.05, delay: 0.05 } },
            { src: '/images/Process/launch/logos-Mixpanel.png', alt: 'Mixpanel - Monitoring user interactions.', config: { priority: 2, top: 65, right: 30, scale: 1.15, delay: 0.45 } },
            { src: '/images/Process/launch/logos-Netlify.png', alt: 'Netlify - Fast and painless hosting.', config: { priority: 3, top: 5, right: 15, scale: 0.8, delay: 0.12 } },
            { src: '/images/Process/launch/logos-Play-Store.png', alt: 'Publishing to global stores.', config: { priority: 2, top: 50, right: 8, scale: 1.25, delay: 0.22 } },
            { src: '/images/Process/launch/logos-Product-Hunt.png', alt: 'Product Hunt - Hunt of the day!', config: { priority: 3, top: 80, right: 42, scale: 0.75, delay: 0.32 } },
            { src: '/images/Process/launch/logos-Sentry.png', alt: 'Sentry - Catching errors in real-time.', config: { priority: 2, top: 30, right: 28, scale: 0.9, delay: 0.18 } },
            { src: '/images/Process/launch/logos-Vercel.png', alt: 'Vercel - Deploying at top speed.', config: { priority: 3, top: 55, right: 20, scale: 1.0, delay: 0.28 } },
            { src: '/images/Process/launch/megaphone.png', alt: 'Telling everyone! The product is ready.', config: { priority: 1, top: 10, right: 30, scale: 1.1, delay: 0.38, mobileOverride: { top: 60, right: 75, scale: 1.0 } } },
            { src: '/images/Process/launch/Product-Hunt-badge.png', alt: 'Product Hunt badge of honor.', config: { priority: 3, top: 40, right: 40, scale: 0.85, delay: 0.08 } },
            { src: '/images/Process/launch/rocket.png', alt: 'Rocket ready for liftoff!', config: { priority: 1, top: 70, right: 18, scale: 1.35, delay: 0.42, mobileOverride: { top: 88, right: 20, scale: 1.2 } } },
            { src: '/images/Process/launch/Vercel-deployment.png', alt: 'Successful Vercel deployment.', config: { priority: 1, top: 22, right: 12, scale: 0.95, delay: 0.14, mobileOverride: { top: 75, right: 15, scale: 0.9 } } },
            { src: '/images/Process/launch/verified-checkmark.png', alt: 'Final approval and quality assurance.', config: { priority: 3, top: 88, right: 8, scale: 1.05, delay: 0.36 } }
        ]
    }
];
