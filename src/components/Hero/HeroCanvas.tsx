'use client';

import { useEffect, useRef } from 'react';
import { HERO_STATES as STATES, heroProgress } from './heroStates';
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

        const initEngine = () => {
            dimensionsRef.current.w = canvas.offsetWidth;
            dimensionsRef.current.h = canvas.offsetHeight;
            canvas.width = dimensionsRef.current.w;
            canvas.height = dimensionsRef.current.h;
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

        let resizeTimeout: ReturnType<typeof setTimeout>;

        const handleResize = () => {
            if (!canvasRef.current) return;
            const w = canvasRef.current.offsetWidth;
            const h = canvasRef.current.offsetHeight;

            dimensionsRef.current.w = w;
            dimensionsRef.current.h = h;
            canvasRef.current.width = w;
            canvasRef.current.height = h;

            cachedContainerTop = container.offsetTop;

            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                particlesRef.current.forEach(p => {
                    p.states = {
                        sphere: p.getSphereCoords(w, h),
                        cube: p.getCubeCoords(w, h),
                        fluid: p.getFluidCoords(w, h),
                    };
                });
            }, 100);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const render = () => {
            const { w, h } = dimensionsRef.current;
            ctx.clearRect(0, 0, w, h);

            const rawProgress = heroProgress(container, cachedContainerTop);

            let targetCX = w / 2;
            let targetCY = h / 2;
            if (rawProgress < STATES[1].threshold) {
                const isMobile = w < 768;
                targetCX = w / 2 + (isMobile ? 0 : CONFIG.particleOffsetX);
                targetCY = h / 2 + CONFIG.particleOffsetY;
            }

            centerRef.current.cx = lerp(centerRef.current.cx, targetCX, 0.04);
            centerRef.current.cy = lerp(centerRef.current.cy, targetCY, 0.04);

            const time = Date.now() * 0.0003;
            const mouseOffsetX = (mouseRef.current.x - w / 2) * 0.0008;
            const mouseOffsetY = (mouseRef.current.y - h / 2) * 0.0008;
            const rotY = time + mouseOffsetX;
            const rotX = time * 0.7 + mouseOffsetY;

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

                p.x = lerp(p.x, targetX, 0.06);
                p.y = lerp(p.y, targetY, 0.06);
                p.z = lerp(p.z, targetZ, 0.06);

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

            requestRef.current = requestAnimationFrame(render);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        initEngine();
        requestRef.current = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.mainCanvas}></canvas>;
}
