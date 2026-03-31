'use client';

import React, { useEffect, useRef, useState } from 'react';
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
    particleOffsetX: -180,
    particleOffsetY: 0,
};
const NUM_PARTICLES = 850;
const FOCAL_LENGTH = 450;

const STATES = {
    0: { threshold: 0.00 },
    1: { threshold: 0.25 },
    2: { threshold: 0.55 },
    3: { threshold: 0.80 },
};

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

export default function Hero() {
    // Refs for DOM and Canvas with strict typing
    const containerRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Refs for Animation Loop
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const centerRef = useRef({ cx: 0, cy: 0 });
    const dimensionsRef = useRef({ w: 0, h: 0 });
    const requestRef = useRef<number | null>(null);
    const scrollStateRef = useRef<number>(-1);

    const [uiState, setUiState] = useState<number>(0);

    useEffect(() => {
        let cachedContainerTop = 0;

        const canvas = canvasRef.current;
        if (!canvas) return; // Null check for canvas

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return; // Null check for context

        const container = containerRef.current;
        if (!container) return; // Null check for container

        const initEngine = () => {
            dimensionsRef.current.w = canvas.offsetWidth;
            dimensionsRef.current.h = canvas.offsetHeight;
            canvas.width = dimensionsRef.current.w;
            canvas.height = dimensionsRef.current.h;
            cachedContainerTop = container.offsetTop;

            const isMobile = dimensionsRef.current.w < 768;
            centerRef.current = {
                cx: dimensionsRef.current.w / 2 + (isMobile ? -60 : CONFIG.particleOffsetX),
                cy: dimensionsRef.current.h / 2,
            };


            particlesRef.current = Array.from(
                { length: NUM_PARTICLES },
                () => new Particle(dimensionsRef.current.w, dimensionsRef.current.h)
            );
        };

        let resizeTimeout: ReturnType<typeof setTimeout>; // تعریف تایمر

        const handleResize = () => {
            if (!canvasRef.current) return;
            const w = canvasRef.current.offsetWidth;
            const h = canvasRef.current.offsetHeight;

            // ۱. آپدیت فوری ابعاد بوم (برای جلوگیری از به هم ریختگی بصری)
            dimensionsRef.current.w = w;
            dimensionsRef.current.h = h;
            canvasRef.current.width = w;
            canvasRef.current.height = h;

            cachedContainerTop = container.offsetTop; // آپدیت کش اسکرول

            // ۲. به تعویق انداختن محاسبات سنگین ریاضی (Debounce)
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                particlesRef.current.forEach(p => {
                    p.states = {
                        sphere: p.getSphereCoords(w, h),
                        cube: p.getCubeCoords(w, h),
                        fluid: p.getFluidCoords(w, h),
                    };
                });
            }, 100); // ۲۵۰ میلی‌ثانیه پس از توقف کاربر، محاسبات انجام می‌شود
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const render = () => {
            const { w, h } = dimensionsRef.current;
            ctx.clearRect(0, 0, w, h);

            // Scroll Progress
            const pinDuration = container.offsetHeight - window.innerHeight;
            const scrollInPin = window.scrollY - cachedContainerTop;
            const rawProgress = pinDuration > 0 ? clamp(scrollInPin / pinDuration, 0, 1) : 0;

            // Determine State
            let currentState = 0;
            if (rawProgress >= STATES[3].threshold) currentState = 3;
            else if (rawProgress >= STATES[2].threshold) currentState = 2;
            else if (rawProgress >= STATES[1].threshold) currentState = 1;

            if (currentState !== scrollStateRef.current) {
                scrollStateRef.current = currentState;
                setUiState(currentState);
            }

            // Center Logic
            let targetCX = w / 2;
            let targetCY = h / 2;
            if (rawProgress < STATES[1].threshold) {
                const isMobile = w < 768;
                targetCX = w / 2 + (isMobile ? -60 : CONFIG.particleOffsetX);
                targetCY = h / 2 + CONFIG.particleOffsetY;
            }

            centerRef.current.cx = lerp(centerRef.current.cx, targetCX, 0.04);
            centerRef.current.cy = lerp(centerRef.current.cy, targetCY, 0.04);

            // Rotation Math
            const time = Date.now() * 0.0003;
            const mouseOffsetX = (mouseRef.current.x - w / 2) * 0.0008;
            const mouseOffsetY = (mouseRef.current.y - h / 2) * 0.0008;
            const rotY = time + mouseOffsetX;
            const rotX = time * 0.7 + mouseOffsetY;

            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
            const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

            // Draw Particles
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

    return (
        <section ref={containerRef} className={styles.heroPinContainer}>
            {/* بقیه JSX دقیقاً مشابه نسخه قبلی است، فقط Cast کردن متغیر CSS اضافه شده */}
            <section className={styles.heroPanel}>
                <div className={styles.canvasContainer}>
                    <canvas ref={canvasRef} className={styles.mainCanvas}></canvas>
                    <div className={styles.liquidOverlay}></div>
                </div>

                <div className={`${styles.heroWordmark} ${styles[`state${uiState}`] || ''}`}>
                    <div className={styles.wmGroup}>
                        <span className={styles.wmPart}>N</span>
                        <span className={styles.wmLetterO}>O</span>
                        <span className={styles.wmPart}>NATO</span>
                    </div>
                </div>

                <div className={`${styles.heroTagline} ${uiState !== 0 ? styles.hidden : ''}`}>
                    <p>We craft digital experiences<br />that leave a <span>mark</span>.</p>
                </div>

                <div className={`${styles.heroScrollHint} ${uiState !== 0 ? styles.hidden : ''}`}>
                    <div className={styles.scrollLine}></div>
                    <span>Scroll</span>
                </div>

                <div className={`${styles.burstCardsContainer} ${uiState === 1 ? styles.active : ''} ${uiState > 1 ? styles.exiting : ''}`}>
                    <div className={styles.burstCard} data-position="left-mid">
                        <div className={styles.cardGlow}></div>
                        <span className={styles.bcNumber}>01</span>
                        <h4>Build</h4>
                        <p>Engineer with precision and scalable architecture.</p>
                    </div>
                    <div className={styles.burstCard} data-position="right-top">
                        <div className={styles.cardGlow}></div>
                        <span className={styles.bcNumber}>02</span>
                        <h4>Design</h4>
                        <p>Craft every pixel with intentional aesthetic.</p>
                    </div>
                    <div className={styles.burstCard} data-position="right-bottom">
                        <div className={styles.cardGlow}></div>
                        <span className={styles.bcNumber}>03</span>
                        <h4>Launch</h4>
                        <p>Deploy & iterate relentlessly in the wild.</p>
                    </div>
                </div>

                <div className={`${styles.fluidWorkContainer} ${uiState === 2 ? styles.active : ''} ${uiState > 2 ? styles.exiting : ''}`}>
                    {['Branding', 'Web Platform', 'App Design', 'Motion', 'AI Integration'].map((tag, i) => (
                        <div
                            key={i}
                            className={styles.fluidWorkItem}
                            style={{ '--index': i } as React.CSSProperties} // <--- رفع ارور استایل متغیر CSS
                        >
                            <div className={styles.fwMeta}>
                                <span className={styles.fwNum}>0{i + 1}</span>
                                <div className={styles.fwLine}></div>
                                <span className={styles.fwTag}>{tag}</span>
                            </div>
                            <h3>{['Nexus Identity', 'Orbita Core', 'Zenith Flow', 'Vega Campaign', 'Synapse Model'][i]}</h3>
                        </div>
                    ))}
                </div>

                <div className={`${styles.heroConnect} ${uiState === 3 ? styles.active : ''}`}>
                    <div className={styles.connectBackdropBlur}></div>
                    <p className={styles.connectSub}>Ready to begin?</p>
                    <h2 className={styles.connectHeadline}>
                        Let's build<br />something <em>inevitable</em>.
                    </h2>
                    <div className={styles.magneticWrap}>
                        <a href="#contact" className={styles.ctaPremium}>
                            Start a Project
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>
        </section>
    );
}
