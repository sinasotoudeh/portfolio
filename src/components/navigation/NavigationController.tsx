'use client';

import { useState, useEffect, type MouseEvent, type ReactNode } from 'react';
import { useLenis } from 'lenis/react';
import styles from './Navigation.module.css';

interface NavigationControllerProps {
    /** Server-rendered bar content: logo, desktop links, CTA buttons. */
    bar: ReactNode;
    /** Server-rendered mobile menu content: links and the connect footer. */
    menu: ReactNode;
}

// Owns the navigation's only state: the scrolled bar, the hamburger and the mobile menu.
// Everything else is rendered on the server by Navigation.tsx and passed in as props.
export default function NavigationController({ bar, menu }: NavigationControllerProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // The root Lenis instance (this bar sits outside LenisProvider; useLenis reads the root store).
    const lenis = useLenis();

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

    // One delegated handler per container replaces the per-link onClick: section links
    // (href="#id") scroll smoothly without touching the URL and close the menu. Bare
    // href="#" links (the mobile socials) never had a handler and stay native.
    const handleSectionLinkClick = (e: MouseEvent<HTMLElement>) => {
        const link = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
        const href = link?.getAttribute('href');
        if (!href || href === '#') return;

        e.preventDefault();
        setIsMobileMenuOpen(false);

        const targetElement = document.getElementById(href.replace('#', ''));
        if (!targetElement) return;

        // Lenis owns page scrolling, so the scroll goes through it (D-14): native smooth scrolling
        // was cut short on this page. The native call only covers a click before Lenis has started.
        if (lenis) {
            lenis.scrollTo(targetElement);
        } else {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <>
            <nav
                className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}
                role="navigation"
                aria-label="Main navigation"
                onClick={handleSectionLinkClick}
            >
                {bar}

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
                onClick={handleSectionLinkClick}
            >
                {menu}
            </div>
        </>
    );
}
