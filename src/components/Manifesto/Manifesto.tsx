import { Fragment } from 'react';
import ManifestoScrub from './ManifestoScrub';
import styles from './Manifesto.module.css';

// ==========================================
// Types & Data
// ==========================================
type WordData = {
    text: string;
    isAccent?: boolean;
};

const PARAGRAPH_1: WordData[] = [
    { text: 'Design' }, { text: 'is' }, { text: 'not' }, { text: 'decoration.' },
    { text: 'It', isAccent: true }, { text: 'is', isAccent: true }, { text: 'a', isAccent: true }, { text: 'language', isAccent: true },
    { text: 'that' }, { text: 'rewires' }, { text: 'how' }, { text: 'humans' }, { text: 'feel.' }
];

const PARAGRAPH_2: WordData[] = [
    { text: 'For' }, { text: 'me,' },
    { text: 'every', isAccent: true }, { text: 'pixel', isAccent: true },
    { text: 'carries' }, { text: 'intention.' },
    { text: 'Every' }, { text: 'interaction' }, { text: 'is' },
    { text: 'choreographed.', isAccent: true },
    { text: 'Every' }, { text: 'experience' }, { text: 'is' }
];

// ۴. کلمه آخر را جداگانه مدیریت می‌کنیم
const LAST_WORD = "inevitable.";

const MARQUEE_SEGMENT = (
    <>
        <span>SINA SOTOUDEH</span> <span className={styles.star}>✦</span>
        <span>WORLD CLASS</span> <span className={styles.star}>✦</span>
        <span>EST.2019</span> <span className={styles.star}>✦</span>
        <span>CUTTING EDGE</span> <span className={styles.star}>✦</span>
        <span>AWARD WINNING</span> <span className={styles.star}>✦</span>
        <span>FORWARD THINKING</span> <span className={styles.star}>✦</span>
    </>
);

// ==========================================
// Main Component
// ==========================================
// Server-rendered Manifesto. All text ships as HTML; ManifestoScrub (client leaf) renders the
// <section> and scrubs the word reveal and the last word's scale-up against scroll with GSAP.
// Each word's first-paint state (dim, blurred, lowered) lives in Manifesto.module.css.
const renderParagraph = (words: WordData[]) =>
    words.map((word, i) => (
        // The space between word spans is ignored by the flex paragraph and keeps the text readable
        // ("Design is not …") for assistive tech and search engines.
        <Fragment key={`w-${i}`}>
            {i > 0 && ' '}
            <span
                className={`${styles.word} ${word.isAccent ? styles.accent : ''}`}
                data-word=""
            >
                {word.text}
            </span>
        </Fragment>
    ));

export default function Manifesto() {
    return (
        <ManifestoScrub
            id="manifesto"
            data-section="manifesto"
            data-pause-offscreen=""
            className={styles.section}
            aria-labelledby="manifesto-title"
        >
            <div className={styles.inner}>

                {/* ۱. Eyebrow */}
                <div className={styles.eyebrow}>
                    <span className={styles.eyebrowLine} />
                    <h2 id="manifesto-title" className={styles.eyebrowText}>Our Manifesto</h2>
                    <span className={styles.eyebrowLine} />
                </div>

                {/* Kinetic Text Area */}
                <div className={styles.kineticContainer}>
                    <p className={styles.paragraph}>
                        {renderParagraph(PARAGRAPH_1)}
                    </p>
                    <p className={styles.paragraph}>
                        {renderParagraph(PARAGRAPH_2)}{' '}

                        {/* ۴. The Inevitable Word Effect */}
                        <span className={styles.inevitable} data-last-word="">
                            {LAST_WORD}
                        </span>
                    </p>
                </div>
            </div>

            {/* ۲ و ۳. Marquee Divider (Full Width, After Content) */}
            <div className={styles.marqueeContainer} aria-hidden="true">
                <div className={styles.marqueeTrack}>
                    {/* تکرار المنت‌ها برای ایجاد اسکرول نرم و بی‌نهایت */}
                    <div className={styles.marqueeItem}>{MARQUEE_SEGMENT}</div>
                    <div className={styles.marqueeItem}>{MARQUEE_SEGMENT}</div>
                    <div className={styles.marqueeItem}>{MARQUEE_SEGMENT}</div>
                    <div className={styles.marqueeItem}>{MARQUEE_SEGMENT}</div>
                </div>
            </div>

        </ManifestoScrub>
    );
}
