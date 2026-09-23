'use client';

import React, { useState, useEffect, useRef, useCallback, type ReactNode, type RefObject } from 'react';
import Image from 'next/image';
import { useLenis } from 'lenis/react';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { FRAMER_EASE_IN_OUT, FRAMER_EASE_OUT, FRAMER_SPRING_BOUNCE_05, prefersReducedMotion } from '@/lib/motion/eases';
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
    const borderRef = useRef<SVGRectElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

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

    const displayIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
    const currentProjectColor = projectColor(activeIndex);

    // Background (hovered or active project) and right-hand image (active project) swap like
    // framer's AnimatePresence mode="wait": the old one animates out, then the new one in.
    const bgShownIndex = usePresenceSwap(displayIndex, bgRef, BG_PRESENCE);
    const imageShownIndex = usePresenceSwap(activeIndex, imageRef, IMAGE_PRESENCE);
    const bgDisplayProject = PROJECTS_DATA[bgShownIndex];
    const activeDesktopProject = PROJECTS_DATA[imageShownIndex];
    const shownProjectColor = projectColor(imageShownIndex);

    // A description stays mounted while it collapses after its project stops being active.
    const [leaving, setLeaving] = useState<number[]>([]);
    const [prevActive, setPrevActive] = useState(activeIndex);
    if (prevActive !== activeIndex) {
        setPrevActive(activeIndex);
        setLeaving(list => (list.includes(prevActive) ? list : [...list, prevActive]));
    }

    // The right column's border draws itself while at least 30% of the column is in view and
    // undraws when it leaves (framer useInView amount 0.3, not once).
    useGSAP(() => {
        const column = rightColumnRef.current;
        const rect = borderRef.current;
        if (!column || !rect) return;
        const drawn = { length: 0 };
        let tween: gsap.core.Tween | undefined;
        const observer = new IntersectionObserver(([entry]) => {
            tween?.kill();
            tween = gsap.to(drawn, {
                length: entry.isIntersecting ? 1 : 0,
                duration: motionDuration(1.5),
                ease: FRAMER_EASE_IN_OUT,
                onUpdate: () => rect.setAttribute('stroke-dasharray', `${drawn.length} 1`),
            });
        }, { threshold: 0.3 });
        observer.observe(column);
        return () => {
            observer.disconnect();
            tween?.kill();
        };
    });

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
                <div
                    key={`bg-${bgDisplayProject.id}`}
                    ref={bgRef}
                    className={styles.bgMediaContainer}
                    style={BG_PRESENCE.from.style}
                >
                    <Image
                        src={bgDisplayProject.coverImage || bgDisplayProject.image}
                        alt={bgDisplayProject.title}
                        fill
                        sizes="100vw"
                        className={styles.bgMedia}
                    />
                    <div className={styles.bgOverlay} />
                </div>
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
                                        {/* Keyboard access: Enter/Space clicks bubble to the item's onClick */}
                                        <button
                                            type="button"
                                            className={styles.titleButton}
                                            aria-current={isActive ? 'true' : undefined}
                                        >
                                            {project.title}
                                        </button>
                                    </h3>

                                    {(isActive || leaving.includes(idx)) && (
                                        <ProjectDescription
                                            open={isActive}
                                            onClosed={() => setLeaving(list => list.filter(i => i !== idx))}
                                        >
                                            <p className={styles.projectGeneralDesc}>{project.generalDesc}</p>
                                            <div className={styles.tagsWrapper}>
                                                {project.tags.map(tag => (
                                                    <span key={tag} className={styles.tag}>{tag}</span>
                                                ))}
                                            </div>
                                        </ProjectDescription>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.rightColumn} ref={rightColumnRef}>
                    <div className={styles.rightContentWrapper}>
                        <svg className={styles.borderSvg} preserveAspectRatio="none">
                            <rect
                                ref={borderRef}
                                x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="23"
                                fill="none"
                                stroke={currentProjectColor}
                                strokeOpacity="0.3"
                                strokeWidth="2"
                                pathLength={1}
                                strokeDashoffset={0}
                                strokeDasharray="0 1"
                            />
                        </svg>

                        <div
                            key={`right-${activeDesktopProject.id}`}
                            ref={imageRef}
                            className={styles.imageAndAnnotations}
                            style={IMAGE_PRESENCE.from.style}
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
                                            color={shownProjectColor}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Ported framer animations are instant with reduced motion.
const motionDuration = (seconds: number) => (prefersReducedMotion() ? 0 : seconds);

// Enter/exit states of the two swapping layers. `style` is the first paint (server HTML and each
// new mount) and matches `vars`, the state GSAP animates from on enter and back to on exit.
interface PresenceStates {
    from: { vars: gsap.TweenVars; style: React.CSSProperties };
    to: gsap.TweenVars;
    duration: number;
}

const BG_PRESENCE: PresenceStates = {
    from: {
        vars: { opacity: 0, filter: 'blur(20px)', scale: 1.05 },
        style: { opacity: 0, filter: 'blur(20px)', transform: 'scale(1.05)' },
    },
    to: { opacity: 0.3, filter: 'blur(0px)', scale: 1 },
    duration: 0.8,
};

const IMAGE_PRESENCE: PresenceStates = {
    from: {
        vars: { opacity: 0, scale: 0.95 },
        style: { opacity: 0, transform: 'scale(0.95)' },
    },
    to: { opacity: 1, scale: 1 },
    duration: 0.5,
};

// Shows one keyed layer at a time: when `target` changes, the shown layer animates out, then the
// target is shown and animates in (also on first mount). A change during the exit only retargets
// the swap; returning to the shown key during the exit brings it back from where it is.
function usePresenceSwap(target: number, ref: RefObject<HTMLDivElement | null>, presence: PresenceStates): number {
    const [shown, setShown] = useState(target);
    const latestTarget = useRef(target);
    const exiting = useRef(false);

    // Enter: every newly shown layer (a new keyed element) animates in from its first paint.
    useGSAP(() => {
        const el = ref.current;
        if (!el) return;
        gsap.fromTo(el, presence.from.vars, {
            ...presence.to,
            duration: motionDuration(presence.duration),
            ease: FRAMER_EASE_OUT,
        });
    }, { dependencies: [shown] });

    useEffect(() => {
        latestTarget.current = target;
        const el = ref.current;
        if (!el) return;
        if (target === shown) {
            if (exiting.current) {
                exiting.current = false;
                gsap.to(el, { ...presence.to, duration: motionDuration(presence.duration), ease: FRAMER_EASE_OUT, overwrite: true });
            }
            return;
        }
        if (exiting.current) return;
        exiting.current = true;
        gsap.to(el, {
            ...presence.from.vars,
            duration: motionDuration(presence.duration),
            ease: FRAMER_EASE_OUT,
            overwrite: true,
            onComplete: () => {
                exiting.current = false;
                setShown(latestTarget.current);
            },
        });
    }, [target, shown, ref, presence]);

    return shown;
}

// The active project's description: expands from height 0 when mounted/opened, collapses when
// closed and then reports back so the list unmounts it (framer AnimatePresence, 0.4 s).
function ProjectDescription({ open, onClosed, children }: { open: boolean; onClosed: () => void; children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const onClosedRef = useRef(onClosed);
    useEffect(() => {
        onClosedRef.current = onClosed;
    });

    useGSAP(() => {
        const el = ref.current;
        if (!el) return;
        gsap.to(el, {
            height: open ? 'auto' : 0,
            opacity: open ? 1 : 0,
            duration: motionDuration(0.4),
            ease: FRAMER_EASE_OUT,
            overwrite: true,
            onComplete: open ? undefined : () => onClosedRef.current(),
        });
    }, { dependencies: [open] });

    return (
        <div ref={ref} className={styles.projectDescContainer} style={{ opacity: 0, height: 0 }}>
            {/* The top spacing lives inside, so height 0 is truly 0 (no jump when it mounts or leaves) */}
            <div className={styles.projectDescInner}>{children}</div>
        </div>
    );
}

function AnnotationPoint({ annotation, index, color }: { annotation: Annotation, index: number, color: string }) {
    const delay = 0.3 + (index * 0.1);
    const dir = annotation.lineDirection;
    const dotRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);

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
    const boxFromY = dir === 'bottom' ? -10 : 10;

    // On mount: the dot springs in, then the line draws, then the label fades up. The dot is centred
    // on the pin (−50%/−50%, where its line starts) under the scale.
    useGSAP(() => {
        const dot = dotRef.current;
        const path = pathRef.current;
        const box = boxRef.current;
        if (!dot || !path || !box) return;
        const instant = prefersReducedMotion();
        const at = (seconds: number) => (instant ? 0 : seconds);

        gsap.fromTo(dot, { xPercent: -50, yPercent: -50, scale: 0 }, {
            scale: 1,
            delay: at(delay),
            duration: at(FRAMER_SPRING_BOUNCE_05.duration),
            ease: FRAMER_SPRING_BOUNCE_05.ease,
        });

        const line = { length: 0, opacity: 0 };
        gsap.to(line, {
            length: 1,
            opacity: 0.8,
            delay: at(delay + 0.1),
            duration: at(0.6),
            ease: FRAMER_EASE_OUT,
            onUpdate: () => {
                path.setAttribute('stroke-dasharray', `${line.length} 1`);
                path.setAttribute('opacity', String(line.opacity));
            },
        });

        gsap.fromTo(box, { opacity: 0, filter: 'blur(5px)', y: boxFromY }, {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            delay: at(delay + 0.5),
            duration: at(0.4),
            ease: FRAMER_EASE_OUT,
        });
    });

    return (
        <div className={styles.annotationPin} style={{ left: annotation.x, top: annotation.y }}>
            <svg className={styles.annotationLineSvg} viewBox="-100 -100 200 200">
                <path
                    ref={pathRef}
                    d={pathD}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
                    opacity={0}
                    pathLength={1}
                    strokeDashoffset={0}
                    strokeDasharray="0 1"
                />
            </svg>

            <div ref={dotRef} className={styles.pinDotWrapper} style={{ transform: 'translate(-50%, -50%) scale(0)' }}>
                <div
                    className={styles.pinDot}
                    style={{
                        borderColor: `${color}80`,
                        boxShadow: `0 0 15px ${color}60`,
                        background: `${color}30`
                    }}
                ><div className={styles.pinDotInner} style={{ background: color }} />
                </div>
            </div>

            <div
                ref={boxRef}
                className={styles.annotationContent}
                style={{ ...boxStyles, borderTopColor: color, opacity: 0, filter: 'blur(5px)', transform: `translateY(${boxFromY}px)` }}
            >
                <p className={styles.annoTitle} style={{ color: color }}>{annotation.title}</p>
                <p className={styles.annoDesc}>{annotation.description}</p>
            </div>
        </div>
    );
}
