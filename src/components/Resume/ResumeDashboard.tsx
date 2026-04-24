// ResumeDashboard.tsx
'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeData, SubSection, ProfileContent } from "@/data/resumeData";
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
    // خط زیر به طور کامل حذف شد (رفع هشدار unused-vars)
    // const [sheetOpen, setSheetOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    // رفرنس جدید برای تشخیص موقعیت دقیق پنجره ماک‌آپ
    const windowRef = useRef<HTMLDivElement>(null);

    const handleSectionClick = (e: React.MouseEvent<HTMLElement>) => {
        if (!sectionRef.current || !windowRef.current) return;

        // دریافت موقعیت المان‌ها نسبت به ویوپورت
        const windowRect = windowRef.current.getBoundingClientRect();
        const sectionRect = sectionRef.current.getBoundingClientRect();

        // آفست مورد نظر شما برای نرفتن زیر Navbar (50 پیکسل)
        const navbarOffset = 80;

        // بررسی اینکه آیا کاربر بالاتر از پنجره ماک‌آپ کلیک کرده است یا روی/پایین آن
        // e.clientY مختصات کلیک کاربر در ویوپورت را برمی‌گرداند
        if (e.clientY < windowRect.top) {
            // کلیک در ناحیه Intro (بالای ماک‌آپ) انجام شده است
            // اسکرول به بالای کل سکشن با احتساب آفست
            window.scrollTo({
                top: window.scrollY + sectionRect.top - navbarOffset,
                behavior: 'smooth'
            });
        } else {
            // کلیک در هر نقطه‌ای از ماک‌آپ یا پایین‌تر از آن (از title bar به پایین) انجام شده است
            // اسکرول به بالای پنجره ماک‌آپ با احتساب آفست
            window.scrollTo({
                top: window.scrollY + windowRect.top - navbarOffset,
                behavior: 'smooth'
            });
        }
    };
    const handleCVButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // جلوگیری از اجرای تابع handleSectionClick والد
        e.stopPropagation();

        if (!windowRef.current) return;

        const windowRect = windowRef.current.getBoundingClientRect();
        const navbarOffset = 80;

        // اسکرول مستقیم به بالای پنجره ماک‌آپ
        window.scrollTo({
            top: window.scrollY + windowRect.top - navbarOffset,
            behavior: 'smooth'
        });
    };

// -- اضافه کردن این دو تابع جدید برای مدیریت تب‌ها و سکشن‌ها (جایگزین useEffectها) --
    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        const tab = resumeData.find(t => t.id === tabId);
        if (tab) {
            setActiveSection(tab.subSections[0].id);
        }
    };

    const handleSectionChange = (sectionId: string) => {
        setActiveSection(sectionId);
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // این دو useEffect به طور کامل حذف شوند (رفع خطاهای set-state-in-effect)
    /*
    useEffect(() => {
        const tab = resumeData.find(t => t.id === activeTab);
        if (tab) setActiveSection(tab.subSections[0].id);
        setSheetOpen(false);
    }, [activeTab]);

    useEffect(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
        setSheetOpen(false);
    }, [activeSection]);
    */

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
                backgroundPosition: 'top center',
                backgroundColor: bgColor,
            }}
        >
            {/* ── Intro Section ── */}
            <div className={styles.introSection}>
                {/* بخش سمت چپ: ورود از چپ (مقدار اولیه $x = -100$) */}
                <motion.div
                    className={styles.introLeft}
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.4 }}
                >
                    <h1 className={styles.mainTitle}>All About Me!</h1>
                    <h2 className={styles.subTitle}>
                        Hi, I’m Sina.<span className={styles.emoji} role="img" aria-label="wave">👋</span><br /></h2>
                    <h2 className={styles.subTitleLast}>
                        I’m so glad you’re here,<br />
                        Grab a virtual coffee<br />
                        And, welcome!☕<br />
                    </h2>
                </motion.div>

                {/* بخش سمت راست: ورود از راست (مقدار اولیه $x = 100$) */}
                <motion.div
                    className={styles.introRight}
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: 0.5 }}
                >
                    <p className={styles.introText}>
                        Behind the code, 
                        the UI components, <br />
                        and the occasional debugging headaches,<br />
                        I’m just someone <br />
                        who truly enjoys learning something new <br />
                        every single day.<br />
                        <br />
                        I might not have all the answers,
                        <br /> but what I do have
                        is a genuine passion <br />for turning complex problems<br />
                         into
                        beautiful, functional, and user-friendly <br />web experiences.<br />
                    </p>

                    {/* ── دکمه نئونی دسکتاپ ── */}
                    <button
                        className={styles.neonCvButton}
                        onClick={handleCVButtonClick}
                        aria-label="Take a look at my CV"
                    >
                        Take a look at my CV!
                        <span className={styles.neonArrow}>↓</span>
                    </button>
                </motion.div>

            </div>

            {/* ── Window ── */}
            <div ref={windowRef} className={styles.window}>
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
                            // onClick={(e) => { e.stopPropagation(); setActiveTab(tab.id); }}
                            // onClick={() => setActiveTab(tab.id)}
                            // جایگزین شود با:
                            onClick={() => handleTabChange(tab.id)}
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
                                        // onClick={(e) => { e.stopPropagation(); setActiveSection(sub.id); }}
                                        // onClick={() => setActiveSection(sub.id)}
                                        // جایگزین شود با:
                                        onClick={() => handleSectionChange(sub.id)}
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
                        onWheel={(e) => e.stopPropagation()}
                        // 2. اگر از Lenis استفاده می‌کنید این اتریبیوت الزامی است
                        data-lenis-prevent="true"
                        style={{
                            backgroundImage: `linear-gradient(rgba(17, 19, 24, 0), rgba(17, 19, 24, 0)), url('/images/cv/content.png')`,
                            // backgroundImage: currentSection?.background ? `linear-gradient(rgba(17, 19, 24, 0.5), rgba(17, 19, 24, 0.5)), ${currentSection.background}` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'top center',
                            backgroundRepeat: 'no-repeat',

                        }}
                    >
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
                                // onClick={(e) => { e.stopPropagation(); setActiveSection(sub.id); }}
                                // onClick={() => setActiveSection(sub.id)}
                                // جایگزین شود با:
                                onClick={() => handleSectionChange(sub.id)}
                                className={`${styles.mobilePill} ${activeSection === sub.id ? styles.mobilePillActive : ''}`}
                            >
                                {sub.mobileTitle || sub.title}
                            </button>
                        ))}
                    </div>
                )}
                {/* ── Mobile: Bottom Nav ── */}
                <nav className={styles.mobileNav}>
                    {resumeData.map(tab => (
                        <button
                            key={tab.id}
                            // onClick={(e) => { e.stopPropagation(); setActiveTab(tab.id); }}
                            // onClick={() => setActiveTab(tab.id)}
                            // جایگزین شود با:
                            onClick={() => handleTabChange(tab.id)}
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


/* ─── Icons ─── */
const Icons = {
    Mail: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
    Phone: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
    MapPin: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
    Link: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>,
    Github: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
};

/* ─── Utilities ─── */
// تابع برای تشخیص آیکون مناسب تماس
const getContactIcon = (text: string) => {
    if (text.includes('@')) return <Icons.Mail />;
    if (text.includes('+') || /\d{10,}/.test(text)) return <Icons.Phone />;
    return <Icons.MapPin />;
};

// تابع برای تبدیل **متن** به متن بولد شده
const parseBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className={styles.boldText}>{part.slice(2, -2)}</strong>;
        }
        return part;
    });
};

/* ─── Section Content Renderer ─── */
type CardItemType = {
    title?: string;
    desc?: string;
    icon?: React.ReactNode | string;
    badge?: string;
};

// توسعه تایپ پروفایل
type ExtendedProfileContent = ProfileContent & { quote?: string };

export function SectionContent({ section }: { section: SubSection }) {
    const { content } = section;

    if (Array.isArray(content)) {
        return (
            <div className={styles.cardGrid}>
                {content.map((item: CardItemType, i: number) => (
                    <motion.div
                        key={i}
                        className={styles.card}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.3 }}
                    >
                        <div className={styles.cardHeader}>
                            {item.icon && <span className={styles.cardIcon}>{item.icon as React.ReactNode}</span>}
                            {item.title && <h4 className={styles.cardTitle}>{item.title}</h4>}
                            {item.badge && <span className={styles.cardBadge}>{item.badge}</span>}
                        </div>
                        <p className={styles.cardDesc}>{parseBoldText(item.desc || '')}</p>
                    </motion.div>
                ))}
            </div>
        );
    }
    
    const profile = content as ExtendedProfileContent;

    return (
        <div className={styles.profileCard}>
            {profile.name && <h2 className={styles.profileName}>{profile.name}</h2>}
            
            <div className={styles.profileMeta}>
                {profile.role && <p className={styles.profileRole}>{profile.role}</p>}
                {profile.githublink && (
                    <a href={`https://${profile.githublink.replace('https://', '')}`} target="_blank" rel="noreferrer" className={styles.profileGithubLink}>
                        <Icons.Github /> {profile.githublink}
                    </a>
                )}
            </div>

            {profile.date && <p className={styles.profileDate}>{profile.date}</p>}

            {/* بخش اطلاعات تماس و لینک‌ها */}
            {(profile.contacts || profile.links) && (
                <div className={styles.contactSection}>
                    {profile.contacts && (
                        <div className={styles.contactList}>
                            {profile.contacts.map((contact, i) => (
                                <span key={`c-${i}`} className={styles.contactBadge}>
                                    {getContactIcon(contact)} {contact}
                                </span>
                            ))}
                        </div>
                    )}
                    {profile.links && (
                        <div className={styles.contactList}>
                            {profile.links.map((link, i) => (
                                <a key={`l-${i}`} href={`https://${link.replace('https://', '')}`} target="_blank" rel="noreferrer" className={styles.linkBadge}>
                                    <Icons.Link /> {link}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {profile.text && <p className={styles.profileText}>{parseBoldText(profile.text)}</p>}
            
            {profile.points && (
                <ul className={styles.pointsList}>
                    {profile.points.map((pt: string, i: number) => (
                        <motion.li
                            key={i}
                            className={styles.pointItem}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 }}
                        >
                            <span className={styles.pointBullet}>▹</span>
                            <span>{parseBoldText(pt)}</span>
                        </motion.li>
                    ))}
                </ul>
            )}

            {/* بخش Tech Stack */}
            {profile.techStack && (
                <div className={styles.techStackWrapper}>
                    {profile.techStack.map((tech, i) => (
                        <span key={i} className={styles.techStackBadge}>{tech}</span>
                    ))}
                </div>
            )}

            {profile.quote && (
                <blockquote className={styles.quote}>
                    <span className={styles.quoteMarks}>&quot;</span>
                    {profile.quote}
                    <span className={styles.quoteMarks}>&quot;</span>
                </blockquote>
            )}
        </div>
    );
}
