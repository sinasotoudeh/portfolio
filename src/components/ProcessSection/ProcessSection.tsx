// components/ProcessSection/ProcessSection.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { processNodes } from '../../data/processData'; // مسیر را در صورت نیاز اصلاح کنید
import styles from './ProcessSection.module.css';
import clsx from 'clsx';

export default function ProcessSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);

    // Mouse tracking with RequestAnimationFrame for $60fps$ performance
    useEffect(() => {
        let requestRef: number;
        const handleMouseMove = (e: MouseEvent) => {
            cancelAnimationFrame(requestRef);
            requestRef = requestAnimationFrame(() => {
                if (sectionRef.current && cursorRef.current) {
                    // Setting CSS Variables for mouse $X$ and $Y$
                    sectionRef.current.style.setProperty('--mouseX', `${e.clientX}px`);
                    sectionRef.current.style.setProperty('--mouseY', `${e.clientY}px`);
                }
            });
        };

        const section = sectionRef.current;
        if (section) {
            section.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            if (section) {
                section.removeEventListener('mousemove', handleMouseMove);
            }
            cancelAnimationFrame(requestRef);
        };
    }, []);

    // Split-text animation effect triggered on activeIndex change
    useEffect(() => {
        if (activeIndex !== null && sectionRef.current) {
            const descriptionElements = sectionRef.current.querySelectorAll(`.${styles.word}`);

            // Kill previous animations to prevent overlap
            gsap.killTweensOf(descriptionElements);

            gsap.fromTo(
                descriptionElements,
                { y: 20, opacity: 0, rotateX: -90 },
                {
                    y: 0, opacity: 1, rotateX: 0,
                    duration: 0.4,
                    stagger: 0.02,
                    ease: 'power3.out',
                    overwrite: true
                }
            );
        }
    }, [activeIndex]);

    // Utility to split text into words for animation
    const splitText = (text: string) => {
        return text.split(' ').map((word, index) => (
            <span key={index} className={styles.wordWrapper}>
                <span className={styles.word}>{word}</span>&nbsp;
            </span>
        ));
    };

    const activeNode = activeIndex !== null ? processNodes[activeIndex] : null;

    return (
        <section
            ref={sectionRef}
            className={styles.container}
            style={{
                backgroundColor: activeNode ? activeNode.bgColor : '#0f0f0f',
                color: activeNode ? activeNode.textColor : '#ffffff',
            } as React.CSSProperties}
        >
            {/* Custom Brutalist Cursor (Local to this section) */}
            <div ref={cursorRef} className={clsx(styles.cursor, activeIndex !== null && styles.cursorActive)} />

            <div className={styles.content}>
                <div className={styles.titlesList}>
                    {processNodes.map((node, index) => (
                        <h2
                            key={node.id}
                            className={clsx(
                                styles.title,
                                activeIndex !== null && activeIndex !== index && styles.titleMuted,
                                activeIndex === index && styles.titleActive
                            )}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                        >
                            <span className={styles.index}>{node.id}</span>
                            {node.title}
                        </h2>
                    ))}
                </div>

                <div className={styles.descriptionContainer}>
                    {activeNode && (
                        <p className={styles.description}>
                            {splitText(activeNode.description)}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
