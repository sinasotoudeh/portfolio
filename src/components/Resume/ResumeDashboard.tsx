import { resumeData } from "@/data/resumeData";
import ResumeController from "./ResumeController";
import ResumeWindow from "./ResumeWindow";
import styles from './ResumeDashboard.module.css';

const bgColor = '#fbecc3ff';

// Server-rendered Resume ("About"): the intro is plain HTML and the résumé data is read here and
// handed to the ResumeWindow client leaf. ResumeController (client) renders the <section>: click to
// scroll the section into place and the intro columns' slide-in.
export default function ResumeDashboard() {
    return (
        <ResumeController
            id='cv'
            data-pause-offscreen=""
            aria-labelledby="cv-title"
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
                <div
                    className={styles.introLeft}
                    data-intro=""
                    data-delay="0.4"
                    style={{ opacity: 0, transform: 'translateX(-100px)' }}
                >
                    <h2 id="cv-title" className={styles.mainTitle}>All About Me!</h2>
                    <p className={styles.subTitle}>
                        Hi, I’m Sina.<span className={styles.emoji} role="img" aria-label="wave">👋</span><br /></p>
                    <p className={styles.subTitleLast}>
                        I’m so glad you’re here,<br />
                        Grab a virtual coffee<br />
                        And, welcome!☕<br />
                    </p>
                </div>

                {/* بخش سمت راست: ورود از راست (مقدار اولیه $x = 100$) */}
                <div
                    className={styles.introRight}
                    data-intro=""
                    data-delay="0.5"
                    style={{ opacity: 0, transform: 'translateX(100px)' }}
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
                        type="button"
                        className={styles.neonCvButton}
                        data-cv-button=""
                        aria-label="Take a look at my CV"
                    >
                        Take a look at my CV!
                        <span className={styles.neonArrow}>↓</span>
                    </button>
                </div>

            </div>

            <ResumeWindow tabs={resumeData} />
        </ResumeController>
    );
}
