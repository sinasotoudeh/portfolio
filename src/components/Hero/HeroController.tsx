'use client';

import { useRef, useState, type ReactNode } from 'react';
import { ScrollTrigger, useGSAP } from '@/lib/motion/gsap';
import { heroProgress, heroStateFor } from './heroStates';
import styles from './Hero.module.css';

interface HeroControllerProps {
    /** Server-rendered sticky panel: canvas leaf, wordmark, tagline, cards, work list, CTA. */
    children: ReactNode;
}

// Owns the Hero's only state: which of the four scroll states is showing. It renders the pin
// section with data-state="0..3" and Hero.module.css keys every layer off that attribute;
// everything inside is rendered on the server by Hero.tsx.
export default function HeroController({ children }: HeroControllerProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const [state, setState] = useState(0);

    useGSAP(() => {
        const section = sectionRef.current;
        if (!section) return;

        // ScrollTrigger supplies the moments (every Lenis scroll step inside the pin, and each
        // refresh); the state itself comes from heroProgress, the canvas engine's own measure, so
        // the DOM layers and the particle morph can never disagree about the viewport height.
        const update = () => setState(heroStateFor(heroProgress(section)));
        ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: () => `+=${section.offsetHeight - window.innerHeight}`,
            onUpdate: update,
            onRefresh: update,
        });
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className={styles.heroPinContainer}
            data-state={state}
            aria-labelledby="hero-title"
        >
            {children}
        </section>
    );
}
