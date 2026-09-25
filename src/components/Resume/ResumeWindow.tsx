'use client';

import React, { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/motion/gsap';
import {
    FRAMER_DEFAULT_TWEEN, FRAMER_EASE_OUT, FRAMER_SPRING_400_35, FRAMER_SPRING_500_25_SHORT, FRAMER_SPRING_500_40,
    cubicBezier, prefersReducedMotion,
} from '@/lib/motion/eases';
import { usePresenceSwap, type PresenceStates } from '@/lib/motion/usePresenceSwap';
import type { SubSection, ProfileContent, TabData } from '@/data/resumeData';
import styles from './ResumeDashboard.module.css';

const TAB_ICONS: Record<string, string> = {
    about: '◈',
    expertise: '⬡',
    experience: '◎',
    projects: '◇',
    education: '△',
};

// The shown section's content swaps like framer's AnimatePresence mode="wait": out up, in from below.
const CONTENT_PRESENCE: PresenceStates = {
    from: { vars: { opacity: 0, y: 12 }, style: { opacity: 0, transform: 'translateY(12px)' } },
    to: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    duration: 0.22,
    ease: cubicBezier(0.25, 0.46, 0.45, 0.94),
};

type Box = { left: number; top: number; width: number; height: number };
const boxOf = (el: HTMLElement | null): Box | null => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return r.width || r.height ? { left: r.left, top: r.top, width: r.width, height: r.height } : null;
};

// framer's shared-layout (layoutId) glide: the marker now in place animates from where the previous
// one was (position and size, its current in-flight box included) to its own box, on the same spring.
function glide(el: HTMLElement | null, from: Box | null, spring: { ease: gsap.EaseFunction; duration: number }) {
    const to = boxOf(el);
    if (!el || !from || !to) return;
    gsap.fromTo(el,
        { x: from.left - to.left, y: from.top - to.top, scaleX: from.width / to.width, scaleY: from.height / to.height, transformOrigin: '0 0' },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: prefersReducedMotion() ? 0 : spring.duration, ease: spring.ease, overwrite: true },
    );
}

// Client leaf of the server-rendered Resume section: the résumé window (tabs, sections, content).
export default function ResumeWindow({ tabs }: { tabs: TabData[] }) {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [activeSection, setActiveSection] = useState(tabs[0].subSections[0].id);
    const contentRef = useRef<HTMLDivElement>(null);
    const contentInnerRef = useRef<HTMLDivElement>(null);
    const underlineRef = useRef<HTMLSpanElement>(null);
    const indicatorRef = useRef<HTMLSpanElement>(null);
    const dotRef = useRef<HTMLSpanElement>(null);
    const glideFrom = useRef<{ underline: Box | null; indicator: Box | null; dot: Box | null } | null>(null);

    // Where the markers are right now (in flight included), taken before a change re-renders them.
    const rememberMarkers = () => {
        glideFrom.current = { underline: boxOf(underlineRef.current), indicator: boxOf(indicatorRef.current), dot: boxOf(dotRef.current) };
    };

    const handleTabChange = (tabId: string) => {
        rememberMarkers();
        setActiveTab(tabId);
        const tab = tabs.find(t => t.id === tabId);
        if (tab) {
            setActiveSection(tab.subSections[0].id);
        }
    };

    const handleSectionChange = (sectionId: string) => {
        rememberMarkers();
        setActiveSection(sectionId);
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // After the change is rendered (before it's painted), each marker glides from where it was.
    useLayoutEffect(() => {
        const from = glideFrom.current;
        if (!from) return;
        glideFrom.current = null;
        glide(underlineRef.current, from.underline, FRAMER_SPRING_400_35);
        glide(indicatorRef.current, from.indicator, FRAMER_SPRING_400_35);
        glide(dotRef.current, from.dot, FRAMER_SPRING_500_40);
    }, [activeTab, activeSection]);

    const currentTab = tabs.find(t => t.id === activeTab)!;
    const currentSection = currentTab?.subSections.find(s => s.id === activeSection) ?? currentTab?.subSections[0];
    const hasSubSections = currentTab.subSections.length > 1;

    // The sidebar stays mounted while it slides out (framer AnimatePresence), showing the tab it had.
    const [sidebarTab, setSidebarTab] = useState<TabData | null>(hasSubSections ? currentTab : null);
    if (hasSubSections && sidebarTab !== currentTab) setSidebarTab(currentTab);

    // Content swaps out/in; the section title above it changes at once (as before).
    const shownId = usePresenceSwap(currentSection.id, contentInnerRef, CONTENT_PRESENCE);
    const shownSection = tabs.flatMap(t => t.subSections).find(s => s.id === shownId) ?? currentSection;

    return (
        <div className={styles.window} data-resume-window="">
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
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
                    >
                        <span className={styles.tabIcon}>{TAB_ICONS[tab.id]}</span>
                        <span>{tab.title}</span>
                        {activeTab === tab.id && (
                            <span ref={underlineRef} className={styles.tabUnderline} />
                        )}
                    </button>
                ))}
            </div>

            {/* Body */}
            <div className={styles.body}>
                {/* Sidebar */}
                {sidebarTab && (
                        <Sidebar open={hasSubSections} onClosed={() => setSidebarTab(null)}>
                            <p className={styles.sidebarLabel}>SECTIONS</p>
                            {sidebarTab.subSections.map(sub => (
                                <button
                                    key={sub.id}
                                    onClick={() => handleSectionChange(sub.id)}
                                    className={`${styles.sideItem} ${activeSection === sub.id ? styles.sideItemActive : ''}`}
                                >
                                    {activeSection === sub.id && (
                                        <span ref={indicatorRef} className={styles.sideIndicator} />
                                    )}
                                    <span className={styles.sideItemText}>{sub.title}</span>
                                </button>
                            ))}
                        </Sidebar>
                )}

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
                    {shownSection && (
                        <div
                            key={shownSection.id}
                            ref={contentInnerRef}
                            className={styles.contentInner}
                            style={CONTENT_PRESENCE.from.style}
                        >
                            <SectionContent section={shownSection} />
                        </div>
                    )}
                </div>
            </div>

            {/* ── Mobile: Sub-section Pill Bar ── */}
            {hasSubSections && (
                <div className={styles.mobilePillBar}>
                    {currentTab.subSections.map(sub => (
                        <button
                            key={sub.id}
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
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`${styles.mobileNavBtn} ${activeTab === tab.id ? styles.mobileNavBtnActive : ''}`}
                    >
                        <span className={styles.mobileNavIcon}>{TAB_ICONS[tab.id]}</span>
                        <span className={styles.mobileNavLabel}>{tab.title}</span>{activeTab === tab.id && (
                            <span ref={dotRef} className={styles.mobileNavDot} />
                        )}
                    </button>
                ))}
            </nav>
        </div>
    );
}

// The sections sidebar: slides/fades in when shown, out before it's removed (framer, 0.2 s).
function Sidebar({ open, onClosed, children }: { open: boolean; onClosed: () => void; children: ReactNode }) {
    const ref = useRef<HTMLElement>(null);
    const onClosedRef = useRef(onClosed);
    useLayoutEffect(() => {
        onClosedRef.current = onClosed;
    });

    useGSAP(() => {
        const el = ref.current;
        if (!el) return;
        gsap.to(el, {
            opacity: open ? 1 : 0,
            x: open ? 0 : -16,
            duration: prefersReducedMotion() ? 0 : 0.2,
            ease: FRAMER_EASE_OUT,
            overwrite: true,
            onComplete: open ? undefined : () => onClosedRef.current(),
        });
    }, { dependencies: [open] });

    return (
        <aside ref={ref} className={styles.sidebar} style={{ opacity: 0, transform: 'translateX(-16px)' }}>
            {children}
        </aside>
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

function SectionContent({ section }: { section: SubSection }) {
    const { content } = section;
    const rootRef = useRef<HTMLDivElement>(null);

    // Cards rise in one after another; points slide in (framer's default transform spring) and fade
    // in (its default 0.3 s tween) one after another — on every mount (each shown section).
    useGSAP(() => {
        const root = rootRef.current;
        if (!root) return;
        const instant = prefersReducedMotion();
        const at = (s: number) => (instant ? 0 : s);
        root.querySelectorAll<HTMLElement>('[data-card]').forEach((card, i) => {
            gsap.fromTo(card, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: at(0.3), delay: at(i * 0.06), ease: FRAMER_EASE_OUT });
        });
        root.querySelectorAll<HTMLElement>('[data-point]').forEach((point, i) => {
            gsap.fromTo(point, { x: -8 }, { x: 0, duration: at(FRAMER_SPRING_500_25_SHORT.duration), delay: at(i * 0.07), ease: FRAMER_SPRING_500_25_SHORT.ease });
            gsap.fromTo(point, { opacity: 0 }, { opacity: 1, duration: at(FRAMER_DEFAULT_TWEEN.duration), delay: at(i * 0.07), ease: FRAMER_DEFAULT_TWEEN.ease });
        });
    }, { scope: rootRef });

    if (Array.isArray(content)) {
        return (
            <div ref={rootRef} className={styles.cardGrid}>
                {content.map((item: CardItemType, i: number) => (
                    <div
                        key={i}
                        data-card=""
                        className={styles.card}
                        style={{ opacity: 0, transform: 'translateY(16px)' }}
                    >
                        <div className={styles.cardHeader}>
                            {item.icon && <span className={styles.cardIcon}>{item.icon as React.ReactNode}</span>}
                            {item.title && <h4 className={styles.cardTitle}>{item.title}</h4>}
                            {item.badge && <span className={styles.cardBadge}>{item.badge}</span>}
                        </div>
                        <p className={styles.cardDesc}>{parseBoldText(item.desc || '')}</p>
                    </div>
                ))}
            </div>
        );
    }
    
    const profile = content as ExtendedProfileContent;

    return (
        <div ref={rootRef} className={styles.profileCard}>
            {profile.name && <h3 className={styles.profileName}>{profile.name}</h3>}
            
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
                        <li
                            key={i}
                            data-point=""
                            className={styles.pointItem}
                            style={{ opacity: 0, transform: 'translateX(-8px)' }}
                        >
                            <span className={styles.pointBullet}>▹</span>
                            <span>{parseBoldText(pt)}</span>
                        </li>
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
