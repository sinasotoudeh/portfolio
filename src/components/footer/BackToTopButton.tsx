'use client';

import { useLenis } from 'lenis/react';
import styles from './Footer.module.css';

// Client leaf of the server-rendered Footer: smooth scroll back to the top.
export default function BackToTopButton() {
  // The root Lenis instance (the footer sits outside LenisProvider; useLenis reads the root store).
  const lenis = useLenis();

  // Through Lenis, which owns page scrolling (D-14); native smooth scrolling was cut short on this
  // page. The native call only covers a click before Lenis has started.
  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className={styles.backToTop}
      aria-label="Back to top"
    >
      <ChevronUpIcon />
    </button>
  );
}

const ChevronUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M18 15l-6-6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
