'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { PROJECTS_DATA, Project, Annotation } from '@/data/workminimal-projects';
import styles from './WorkMinimal.module.css';

const PROJECT_COLORS = ['#FF3366', '#00C3FF', '#FFD500', '#00FF66', '#B033FF', '#FF8C00'];

export default function WorkMinimal() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [mobileActiveProject, setMobileActiveProject] = useState<Project | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const rightColumnRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(rightColumnRef, { once: false, amount: 0.3 });

    const ticking = useRef(false);
    const isClickScrolling = useRef(false);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleScroll = useCallback(() => {
        if (isMobile || isClickScrolling.current) return;

        if (!ticking.current) {
            window.requestAnimationFrame(() => {
                if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
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
    }, [activeIndex, isMobile]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        document.body.style.overflow = (isMobile && mobileActiveProject) ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobile, mobileActiveProject]);

    const activeDesktopProject = PROJECTS_DATA[activeIndex];
    const displayIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
    const bgDisplayProject = PROJECTS_DATA[displayIndex];
    const currentProjectColor = PROJECT_COLORS[activeIndex % PROJECT_COLORS.length];

    const handleProjectClick = (index: number) => {
        if (containerRef.current) {
            isClickScrolling.current = true;
            setActiveIndex(index);

            const windowHeight = window.innerHeight;
            const containerAbsoluteTop = window.scrollY + containerRef.current.getBoundingClientRect().top;
            const targetScrollY = containerAbsoluteTop + (index * windowHeight) + (windowHeight * 0.5);

            window.scrollTo({
                top: targetScrollY,
                behavior: 'smooth'
            });

            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => {
                isClickScrolling.current = false;
            }, 1000);
        }
    };

    return (
        <div
            ref={containerRef}
            className={styles.scrollContainer}
            style={{ height: isMobile ? 'auto' : `${(PROJECTS_DATA.length + 0.8) * 100}vh` }}
        >
            {!isMobile && (
                <section className={styles.desktopShowcase}>
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
                                    priority
                                />
                                <div className={styles.bgOverlay} />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className={styles.splitContainer}>
                        <div className={styles.leftColumn}>
                            <div className={styles.desktopHeader}>
                                <span className={styles.shNumber}>03</span>
                                <h2 className={styles.shTitle}>Selected Works</h2>
                            </div>

                            <div className={styles.projectListWrapper}>
                                {PROJECTS_DATA.map((project, idx) => {
                                    const isActive = idx === activeIndex;
                                    const isHovered = idx === hoveredIndex;
                                    const projColor = PROJECT_COLORS[idx % PROJECT_COLORS.length];

                                    return (
                                        <div
                                            key={project.id}
                                            className={styles.leftColItem}
                                            onClick={() => handleProjectClick(idx)}
                                            onMouseEnter={() => setHoveredIndex(idx)}
                                            onMouseLeave={() => setHoveredIndex(null)}
                                        >
                                            <h1
                                                className={`${styles.sidebarTitle} ${isActive ? styles.sidebarTitleActive : styles.sidebarTitleInactive}`}
                                                style={{
                                                    '--proj-color': projColor,
                                                    WebkitTextStroke: (isActive || isHovered) ? '0px' : `1px ${projColor}80`,
                                                    color: (isActive || isHovered) ? projColor : 'transparent',
                                                } as React.CSSProperties}
                                            >
                                                {project.title}
                                            </h1>

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
                                                priority
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
                </section>
            )}

            {isMobile && (
                <section className={styles.mobileShowcase}>
                    <div className={styles.mobileHeader}>
                        <span className={styles.shNumber}>03</span>
                        <h2 className={styles.shTitle}>Selected Works</h2>
                    </div>

                    <div className={styles.mobileListContainer}>
                        {PROJECTS_DATA.map((project, idx) => {
                            const projColor = PROJECT_COLORS[idx % PROJECT_COLORS.length];
                            return (
                                <div
                                    key={project.id}
                                    className={styles.mobileTitleWrapper}
                                    onClick={() => setMobileActiveProject(project)}
                                >
                                    <h1
                                        className={styles.hugeTitleMobile}
                                        style={{
                                            WebkitTextStroke: `1.5px ${projColor}80`,
                                            color: projColor
                                        } as React.CSSProperties}
                                    >
                                        {project.title}
                                    </h1>
                                </div>
                            );
                        })}
                    </div>

                    <AnimatePresence>
                        {mobileActiveProject && (
                            <motion.div
                                className={styles.mobileModal}
                                initial={{ opacity: 0, y: '100%' }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: '100%' }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <div className={styles.mobileModalBg}>
                                    <Image
                                        src={mobileActiveProject.coverImage || mobileActiveProject.image}
                                        alt={mobileActiveProject.title}
                                        fill
                                        sizes="100vw"
                                        className={styles.bgMedia}
                                    />
                                    <div className={styles.bgOverlaySolid} />
                                </div>

                                <button className={styles.closeBtnMobile} onClick={() => setMobileActiveProject(null)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>

                                <div className={styles.mobileModalContent}>
                                    <h2
                                        className={styles.modalTitle}
                                        style={{ color: PROJECT_COLORS[PROJECTS_DATA.findIndex(p => p.id === mobileActiveProject.id) % PROJECT_COLORS.length] }}
                                    >
                                        {mobileActiveProject.title}
                                    </h2>
                                    <p className={styles.modalDesc}>{mobileActiveProject.generalDesc}</p>

                                    <div className={styles.tagsWrapperMobile}>
                                        {mobileActiveProject.tags.map(tag => (
                                            <span key={tag} className={styles.tag}>{tag}</span>
                                        ))}
                                    </div>

                                    <div className={styles.mobileImageContainer}>
                                        <Image
                                            src={mobileActiveProject.image}
                                            alt={mobileActiveProject.title}
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            className={styles.mobileCenterImage}
                                        />
                                    </div>

                                    <div className={styles.mobileAnnotationsList}>
                                        {mobileActiveProject.annotations.map((anno, i) => (
                                            <div key={anno.id} className={styles.mobileAnnoCard} style={{ '--card-color': PROJECT_COLORS[PROJECTS_DATA.findIndex(p => p.id === mobileActiveProject.id) % PROJECT_COLORS.length] } as React.CSSProperties}>
                                                <div className={styles.mobileAnnoHeader}>
                                                    <span className={styles.mobileAnnoIndex}>0{i + 1}</span>
                                                    <h4 className={styles.mobileAnnoTitle}>{anno.title}</h4>
                                                </div>
                                                <p className={styles.mobileAnnoDesc}>{anno.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            )}
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
                <h5 className={styles.annoTitle} style={{ color: color }}>{annotation.title}</h5>
                <p className={styles.annoDesc}>{annotation.description}</p>
            </motion.div>
        </div>
    );
}
