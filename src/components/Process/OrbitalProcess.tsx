// OrbitalProcess.tsx - بازنویسی کامل
'use client';

import React, { useRef, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './Process.module.css';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const PROCESS_DATA = [
    { step: '01', title: 'Discover', desc: 'We immerse in your world until we see what others miss.', color: '#a78bfa', accent: '#7c3aed' },
    { step: '02', title: 'Define', desc: 'From chaos, we extract clarity. We define the north star.', color: '#60a5fa', accent: '#2563eb' },
    { step: '03', title: 'Design', desc: 'This is where intuition meets craft. Nothing is sacred until perfect.', color: '#f472b6', accent: '#db2777' },
    { step: '04', title: 'Build', desc: 'We engineer our designs with the same obsession as we design them.', color: '#34d399', accent: '#059669' },
    { step: '05', title: 'Launch', desc: 'We launch together, measure obsessively, and iterate.', color: '#fbbf24', accent: '#d97706' },
];

const Z_STEP = 1800;
const TOTAL_DEPTH = PROCESS_DATA.length * Z_STEP;

// تعداد particle‌های شناور
const PARTICLE_COUNT = 28;

function buildSpiralPath(positions: { x: number; y: number }[]): string {
    if (positions.length < 2) return '';
    let d = `M ${positions[0].x} ${positions[0].y}`;
    for (let i = 1; i < positions.length; i++) {
        const prev = positions[i - 1];
        const curr = positions[i];
        const cpx = (prev.x + curr.x) / 2;
        const cpy = (prev.y + curr.y) / 2;
        d += ` Q ${prev.x} ${prev.y} ${cpx} ${cpy}`;
    }
    d += ` L ${positions[positions.length - 1].x} ${positions[positions.length - 1].y}`;
    return d;
}

export default function OrbitalProcess() {
    const containerRef = useRef<HTMLDivElement>(null);
    const spiralRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const spiralPathRef = useRef<SVGPathElement>(null);
    const spiralDotRef = useRef<SVGCircleElement>(null);
    const spiralNodeDotsRef = useRef<SVGCircleElement[]>([]);
    const nucleusRef = useRef<HTMLDivElement>(null);
    const finalRevealRef = useRef<HTMLDivElement>(null);
    const ambientRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const progressFillRef = useRef<HTMLDivElement>(null);
    const stepLabelRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const particlesRef = useRef<(HTMLDivElement | null)[]>([]);

    const nodesPositions = useMemo(() => {
        return PROCESS_DATA.map((_, i) => {
            const a = 150;
            const b = 40;
            const theta = i * 2.1;
            const rv = a + b * theta;
            const x = r4(Math.cos(theta) * rv);
            const y = r4(Math.sin(theta) * (rv * 0.6));
            const z = -(i * Z_STEP);
            return { x, y, z };
        });
    }, []);


    const svgPadding = 80;
    const xs = nodesPositions.map(p => p.x);
    const ys = nodesPositions.map(p => p.y);
    const minX = Math.min(...xs) - svgPadding;
    const maxX = Math.max(...xs) + svgPadding;
    const minY = Math.min(...ys) - svgPadding;
    const maxY = Math.max(...ys) + svgPadding;
    const svgW = maxX - minX;
    const svgH = maxY - minY;

    const spiralPath = useMemo(() => buildSpiralPath(nodesPositions), [nodesPositions]);

    function seededRandom(seed: number): number {
        const x = Math.sin(seed + 1) * 10000;
        return x - Math.floor(x);
    }
    function r4(n: number): number {
        return Math.round(n * 10000) / 10000;
    }

    // و این useMemo رو
    const particles = useMemo(() => {
        return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
            id: i,
            x: r4(seededRandom(i * 7) * 100),
            y: r4(seededRandom(i * 13) * 100),
            size: r4(1 + seededRandom(i * 3) * 3),
            duration: 4 + seededRandom(i * 5) * 6,
            delay: seededRandom(i * 11) * 4,
        }));
    }, []);

    useGSAP(() => {
        if (!spiralRef.current || !containerRef.current) return;

        // float animation برای کارت‌ها
        const floatTweens = cardsRef.current.map((card, i) => {
            if (!card) return null;
            return gsap.to(card, {
                y: '+=10',
                rotationX: '+=1.2',
                rotationY: '+=1.8',
                duration: 3.5 + (i % 3) * 0.7,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut',
            });
        });

        // float برای particle‌ها
        particlesRef.current.forEach((p, i) => {
            if (!p) return;
            gsap.to(p, {
                y: `+=${15 + seededRandom(i * 17) * 20}`,
                x: `+=${(seededRandom(i * 19) - 0.5) * 20}`,
                opacity: 0.1 + seededRandom(i * 23) * 0.4,
                duration: particles[i].duration,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut',
                delay: particles[i].delay,
            });
        });

        let pathLength = 0;
        if (spiralPathRef.current) {
            pathLength = spiralPathRef.current.getTotalLength();
            gsap.set(spiralPathRef.current, {
                strokeDasharray: pathLength,
                strokeDashoffset: pathLength,
            });
        }

        // وضعیت اولیه
        cardsRef.current.forEach((card) => {
            if (!card) return;
            gsap.set(card, { opacity: 0, scale: 0.3, visibility: 'hidden' });
        });
        if (nucleusRef.current) gsap.set(nucleusRef.current, { opacity: 0, scale: 0 });
        if (finalRevealRef.current) gsap.set(finalRevealRef.current, { opacity: 0, visibility: 'hidden' });

        // node dots روی SVG
        spiralNodeDotsRef.current.forEach(dot => {
            if (dot) gsap.set(dot, { opacity: 0, attr: { r: 4 } });
        });

        let activeCardIndex = -1;

        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                pin: true,
                start: 'top top',
                end: '+=700%',
                scrub: 1.2,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const cameraZ = progress * TOTAL_DEPTH;

                    // عنوان محو
                    if (titleRef.current) {
                        gsap.set(titleRef.current, {
                            opacity: Math.max(0, 1 - progress * 12),
                            y: -(progress * 140),
                            force3D: true,
                        });
                    }

                    // spiral draw
                    if (spiralPathRef.current && pathLength > 0) {
                        const drawProgress = Math.min(progress / 0.85, 1);
                        gsap.set(spiralPathRef.current, {
                            strokeDashoffset: pathLength * (1 - drawProgress),
                            opacity: Math.min(drawProgress * 2, 0.5),
                        });
                    }

                    // dot روی مسیر
                    if (spiralDotRef.current && spiralPathRef.current && pathLength > 0) {
                        const dotProgress = Math.min(progress / 0.85, 1);
                        const point = spiralPathRef.current.getPointAtLength(dotProgress * pathLength);
                        gsap.set(spiralDotRef.current, {
                            attr: { cx: point.x, cy: point.y },
                            opacity: dotProgress > 0.05 ? 1 : 0,
                        });
                    }

                    // پیدا کردن کارت فعال
                    let newActiveIndex = -1;
                    cardsRef.current.forEach((card, i) => {
                        if (!card) return;
                        const cardZ = i * Z_STEP;
                        const dist = cardZ - cameraZ;
                        let opacity = 0;
                        let blur = 20;
                        let scale = 0.3;

                        if (dist > 0 && dist < 3000) {
                            opacity = gsap.utils.mapRange(3000, 600, 0, 1, dist);
                            blur = gsap.utils.mapRange(3000, 600, 18, 0, dist);
                            scale = gsap.utils.mapRange(3000, 600, 0.4, 1, dist);
                        } else if (dist <= 0 && dist > -1200) {
                            opacity = gsap.utils.mapRange(0, -1200, 1, 0, dist);
                            blur = gsap.utils.mapRange(0, -1200, 0, 15, dist);
                            scale = gsap.utils.mapRange(0, -1200, 1, 1.35, dist);
                            if (opacity > 0.3) newActiveIndex = i;
                        }

                        const visible = opacity > 0.01;
                        gsap.set(card, {
                            opacity: visible ? Math.min(opacity, 1) : 0,
                            scale: visible ? scale : 0.3,
                            filter: visible && blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : 'none',
                            visibility: visible ? 'visible' : 'hidden',
                            force3D: true,
                        });
                    });

                    // node dots روی spiral - روشن شدن با رسیدن به هر کارت
                    spiralNodeDotsRef.current.forEach((dot, i) => {
                        if (!dot) return;
                        const cardZ = i * Z_STEP;
                        const dist = cardZ - cameraZ;
                        const reached = dist <= 200;
                        gsap.set(dot, {
                            opacity: reached ? 0.9 : 0.2,
                            attr: { r: reached ? 6 : 4 },
                        });
                    });

                    // ambient color تغییر با کارت فعال
                    if (newActiveIndex !== activeCardIndex && newActiveIndex >= 0 && ambientRef.current) {
                        activeCardIndex = newActiveIndex;
                        const color = PROCESS_DATA[newActiveIndex].color;
                        gsap.to(ambientRef.current, {
                            background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${color}18 0%, transparent 70%)`,
                            duration: 0.8,
                            ease: 'power2.out',
                        });

                        // progress bar رنگ
                        if (progressFillRef.current) {
                            gsap.to(progressFillRef.current, {
                                background: color,
                                duration: 0.5,
                            });
                        }

                        // step label
                        if (stepLabelRef.current) {
                            gsap.fromTo(stepLabelRef.current,
                                { opacity: 0, y: 8 },
                                { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
                            );
                            stepLabelRef.current.textContent = PROCESS_DATA[newActiveIndex].title;
                            stepLabelRef.current.style.color = color;
                        }
                    }

                    // progress bar fill
                    if (progressFillRef.current && newActiveIndex >= 0) {
                        const fillPercent = ((newActiveIndex + 1) / PROCESS_DATA.length) * 100;
                        gsap.to(progressFillRef.current, {
                            width: `${fillPercent}%`,
                            duration: 0.6,
                            ease: 'power2.out',
                        });
                    }

                    // particle‌ها با scroll حرکت می‌کنن
                    particlesRef.current.forEach((p, i) => {
                        if (!p) return;
                        const parallaxY = progress * (30 + (i % 5) * 15);
                        gsap.set(p, { y: `+=${parallaxY * 0.01}` });
                    });

                    // nucleus
                    if (nucleusRef.current) {
                        const nucleusProgress = Math.max(0, (progress - 0.82) / 0.18);
                        gsap.set(nucleusRef.current, { opacity: nucleusProgress, scale: nucleusProgress });
                    }

                    // final reveal - نه انفجار، بلکه یه fade reveal زیبا
                    const finalProgress = Math.max(0, (progress - 0.88) / 0.12);
                    if (finalRevealRef.current) {
                        if (finalProgress > 0) {
                            gsap.set(finalRevealRef.current, {
                                opacity: Math.min(finalProgress * 1.5, 1),
                                scale: 0.85 + finalProgress * 0.15,
                                visibility: 'visible',
                            });
                            // spiral fade out در انتها
                            if (svgRef.current) {
                                gsap.set(svgRef.current, { opacity: 1 - finalProgress * 0.8 });
                            }
                        } else {
                            gsap.set(finalRevealRef.current, { opacity: 0, visibility: 'hidden' });
                            if (svgRef.current) gsap.set(svgRef.current, { opacity: 1 });
                        }
                    }
                },
            },
        });

        scrollTl.to(spiralRef.current, { z: TOTAL_DEPTH, ease: 'none' });

        return () => {
            floatTweens.forEach(t => t?.kill());
            scrollTl.kill();
        };
    }, { scope: containerRef });
    const viewBox = `${r4(minX)} ${r4(minY)} ${r4(svgW)} ${r4(svgH)}`;


    return (
        <section
            ref={containerRef}
            className={styles.section}
            id="process"
            aria-label="Our Work Process"
        >
            <div className={styles.viewport}>
                <div className={styles.noiseOverlay} aria-hidden="true" />
                <div className={styles.fogOverlay} aria-hidden="true" />

                {/* ambient color layer - با هر کارت رنگ عوض میشه */}
                <div ref={ambientRef} className={styles.ambientLayer} aria-hidden="true" />

                {/* particle‌های شناور */}
                <div className={styles.particleField} aria-hidden="true">
                    {particles.map((p) => (
                        <div
                            key={p.id}
                            ref={(el) => { particlesRef.current[p.id] = el; }}
                            className={styles.particle}
                            style={{
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                width: `${p.size}px`,
                                height: `${p.size}px`,
                                opacity: '0.15',
                            }}
                        />
                    ))}
                </div>

                {/* SVG spiral */}
                <svg
                    ref={svgRef}
                    className={styles.spiralSvg}
                    viewBox={viewBox}
                    aria-hidden="true"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <linearGradient id="spiralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
                            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#f472b6" stopOpacity="0.4" />
                        </linearGradient>
                        <filter id="spiralGlow">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter id="dotGlow">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* خط اصلی */}
                    <path
                        ref={spiralPathRef}
                        d={spiralPath}
                        fill="none"
                        stroke="url(#spiralGrad)"
                        strokeWidth="1.5"
                        filter="url(#spiralGlow)"
                        opacity="0"
                    />

                    {/* node dots - یکی برای هر کارت */}
                    {nodesPositions.map((pos, i) => (
                        <circle
                            key={`node-dot-${i}`}
                            ref={(el) => { if (el) spiralNodeDotsRef.current[i] = el; }}
                            cx={pos.x}
                            cy={pos.y}
                            r="4"
                            fill={PROCESS_DATA[i].color}
                            filter="url(#dotGlow)"
                            opacity="0.2"
                        />
                    ))}

                    {/* dot متحرک */}
                    <circle
                        ref={spiralDotRef}
                        r="5"
                        fill="#ffffff"
                        filter="url(#dotGlow)"
                        opacity="0"
                    />
                </svg>

                {/* progress indicator */}
                <div className={styles.progressIndicator} aria-hidden="true">
                    <div ref={progressBarRef} className={styles.progressBar}>
                        <div ref={progressFillRef} className={styles.progressFill} />
                    </div>
                    <span ref={stepLabelRef} className={styles.stepLabel} />
                </div>

                <div ref={titleRef} className={styles.mainTitle}>
                    <h2>Our Process</h2>
                    <p className={styles.subtitle}>Scroll to explore</p>
                </div>

                <div ref={spiralRef} className={styles.spiralContainer}>
                    {/* nucleus */}
                    <div
                        ref={nucleusRef}
                        className={styles.nucleus}
                        style={{ transform: `translate(-50%, -50%) translateZ(${-(PROCESS_DATA.length - 1) * Z_STEP - 200}px)` }}
                        aria-hidden="true"
                    >
                        <div className={styles.nucleusRing} />
                        <div className={styles.nucleusRing2} />
                        <div className={styles.nucleusCore} />
                    </div>

                    {PROCESS_DATA.map((item, i) => {
                        const pos = nodesPositions[i];
                        return (
                            <div
                                key={`node-${i}`}
                                className={styles.nodeWrapper}
                                style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px)` }}
                            >
                                <div
                                    ref={(el) => { cardsRef.current[i] = el; }}
                                    className={styles.glassCard}
                                    data-step={item.step}
                                    style={{ '--card-color': item.color } as React.CSSProperties}
                                >
                                    <div className={styles.cardGlow} aria-hidden="true" />
                                    <div className={styles.cardAccentLine} style={{ background: item.color }} aria-hidden="true" />
                                    <div className={styles.cardHeader}>
                                        <span className={styles.stepNum} style={{ color: item.color }}>
                                            {item.step}
                                            <span className={styles.stepTotal}> / 05</span>
                                        </span>
                                        <div className={styles.lineIndicator} style={{ background: `linear-gradient(90deg, ${item.color}66 0%, transparent 100%)` }} />
                                    </div>
                                    <h3 className={styles.cardTitle}>{item.title}</h3>
                                    <p className={styles.desc}>{item.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* final reveal - جایگزین finalBurst */}
                <div
                    ref={finalRevealRef}
                    className={styles.finalReveal}
                    aria-hidden="true"
                >
                    <div className={styles.revealRing} />
                    <div className={styles.revealRing2} />
                    <div className={styles.revealCore} />
                    <div className={styles.revealContent}>
                        <span className={styles.revealLabel}>Process Complete</span>
                        <p className={styles.revealCta}>Ready to begin?</p>
                    </div>
                </div>
            </div>
        </section >
    );
}
