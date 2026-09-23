'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import { cubicBezier, prefersReducedMotion } from '@/lib/motion/eases';
import { PROJECTS_DATA, Project } from '@/data/workminimal-projects';
import { WORK_MOBILE_QUERY, projectColor } from './workTheme';
import styles from './WorkMinimal.module.css';

// Mobile layout of Selected Works (shown by CSS at the mobile breakpoint): the project titles as
// a list; tapping one opens a full-screen sheet with its details.
export default function WorkMobile() {
    const [mobileActiveProject, setMobileActiveProject] = useState<Project | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const openerRef = useRef<HTMLElement | null>(null);
    const sheetRef = useRef<HTMLDivElement>(null);

    // The sheet stays rendered while it slides out after closing (framer AnimatePresence).
    const [sheetProject, setSheetProject] = useState<Project | null>(null);
    if (mobileActiveProject && sheetProject !== mobileActiveProject) {
        setSheetProject(mobileActiveProject);
    }
    const sheetOpen = mobileActiveProject !== null;
    const preparedSheet = useRef<HTMLDivElement | null>(null);

    // Slide up + fade in when opened, back down when closed, then unmount (0.4 s).
    useGSAP(() => {
        const sheet = sheetRef.current;
        if (!sheet) return;
        // A newly mounted sheet starts below the screen, transparent (before its first paint).
        if (preparedSheet.current !== sheet) {
            preparedSheet.current = sheet;
            gsap.set(sheet, { y: 0, yPercent: 100, opacity: 0 });
        }
        gsap.to(sheet, {
            yPercent: sheetOpen ? 0 : 100,
            opacity: sheetOpen ? 1 : 0,
            duration: prefersReducedMotion() ? 0 : 0.4,
            ease: SHEET_EASE,
            overwrite: true,
            onComplete: sheetOpen ? undefined : () => setSheetProject(null),
        });
    }, { dependencies: [sheetOpen, sheetProject] });

    useEffect(() => {
        const query = window.matchMedia(WORK_MOBILE_QUERY);
        const sync = () => setIsMobile(query.matches);
        sync();
        query.addEventListener('change', sync);
        return () => query.removeEventListener('change', sync);
    }, []);

    // The page behind the open sheet doesn't scroll (only while the mobile layout is showing).
    useEffect(() => {
        document.body.style.overflow = (isMobile && mobileActiveProject) ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobile, mobileActiveProject]);

    // Keyboard: the open sheet takes focus (close button) and Escape closes it; focus then returns
    // to the title that opened it.
    useEffect(() => {
        if (!mobileActiveProject) return;
        closeButtonRef.current?.focus();
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMobileActiveProject(null);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            openerRef.current?.focus();
        };
    }, [mobileActiveProject]);

    return (
        <div className={styles.mobileShowcase}>
            <div className={styles.mobileHeader}>
                <span className={styles.shNumber}>03</span>
                <h2 className={styles.shTitle}>Selected Works</h2>
            </div>

            <div className={styles.mobileListContainer}>
                {PROJECTS_DATA.map((project, idx) => {
                    const projColor = projectColor(idx);
                    return (
                        <div
                            key={project.id}
                            className={styles.mobileTitleWrapper}
                            onClick={(e) => {
                                openerRef.current = e.currentTarget.querySelector('button');
                                setMobileActiveProject(project);
                            }}
                        >
                            <h3
                                className={styles.hugeTitleMobile}
                                style={{
                                    WebkitTextStroke: `1.5px ${projColor}80`,
                                    color: projColor
                                } as React.CSSProperties}
                            >
                                {/* Keyboard access: Enter/Space clicks bubble to the wrapper's onClick */}
                                <button type="button" className={styles.titleButton}>
                                    {project.title}
                                </button>
                            </h3>
                        </div>
                    );
                })}
            </div>

            {sheetProject && (
                <div
                    ref={sheetRef}
                    className={styles.mobileModal}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="work-sheet-title"
                >
                    <div className={styles.mobileModalBg}>
                        <Image
                            src={sheetProject.coverImage || sheetProject.image}
                            alt={sheetProject.title}
                            fill
                            sizes="100vw"
                            className={styles.bgMedia}
                        />
                        <div className={styles.bgOverlaySolid} />
                    </div>

                    <button ref={closeButtonRef} className={styles.closeBtnMobile} onClick={() => setMobileActiveProject(null)} aria-label="Close project details">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    <div className={styles.mobileModalContent}>
                        <h3
                            id="work-sheet-title"
                            className={styles.modalTitle}
                            style={{ color: projectColor(PROJECTS_DATA.findIndex(p => p.id === sheetProject.id)) }}
                        >
                            {sheetProject.title}
                        </h3>
                        <p className={styles.modalDesc}>{sheetProject.generalDesc}</p>

                        <div className={styles.tagsWrapperMobile}>
                            {sheetProject.tags.map(tag => (
                                <span key={tag} className={styles.tag}>{tag}</span>
                            ))}
                        </div>

                        <div className={styles.mobileImageContainer}>
                            <Image
                                src={sheetProject.image}
                                alt={sheetProject.title}
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className={styles.mobileCenterImage}
                            />
                        </div>

                        <div className={styles.mobileAnnotationsList}>
                            {sheetProject.annotations.map((anno, i) => (
                                <div key={anno.id} className={styles.mobileAnnoCard} style={{ '--card-color': projectColor(PROJECTS_DATA.findIndex(p => p.id === sheetProject.id)) } as React.CSSProperties}>
                                    <div className={styles.mobileAnnoHeader}>
                                        <span className={styles.mobileAnnoIndex}>0{i + 1}</span>
                                        <h4 className={styles.mobileAnnoTitle}>{anno.title}</h4>
                                    </div>
                                    <p className={styles.mobileAnnoDesc}>{anno.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// framer's cubic-bezier(0.22, 1, 0.36, 1) from the original sheet transition.
const SHEET_EASE = cubicBezier(0.22, 1, 0.36, 1);
