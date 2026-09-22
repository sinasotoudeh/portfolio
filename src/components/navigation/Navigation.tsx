import Link from 'next/link';
import NavigationController from './NavigationController';
import styles from './Navigation.module.css';

const NAV_LINKS = [
    { label: 'Manifesto', href: '#manifesto' },
    { label: 'Works', href: '#work' },
    { label: 'Process', href: '#process' },
    { label: 'About', href: '#cv' },
    { label: 'Contact', href: '#contact' },
];

// Server shell: all markup renders here; NavigationController adds scroll state, the
// hamburger/mobile menu toggle and smooth section scrolling on top of it.
export default function Navigation() {
    return (
        <NavigationController
            bar={
                <>
                    {/* Logo */}
                    <Link href="/" className={styles.logo} data-cursor="hover">
                        <div className={styles.logoContainer}>
                            <div className={styles.logoLine}>
                                <span className={styles.logoBold}><span className={styles.logoAccent}>Sin</span></span>
                                a
                            </div>
                            <div className={styles.logoLine}>
                                <span className={styles.logoBold}>
                                    <span className={styles.logoAccent}>SO</span>
                                </span>
                                toudeh
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Links */}
                    <ul className={styles.linksList} role="list">
                        {NAV_LINKS.map((link) => (
                            <li key={link.label}>
                                <a
                                    href={link.href}
                                    className={styles.navLink}
                                    data-cursor="hover"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* CTA Buttons */}
                    <div className={styles.cta}>
                        <button className={styles.btnGhost} data-cursor="hover">
                            &#9654; Reel
                        </button>
                        <button className={styles.btnPrimary} data-magnetic>
                            Start Project
                        </button>
                    </div>
                </>
            }
            menu={
                <>
                    <ul role="list">
                        {NAV_LINKS.map((link) => (
                            <li key={`mobile-${link.label}`}>
                                <a
                                    href={link.href}
                                    data-cursor="hover"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* بخش فوتر برای منوی موبایل */}
                    <div className={styles.mobileFooter}>
                        <span>Let&apos;s Connect</span>
                        <div className={styles.mobileSocials}>
                            <a href="https://www.instagram.com/sina.sotoude/" target="_blank" rel="noopener noreferrer" data-cursor="hover">Instagram</a>
                            <a href="https://www.linkedin.com/in/sinasotoudeh" target="_blank" rel="noopener noreferrer" data-cursor="hover">LinkedIn</a>
                            <a href="https://github.com/sinasotoudeh" target="_blank" rel="noopener noreferrer" data-cursor="hover">GitHub</a>
                        </div>
                    </div>
                </>
            }
        />
    );
}
