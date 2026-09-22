'use client';

import React, { useState, useEffect } from 'react';
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
                            onClick={() => setMobileActiveProject(project)}
                        >
                            <h3
                                className={styles.hugeTitleMobile}
                                style={{
                                    WebkitTextStroke: `1.5px ${projColor}80`,
                                    color: projColor
                                } as React.CSSProperties}
                            >
                                {project.title}
                            </h3>
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

                        <button className={styles.closeBtnMobile} onClick={() => setMobileActiveProject(null)} aria-label="Close project details">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <div className={styles.mobileModalContent}>
                            <h3
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
