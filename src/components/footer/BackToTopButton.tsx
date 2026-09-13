'use client';

import styles from './Footer.module.css';

// Client leaf of the server-rendered Footer: smooth scroll back to the top.
export default function BackToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
