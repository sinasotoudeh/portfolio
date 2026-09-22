'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { PROJECTS_DATA, Annotation } from '@/data/workminimal-projects';
import { WORK_MOBILE_QUERY, projectColor } from './workTheme';
import styles from './WorkMinimal.module.css';

// Desktop layout of Selected Works (hidden by CSS at the mobile breakpoint): a sticky showcase
// inside the #work section, which is (projects + 0.8) viewports tall. Scrolling one viewport
// moves to the next project; clicking a title scrolls to it.
export default function WorkDesktop() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // The root Lenis instance (useLenis reads the root store).
    const lenis = useLenis();
    const showcaseRef = useRef<HTMLDivElement>(null);
    const rightColumnRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(rightColumnRef, { once: false, amount: 0.3 });

    const ticking = useRef(false);
    const isClickScrolling = useRef(false);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
    const mobileQuery = useRef<MediaQueryList | null>(null);

    // The #work section around the sticky showcase: its position drives the active project.
    const getContainer = () => showcaseRef.current?.parentElement ?? null;

    const handleScroll = useCallback(() => {
        mobileQuery.current ??= window.matchMedia(WORK_MOBILE_QUERY);
        if (mobileQuery.current.matches || isClickScrolling.current) return;

        if (!ticking.current) {
            window.requestAnimationFrame(() => {
                const container = getContainer();
                if (container) {
                    const rect = container.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    const containerTop = rect.top;

                    if (containerTop <= 0) {
                        const scrollDepth = Math.abs(containerTop);
                        let newIndex = Math.floor(scrollDepth / windowHeight);
                        newIndex = Math.max(0, Math.min(newIndex, PROJECTS_DATA.length - 1));

                        if (newIndex !== activeIndex) {
                            setActiveIndex(newIndex);
                        }
                    }
                }
                ticking.current = false;
            });
            ticking.current = true;
        }
    }, [activeIndex]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const activeDesktopProject = PROJECTS_DATA[activeIndex];
    const displayIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
    const bgDisplayProject = PROJECTS_DATA[displayIndex];
    const currentProjectColor = projectColor(activeIndex);

    // Scroll updates pause while the page travels to the clicked project. Through Lenis, which
    // owns page scrolling (D-14, D-20): the native smooth scroll stopped short of the target.
    const handleProjectClick = (index: number) => {
        const container = getContainer();
        if (container) {
            isClickScrolling.current = true;
            setActiveIndex(index);

            const windowHeight = window.innerHeight;
            const containerAbsoluteTop = window.scrollY + container.getBoundingClientRect().top;
            const targetScrollY = containerAbsoluteTop + (index * windowHeight) + (windowHeight * 0.5);

            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            if (lenis) {
                lenis.scrollTo(targetScrollY, {
                    onComplete: () => {
                        isClickScrolling.current = false;
                    },
                });
            } else {
                window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
                scrollTimeout.current = setTimeout(() => {
                    isClickScrolling.current = false;
                }, 1000);
            }
        }
    };

    return (
        <div ref={showcaseRef} className={styles.desktopShowcase}>
            <div className={styles.backgroundLayer}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`bg-${bgDisplayProject.id}`}
                        initial={{ opacity: 0, filter: 'blur(20px)', scale: 1.05 }}
                        animate={{ opacity: 0.3, filter: 'blur(0px)', scale: 1 }}
                        exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.05 }}
                        transition={{ duration: 0.8 }}
                        className={styles.bgMediaContainer}
                    >
                        <Image
                            src={bgDisplayProject.coverImage || bgDisplayProject.image}
                            alt={bgDisplayProject.title}
                            fill
                            sizes="100vw"
                            className={styles.bgMedia}
                        />
                        <div className={styles.bgOverlay} />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className={styles.splitContainer}>
                <div className={styles.leftColumn}>
                    <div className={styles.desktopHeader}>
                        <span className={styles.shNumber}>03</span>
                        <h2 id="work-title" className={styles.shTitle}>Selected Works</h2>
                    </div>

                    <div className={styles.projectListWrapper}>
                        {PROJECTS_DATA.map((project, idx) => {
                            const isActive = idx === activeIndex;
                            const isHovered = idx === hoveredIndex;
                            const projColor = projectColor(idx);

                            return (
                                <div
                                    key={project.id}
                                    className={styles.leftColItem}
                                    onClick={() => handleProjectClick(idx)}
                                    onMouseEnter={() => setHoveredIndex(idx)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <h3
                                        className={`${styles.sidebarTitle} ${isActive ? styles.sidebarTitleActive : styles.sidebarTitleInactive}`}
                                        style={{
                                            '--proj-color': projColor,
                                            WebkitTextStroke: (isActive || isHovered) ? '0px' : `1px ${projColor}80`,
                                            color: (isActive || isHovered) ? projColor : 'transparent',
                                        } as React.CSSProperties}
                                    >
                                        {project.title}
                                    </h3>

                                    <AnimatePresence>
                                        {isActive && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.4 }}
                                                className={styles.projectDescContainer}
                                            >
                                                <p className={styles.projectGeneralDesc}>{project.generalDesc}</p>
                                                <div className={styles.tagsWrapper}>
                                                    {project.tags.map(tag => (
                                                        <span key={tag} className={styles.tag}>{tag}</span>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.rightColumn} ref={rightColumnRef}>
                    <div className={styles.rightContentWrapper}>
                        <svg className={styles.borderSvg} preserveAspectRatio="none">
                            <motion.rect
                                x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="23"
                                fill="none"
                                stroke={currentProjectColor}
                                strokeOpacity="0.3"
                                strokeWidth="2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: isInView ? 1 : 0 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />
                        </svg>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`right-${activeDesktopProject.id}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5 }}
                                className={styles.imageAndAnnotations}
                            >
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={activeDesktopProject.image}
                                        alt={activeDesktopProject.title}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 60vw"
                                        className={styles.centerImage}
                                    />
                                    <div className={styles.annotationsContainer}>
                                        {activeDesktopProject.annotations.map((anno, i) => (
                                            <AnnotationPoint
                                                key={anno.id}
                                                annotation={anno}
                                                index={i}
                                                color={currentProjectColor}
                                            />
                                        ))}
                                    </div>
                                </div></motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AnnotationPoint({ annotation, index, color }: { annotation: Annotation, index: number, color: string }) {
    const delay = 0.3 + (index * 0.1);
    const dir = annotation.lineDirection;

    let pathD = "";
    let boxStyles: React.CSSProperties = {};

    switch (dir) {
        case 'left':
            pathD = "M 0 0 L -20 -20 L -80 -20";
            boxStyles = { right: '80px', top: '-40px' };
            break;
        case 'right':
            pathD = "M 0 0 L 20 -20 L 80 -20";
            boxStyles = { left: '80px', top: '-40px' };
            break;
        case 'top':
            pathD = "M 0 0 L 20 -20 L 20 -80";
            boxStyles = { bottom: '80px', left: '-20px' };
            break;
        case 'bottom':
            pathD = "M 0 0 L -20 20 L -20 80";
            boxStyles = { top: '80px', right: '-20px' };
            break;
    }

    return (
        <div className={styles.annotationPin} style={{ left: annotation.x, top: annotation.y }}>
            <svg className={styles.annotationLineSvg} viewBox="-100 -100 200 200">
                <motion.path
                    d={pathD}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    transition={{ delay: delay + 0.1, duration: 0.6, ease: "easeOut" }}
                />
            </svg>

            <motion.div
                className={styles.pinDotWrapper}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay, type: 'spring', bounce: 0.5 }}
            >
                <div
                    className={styles.pinDot}
                    style={{
                        borderColor: `${color}80`,
                        boxShadow: `0 0 15px ${color}60`,
                        background: `${color}30`
                    }}
                ><div className={styles.pinDotInner} style={{ background: color }} />
                </div>
            </motion.div>

            <motion.div
                className={styles.annotationContent}
                style={{ ...boxStyles, borderTopColor: color }}
                initial={{ opacity: 0, filter: 'blur(5px)', y: dir === 'bottom' ? -10 : 10 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                transition={{ delay: delay + 0.5, duration: 0.4 }}
            >
                <p className={styles.annoTitle} style={{ color: color }}>{annotation.title}</p>
                <p className={styles.annoDesc}>{annotation.description}</p>
            </motion.div>
        </div>
    );
}
