// src/components/WorkCarousel/WorkCarousel.tsx

'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useMotionValueEvent, AnimatePresence, useTransform, MotionValue } from 'framer-motion';
import { PROJECTS_DATA, ALL_FEATURES, TOTAL_FEATURES, Project, FlatFeature, Highlight } from '@/data/work-projects';
import styles from './Work.module.css';

export default function WorkCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    // ارتفاع کل برای اسکرول
    const scrollHeight = `${TOTAL_FEATURES * 150}vh`;

    const { scrollYProgress } = useScroll({
        target: scrollContainerRef,
        offset: ['start start', 'end end'],
    });

    useMotionValueEvent(scrollYProgress, 'change', (latest: number) => {
        if (TOTAL_FEATURES === 0) return;
        const newIndex = Math.min(Math.max(Math.round(latest * (TOTAL_FEATURES - 1)), 0), TOTAL_FEATURES - 1);
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    });

    const activeFeature = ALL_FEATURES[activeIndex];
    const activeProject = PROJECTS_DATA.find((p: Project) => p.id === activeFeature?.projectId);

    return (
        <section ref={scrollContainerRef} className={styles.workShowcase} style={{ height: scrollHeight }}>
            <div className={styles.stickyContainer}>

                {/* Global Progress Bar 
                <motion.div
                    className={styles.globalProgressBar}
                    style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
                />*/}

                <div className={styles.backgroundGlow} />
                <div className={styles.vignetteOverlay} />

                <div className={styles.splitLayout}>

                    {/* سمت چپ: توضیحات و هدر */}
                    <div className={styles.textContent}>

                        {/* هدر هماهنگ با استایل گلوبال 
                        <div className="section-header" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                            <span className="sh-number">03</span>
                            <div className="sh-title-wrap">
                                <h2 className="sh-title">Selected Works</h2>
                                <p className="sh-sub">A showcase of our most impactful digital experiences.</p>
                            </div>
                        </div>*/}

                        {/* اطلاعات کلی پروژه */}
                        <div className={styles.projectContext}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeProject?.id || 'empty-proj'}
                                    initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <h3 className={styles.projectTitle}>{activeProject?.title}</h3>
                                    <p className={styles.projectDesc}>{activeProject?.generalDesc}</p>
                                    <div className={styles.projectTags}>
                                        {activeProject?.tags.map((tag: string) => (
                                            <span key={tag} className={styles.tag}>{tag}</span>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* اطلاعات فیچر فعال */}
                        <div className={styles.featureDetails}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeFeature?.id || 'empty-feat'}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -40 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    className="glass-card" /* استفاده از کلاس گلوبال */
                                    style={{ padding: '2.5rem' }}
                                >
                                    <span className={styles.featureCounter}>
                                        {String(activeIndex + 1).padStart(2, '0')} / {String(TOTAL_FEATURES).padStart(2, '0')}
                                    </span>
                                    <h4 className={styles.featureTitle}>{activeFeature?.title}</h4>
                                    <p className={styles.featureDesc}>{activeFeature?.desc}</p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* سمت راست: گالری سه‌بعدی */}
                    <div className={styles.galleryContent}>
                        <div className={styles.deckContainer}>
                            {ALL_FEATURES.map((feature: FlatFeature, i: number) => {
                                const distance = i - activeIndex;
                                const isActive = distance === 0;

                                let xPos = '0%';
                                let yPos = '0%';
                                let scale = 1;
                                let opacity = 1;
                                let blur = 0;
                                let zIndex = 20 - Math.abs(distance);

                                if (distance > 0) {
                                    xPos = `${distance * 12}%`;
                                    yPos = `${distance * 15}%`;
                                    scale = Math.max(1 - distance * 0.15, 0.5);
                                    opacity = Math.max(1 - distance * 0.3, 0);
                                    blur = distance * 4;
                                } else if (distance < 0) {
                                    xPos = `${distance * 12}%`;
                                    yPos = `${distance * 15}%`;
                                    scale = Math.max(1 + distance * 0.15, 0.5);
                                    opacity = Math.max(1 + distance * 0.3, 0);
                                    blur = Math.abs(distance) * 4;
                                }

                                return (
                                    <motion.div
                                        key={feature.id}
                                        className={styles.featureCard}
                                        initial={false}
                                        animate={{
                                            x: xPos,
                                            y: yPos,
                                            scale: scale,
                                            opacity: opacity,
                                            zIndex: zIndex,
                                            filter: `blur(${blur}px) brightness(${isActive ? 100 : 40}%)`
                                        }}
                                        transition={{ type: "spring", stiffness: 260, damping: 30 }}
                                    >
                                        {/* لایه تصویر با Overflow Hidden */}
                                        <div className={styles.cardInteractiveMock}>
                                            {feature.image ? (
                                                <Image src={feature.image} alt={feature.title} fill sizes="(max-width: 768px) 100vw, 50vw" className={styles.mockImage} />
                                            ) : (
                                                <div className={styles.placeholderMock} />
                                            )}
                                        </div>

                                        {/* لایه Highlights کاملا مستقل از ماسک تصویر (بدون Overflow) */}
                                        <div className={styles.highlightsContainer}>
                                            {isActive && feature.highlights?.map((highlight: Highlight, idx: number) => (
                                                <HighlightItem
                                                    key={`hl-${feature.id}-${idx}`}
                                                    highlight={highlight}
                                                    index={i}
                                                    total={TOTAL_FEATURES}
                                                    progress={scrollYProgress}
                                                    delayIndex={idx}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                </div>

                {/* Progress Indicators (Dots) */}
                <div className={styles.progressIndicators}>
                    {ALL_FEATURES.map((_, idx) => (
                        <motion.div
                            key={`dot-${idx}`}
                            className={styles.dot}
                            animate={{
                                scale: idx === activeIndex ? 1.5 : 1,
                                opacity: idx === activeIndex ? 1 : 0.3,
                                backgroundColor: idx === activeIndex ? 'var(--color-accent-primary)' : 'var(--text-muted)',
                                width: idx === activeIndex ? '24px' : '6px'
                            }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}

// ─── Sub-component: HighlightItem ───
function HighlightItem({ highlight, index, total, progress, delayIndex }: { highlight: Highlight, index: number, total: number, progress: MotionValue<number>, delayIndex: number }) {
    // محاسبه مرکز اسکرول برای این کارت خاص
    const centerPoint = index / (total - 1 || 1);
    const span = 1 / (total - 1 || 1);

    // استفاده از Callback به جای آرایه برای جلوگیری از خطای WAAPI Offsets
    const yTransform = useTransform(progress, (latest) => {
        const distance = latest - centerPoint;
        const halfSpan = span / 2;

        // محاسبه نسبت فاصله (بین 1- تا 1)
        const ratio = Math.max(-1, Math.min(1, distance / halfSpan));

        // تبدیل نسبت به حرکت پیکسلی (مثلا از 40px تا -40px)
        return ratio * -40;
    });

    const opacityTransform = useTransform(progress, (latest) => {
        const distance = Math.abs(latest - centerPoint);
        const maxDistance = span / 3;

        // اگر از محدوده خارج شد، شفافیت صفر شود
        if (distance >= maxDistance) return 0;

        // در مرکز شفافیت 1 و هرچه دورتر می‌شود به سمت 0 می‌رود
        return 1 - (distance / maxDistance);
    });

    return (
        <motion.div
            className={styles.highlightChip}
            style={{
                ...(highlight.pos as React.CSSProperties),
                y: yTransform,
                opacity: opacityTransform
            }}
        >
            {highlight.type === 'stat' && (
                <div className={styles.statContent}>
                    <span className={styles.statValue}>{highlight.value}</span>
                    <span className={styles.statLabel}>{highlight.label}</span>
                </div>
            )}
            {(highlight.type === 'badge' || highlight.type === 'tooltip') && (
                <div className={styles.badgeContent}>{highlight.text}</div>
            )}
        </motion.div>
    );
}
