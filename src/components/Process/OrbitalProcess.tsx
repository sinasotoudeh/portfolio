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
    { step: '01', title: 'Discover', desc: 'We immerse in your world until we see what others miss.' },
    { step: '02', title: 'Define', desc: 'From chaos, we extract clarity. We define the north star.' },
    { step: '03', title: 'Design', desc: 'This is where intuition meets craft. Nothing is sacred until perfect.' },
    { step: '04', title: 'Build', desc: 'We engineer our designs with the same obsession as we design them.' },
    { step: '05', title: 'Launch', desc: 'We launch together, measure obsessively, and iterate.' },
];

const Z_STEP = 1800;
const TOTAL_DEPTH = PROCESS_DATA.length * Z_STEP;

// محاسبه نقاط مارپیچ ارشمیدوسی برای SVG path
function buildArchimedeanSpiralPath(positions: { x: number; y: number }[]): string {
    if (positions.length < 2) return '';
    // رسم خط از اولین نقطه تا آخرین با curve نرم
    const pts = positions.map(p => ({ x: p.x, y: p.y }));
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const curr = pts[i];
        const cpx = (prev.x + curr.x) / 2;
        const cpy = (prev.y + curr.y) / 2;
        d += ` Q ${prev.x} ${prev.y} ${cpx} ${cpy}`;
    }
    d += ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
    return d;
}

export default function OrbitalProcess() {
    const containerRef = useRef<HTMLDivElement>(null);
    const spiralRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const spiralPathRef = useRef<SVGPathElement>(null);
    const spiralDotRef = useRef<SVGCircleElement>(null);
    const nucleusRef = useRef<HTMLDivElement>(null);
    const finalBurstRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    // مختصات 2D برای SVG مارپیچ (پروجکشن روی صفحه)
    const nodesPositions = useMemo(() => {
        return PROCESS_DATA.map((_, i) => {
            const a = 150;
            const b = 40;
            const theta = i * 2.1;
            const r = a + b * theta;
            const x = Math.cos(theta) * r;
            const y = Math.sin(theta) * (r * 0.6);
            const z = -(i * Z_STEP);
            return { x, y, z };
        });
    }, []);

    // SVG viewBox مرکز در 0,0
    const svgPadding = 80;
    const xs = nodesPositions.map(p => p.x);
    const ys = nodesPositions.map(p => p.y);
    const minX = Math.min(...xs) - svgPadding;
    const maxX = Math.max(...xs) + svgPadding;
    const minY = Math.min(...ys) - svgPadding;
    const maxY = Math.max(...ys) + svgPadding;
    const svgW = maxX - minX;
    const svgH = maxY - minY;

    const spiralPath = useMemo(() => buildArchimedeanSpiralPath(nodesPositions), [nodesPositions]);

    useGSAP(() => {
        if (!spiralRef.current || !containerRef.current) return;

        // Float animation - فقط روی transform کار می‌کند، نه opacity/scale
        const floatTweens = cardsRef.current.map((card, i) => {
            if (!card) return null;
            return gsap.to(card, {
                y: '+=12',
                rotationX: '+=1.5',
                rotationY: '+=2',
                duration: 3.5 + (i % 3) * 0.7,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut',
                paused: false,
            });
        });

        // SVG path length برای dash animation
        let pathLength = 0;
        if (spiralPathRef.current) {
            pathLength = spiralPathRef.current.getTotalLength();
            gsap.set(spiralPathRef.current, {
                strokeDasharray: pathLength,
                strokeDashoffset: pathLength,
            });
        }

        // وضعیت اولیه کارت‌ها
        cardsRef.current.forEach((card) => {
            if (!card) return;
            gsap.set(card, { opacity: 0, scale: 0.3, visibility: 'hidden' });
        });

        // وضعیت اولیه nucleus
        if (nucleusRef.current) {
            gsap.set(nucleusRef.current, { opacity: 0, scale: 0 });
        }

        let lastProgress = 0;

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

                    // عنوان محو می‌شود
                    if (titleRef.current) {
                        const titleOpacity = Math.max(0, 1 - progress * 10);
                        gsap.set(titleRef.current, {
                            opacity: titleOpacity,
                            y: -(progress * 120),
                            force3D: true,
                        });
                    }

                    // SVG spiral draw - با پیشرفت اسکرول خط کشیده می‌شود
                    if (spiralPathRef.current && pathLength > 0) {
                        // خط با پیشرفت اسکرول ظاهر می‌شود (تا 85% اسکرول)
                        const drawProgress = Math.min(progress / 0.85, 1);
                        const offset = pathLength * (1 - drawProgress);
                        gsap.set(spiralPathRef.current, {
                            strokeDashoffset: offset,
                            opacity: Math.min(drawProgress * 3, 0.6),
                        });
                    }

                    // dot روی مسیر حرکت می‌کند
                    if (spiralDotRef.current && spiralPathRef.current && pathLength > 0) {
                        const dotProgress = Math.min(progress / 0.85, 1);
                        const point = spiralPathRef.current.getPointAtLength(dotProgress * pathLength);
                        gsap.set(spiralDotRef.current, {
                            attr: { cx: point.x, cy: point.y },
                            opacity: dotProgress > 0.05 ? 0.9 : 0,
                        });
                    }

                    // کارت‌ها
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
                            scale = gsap.utils.mapRange(0, -1200, 1, 1.4, dist);
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

                    // اتفاق بصری پایانی - وقتی progress > 0.88
                    const finalProgress = Math.max(0, (progress - 0.88) / 0.12);
                    if (finalBurstRef.current) {
                        if (finalProgress > 0) {
                            gsap.set(finalBurstRef.current, {
                                opacity: finalProgress < 0.5
                                    ? finalProgress * 2
                                    : 1 - (finalProgress - 0.5) * 2,
                                scale: 0.5 + finalProgress * 2.5,
                                visibility: 'visible',
                            });
                        } else {
                            gsap.set(finalBurstRef.current, { opacity: 0, visibility: 'hidden' });
                        }
                    }

                    // nucleus ظاهر می‌شود در انتها
                    if (nucleusRef.current) {
                        const nucleusProgress = Math.max(0, (progress - 0.82) / 0.18);
                        gsap.set(nucleusRef.current, {
                            opacity: nucleusProgress,
                            scale: nucleusProgress,
                        });
                    }

                    lastProgress = progress;
                },
            },
        });

        scrollTl.to(spiralRef.current, {
            z: TOTAL_DEPTH,
            ease: 'none',
        });

        return () => {
            floatTweens.forEach(t => t?.kill());
            scrollTl.kill();
        };
    }, { scope: containerRef });

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

                {/* SVG مارپیچ ارشمیدوسی - در پس‌زمینه */}
                <svg
                    ref={svgRef}
                    className={styles.spiralSvg}
                    viewBox={`${minX} ${minY} ${svgW} ${svgH}`}
                    aria-hidden="true"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <linearGradient id="spiralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#f472b6" stopOpacity="0.3" />
                        </linearGradient>
                        <filter id="spiralGlow">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    {/* خط اصلی مارپیچ */}
                    <path
                        ref={spiralPathRef}
                        d={spiralPath}
                        fill="none"
                        stroke="url(#spiralGrad)"
                        strokeWidth="1.5"
                        filter="url(#spiralGlow)"
                        opacity="0"
                    />
                    {/* dot متحرک روی مسیر */}
                    <circle
                        ref={spiralDotRef}
                        r="5"
                        fill="#a78bfa"
                        filter="url(#spiralGlow)"
                        opacity="0"
                    />
                    {/* نقطه مرکزی */}
                    <circle
                        cx={nodesPositions[nodesPositions.length - 1].x}
                        cy={nodesPositions[nodesPositions.length - 1].y}
                        r="8"
                        fill="none"
                        stroke="#a78bfa"
                        strokeWidth="1"
                        opacity="0.3"
                    />
                </svg>

                <div ref={titleRef} className={styles.mainTitle}>
                    <h2>Our Process</h2>
                    <p className={styles.subtitle}>Scroll to explore the unknown</p>
                </div>

                <div ref={spiralRef} className={styles.spiralContainer}>
                    {/* هسته مرکزی */}
                    <div
                        ref={nucleusRef}
                        className={styles.nucleus}
                        style={{
                            transform: `translate(-50%, -50%) translateZ(${-(PROCESS_DATA.length - 1) * Z_STEP - 200}px)`
                        }}
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
                                style={{
                                    transform: `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px)`
                                }}
                            >
                                <div
                                    ref={(el) => { cardsRef.current[i] = el; }}
                                    className={styles.glassCard}
                                    data-step={item.step}
                                >
                                    <div className={styles.cardGlow} aria-hidden="true" />
                                    <div className={styles.cardHeader}>
                                        <span className={styles.stepNum}>
                                            {item.step}
                                            <span className={styles.stepTotal}> / 05</span>
                                        </span>
                                        <div className={styles.lineIndicator} />
                                    </div>
                                    <h3 className={styles.cardTitle}>{item.title}</h3>
                                    <p className={styles.desc}>{item.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* اتفاق بصری پایانی */}
                <div
                    ref={finalBurstRef}
                    className={styles.finalBurst}
                    aria-hidden="true"
                >
                    <div className={styles.burstRing} />
                    <div className={styles.burstRing2} />
                    <div className={styles.burstCore} />
                    <div className={styles.burstText}>
                        <span>Ready to begin?</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
