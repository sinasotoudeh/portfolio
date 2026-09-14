import type { CSSProperties } from 'react';
import HeroCanvas from './HeroCanvas';
import HeroController from './HeroController';
import styles from './Hero.module.css';

// Server-rendered Hero. All markup ships as HTML; two client leaves remain: HeroController (the
// pin section, which sets data-state 0..3 from scroll) and HeroCanvas (the particle engine).
// Every layer's visibility per state lives in Hero.module.css under [data-state="n"].
export default function Hero() {
    return (
        <HeroController>
            <div className={styles.heroPanel}>
                <div className={styles.canvasContainer} aria-hidden="true">
                    <HeroCanvas />
                    <div className={styles.liquidOverlay}></div>
                </div>

                <div className={styles.heroWordmark}>
                    {/* The page's h1. The space between the rows is ignored by the flex layout and
                        keeps the accessible text "Sina Sotoudeh". */}
                    <h1 id="hero-title" className={styles.wmGroup}>
                        <span className={styles.wmWordRow}>
                            <span className={styles.wmLetterS}>S</span>
                            <span className={styles.wmColor1}>in</span>
                            <span className={styles.wmExpand}>a</span>
                        </span>{' '}
                        <span className={styles.wmWordRow}>
                            {/* جایجایی ساختاری S برای افکت بازشدن و جدا شدن منطقی */}
                            <span className={styles.wmLetterS}>S</span>
                            <span className={styles.wmLetterO}>o</span>
                            <span className={styles.wmExpand}>toudeh</span>
                        </span>
                    </h1>
                </div>

                {/* بقیه المان‌ها کاملا مثل قبل */}
                <div className={styles.heroTagline}>
                    <p>We craft digital experiences<br />that leave a <span>mark</span>.</p>
                </div>

                <div className={styles.heroScrollHint}>
                    <div className={styles.scrollLine}></div>
                    <span>Scroll</span>
                </div>

                <div className={styles.burstCardsContainer}>
                    <div className={styles.burstCard} data-position="left-mid">
                        <div className={styles.cardGlow}></div>
                        <span className={styles.bcNumber}>01</span>
                        <h2 className={styles.bcTitle}>Build</h2>
                        <p>Engineer with precision and scalable architecture.</p>
                    </div>
                    <div className={styles.burstCard} data-position="right-top">
                        <div className={styles.cardGlow}></div>
                        <span className={styles.bcNumber}>02</span>
                        <h2 className={styles.bcTitle}>Design</h2>
                        <p>Craft every pixel with intentional aesthetic.</p>
                    </div>
                    <div className={styles.burstCard} data-position="right-bottom">
                        <div className={styles.cardGlow}></div>
                        <span className={styles.bcNumber}>03</span>
                        <h2 className={styles.bcTitle}>Launch</h2>
                        <p>Deploy & iterate relentlessly in the wild.</p>
                    </div>
                </div>

                <ul className={styles.fluidWorkContainer}>
                    {['Branding', 'Web Platform', 'App Design', 'Motion', 'AI Integration'].map((tag, i) => (
                        <li
                            key={i}
                            className={styles.fluidWorkItem}
                            style={{ '--index': i } as CSSProperties}
                        >
                            <div className={styles.fwMeta}>
                                <span className={styles.fwNum}>0{i + 1}</span>
                                <div className={styles.fwLine}></div>
                                <span className={styles.fwTag}>{tag}</span>
                            </div>
                            <p className={styles.fwName}>{['Nexus Identity', 'Orbita Core', 'Zenith Flow', 'Vega Campaign', 'Synapse Model'][i]}</p>
                        </li>
                    ))}
                </ul>

                <div className={styles.heroConnect}>
                    <div className={styles.connectBackdropBlur}></div>
                    <p className={styles.connectSub}>Ready to begin?</p>
                    <h2 className={styles.connectHeadline}>
                        Let&apos;s build<br />something <em>inevitable</em>.
                    </h2>
                    <div className={styles.magneticWrap}>
                        <a href="#contact" className={styles.ctaPremium}>
                            Start a Project
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </HeroController>
    );
}
