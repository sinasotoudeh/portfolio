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
    const sectionRef = useRef<HTMLElement>(null);

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
    const bgColor = '#fbecc3ff';

    return (
        <section
            id='cv'
            ref={sectionRef}
            onClick={handleSectionClick}
            className={styles.root}
            style={{
                backgroundImage: `linear-gradient(to top, ${bgColor} 5%, transparent 20%), url('/images/cv/bg.png')`,
                backgroundSize: '100% 68vw, 100% auto',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top center', // یا 'center center' بسته به نیاز شما
                backgroundColor: bgColor,

            }}

        >
            {/* ── Intro Section ── */}
            <div className={styles.introSection}>

                {/* بخش سمت چپ: عنوان بزرگ و جمله ابتدایی */}
                <div className={styles.introLeft}>
                    <h1 className={styles.mainTitle}>All About Me!</h1>
                    <h2 className={styles.subTitle}>
                        Before we dive into<br />
                        the technical jargon<br />
                        and tech stacks…<br />
                        Hi, I’m Sina.<span className={styles.emoji} role="img" aria-label="wave">👋</span>
                    </h2>
                </div>

                {/* بخش سمت راست: پاراگراف‌های راست‌چین */}
                <div className={styles.introRight}>
                    <p className={styles.introText}>
                        Behind the code, the UI components, and the occasional debugging headaches,
                        I’m just someone who truly enjoys learning something new every single day.<br />
                        I might not have all the answers, but what I do have
                        is a genuine passion for building things that live on the internet.<br />
                    </p>
                    <p className={styles.introText}>
                        I love turning complex problems into
                        beautiful, functional, and user-friendly web experiences.<br />
                        I’m so glad you’re here—<br />
                        let me share a bit of my story with you.
                    </p>
                </div>

            </div>
            {/* ── Window ── */}
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
                    <div
                        ref={contentRef}
                        className={styles.content}
                        style={{
                            backgroundImage: currentSection?.background ? `linear-gradient(rgba(17, 19, 24, 0.85), rgba(17, 19, 24, 0.95)), ${currentSection.background}` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        {/* عنوان بزرگ ریسپانسیو */}
                        {!currentSection.hideTitle && (
                            <h3 className={styles.sectionTitle}>
                                {currentSection.title}
                            </h3>
                        )}
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



                                    <SectionContent section={currentSection} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                {/* ── Mobile: Sub-section Pill Bar ── */}
                {hasSubSections && (
                    <div className={styles.mobilePillBar}>
                        {currentTab.subSections.map(sub => (
                            <button
                                key={sub.id}
                                onClick={(e) => { e.stopPropagation(); setActiveSection(sub.id); }}
                                className={`${styles.mobilePill} ${activeSection === sub.id ? styles.mobilePillActive : ''}`}
                            >
                                {sub.mobileTitle || sub.title}
                            </button>
                        ))}
                    </div>
                )}
                {/* ── Mobile: Bottom Nav (اکنون درون window قرار دارد) ── */}
                <nav className={styles.mobileNav}>
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


            </div>
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
                        <div className={styles.cardHeader}>
                            {item.icon && <span className={styles.cardIcon}>{item.icon}</span>}
                            <h4 className={styles.cardTitle}>{item.title}</h4>
                            {item.badge && <span className={styles.cardBadge}>{item.badge}</span>}
                        </div>
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
