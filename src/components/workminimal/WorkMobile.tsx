'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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

            <AnimatePresence>
                {mobileActiveProject && (
                    <motion.div
                        className={styles.mobileModal}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="work-sheet-title"
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
                                style={{ color: projectColor(PROJECTS_DATA.findIndex(p => p.id === mobileActiveProject.id)) }}
                            >
                                {mobileActiveProject.title}
                            </h3>
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
                                    <div key={anno.id} className={styles.mobileAnnoCard} style={{ '--card-color': projectColor(PROJECTS_DATA.findIndex(p => p.id === mobileActiveProject.id)) } as React.CSSProperties}>
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
        </div>
    );
}
