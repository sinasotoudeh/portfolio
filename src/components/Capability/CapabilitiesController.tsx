'use client';

import { useRef, type ComponentPropsWithoutRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/motion/gsap';
import { FRAMER_EASE_OUT, prefersReducedMotion } from '@/lib/motion/eases';
import { CAPABILITIES_CONFIG as CONFIG } from '@/config/capabilities.config';
import { CYLINDER, cardDepth, maxScrollRotation } from './cylinder';

// Scroll progress is smoothed by a spring (the former framer useSpring: stiffness 100, damping 30,
// mass 0.8 — overdamped), solved exactly per frame; it settles like framer's (rest when within
// 0.001 and slower than 0.01/s, then snaps to the target).
const { stiffness, damping, mass } = CONFIG.SCROLL_SPRING;
const discriminant = Math.sqrt(damping * damping - 4 * mass * stiffness);
const ROOT_FAST = (-damping - discriminant) / (2 * mass);
const ROOT_SLOW = (-damping + discriminant) / (2 * mass);
const REST_DELTA = 0.001;
const REST_SPEED = 0.01;

// Drag, as the former use-gesture useDrag({ axis: 'x' }) resolved it: radians per pixel of offset;
// the first movement decides the axis (beyond 0 px for mouse/touch, 8 px for a pen); once the
// gesture has moved 1 px that pixel is discounted.
const DRAG_SENSITIVITY = 0.005;
const DRAG_STEP = 1;
const axisThreshold = (pointerType: string) => (pointerType === 'pen' ? 8 : 0);

// Client leaf of the server-rendered Capabilities section: renders the <section> around the server
// markup and drives it — ring rotation (scroll + drag), per-card depth, background drift, text reveal.
export default function CapabilitiesController({ children, ...props }: ComponentPropsWithoutRef<'section'>) {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        const section = sectionRef.current;
        const stage = section?.querySelector<HTMLElement>('[data-cap-stage]');
        const ring = section?.querySelector<HTMLElement>('[data-cap-ring]');
        const background = section?.querySelector<HTMLElement>('[data-cap-bg]');
        const text = section?.querySelector<HTMLElement>('[data-cap-text]');
        if (!section || !stage || !ring || !background || !text) return;

        const cards = [...section.querySelectorAll<HTMLElement>('[data-cap-card]')].map(el => ({
            el,
            angle: Number(el.dataset.capCard),
        }));
        const maxRotation = maxScrollRotation(cards.length);
        const reducedMotion = prefersReducedMotion();

        // Stage geometry from its real height (the vh values in the CSS cover the first paint).
        const size = () => {
            const h = stage.clientHeight;
            stage.style.setProperty('--cyl-perspective', `${h * CYLINDER.perspectivePerHeight}px`);
            stage.style.setProperty('--cyl-radius', `${h * CYLINDER.radiusPerHeight}px`);
            stage.style.setProperty('--cyl-card-scale', String(h * CYLINDER.cardScalePerHeight));
        };
        const resizeObserver = new ResizeObserver(size);
        resizeObserver.observe(stage);
        size();

        let target = 0; // scroll progress through the section
        let progress = 0; // spring-smoothed progress
        let velocity = 0;
        let dragRotation = 0;
        let settled = true;

        const render = () => {
            const rotation = progress * maxRotation + dragRotation;
            ring.style.transform = `rotateY(${rotation}rad)`;
            for (const card of cards) {
                const depth = cardDepth(card.angle + rotation);
                if (depth.hidden) {
                    card.el.style.visibility = 'hidden';
                    continue;
                }
                card.el.style.visibility = 'visible';
                card.el.style.opacity = depth.opacity;
                card.el.style.transform = depth.transform;
                card.el.style.pointerEvents = depth.pointerEvents;
            }
            background.style.transform = reducedMotion ? 'none' : `translateY(${progress * -15}%)`;
        };

        // Exact overdamped spring step over dt seconds toward a fixed target.
        const stepSpring = (dt: number) => {
            const offset = progress - target;
            const a = (velocity - ROOT_SLOW * offset) / (ROOT_FAST - ROOT_SLOW);
            const b = offset - a;
            const fast = Math.exp(ROOT_FAST * dt);
            const slow = Math.exp(ROOT_SLOW * dt);
            progress = target + a * fast + b * slow;
            velocity = ROOT_FAST * a * fast + ROOT_SLOW * b * slow;
            if (Math.abs(progress - target) < REST_DELTA && Math.abs(velocity) < REST_SPEED) {
                progress = target;
                velocity = 0;
                settled = true;
            }
        };

        const tick = (_time: number, deltaMs: number) => {
            stepSpring(deltaMs / 1000);
            render();
            if (settled) gsap.ticker.remove(tick);
        };

        const follow = (next: number) => {
            target = next;
            if (reducedMotion) {
                progress = target;
                render();
                return;
            }
            if (settled && progress !== target) {
                settled = false;
                gsap.ticker.add(tick);
            }
        };

        let measured = false;
        const trigger = ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: self => follow(self.progress),
            onRefresh: self => {
                // The spring starts where the page already is (no animation on load).
                if (!measured) {
                    measured = true;
                    target = progress = self.progress;
                    render();
                } else {
                    follow(self.progress);
                }
            },
        });

        // Drag with a pointer: horizontal movement turns the ring. The offset accumulates across
        // gestures (no inertia); a gesture that starts out vertical is ignored.
        let pointerId: number | null = null;
        let startX = 0;
        let startY = 0;
        let axis: 'x' | 'y' | null = null;
        let step: number | null = null;
        let dragOffset = 0; // px, all gestures so far
        let gestureStartOffset = 0;
        const onPointerDown = (e: PointerEvent) => {
            if (pointerId !== null || (e.pointerType === 'mouse' && e.button !== 0)) return;
            pointerId = e.pointerId;
            startX = e.clientX;
            startY = e.clientY;
            axis = null;
            step = null;
            gestureStartOffset = dragOffset;
            stage.setPointerCapture(e.pointerId);
        };
        const onPointerMove = (e: PointerEvent) => {
            if (e.pointerId !== pointerId) return;
            const mx = e.clientX - startX;
            const my = e.clientY - startY;
            if (axis === null) {
                const threshold = axisThreshold(e.pointerType);
                if (Math.abs(mx) > Math.abs(my) && Math.abs(mx) > threshold) axis = 'x';
                else if (Math.abs(my) > Math.abs(mx) && Math.abs(my) > threshold) axis = 'y';
                else return;
            }
            if (step === null) {
                if (Math.abs(mx) < DRAG_STEP) return;
                step = Math.sign(mx) * DRAG_STEP;
            }
            if (axis !== 'x') return;
            dragOffset = gestureStartOffset + mx - step;
            dragRotation = dragOffset * DRAG_SENSITIVITY;
            if (settled) render();
        };
        const onPointerEnd = (e: PointerEvent) => {
            if (e.pointerId !== pointerId) return;
            pointerId = null;
        };
        stage.addEventListener('pointerdown', onPointerDown);
        stage.addEventListener('pointermove', onPointerMove);
        stage.addEventListener('pointerup', onPointerEnd);
        stage.addEventListener('pointercancel', onPointerEnd);

        // Text block: slides in whenever any part of it is in view and back out when it leaves.
        const textObserver = new IntersectionObserver(([entry]) => {
            gsap.to(text, {
                opacity: entry.isIntersecting ? 1 : 0,
                x: entry.isIntersecting ? 0 : 50,
                duration: reducedMotion ? 0 : 0.8,
                ease: FRAMER_EASE_OUT,
                overwrite: true,
            });
        });
        textObserver.observe(text);

        return () => {
            trigger.kill();
            gsap.ticker.remove(tick);
            resizeObserver.disconnect();
            textObserver.disconnect();
            stage.removeEventListener('pointerdown', onPointerDown);
            stage.removeEventListener('pointermove', onPointerMove);
            stage.removeEventListener('pointerup', onPointerEnd);
            stage.removeEventListener('pointercancel', onPointerEnd);
        };
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} {...props}>
            {children}
        </section>
    );
}
