'use client';

import { useRef, type ComponentPropsWithoutRef, type MouseEvent } from 'react';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { FRAMER_SPRING_BOUNCE_04_08, prefersReducedMotion } from '@/lib/motion/eases';

// The fixed navbar's height: scroll targets stop this far below the top of the screen.
const NAVBAR_OFFSET = 80;

// Client leaf of the server-rendered Resume section: renders the <section> around the server markup.
// - Any click in the section scrolls it into place: to the section's top when the click is above the
//   résumé window, else to the window's top; the "Take a look at my CV!" button goes to the window.
// - The two intro columns slide in from the sides (framer's bounce 0.4 spring, 0.8 s) the first time
//   they come into view (50 px inside the viewport).
export default function ResumeController({ children, ...props }: ComponentPropsWithoutRef<'section'>) {
    const sectionRef = useRef<HTMLElement>(null);

    const handleClick = (e: MouseEvent<HTMLElement>) => {
        const section = sectionRef.current;
        const resumeWindow = section?.querySelector<HTMLElement>('[data-resume-window]');
        if (!section || !resumeWindow) return;
        const windowTop = resumeWindow.getBoundingClientRect().top;
        const onCvButton = e.target instanceof Element && e.target.closest('[data-cv-button]');
        const top = !onCvButton && e.clientY < windowTop
            ? section.getBoundingClientRect().top
            : windowTop;
        window.scrollTo({ top: window.scrollY + top - NAVBAR_OFFSET, behavior: 'smooth' });
    };

    useGSAP(() => {
        const section = sectionRef.current;
        if (!section) return;
        const columns = section.querySelectorAll<HTMLElement>('[data-intro]');
        const observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                observer.unobserve(entry.target);
                const el = entry.target as HTMLElement;
                const instant = prefersReducedMotion();
                gsap.to(el, {
                    opacity: 1,
                    x: 0,
                    duration: instant ? 0 : FRAMER_SPRING_BOUNCE_04_08.duration,
                    delay: instant ? 0 : Number(el.dataset.delay),
                    ease: FRAMER_SPRING_BOUNCE_04_08.ease,
                });
            }
        }, { rootMargin: '-50px' });
        columns.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} onClick={handleClick} {...props}>
            {children}
        </section>
    );
}
