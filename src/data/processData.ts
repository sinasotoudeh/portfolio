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
    zIndex?: number; // <--- این خط باید اضافه شود

};

export type ProcessImage = {
    src: string;
    width: number;  // intrinsic pixel size of the PNG (next/image)
    height: number;
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
        description: `Great products start with understanding.  I immerce in your world, aligning user needs with your business goals to find what others might miss.`,
        bgColor: '#FF3366',
        textColor: '#000000',
        images: [
            { src: '/images/Process/discover/binoculars.png', width: 338, height: 223, alt: 'Looking closely to find hidden gems!', config: { priority: 1, top: 16, right: 10, scale: 1.8, delay: 0.09, mobileOverride: { top: 55, right: 1, scale: 1.1 } } },
            { src: '/images/Process/discover/logos-Dovetail.png', width: 212, height: 197, alt: 'Ticking off project goals.', config: { priority: 2, top: 43, right: 27, scale: 0.9, delay: 0.15 } },
            { src: '/images/Process/discover/heat-map.png', width: 284, height: 205, alt: 'Tracking user behavior with heatmaps.', config: { priority: 1, top: 67, right: 25, scale: 1.1, delay: 0.31, mobileOverride: { top: 70, right: 65, scale: 0.9 } } },
            { src: '/images/Process/discover/ID-card.png', width: 291, height: 203, alt: 'Understanding the user persona.', config: { priority: 2, top: 80, right: 1, scale: 1.5, delay: 0.45 } },
            { src: '/images/Process/discover/checked-form.png', width: 213, height: 268, alt: 'Dovetail - Organizing research data.', config: { priority: 2, top: 12, right: 35, scale: 1.5, delay: 0.05 } },
            { src: '/images/Process/discover/logos-FigJam.png', width: 211, height: 197, alt: 'FigJam - Team brainstorming.', config: { priority: 2, top: 45, right: 5, scale: 1.0, delay: 0.29 } },
            { src: '/images/Process/discover/logos-Google-Analytics.png', width: 200, height: 182, alt: 'Google Analytics - Data never lies!', config: { priority: 3, top: 58, right: 48, scale: 1, delay: 0.19 } },
            { src: '/images/Process/discover/logos-Hotjar.png', width: 176, height: 182, alt: 'Hotjar - Watching real user journeys.', config: { priority: 2, top: 65, right: 10, scale: 0.95, delay: 0.35 } },
            { src: '/images/Process/discover/logos-Maze.png', width: 213, height: 197, alt: 'Maze - Rapid testing and validation.', config: { priority: 3, top: 75, right: 37, scale: 1, delay: 0.33 } },
            { src: '/images/Process/discover/logos-Microsoft-Clarity.png', width: 212, height: 182, alt: 'Clarity - Analyzing user interactions.', config: { priority: 2, top: 30, right: 3, scale: 1.05, delay: 0.21 } },
            { src: '/images/Process/discover/logos-Miro.png', width: 212, height: 197, alt: 'Miro - Where ideas take shape.', config: { priority: 2, top: 85, right: 28, scale: 1.5, delay: 0.39 } },
            { src: '/images/Process/discover/logos-SurveyMonkey.png', width: 226, height: 197, alt: 'SurveyMonkey - Targeted Q&A.', config: { priority: 2, top: 28, right: 25, scale: 1.2, delay: 0.07 } },
            { src: '/images/Process/discover/logos_Typeform.png', width: 184, height: 182, alt: 'Typeform - Beautiful, interactive forms.', config: { priority: 2, top: 60, right: 1, scale: 1.15, delay: 0.37 } },
            { src: '/images/Process/discover/magnifying-glass.png', width: 280, height: 205, alt: 'Magnifying user pain points!', config: { priority: 1, top: 40, right: 38, scale: 1.4, delay: 0.11, mobileOverride: { top: 85, right: 60, scale: 1.2 } } },
            { src: '/images/Process/discover/mind-map.png', width: 303, height: 205, alt: 'Mind mapping our thoughts.', config: { priority: 1, top: 52, right: 16, scale: 1.6, delay: 0.25, mobileOverride: { top: 80, right: 10, scale: 1.7 } } },
            { src: '/images/Process/discover/navigational-compass.png', width: 229, height: 177, alt: 'Project compass - guiding the way.', config: { priority: 2, top: 80, right: 55, scale: 1.8, delay: 0.27 } },
            { src: '/images/Process/discover/sticky-notes-1.png', width: 238, height: 177, alt: 'Colorful notes full of ideas.', config: { priority: 2, top: 33, right: 16, scale: 0.95, delay: 0.17 } },
            { src: '/images/Process/discover/sticky-notes-2.png', width: 241, height: 177, alt: 'Brainstorming with sticky notes.', config: { priority: 3, top: 85, right: 42, scale: 1.2, delay: 0.41 } },
            { src: '/images/Process/discover/survey-form.png', width: 303, height: 202, alt: 'Crafting precise user surveys.', config: { priority: 1, top: 55, right: 35, scale: 1.5, delay: 0.23, mobileOverride: { top: 45, right: 50, scale: 1.0 } } },
            { src: '/images/Process/discover/user-research.png', width: 226, height: 182, alt: 'Deep diving into user interviews.', config: { priority: 1, top: 15, right: 0, scale: 1.1, delay: 0.13, mobileOverride: { top: 60, right: 40, scale: 1.0 } } },
            { src: '/images/Process/discover/whiteboard.png', width: 227, height: 227, alt: 'A blank canvas for starting out.', config: { priority: 3, top: 78, right: 16, scale: 1.6, delay: 0.43 } }
        ]
    },
    {
        id: '02',
        title: 'Define',
        description: 'From chaos, I extract clarity. Together, We define the north star — the single truth that will guide every decision forward.',
        bgColor: '#00FFCC',
        textColor: '#000000',
        images: [
            { src: '/images/Process/define/chess-knight.png', width: 170, height: 263, alt: 'Smart strategies and bold moves!', config: { priority: 1, top: 60, right: 15, scale: 4, delay: 0.25, mobileOverride: { top: 73, right: 10, scale: 3 } } },
            { src: '/images/Process/define/exclamation-mark.png', width: 146, height: 269, alt: 'Spotting the crucial details.', config: { priority: 1, top: 58, right: 26, scale: 3.3, delay: 0.4, mobileOverride: { top: 70, right: 35, scale: 2.8 } } },
            { src: '/images/Process/define/Moleskine-notebook.png', width: 154, height: 247, alt: 'Strategy notebook.', config: { priority: 2, top: 42, right: 41, scale: 1.4, delay: 0.6 } },
            { src: '/images/Process/define/flowchart-diagram.png', width: 213, height: 269, alt: 'Designing clear logical flows.', config: { priority: 2, top: 62.5, right: 40.5, scale: 1, delay: 0.7 } },
            { src: '/images/Process/define/bullseye-target.png', width: 146, height: 188, alt: 'Hitting the golden target!', config: { priority: 2, top: 83, right: 40.5, scale: 1, delay: 0.8, mobileOverride: { top: 55, right: 15, scale: 1.1 } } },

            { src: '/images/Process/define/logos-Jira.png', width: 209, height: 205, alt: 'Jira - Precise issue tracking.', config: { priority: 1, top: 15, right: 2, scale: 1.05, delay: 0.1, mobileOverride: { top: 15, right: 2, scale: 1.05 } } },
            { src: '/images/Process/define/logos-Notion.png', width: 177, height: 205, alt: 'Notion - Our team second brain!', config: { priority: 1, top: 15, right: 15, scale: 1, delay: 0.2, mobileOverride: { top: 15, right: 25, scale: 1.05 } } },
            { src: '/images/Process/define/logos-Whimsical.png', width: 177, height: 198, alt: 'Whimsical - Rapid visual ideation.', config: { priority: 1, top: 11.5, right: 26, scale: 1.2, delay: 0.35, mobileOverride: { top: 12, right: 48, scale: 1.3 } } },
            { src: '/images/Process/define/logos-Asana.png', width: 180, height: 195, alt: 'Asana - Joyful task management.', config: { priority: 1, top: 15, right: 40, scale: 0.9, delay: 0.5, mobileOverride: { top: 15, right: 70, scale: 1.05 } } },

            // { src: '/images/Process/define/calender.png', width: 209, height: 203, alt: 'Scheduling and project planning.', config: { priority: 3, top: 30, right: 40, scale: 0.9, delay: 0.2 } },
            // { src: '/images/Process/define/logos-Confluence.png', width: 186, height: 232, alt: 'Confluence - The team knowledge base.', config: { priority: 3, top: 50, right: 45, scale: 0.95, delay: 0.45 } },
            // { src: '/images/Process/define/logos-Linear.png', width: 175, height: 195, alt: 'Linear - Lightning-fast product management.', config: { priority: 1, top: 65, right: 30, scale: 1.15, delay: 0.22, mobileOverride: { top: 88, right: 25, scale: 1.0 } } },
            // { src: '/images/Process/define/logos-Lucidchart.png', width: 209, height: 212, alt: 'Lucidchart - Drawing clear diagrams.', config: { priority: 3, top: 5, right: 15, scale: 0.8, delay: 0.32 } },
            // { src: '/images/Process/define/logos-Slack.png', width: 177, height: 203, alt: 'Slack - Seamless team communication.', config: { priority: 2, top: 25, right: 35, scale: 0.9, delay: 0.28 } },
            // { src: '/images/Process/define/logos_26.png', width: 186, height: 203, alt: 'Handy auxiliary tools.', config: { priority: 3, top: 40, right: 20, scale: 0.85, delay: 0.08 } },
            // { src: '/images/Process/define/North-Star.png', width: 213, height: 263, alt: 'The North Star - Our guiding light!', config: { priority: 1, top: 55, right: 5, scale: 1, delay: 0.48, mobileOverride: { top: 75, right: 15, scale: 1.2 } } },
            // { src: '/images/Process/define/task-management.png', width: 199, height: 253, alt: 'Organizing and managing tasks.', config: { priority: 2, top: 48, right: 32, scale: 0.7, delay: 0.24 } },
            // { src: '/images/Process/define/Venn-diagram.png', width: 159, height: 235, alt: 'Finding the sweet spot of needs.', config: { priority: 2, top: 32, right: 28, scale: 1.05, delay: 0.36 } }
        ]
    },
    {
        id: '03',
        title: 'Design',
        description: 'This is where your vision takes visual shape. I prototype at the speed of thought — 3D, motion, typography, colour.',
        bgColor: '#E6FF00',
        textColor: '#000000',
        images: [
            { src: '/images/Process/design/typography-block.png', width: 285, height: 180, alt: 'Obsessing over typography and fonts.', config: { priority: 1, top: 35, right: 23, scale: 2.3, delay: 0.20, mobileOverride: { top: 17, right: 20, scale: 2.1 } } },
            { src: '/images/Process/design/wireframe-layout.png', width: 319, height: 196, alt: 'Wireframing the core structure.', config: { priority: 1, top: 63, right: 11, scale: 3, delay: 0.13, mobileOverride: { top: 80, right: 5, scale: 1.1 } } },
            { src: '/images/Process/design/Pantone-color-swatch.png', width: 265, height: 190, alt: 'Gorgeous Pantone color palettes.', config: { priority: 2, top: 50, right: 45, scale: 0.9, delay: 0.36 } },
            { src: '/images/Process/design/stylus-pen.png', width: 228, height: 171, alt: 'Digital pen for crafting masterpieces.', config: { priority: 2, top: 54, right: 40, scale: 1, delay: 0.32 } },
            { src: '/images/Process/design/magic-wand.png', width: 230, height: 184, alt: 'The designer magic wand!', config: { priority: 2, top: 56, right: 37, scale: 1.1, delay: 0.30, mobileOverride: { top: 75, right: 23, scale: 0.8 } } },

            { src: '/images/Process/design/logos-Adobe-Illustrator.png', width: 187, height: 171, alt: 'Illustrator - Crafting magical vectors.', config: { priority: 1, top: 10, right: 5, scale: 0.7, delay: 0.10, mobileOverride: { top: 65, right: 68, scale: 0.6 } } },
            { src: '/images/Process/design/logos-After-Effects.png', width: 165, height: 172, alt: 'After Effects - Bringing visuals to life.', config: { priority: 1, top: 10, right: 15, scale: 0.7, delay: 0.16, mobileOverride: { top: 65, right: 55, scale: 0.6 } } },
            { src: '/images/Process/design/Figma-logo.png', width: 188, height: 169, alt: 'Figma - Our main design playground!', config: { priority: 1, top: 10, right: 25, scale: 0.7, delay: 0.22, mobileOverride: { top: 65, right: 39, scale: 0.6 } } },
            { src: '/images/Process/design/logos-Blender.png', width: 184, height: 172, alt: 'Blender - Entering the 3D world.', config: { priority: 1, top: 10, right: 35, scale: 0.7, delay: 0.28, mobileOverride: { top: 65, right: 24, scale: 0.6 } } },
            { src: '/images/Process/design/logos-LottieFiles.png', width: 199, height: 172, alt: 'Lottie - Smooth, lightweight animations.', config: { priority: 1, top: 10, right: 45, scale: 0.6, delay: 0.34, mobileOverride: { top: 75, right: 68, scale: 0.55 } } },
            { src: '/images/Process/design/logos-Spline.png', width: 165, height: 174, alt: 'Spline - Web-based 3D design.', config: { priority: 1, top: 11, right: 55, scale: 0.7, delay: 0.40, mobileOverride: { top: 75, right: 55, scale: 0.6 } } },
            { src: '/images/Process/design/logos-Principle.png', width: 199, height: 153, alt: 'Principle - Engaging interactive prototypes.', config: { priority: 1, top: 10, right: 64, scale: 0.7, delay: 0.46, mobileOverride: { top: 75, right: 37, scale: 0.6 } } },
            { src: '/images/Process/design/logos-ProtoPie.png', width: 165, height: 163, alt: 'ProtoPie - Advanced interaction simulation.', config: { priority: 1, top: 10, right: 75, scale: 0.7, delay: 0.52, mobileOverride: { top: 85, right: 68, scale: 0.6 } } },
            { src: '/images/Process/design/logos-Zeplin.png', width: 177, height: 158, alt: 'Zeplin - Bridging design and code.', config: { priority: 1, top: 10, right: 85, scale: 0.7, delay: 0.58, mobileOverride: { top: 85, right: 53, scale: 0.55 } } },


            // { src: '/images/Process/design/motion-design.png', width: 188, height: 170, alt: 'Crafting buttery smooth motions.', config: { priority: 1, top: 75, right: 42, scale: 0.85, delay: 0.38, mobileOverride: { top: 88, right: 75, scale: 0.9 } } },
            // { src: '/images/Process/design/logos-figma.png', width: 184, height: 174, alt: 'Figma - Collaborative design.', config: { priority: 3, top: 80, right: 10, scale: 0.8, delay: 0.35 } },
            // { src: '/images/Process/design/geometric-shape.png', width: 258, height: 171, alt: 'Mixing forms and geometry in design.', config: { priority: 2, top: 70, right: 35, scale: 0.9, delay: 0.3 } },
            // { src: '/images/Process/design/logos-UI-UX.png', width: 203, height: 189, alt: 'Focusing on unparalleled user experience.', config: { priority: 2, top: 85, right: 28, scale: 1.0, delay: 0.32 } },

            // { src: '/images/Process/design/bezier-curves.png', width: 218, height: 208, alt: 'Drawing flawless curves.', config: { priority: 1, top: 15, right: 25, scale: 1.1, delay: 0.1, mobileOverride: { top: 58, right: 75, scale: 1.0 } } },


        ]
    },
    {
        id: '04',
        title: 'Build',
        description: 'I engineer my designs with the same obsession as I design them. Every interaction. Every breakpoint.',
        bgColor: '#FF3300',
        textColor: '#FFFFFF',
        images: [
            { src: '/images/Process/build/code-editor.png', width: 220, height: 228, alt: 'Code editor - where the magic happens.', config: { priority: 1, top: 38, right: 25, scale: 3, delay: 0.25, mobileOverride: { top: 25, right: 25, scale: 3 } } },
            { src: '/images/Process/build/syntax-tags.png', width: 249, height: 185, alt: 'Clean tags and perfect syntax.', config: { priority: 1, top: 28, right: 15, scale: 1.1, delay: 0.18, zIndex: 50, mobileOverride: { top: 15, right: 2, scale: 1.1 } } },
            { src: '/images/Process/build/terminal-command.png', width: 228, height: 234, alt: 'Terminal - Talking directly to the system.', config: { priority: 1, top: 43, right: 35, scale: 1.5, delay: 0.38, zIndex: 50, mobileOverride: { top: 35, right: 45, scale: 1.5 } } },
            { src: '/images/Process/build/bug-prohibition.png', width: 189, height: 217, alt: 'Bugs are strictly prohibited!', config: { priority: 1, top: 8, right: 25, scale: 0.8, delay: 0.28, mobileOverride: { top: 38, right: 75, scale: 1.0 } } },
            { src: '/images/Process/build/logos-Docker.png', width: 187, height: 163, alt: 'Docker - Secure and stable containers.', config: { priority: 1, top: 44, right: 55, scale: 1.5, delay: 0.60, zIndex: 60, mobileOverride: { top: 88, right: 75, scale: 1.0 } } },
            { src: '/images/Process/build/logos-GitHub.png', width: 174, height: 163, alt: 'GitHub - The safe home for our code.', config: { priority: 2, top: 30, right: 80, scale: 2.5, delay: 0.80 } },
            { src: '/images/Process/build/logos-GitLab.png', width: 187, height: 173, alt: 'GitLab - Seamless development integration.', config: { priority: 2, top: 52, right: 42, scale: 0.8, delay: 0.48 } },
            { src: '/images/Process/build/logos-Next.png', width: 173, height: 163, alt: 'Next.js - Our fast and powerful framework!', config: { priority: 1, top: 61, right: 30, scale: 0.8, delay: 0.32, mobileOverride: { top: 85, right: 0, scale: 1.1 } } },
            { src: '/images/Process/build/logos-Postman.png', width: 174, height: 173, alt: 'Postman - Precise API testing.', config: { priority: 2, top: 25, right: 65, scale: 1, delay: 0.68, zIndex: 60 } },
            { src: '/images/Process/build/logos-WebStorm.png', width: 164, height: 173, alt: 'WebStorm - Professional JS coding.', config: { priority: 2, top: 80, right: 8, scale: 1.5, delay: 0.10 } },
            { src: '/images/Process/build/React-logo.png', width: 189, height: 204, alt: 'React - Building lovely components.', config: { priority: 1, top: 20, right: 45, scale: 2, delay: 0.52, mobileOverride: { top: 76, right: 45, scale: 1.1 } } },
            { src: '/images/Process/build/version-control-branch.png', width: 173, height: 204, alt: 'Managing versions and clean branches.', config: { priority: 2, top: 16, right: 12, scale: 0.8, delay: 0.14 } },
            { src: '/images/Process/build/microchip.png', width: 235, height: 217, alt: 'Processing complex logic and code.', config: { priority: 2, top: 80, right: 35, scale: 1, delay: 0.42, zIndex: 50 } },



            // { src: '/images/Process/build/logos-NPM.png', width: 173, height: 173, alt: 'NPM - An ocean of handy packages.', config: { priority: 3, top: 15, right: 45, scale: 0.8, delay: 0.35 } },
            // { src: '/images/Process/build/server-stack.png', width: 193, height: 210, alt: 'Robust server infrastructure.', config: { priority: 3, top: 85, right: 18, scale: 1.0, delay: 0.18 } },
            // { src: '/images/Process/build/software-container.png', width: 173, height: 207, alt: 'Isolating execution environments.', config: { priority: 2, top: 40, right: 28, scale: 0.9, delay: 0.28 } },
            // { src: '/images/Process/build/mechanical-gear.png', width: 202, height: 224, alt: 'The gears of software engineering.', config: { priority: 3, top: 5, right: 30, scale: 1.15, delay: 0.12 } },


        ]
    },

    {
        id: '05',
        title: 'Launch',
        description: 'Deployment is just a milestone, not the end. We launch together, measure obsessively, and iterate until the work exceeds the vision.',
        bgColor: '#CC00FF',
        textColor: '#FFFFFF',
        images: [
            { src: '/images/Process/launch/rocket.png', width: 203, height: 293, alt: 'Rocket ready for liftoff!', config: { priority: 1, top: 35, right: 60, scale: 2.5, delay: 0.45, mobileOverride: { top: 88, right: 20, scale: 1.2 } } },
            { src: '/images/Process/launch/Earth.png', width: 203, height: 173, alt: 'Ready to show the world.', config: { priority: 1, top: 75, right: 5, scale: 3, delay: 0.50, mobileOverride: { top: 50, right: -10, scale: 1.1 } } },
            { src: '/images/Process/launch/logos-Lighthouse.png', width: 247, height: 213, alt: 'Lighthouse - Scoring 100 on performance!', config: { priority: 1, top: 55, right: 40, scale: 2, delay: 0.15, mobileOverride: { top: 40, right: 60, scale: 2 } } },
            { src: '/images/Process/launch/confetti-popper.png', width: 165, height: 226, alt: 'Launch party! Popping the confetti!', config: { priority: 1, top: 30, right: 25, scale: 2, delay: 0.60, mobileOverride: { top: 15, right: 10, scale: 1 } } },
            // { src: '/images/Process/launch/gear.png', width: 89, height: 139, alt: 'Final tweaks and optimization.', config: { priority: 2, top: 75, right: 10, scale: 0.9, delay: 0.3 } },
            { src: '/images/Process/launch/growth-chart.png', width: 187, height: 202, alt: 'Product growth and success chart.', config: { priority: 1, top: 25, right: 5, scale: 1.0, delay: 0.85, mobileOverride: { top: 85, right: 75, scale: 0.9 } } },
            { src: '/images/Process/launch/infinity-loop.png', width: 198, height: 190, alt: 'The infinite loop of continuous improvement.', config: { priority: 2, top: 35, right: 48, scale: 0.5, delay: 0.95 } },
            { src: '/images/Process/launch/logos-Amplitude.png', width: 247, height: 226, alt: 'Amplitude - Deep product analytics.', config: { priority: 2, top: 18, right: 40, scale: 1.1, delay: 0.80 } },
            { src: '/images/Process/launch/logos-cloud-deployment.png', width: 247, height: 224, alt: 'Deploying to the cloud.', config: { priority: 3, top: 85, right: 30, scale: 0.95, delay: 0.10 } },

            { src: '/images/Process/launch/logos-Mixpanel.png', width: 238, height: 226, alt: 'Mixpanel - Monitoring user interactions.', config: { priority: 2, top: 65, right: 30, scale: 1.15, delay: 0.75 } },
            { src: '/images/Process/launch/logos-Netlify.png', width: 238, height: 213, alt: 'Netlify - Fast and painless hosting.', config: { priority: 2, top: 5, right: 15, scale: 0.8, delay: 0.30 } },
            { src: '/images/Process/launch/logos-Play-Store.png', width: 238, height: 224, alt: 'Publishing to global stores.', config: { priority: 2, top: 45, right: 8, scale: 1.25, delay: 0.40 } },
            { src: '/images/Process/launch/logos-Product-Hunt.png', width: 247, height: 224, alt: 'Product Hunt - Hunt of the day!', config: { priority: 3, top: 80, right: 38, scale: 0.6, delay: 0.70 } },
            { src: '/images/Process/launch/logos-Sentry.png', width: 247, height: 226, alt: 'Sentry - Catching errors in real-time.', config: { priority: 3, top: 40, right: 18, scale: 0.9, delay: 0.20 } },
            { src: '/images/Process/launch/logos-Vercel.png', width: 247, height: 213, alt: 'Vercel - Deploying at top speed.', config: { priority: 2, top: 55, right: 20, scale: 1.0, delay: 0.25, mobileOverride: { top: 48, right: 16, scale: 1.0 } } },
            { src: '/images/Process/launch/megaphone.png', width: 144, height: 180, alt: 'Telling everyone! The product is ready.', config: { priority: 2, top: 10, right: 30, scale: 1.1, delay: 0.65, mobileOverride: { top: 60, right: 75, scale: 1.0 } } },
            // { src: '/images/Process/launch/Product-Hunt-badge.png', width: 167, height: 190, alt: 'Product Hunt badge of honor.', config: { priority: 3, top: 40, right: 40, scale: 0.85, delay: 0.08 } },

            { src: '/images/Process/launch/Vercel-deployment.png', width: 185, height: 202, alt: 'Successful Vercel deployment.', config: { priority: 3, top: 22, right: 12, scale: 0.95, delay: 0.35, mobileOverride: { top: 75, right: 15, scale: 0.9 } } },
            { src: '/images/Process/launch/verified-checkmark.png', width: 170, height: 179, alt: 'Final approval and quality assurance.', config: { priority: 2, top: 35, right: 38, scale: 1.05, delay: 0.55 } }
        ]
    }
];
