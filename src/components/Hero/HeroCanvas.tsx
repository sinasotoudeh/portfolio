'use client';

import { useEffect, useRef } from 'react';
import { HERO_STATES as STATES, heroProgress, heroStateFor } from './heroStates';
import styles from './Hero.module.css';

// --- Types & Interfaces ---
interface Coords {
    x: number;
    y: number;
    z: number;
}

interface ParticleStates {
    sphere: Coords;
    cube: Coords;
    fluid: Coords;
}

// --- Constants & Config ---
const CONFIG = {
    particleOffsetX: 250, // تنظیم شده برای هماهنگی با جایگاه جدید O در انتهای SinSO
    particleOffsetY: 0,
};
const NUM_PARTICLES = 250;
const FOCAL_LENGTH = 1000;

// Canvas backing store is CSS size × devicePixelRatio, capped here (sharp on retina, bounded cost).
const MAX_DPR = 2;
// The loop only runs while the pin section is within this margin of the viewport.
const ACTIVE_MARGIN = '200px 0px';

// Reduced motion: no loop. One still frame per hero state, drawn at the engine's own keyframes
// (state 0 sphere, 1 cube, 2–3 fluid) with a fixed tilt so the cube still reads as 3-D.
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const STILL_PROGRESS = [STATES[0].threshold, STATES[1].threshold, STATES[2].threshold, STATES[3].threshold];
const STILL_ROT_Y = 0.6;
const STILL_ROT_X = 0.4;

// --- Math Helpers ---
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const clamp = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));

// --- Particle Class ---
class Particle {
    x: number;
    y: number;
    z: number;
    baseRadius: number;
    states: ParticleStates;

    constructor(w: number, h: number) {
        this.states = {
            sphere: this.getSphereCoords(w, h),
            cube: this.getCubeCoords(w, h),
            fluid: this.getFluidCoords(w, h),
        };
        this.x = this.states.sphere.x;
        this.y = this.states.sphere.y;
        this.z = this.states.sphere.z;
        this.baseRadius = Math.random() * 1.8 + 0.8;
    }

    getSphereCoords(w: number, h: number): Coords {
        const r = Math.min(w, h) * 0.25;
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(Math.random() * 2 - 1);
        return {
            x: r * Math.sin(phi) * Math.cos(theta),
            y: r * Math.sin(phi) * Math.sin(theta),
            z: r * Math.cos(phi),
        };
    }

    getCubeCoords(w: number, h: number): Coords {
        const size = Math.min(w, h) * 0.35;
        const half = size / 2;
        const face = Math.floor(Math.random() * 6);
        let x = (Math.random() - 0.5) * size;
        let y = (Math.random() - 0.5) * size;
        let z = (Math.random() - 0.5) * size;
        if (face === 0) x = half;
        else if (face === 1) x = -half;
        if (face === 2) y = half;
        else if (face === 3) y = -half;
        if (face === 4) z = half;
        else if (face === 5) z = -half;
        return { x, y, z };
    }

    getFluidCoords(w: number, h: number): Coords {
        return {
            x: (Math.random() - 0.5) * w * 1.2,
            y: (Math.random() - 0.5) * h * 1.2,
            z: (Math.random() - 0.5) * 800,
        };
    }
}

// Client leaf of the server-rendered Hero: the particle engine. It reads the pin's scroll
// progress itself for the morph; which DOM layer is showing is HeroController's job.
export default function HeroCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const centerRef = useRef({ cx: 0, cy: 0 });
    const dimensionsRef = useRef({ w: 0, h: 0 });
    const requestRef = useRef<number | null>(null);

    useEffect(() => {
        let cachedContainerTop = 0;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        // The pin section rendered by HeroController (the nearest <section> around the canvas).
        const container = canvas.closest('section');
        if (!container) return;

        const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
        let onScreen = true; // corrected by the observer's first callback
        let stillState = -1; // hero state of the last still frame (reduced motion)

        // Resizing the buffer resets the context, so the DPR transform is re-applied every time;
        // everything else keeps drawing in CSS pixels.
        const sizeBuffer = (w: number, h: number) => {
            const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        const initEngine = () => {
            dimensionsRef.current.w = canvas.offsetWidth;
            dimensionsRef.current.h = canvas.offsetHeight;
            sizeBuffer(dimensionsRef.current.w, dimensionsRef.current.h);
            cachedContainerTop = container.offsetTop;

            const isMobile = dimensionsRef.current.w < 768;
            centerRef.current = {
                cx: dimensionsRef.current.w / 2 + (isMobile ? 0 : CONFIG.particleOffsetX),
                cy: dimensionsRef.current.h / 2,
            };

            particlesRef.current = Array.from(
                { length: NUM_PARTICLES },
                () => new Particle(dimensionsRef.current.w, dimensionsRef.current.h)
            );
        };

        // One frame of the engine. `ease` / `centerEase` are the per-frame lerp factors (1 snaps
        // straight onto the targets); rotY / rotX are the rotation angles in radians.
        const draw = (rawProgress: number, ease: number, centerEase: number, rotY: number, rotX: number) => {
            const { w, h } = dimensionsRef.current;
            ctx.clearRect(0, 0, w, h);

            let targetCX = w / 2;
            let targetCY = h / 2;
            if (rawProgress < STATES[1].threshold) {
                const isMobile = w < 768;
                targetCX = w / 2 + (isMobile ? 0 : CONFIG.particleOffsetX);
                targetCY = h / 2 + CONFIG.particleOffsetY;
            }

            centerRef.current.cx = lerp(centerRef.current.cx, targetCX, centerEase);
            centerRef.current.cy = lerp(centerRef.current.cy, targetCY, centerEase);

            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
            const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

            particlesRef.current.forEach((p) => {
                let targetX: number, targetY: number, targetZ: number;

                if (rawProgress < STATES[1].threshold) {
                    const f = rawProgress / STATES[1].threshold;
                    targetX = lerp(p.states.sphere.x, p.states.cube.x, f);
                    targetY = lerp(p.states.sphere.y, p.states.cube.y, f);
                    targetZ = lerp(p.states.sphere.z, p.states.cube.z, f);
                } else if (rawProgress < STATES[2].threshold) {
                    const f = (rawProgress - STATES[1].threshold) / (STATES[2].threshold - STATES[1].threshold);
                    targetX = lerp(p.states.cube.x, p.states.fluid.x, f);
                    targetY = lerp(p.states.cube.y, p.states.fluid.y, f);
                    targetZ = lerp(p.states.cube.z, p.states.fluid.z, f);
                } else {
                    targetX = p.states.fluid.x;
                    targetY = p.states.fluid.y;
                    targetZ = p.states.fluid.z;
                }

                p.x = lerp(p.x, targetX, ease);
                p.y = lerp(p.y, targetY, ease);
                p.z = lerp(p.z, targetZ, ease);

                const rx = p.x * cosY - p.z * sinY;
                const rz0 = p.x * sinY + p.z * cosY;
                const ry = p.y * cosX - rz0 * sinX;
                const rz = p.y * sinX + rz0 * cosX;

                const depth = rz + FOCAL_LENGTH + 200;
                if (depth <= 0) return;
                const scale = FOCAL_LENGTH / depth;

                const x2d = rx * scale + centerRef.current.cx;
                const y2d = ry * scale + centerRef.current.cy;

                const r = clamp(p.baseRadius * scale * 2.5, 0.3, 8);
                const alpha = clamp(scale * 2.0, 0.1, 0.95);

                ctx.beginPath();
                ctx.arc(x2d, y2d, r, 0, Math.PI * 2);

                if (rawProgress < STATES[1].threshold) {
                    ctx.fillStyle = `hsla(220, 80%, 75%, ${alpha})`;
                } else if (rawProgress < STATES[2].threshold) {
                    const f = (rawProgress - STATES[1].threshold) / (STATES[2].threshold - STATES[1].threshold);
                    const hue = lerp(220, 270, f);
                    ctx.fillStyle = `hsla(${hue}, 75%, 70%, ${alpha})`;
                } else {
                    ctx.fillStyle = `hsla(290, 70%, 72%, ${alpha})`;
                }
                ctx.fill();
            });
        };

        const render = () => {
            const { w, h } = dimensionsRef.current;
            const time = Date.now() * 0.0003;
            const mouseOffsetX = (mouseRef.current.x - w / 2) * 0.0008;
            const mouseOffsetY = (mouseRef.current.y - h / 2) * 0.0008;

            draw(heroProgress(container, cachedContainerTop), 0.06, 0.04, time + mouseOffsetX, time * 0.7 + mouseOffsetY);

            requestRef.current = requestAnimationFrame(render);
        };

        // Reduced motion: redraw only when the hero state changes (or when forced after a resize).
        const drawStill = (force = false) => {
            const state = heroStateFor(heroProgress(container, cachedContainerTop));
            if (!force && state === stillState) return;
            stillState = state;
            draw(STILL_PROGRESS[state], 1, 1, STILL_ROT_Y, STILL_ROT_X);
        };

        const start = () => {
            if (requestRef.current === null) requestRef.current = requestAnimationFrame(render);
        };
        const stop = () => {
            if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
            requestRef.current = null;
        };
        // The loop runs only with motion allowed and the hero near the viewport. Rotation follows
        // the clock and progress is read every frame, so a resumed loop picks up where it would be.
        const sync = () => {
            if (reducedMotion.matches) {
                stop();
                drawStill(true);
            } else if (onScreen) {
                start();
            } else {
                stop();
            }
        };

        let resizeTimeout: ReturnType<typeof setTimeout>;

        const handleResize = () => {
            if (!canvasRef.current) return;
            const w = canvasRef.current.offsetWidth;
            const h = canvasRef.current.offsetHeight;

            dimensionsRef.current.w = w;
            dimensionsRef.current.h = h;
            sizeBuffer(w, h);

            cachedContainerTop = container.offsetTop;
            if (reducedMotion.matches) drawStill(true);

            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                particlesRef.current.forEach(p => {
                    p.states = {
                        sphere: p.getSphereCoords(w, h),
                        cube: p.getCubeCoords(w, h),
                        fluid: p.getFluidCoords(w, h),
                    };
                });
                if (reducedMotion.matches) drawStill(true);
            }, 100);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleScroll = () => {
            if (reducedMotion.matches) drawStill();
        };

        const observer = new IntersectionObserver(([entry]) => {
            onScreen = entry.isIntersecting;
            sync();
        }, { rootMargin: ACTIVE_MARGIN });

        window.addEventListener('resize', handleResize, { passive: true });
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('scroll', handleScroll, { passive: true });
        reducedMotion.addEventListener('change', sync);
        initEngine();
        sync();
        observer.observe(container);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
            reducedMotion.removeEventListener('change', sync);
            observer.disconnect();
            clearTimeout(resizeTimeout);
            stop();
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.mainCanvas}></canvas>;
}
