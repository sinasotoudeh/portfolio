'use client';

import { useRef, type ComponentPropsWithoutRef } from 'react';
import { gsap, useGSAP } from '@/lib/motion/gsap';

// Scroll range of the whole effect: from the section's top at 80% of the viewport until its
// bottom leaves the top. Timeline time 0..1 is that progress.
const START = 'top 80%';
const END = 'bottom top';

// Word k (1-based) of n reveals over progress [k/n · 0.5, + 0.1]; the last word reveals over
// [0.55, 0.65] and then grows 1 → 25 over [0.67, 1]. All linear.
const WORD_SPREAD = 0.5;
const WORD_DURATION = 0.1;
const LAST_REVEAL_AT = 0.55;
const LAST_SCALE_AT = 0.67;
const LAST_SCALE_TO = 25;

// Hidden matches the first paint in Manifesto.module.css.
const HIDDEN = { opacity: 0.1, y: 30, filter: 'blur(12px)' };
const SHOWN = { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'none' };

// Client leaf of the server-rendered Manifesto: renders the <section> around the server markup and
// scrubs the word reveal against scroll. With reduced motion nothing runs and the CSS shows the
// text still and fully visible.
export default function ManifestoScrub({ children, ...props }: ComponentPropsWithoutRef<'section'>) {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        const section = sectionRef.current;
        if (!section) return;

        const mm = gsap.matchMedia();
        mm.add('(prefers-reduced-motion: no-preference)', () => {
            const words = gsap.utils.toArray<HTMLElement>('[data-word]', section);
            const lastWord = section.querySelector<HTMLElement>('[data-last-word]');

            const tl = gsap.timeline({
                scrollTrigger: { trigger: section, start: START, end: END, scrub: true },
            });
            words.forEach((word, i) => {
                tl.fromTo(word, HIDDEN, { ...SHOWN, duration: WORD_DURATION }, ((i + 1) / words.length) * WORD_SPREAD);
            });
            if (lastWord) {
                tl.fromTo(lastWord, HIDDEN, { ...SHOWN, duration: WORD_DURATION }, LAST_REVEAL_AT);
                tl.fromTo(lastWord, { scale: 1 }, { scale: LAST_SCALE_TO, ease: 'none', duration: 1 - LAST_SCALE_AT }, LAST_SCALE_AT);
            }
        });

        return () => mm.revert();
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} {...props}>
            {children}
        </section>
    );
}
