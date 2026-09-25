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

// framer's default tween for a value given only a delay: 0.3 s on this curve.
export const FRAMER_DEFAULT_TWEEN = { ease: cubicBezier(0.25, 0.1, 0.35, 1), duration: 0.3 };

// Springs framer resolved for the Resume section (fitted to / stepped with framer's own generator;
// duration = when framer declares the spring finished):
// { type: 'spring', bounce: 0.4, duration: 0.8 } → ω0 13.8, ζ 0.6.
export const FRAMER_SPRING_BOUNCE_04_08 = { ease: springEase(13.8, 0.6, 0.8), duration: 0.8 };
// layoutId transitions: stiffness 400 / damping 35 (ω0 20, ζ 0.875) and 500 / 40 (ω0 22.361, ζ 0.894).
export const FRAMER_SPRING_400_35 = { ease: springEase(20, 0.875, 0.555), duration: 0.555 };
export const FRAMER_SPRING_500_40 = { ease: springEase(22.361, 0.8944, 0.504), duration: 0.504 };
// framer's default transform spring (stiffness 500, damping 25) over a short (8 px) move.
export const FRAMER_SPRING_500_25_SHORT = { ease: springEase(22.361, 0.559, 0.245), duration: 0.245 };
