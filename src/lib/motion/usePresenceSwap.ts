// Imported only by client components (no directive needed, like ./gsap).
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { gsap, useGSAP } from './gsap';
import { FRAMER_EASE_OUT, prefersReducedMotion } from './eases';

// Enter/exit states of a swapping layer. `from.style` is the first paint (server HTML and each new
// mount) and matches `from.vars`, the state it animates in from; `exit` (default: `from.vars`) is
// the state it animates out to.
export interface PresenceStates {
    from: { vars: gsap.TweenVars; style: CSSProperties };
    to: gsap.TweenVars;
    exit?: gsap.TweenVars;
    duration: number;
    ease?: gsap.EaseFunction;
}

const motionDuration = (seconds: number) => (prefersReducedMotion() ? 0 : seconds);

// framer's AnimatePresence mode="wait" for one keyed layer: when `target` changes, the shown layer
// animates out, then the target is shown and animates in (also on first mount). A change during
// the exit only retargets the swap; returning to the shown key during the exit brings it back from
// where it is. Render the layer with `key={shown}` and `ref`.
export function usePresenceSwap<T>(target: T, ref: RefObject<HTMLElement | null>, presence: PresenceStates): T {
    const [shown, setShown] = useState(target);
    const latestTarget = useRef(target);
    const exiting = useRef(false);
    const ease = presence.ease ?? FRAMER_EASE_OUT;

    // Enter: every newly shown layer (a new keyed element) animates in from its first paint.
    useGSAP(() => {
        const el = ref.current;
        if (!el) return;
        gsap.fromTo(el, presence.from.vars, { ...presence.to, duration: motionDuration(presence.duration), ease });
    }, { dependencies: [shown] });

    useEffect(() => {
        latestTarget.current = target;
        const el = ref.current;
        if (!el) return;
        if (target === shown) {
            if (exiting.current) {
                exiting.current = false;
                gsap.to(el, { ...presence.to, duration: motionDuration(presence.duration), ease, overwrite: true });
            }
            return;
        }
        if (exiting.current) return;
        exiting.current = true;
        gsap.to(el, {
            ...(presence.exit ?? presence.from.vars),
            duration: motionDuration(presence.duration),
            ease,
            overwrite: true,
            onComplete: () => {
                exiting.current = false;
                setShown(latestTarget.current);
            },
        });
    }, [target, shown, ref, presence, ease]);

    return shown;
}
