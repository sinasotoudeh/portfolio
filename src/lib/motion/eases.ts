// Ease functions for GSAP (`ease: fn`) that reproduce the curves the site's framer-motion
// animations used, so ported motion keeps its exact feel without a GSAP plugin.

// Cubic bezier easing, the same subdivision algorithm framer-motion (motion-utils) uses.
const calcBezier = (t: number, a1: number, a2: number) =>
    (((1 - 3 * a2 + 3 * a1) * t + (3 * a2 - 6 * a1)) * t + 3 * a1) * t;

export function cubicBezier(x1: number, y1: number, x2: number, y2: number): (p: number) => number {
    if (x1 === y1 && x2 === y2) return (p) => p;
    const tForX = (x: number) => {
        let lower = 0;
        let upper = 1;
        let t = 0.5;
        let current = 0;
        let i = 0;
        do {
            t = lower + (upper - lower) / 2;
            current = calcBezier(t, x1, x2) - x;
            if (current > 0) upper = t;
            else lower = t;
        } while (Math.abs(current) > 0.0000001 && ++i < 12);
        return t;
    };
    return (p) => (p === 0 || p === 1 ? p : calcBezier(tForX(p), y1, y2));
}

// framer-motion's defaults: a transition given only a duration eases with easeOut.
export const FRAMER_EASE_OUT = cubicBezier(0, 0, 0.58, 1);
export const FRAMER_EASE_IN_OUT = cubicBezier(0.42, 0, 0.58, 1);

// An underdamped spring from rest to 1 over `duration` seconds (natural frequency omega0 in
// rad/s, damping ratio zeta < 1), as an ease. framer's { type: 'spring', bounce: 0.5 } resolves
// to omega0 15.897, zeta 0.5 over 0.8 s (fitted to framer's own generator, error < 0.001).
export function springEase(omega0: number, zeta: number, duration: number): (p: number) => number {
    const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
    return (p) => {
        if (p >= 1) return 1;
        const t = p * duration;
        return 1 - Math.exp(-zeta * omega0 * t) * (Math.cos(omegaD * t) + ((zeta * omega0) / omegaD) * Math.sin(omegaD * t));
    };
}

export const FRAMER_SPRING_BOUNCE_05 = { ease: springEase(15.897, 0.5, 0.8), duration: 0.8 };

// Reduced motion: ported animations become instant (duration 0).
export const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
