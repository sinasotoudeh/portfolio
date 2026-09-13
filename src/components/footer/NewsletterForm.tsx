'use client';

import React, { useState } from 'react';
import styles from './Footer.module.css';

// Client leaf of the server-rendered Footer: the newsletter form's input and submit state.
export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setEmail('');
  };

  return (
    <form onSubmit={handleNewsletterSubmit} className={styles.newsletterForm}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className={styles.newsletterInput}
        required
        aria-label="Email address"
      />
      <button
        type="submit"
        className={styles.newsletterButton}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className={styles.spinner} />
        ) : (
          <ArrowIcon />
        )}
      </button>
    </form>
  );
}

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
