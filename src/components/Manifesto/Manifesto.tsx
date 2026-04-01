'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
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
    { text: 'At' }, { text: 'Nonato,' },
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
        <span>NONATO</span> <span className={styles.star}>✦</span>
        <span>WORLD CLASS</span> <span className={styles.star}>✦</span>
        <span>EST.2019</span> <span className={styles.star}>✦</span>
        <span>CUTTING EDGE</span> <span className={styles.star}>✦</span>
        <span>AWARD WINNING</span> <span className={styles.star}>✦</span>
        <span>FORWARD THINKING</span> <span className={styles.star}>✦</span>
    </>
);

// ==========================================
// Sub-components
// ==========================================
interface WordProps {
    children: React.ReactNode;
    progress: MotionValue<number>;
    range: [number, number];
    isAccent?: boolean;
}

const KineticWord: React.FC<WordProps> = ({ children, progress, range, isAccent }) => {
    const opacity = useTransform(progress, range, [0.1, 1]);
    const y = useTransform(progress, range, [30, 0]);
    const blurValue = useTransform(progress, range, [12, 0]);
    const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

    return (
        <motion.span
            className={`${styles.word} ${isAccent ? styles.accent : ''}`}
            style={{ opacity, y, filter }}
        >
            {children}
        </motion.span>
    );
};

// ==========================================
// Main Component
// ==========================================
export default function Manifesto() {
    const containerRef = useRef<HTMLElement>(null);

    // تغییر بازه: از زمانی که ۸۰٪ صفحه رو میبینه شروع میشه، تا زمانی که کل سکشن از بالای صفحه خارج بشه.
    // این فضای زیادی به ما میده تا افکت scale رو برای کلمه آخر اجرا کنیم.
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start 80%', 'end start'],
    });

    const totalWords = PARAGRAPH_1.length + PARAGRAPH_2.length;
    let wordCounter = 0;

    const renderParagraph = (words: WordData[]) => {
        return words.map((word, i) => {
            wordCounter++;
            // کلمات معمولی فقط در ۶۰ درصد اول اسکرول (۰ تا ۰.۶) ظاهر می‌شوند
            const start = (wordCounter / totalWords) * 0.5;
            const end = start + 0.1;

            return (
                <KineticWord
                    key={`w-${i}`}
                    progress={scrollYProgress}
                    range={[start, end]}
                    isAccent={word.isAccent}
                >
                    {word.text}
                </KineticWord>
            );
        });
    };

    // ۴. منطق انیمیشن کلمه آخر (inevitable)
    // بین ۰.۵۵ تا ۰.۶۵ ظاهر و فوکوس می‌شود
    const lastWordOpacity = useTransform(scrollYProgress, [0.55, 0.65], [0.1, 1]);
    const lastWordBlurVal = useTransform(scrollYProgress, [0.55, 0.65], [12, 0]);
    const lastWordFilter = useTransform(lastWordBlurVal, (v) => `blur(${v}px)`);

    // از ۰.۷ تا ۱.۰ (انتهای اسکرول سکشن) به شدت بزرگ می‌شود تا از صفحه خارج شود
    const lastWordScale = useTransform(scrollYProgress, [0.67, 1], [1, 25]);
    const lastWordY = useTransform(scrollYProgress, [0.55, 0.65], [30, 0]);

    return (
        <section
            ref={containerRef}
            id="manifesto"
            data-section="manifesto"
            className={styles.section}
        >
            <div className={styles.inner}>

                {/* ۱. Eyebrow */}
                <div className={styles.eyebrow}>
                    <span className={styles.eyebrowLine} />
                    <span className={styles.eyebrowText}>Our Manifesto</span>
                    <span className={styles.eyebrowLine} />
                </div>

                {/* Kinetic Text Area */}
                <div className={styles.kineticContainer}>
                    <p className={styles.paragraph}>
                        {renderParagraph(PARAGRAPH_1)}
                    </p>
                    <p className={styles.paragraph}>
                        {renderParagraph(PARAGRAPH_2)}

                        {/* ۴. The Inevitable Word Effect */}
                        <motion.span
                            className={styles.inevitable}
                            style={{
                                opacity: lastWordOpacity,
                                y: lastWordY,
                                filter: lastWordFilter,
                                scale: lastWordScale,
                            }}
                        >
                            {LAST_WORD}
                        </motion.span>
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

        </section>
    );
}
