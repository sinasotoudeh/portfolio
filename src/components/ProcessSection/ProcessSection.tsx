// components/ProcessSection/ProcessSection.tsx
'use client';

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';
import { processNodes } from '../../data/processData';
import styles from './ProcessSection.module.css';
import clsx from 'clsx';

// The mobile layout (smaller icons, mobile positions/scales, priority-1 icons only) — the same
// query as the breakpoints in ProcessSection.module.css.
const MOBILE_QUERY = '(max-width: 767px)';

// Stage animations set their start state before the browser paints (no one-frame flash of the icons).
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Rendering notes (what keeps this section light): every drop-shadow filter sits on a static inner
// element and all motion happens on its wrapper, so the GPU moves finished bitmaps instead of
// re-filtering them each frame; the stage colour is its own layer, so a colour change never repaints
// the titles or the art; each stage's icons stay mounted once shown (no re-download/re-decode) and
// the next stage is mounted ahead of time.
export default function ProcessSection() {
    const [scrollIndex, setScrollIndex] = useState<number | null>(null);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [mountedStages, setMountedStages] = useState<number[]>([]);

    const sectionRef = useRef<HTMLElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const displayIndex = hoverIndex !== null ? hoverIndex : scrollIndex;
    const activeNode = displayIndex !== null ? processNodes[displayIndex] : null;

    // Icons of the shown stage and the next one are mounted (and kept): no pop-in on arrival.
    if (displayIndex !== null) {
        const wanted = [displayIndex, Math.min(displayIndex + 1, processNodes.length - 1)];
        if (wanted.some(i => !mountedStages.includes(i))) {
            setMountedStages([...new Set([...mountedStages, ...wanted])]);
        }
    }

    useEffect(() => {
        if (!sectionRef.current || !wrapperRef.current) return;

        const ctx = gsap.context(() => {
            const totalNodes = processNodes.length;
            const totalScrollSpace = (totalNodes + 1) * 100;

            ScrollTrigger.create({
                trigger: wrapperRef.current,
                start: "top top",
                end: `+=${totalScrollSpace}%`,
                pin: sectionRef.current,
                scrub: true,
                onUpdate: (self) => {
                    const totalStages = totalNodes + 1;
                    const currentStage = Math.floor(self.progress * totalStages);

                    if (currentStage === 0) {
                        setScrollIndex(null);
                    } else {
                        const mappedIndex = Math.min(currentStage - 1, totalNodes - 1);
                        setScrollIndex(mappedIndex);
                    }
                }
            });
        }, wrapperRef);

        return () => ctx.revert();
    }, []);

    useIsomorphicLayoutEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const ctx = gsap.context(() => {
            const descWrapper = section.querySelector(`.${styles.absoluteDescription}`);
            if (descWrapper && displayIndex !== null) {
                gsap.fromTo(descWrapper,
                    { clipPath: 'inset(0% 0% 100% 0%)' },
                    { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power4.out', overwrite: true }
                );
            }

            const descriptionElements = section.querySelectorAll(`.${styles.word}`);
            if (descriptionElements.length > 0 && displayIndex !== null) {
                gsap.fromTo(
                    descriptionElements,
                    { y: 30, opacity: 0, rotateX: -60 },
                    {
                        y: 0, opacity: 1, rotateX: 0,
                        duration: 0.6, stagger: 0.015, ease: 'power3.out', overwrite: true, delay: 0.1
                    }
                );
            }

            // Icons of the other stages stop (their group is hidden by React).
            section.querySelectorAll<HTMLElement>('[data-stage]').forEach(group => {
                if (Number(group.dataset.stage) !== displayIndex) gsap.killTweensOf(group.children);
            });
            if (displayIndex === null) return;

            // The shown stage's icons fly in. Hidden ones (priority for this screen size) are skipped
            // and don't count toward the stagger.
            const isMobile = window.matchMedia(MOBILE_QUERY).matches;
            const group = section.querySelector<HTMLElement>(`[data-stage="${displayIndex}"]`);
            const icons = group ? [...group.children].filter((el): el is HTMLElement => el instanceof HTMLElement && el.offsetParent !== null) : [];
            icons.forEach((icon, i) => {
                const finalScale = Number(isMobile ? icon.dataset.scaleMobile : icon.dataset.scale);
                const delay = Number(icon.dataset.delay) || (i * 0.05);
                // Fixed raster scale while it flies (no re-rasterising the shadowed art mid-flight),
                // released at rest so the final frame is rasterised crisp.
                gsap.fromTo(icon,
                    { x: '100vw', scale: finalScale * 0.8, opacity: 0, rotation: 10, willChange: 'transform' },
                    {
                        x: '0vw',
                        scale: finalScale,
                        opacity: 1,
                        rotation: 0,
                        duration: 1.2,
                        delay,
                        ease: 'power4.out',
                        overwrite: true,
                        onComplete: () => { icon.style.willChange = ''; },
                    }
                );
            });
        });

        return () => ctx.revert();
    }, [displayIndex, mountedStages]);

    const splitText = useCallback((text: string) => {
        return text.split(' ').map((word, index) => (
            <span key={index} className={styles.wordWrapper}>
                <span className={styles.word}>{word}</span>&nbsp;
            </span>
        ));
    }, []);

    const handleMouseEnter = (index: number) => {
        if (!window.matchMedia(MOBILE_QUERY).matches) setHoverIndex(index);
    };

    const handleMouseLeave = () => {
        if (!window.matchMedia(MOBILE_QUERY).matches) setHoverIndex(null);
    };

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <section
                ref={sectionRef}
                id='process'
                className={styles.container}
                style={{
                    color: activeNode ? activeNode.textColor : '#ffffff',
                } as React.CSSProperties}
            >
                {/* Stage colour: its own layer, so changing it never repaints anything else */}
                <div
                    className={styles.bgColor}
                    style={{ backgroundColor: activeNode ? activeNode.bgColor : '#0f0f0f' }}
                    aria-hidden="true"
                />

                <div className={clsx(styles.bgImage, displayIndex !== null && styles.bgImageHidden)} aria-hidden="true">
                    <div className={styles.bgImageArt} style={{ backgroundImage: "url('/images/Process/default.png')" }} />
                </div>

                <div className={styles.imagesContainer}>
                    {processNodes.map((node, stage) => mountedStages.includes(stage) && (
                        <div
                            key={node.id}
                            data-stage={stage}
                            className={styles.stageIcons}
                            style={{ visibility: stage === displayIndex ? 'visible' : 'hidden' }}
                        >
                            {node.images.map((image, index) => {
                                const cfg = image.config;
                                const mobile = cfg.mobileOverride;
                                return (
                                    <div
                                        key={`${node.id}-img-${index}`}
                                        className={styles.fixedImage}
                                        data-priority={cfg.priority}
                                        data-scale={cfg.scale}
                                        data-scale-mobile={mobile?.scale ?? cfg.scale}
                                        data-delay={cfg.delay ?? ''}
                                        style={{
                                            '--top': `${cfg.top}%`,
                                            '--right': `${cfg.right}%`,
                                            '--top-mobile': `${mobile?.top ?? cfg.top}%`,
                                            '--right-mobile': `${mobile?.right ?? cfg.right}%`,
                                            zIndex: cfg.zIndex !== undefined ? cfg.zIndex : Math.floor(cfg.scale * 10),
                                        } as React.CSSProperties}
                                    >
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            width={image.width}
                                            height={image.height}
                                            className={styles.fixedImageArt}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div className={styles.content}>
                    <div className={styles.titlesList} onMouseLeave={handleMouseLeave}>
                        {processNodes.map((node, index) => {
                            const isHoveredNotScrolled = displayIndex === index && hoverIndex !== null && hoverIndex !== scrollIndex;
                            const isActive = displayIndex === index;
                            const isMuted = displayIndex !== null && !isActive;
                            const isLastItem = index === processNodes.length - 1;

                            return (
                                <div key={node.id} className={styles.titleWrapper} onMouseEnter={() => handleMouseEnter(index)}>
                                    <h2 className={clsx(
                                        styles.title,
                                        isMuted && styles.titleMuted,
                                        isActive && !isHoveredNotScrolled && styles.titleActive,
                                        isHoveredNotScrolled && styles.titleHollow
                                    )}>
                                        <span className={styles.index}>{node.id}</span>
                                        {node.title}
                                    </h2>
                                    {isActive && (
                                        <div className={clsx(
                                            styles.absoluteDescription,
                                            isLastItem && styles.descriptionTop
                                        )}>
                                            <p className={styles.description}>
                                                {splitText(node.description)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
