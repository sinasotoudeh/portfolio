// components/ProcessSection/ProcessSection.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { processNodes } from '../../data/processData';
import styles from './ProcessSection.module.css';
import clsx from 'clsx';

export default function ProcessSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const sectionRef = useRef<HTMLElement>(null);

    // انیمیشن Split-text
    useEffect(() => {
        if (activeIndex !== null && sectionRef.current) {
            const descriptionElements = sectionRef.current.querySelectorAll(`.${styles.word}`);

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
            id='process'
            className={styles.container}
            style={{
                // رنگ پس‌زمینه همچنان زیر تصویر کار می‌کند
                backgroundColor: activeNode ? activeNode.bgColor : '#0f0f0f',
                color: activeNode ? activeNode.textColor : '#ffffff',
            } as React.CSSProperties}
        >
            {/* لایه تصویر پس‌زمینه - منطبق با رفتار سکشن قبلی */}
            <div
                className={styles.bgImage}
                style={{ backgroundImage: "url('/images/process/e16c4c84-5ae3-4cb3-9ffa-1dbc90cdddde (1).png')" }}
            />


            <div className={styles.content}>
                <div
                    className={styles.titlesList}
                    onMouseLeave={() => setActiveIndex(null)}
                >
                    {processNodes.map((node, index) => (
                        < div
                            key={node.id}
                            className={styles.titleWrapper}
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                        >
                            <h2
                                className={clsx(
                                    styles.title,
                                    activeIndex !== null && activeIndex !== index && styles.titleMuted,
                                    activeIndex === index && styles.titleActive
                                )}
                            >
                                <span className={styles.index}>{node.id}</span>
                                {node.title}
                            </h2>
                        </div>
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
        </section >
    );
}
