// components/ProcessSection/ProcessSection.tsx
'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { processNodes } from '../../data/processData';
import styles from './ProcessSection.module.css';
import clsx from 'clsx';

// ثبت پلاگین اسکرول ترایگر
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function ProcessSection() {
    // تفکیک استیت اسکرول و استیت هاور
    const [scrollIndex, setScrollIndex] = useState<number | null>(null);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const [windowWidth, setWindowWidth] = useState<number>(0);
    const sectionRef = useRef<HTMLElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const imagesRef = useRef<(HTMLImageElement | null)[]>([]);

    // منطق نمایش: اگر هاور فعال باشد اولویت دارد، در غیر این صورت استیت اسکرول
    const displayIndex = hoverIndex !== null ? hoverIndex : scrollIndex;
    const activeNode = displayIndex !== null ? processNodes[displayIndex] : null;

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth > 0 && windowWidth < 768;
    const isTablet = windowWidth >= 768 && windowWidth < 1024;

    const visibleImages = useMemo(() => {
        if (!activeNode) return [];
        return activeNode.images.filter(img => {
            if (windowWidth === 0) return true;
            if (isMobile) return img.config.priority === 1;
            if (isTablet) return img.config.priority <= 2;
            return true;
        });
    }, [activeNode, windowWidth, isMobile, isTablet]);

    // منطق پین شدن و تغییر آیتم‌ها با اسکرول
    useEffect(() => {
        if (!sectionRef.current || !wrapperRef.current) return;

        const totalNodes = processNodes.length;
        // محاسبه میزان فضایی که اسکرول باید گیر کند (مثلا برای هر آیتم 100vh + یک فضای اولیه برای حالت دیفالت)
        const totalScrollSpace = (totalNodes + 1) * 100;

        const st = ScrollTrigger.create({
            trigger: wrapperRef.current,
            start: "top top",
            end: `+=${totalScrollSpace}%`,
            pin: sectionRef.current,
            scrub: true,
            onUpdate: (self) => {
                // تقسیم بندی پراگرس بین وضعیت‌های مختلف (وضعیت دیفالت + آیتم‌ها)
                const totalStages = totalNodes + 1;
                const currentStage = Math.floor(self.progress * totalStages);

                if (currentStage === 0) {
                    // در مرحله اول (قبل از اسکرول عمیق) استیت دیفالت است
                    setScrollIndex(null);
                } else {
                    // مپ کردن به ایندکس‌های آرایه
                    const mappedIndex = Math.min(currentStage - 1, totalNodes - 1);
                    setScrollIndex(mappedIndex);
                }
            }
        });

        return () => {
            st.kill();
        };
    }, []);

    useEffect(() => {
        if (!sectionRef.current) return;

        const descriptionElements = sectionRef.current.querySelectorAll(`.${styles.word}`);
        gsap.killTweensOf(descriptionElements);
        if (displayIndex !== null) {
            gsap.fromTo(
                descriptionElements,
                { y: 30, opacity: 0, rotateX: -60 },
                {
                    y: 0, opacity: 1, rotateX: 0,
                    duration: 0.6, stagger: 0.02, ease: 'power3.out', overwrite: true
                }
            );
        }

        const validImages = imagesRef.current.filter(Boolean);
        gsap.killTweensOf(validImages);

        if (displayIndex !== null && validImages.length > 0 && activeNode) {
            validImages.forEach((img, i) => {
                const imgData = visibleImages[i];
                if (!imgData) return;

                const baseConfig = imgData.config;
                const finalScale = (isMobile && baseConfig.mobileOverride?.scale)
                    ? baseConfig.mobileOverride.scale
                    : baseConfig.scale;

                gsap.fromTo(img,
                    { x: '100vw', scale: finalScale * 0.8, opacity: 0, rotation: 10 },
                    { x: '0vw', scale: finalScale, opacity: 1, rotation: 0, duration: 1.2, delay: baseConfig.delay || (i * 0.05), ease: 'power4.out', overwrite: true }
                );
            });
        }
    }, [displayIndex, activeNode, visibleImages, isMobile]);

    const splitText = (text: string) => {
        return text.split(' ').map((word, index) => (
            <span key={index} className={styles.wordWrapper}>
                <span className={styles.word}>{word}</span>&nbsp;
            </span>
        ));
    };

    imagesRef.current = [];

    // هندلرهای هاور که در موبایل غیرفعال می‌شوند
    const handleMouseEnter = (index: number) => {
        if (!isMobile) setHoverIndex(index);
    };

    const handleMouseLeave = () => {
        if (!isMobile) setHoverIndex(null);
    };

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <section
                ref={sectionRef}
                id='process'
                className={styles.container}
                style={{
                    backgroundColor: activeNode ? activeNode.bgColor : '#0f0f0f',
                    color: activeNode ? activeNode.textColor : '#ffffff',
                } as React.CSSProperties}
            >
                <div
                    className={clsx(styles.bgImage, displayIndex !== null && styles.bgImageHidden)}
                    style={{ backgroundImage: "url('/images/process/default.png')" }}
                />

                <div className={styles.imagesContainer}>
                    {visibleImages.map((image, index) => {
                        const cfg = image.config;
                        const finalTop = (isMobile && cfg.mobileOverride?.top !== undefined) ? cfg.mobileOverride.top : cfg.top;
                        const finalRight = (isMobile && cfg.mobileOverride?.right !== undefined) ? cfg.mobileOverride.right : cfg.right;

                        return (
                            <img
                                key={`${activeNode?.id}-img-${index}`}
                                ref={(el) => { imagesRef.current[index] = el; }}
                                src={image.src}
                                alt={image.alt}
                                className={styles.fixedImage}
                                style={{
                                    top: `${finalTop}%`,
                                    right: `${finalRight}%`,
                                    zIndex: Math.floor(cfg.scale * 10)
                                }}
                                loading="lazy"
                            />
                        );
                    })}
                </div>

                <div className={styles.content}>
                    <div className={styles.titlesList} onMouseLeave={handleMouseLeave}>
                        {processNodes.map((node, index) => {
                            // تشخیص اینکه آیا آیتم فعلی باید وضعیت Hollow بگیرد یا خیر
                            const isHoveredNotScrolled = displayIndex === index && hoverIndex !== null && hoverIndex !== scrollIndex;
                            const isActive = displayIndex === index;
                            const isMuted = displayIndex !== null && !isActive;

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
                                </div>
                            );
                        })}
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
        </div>
    );
}
