// ResumeDashboard.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeData } from "@/data/resumeData";
import styles from './ResumeDashboard.module.css';

const TAB_ICONS: Record<string, string> = {
    about: '◈',
    expertise: '⬡',
    experience: '◎',
    projects: '◇',
    education: '△',
};

export default function ResumeDashboard() {
    const [activeTab, setActiveTab] = useState(resumeData[0].id);
    const [activeSection, setActiveSection] = useState(resumeData[0].subSections[0].id);
    const [sheetOpen, setSheetOpen] = useState(false);

    const contentRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null); // رفرنس برای کل سکشن

    // اسکرول نرم به داخل اسکرین هنگام کلیک روی سکشن
    const handleSectionClick = () => {
        if (sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    useEffect(() => {
        const tab = resumeData.find(t => t.id === activeTab);
        if (tab) setActiveSection(tab.subSections[0].id);
        setSheetOpen(false);
    }, [activeTab]);

    useEffect(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        setSheetOpen(false);
    }, [activeSection]);

    const currentTab = resumeData.find(t => t.id === activeTab)!;
    const currentSection = currentTab?.subSections.find(s => s.id === activeSection) ?? currentTab?.subSections[0];
    const hasSubSections = currentTab.subSections.length > 1;

    return (
        <section
            ref={sectionRef}
            onClick={handleSectionClick}
            className={styles.root}
            style={{ position: 'relative', height: '100vh', overflow: 'hidden' }} // تنظیم ارتفاع دقیق برابر با ویوپورت
        >
            {/* ── Desktop: macOS Window ── */}
            <div className={styles.window}>

                {/* Title Bar */}
                <div className={styles.titleBar}>
                    <div className={styles.trafficLights}>
                        <span className={styles.tlRed} />
                        <span className={styles.tlYellow} />
                        <span className={styles.tlGreen} />
                    </div>
                    <span className={styles.windowTitle}>sina_sotoudeh_resume.exe</span>
                    <div className={styles.titleBarRight} />
                </div>

                {/* Desktop Tab Bar */}
                <div className={styles.tabBar}>
                    {resumeData.map(tab => (
                        <button
                            key={tab.id}
                            onClick={(e) => { e.stopPropagation(); setActiveTab(tab.id); }}
                            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
                        >
                            <span className={styles.tabIcon}>{TAB_ICONS[tab.id]}</span>
                            <span>{tab.title}</span>
                            {activeTab === tab.id && (
                                <motion.span
                                    layoutId="tabUnderline"
                                    className={styles.tabUnderline}
                                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div className={styles.body}>
                    {/* Sidebar */}
                    <AnimatePresence>
                        {hasSubSections && (
                            <motion.aside
                                className={styles.sidebar}
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -16 }}
                                transition={{ duration: 0.2 }}
                            >
                                <p className={styles.sidebarLabel}>SECTIONS</p>
                                {currentTab.subSections.map(sub => (
                                    <button
                                        key={sub.id}
                                        onClick={(e) => { e.stopPropagation(); setActiveSection(sub.id); }}
                                        className={`${styles.sideItem} ${activeSection === sub.id ? styles.sideItemActive : ''}`}
                                    >
                                        {activeSection === sub.id && (
                                            <motion.span
                                                layoutId="sideIndicator"
                                                className={styles.sideIndicator}
                                                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                            />
                                        )}
                                        <span className={styles.sideItemText}>{sub.title}</span>
                                    </button>
                                ))}
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* Content */}
                    <div ref={contentRef} className={styles.content}>
                        <AnimatePresence mode="wait">
                            {currentSection && (
                                <motion.div
                                    key={currentSection.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    className={styles.contentInner}
                                >
                                    {/* عنوان گزینه در بالای محتوا */}
                                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                                        {currentSection.title}
                                    </h3>

                                    <SectionContent section={currentSection} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* ── Mobile: Bottom Nav ── */}
            <nav
                className={styles.mobileNav}
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%' }} // چسبیدن به پایین سکشن نه ویوپورت
            >
                {resumeData.map(tab => (
                    <button
                        key={tab.id}
                        onClick={(e) => { e.stopPropagation(); setActiveTab(tab.id); }}
                        className={`${styles.mobileNavBtn} ${activeTab === tab.id ? styles.mobileNavBtnActive : ''}`}
                    >
                        <span className={styles.mobileNavIcon}>{TAB_ICONS[tab.id]}</span>
                        <span className={styles.mobileNavLabel}>{tab.title}</span>{activeTab === tab.id && (
                            <motion.span
                                layoutId="mobileNavDot"
                                className={styles.mobileNavDot}
                                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                            />
                        )}
                    </button>
                ))}
            </nav>

            {/* ── Mobile: Sub-section Pill Bar ── */}
            {hasSubSections && (
                <div className={styles.mobilePillBar}>
                    {currentTab.subSections.map(sub => (
                        <button
                            key={sub.id}
                            onClick={(e) => { e.stopPropagation(); setActiveSection(sub.id); }}
                            className={`${styles.mobilePill} ${activeSection === sub.id ? styles.mobilePillActive : ''}`}
                        >
                            {sub.title}
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}

/* ─── Section Content Renderer ─── */
function SectionContent({ section }: { section: any }) {
    const { content } = section;

    if (Array.isArray(content)) {
        return (
            <div className={styles.cardGrid}>
                {content.map((item: any, i: number) => (
                    <motion.div
                        key={i}
                        className={styles.card}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.3 }}
                    >
                        <h4 className={styles.cardTitle}>{item.title}</h4>
                        <p className={styles.cardDesc}>{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        );
    }

    return (
        <div className={styles.profileCard}>
            {content.name && <h2 className={styles.profileName}>{content.name}</h2>}
            {content.role && <p className={styles.profileRole}>{content.role}</p>}
            {content.date && <p className={styles.profileDate}>{content.date}</p>}
            {content.text && <p className={styles.profileText}>{content.text}</p>}
            {content.points && (
                <ul className={styles.pointsList}>
                    {content.points.map((pt: string, i: number) => (
                        <motion.li
                            key={i}
                            className={styles.pointItem}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 }}
                        >
                            <span className={styles.pointBullet}>▹</span>
                            <span>{pt}</span>
                        </motion.li>
                    ))}
                </ul>
            )}
            {content.quote && (
                <blockquote className={styles.quote}>
                    <span className={styles.quoteMarks}>"</span>
                    {content.quote}
                    <span className={styles.quoteMarks}>"</span>
                </blockquote>
            )}
        </div>
    );
}
