'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Navigation.module.css';

const NAV_LINKS = [
    { label: 'Manifesto', href: '#manifesto' },
    { label: 'Work', href: '#work' },
    { label: 'Process', href: '#process' },
    { label: 'Team', href: '#team' },
    { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsScrolled(window.scrollY > 50);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);

        const targetId = href.replace('#', '');
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <>
            <nav
                className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}
                role="navigation"
                aria-label="Main navigation"
            >
                {/* Logo */}
                <Link href="/" className={styles.logo} data-cursor="hover">
                    <span className={styles.logoN}>N</span>
                    <span className={styles.logoRest}>onato</span>
                    <div className={styles.logoDot} />
                </Link>

                {/* Desktop Links */}
                <ul className={styles.linksList} role="list">
                    {NAV_LINKS.map((link) => (
                        <li key={link.label}>
                            <a
                                href={link.href}
                                className={styles.navLink}
                                onClick={(e) => handleScrollToSection(e, link.href)}
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

                {/* Mobile Hamburger */}
                <button
                    className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ''}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={isMobileMenuOpen}
                    data-cursor="hover"
                >
                    <span /><span /><span />
                </button>
            </nav>

            {/* Premium Mobile Menu Overlay */}
            <div
                className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}
                aria-hidden={!isMobileMenuOpen}
            >
                <ul role="list">
                    {NAV_LINKS.map((link) => (
                        <li key={`mobile-${link.label}`}>
                            <a
                                href={link.href}
                                onClick={(e) => handleScrollToSection(e, link.href)}
                                data-cursor="hover"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* بخش فوتر برای منوی موبایل */}
                <div className={styles.mobileFooter}>
                    <span>Let's Connect</span>
                    <div className={styles.mobileSocials}>
                        <a href="#" data-cursor="hover">Instagram</a>
                        <a href="#" data-cursor="hover">Twitter</a>
                        <a href="#" data-cursor="hover">LinkedIn</a>
                    </div>
                </div>
            </div>
        </>
    );
}
