// Footer.tsx
'use client';

import React, { useState } from 'react';
import styles from './Footer.module.css';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Services',
    links: [
      { label: 'Branding', href: '/services/branding' },
      { label: 'Web Development', href: '/services/web' },
      { label: 'App Design', href: '/services/app' },
      { label: 'AI Integration', href: '/services/ai' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Work', href: '/work' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
  { label: 'GitHub', href: 'https://github.com', icon: 'github' },
  { label: 'Dribbble', href: 'https://dribbble.com', icon: 'dribbble' },
];

export default function Footer() {
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        {/* Top Section */}
        <div className={styles.footerTop}>
          <div className={styles.hugeTextSection}>
            <span className={styles.hugeTextLine1}>STAY</span>
            <span className={styles.hugeTextLine2}>AHEAD.</span>
          </div>

          <div className={styles.newsletterSection}>
            <p className={styles.newsletterDesc}>
              Get the latest insights and updates delivered to your inbox.
            </p>
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
          </div>
        </div>

        {/* Links Grid */}
        <div className={styles.linksGrid}>
          {FOOTER_SECTIONS.map((section, idx) => (
            <div key={section.title} className={styles.linkColumn} style={{ '--col-index': idx } as React.CSSProperties}>
              <h5 className={styles.columnTitle}>{section.title}</h5>
              <ul className={styles.linkList}>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className={styles.footerLink}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Brand Section (Moved here) */}
          <div className={styles.brandSection} style={{ '--col-index': FOOTER_SECTIONS.length } as React.CSSProperties}>
            <div className={styles.logo}>
              <span className={styles.logoText}>N</span>
              <span className={styles.logoAccent}>O</span>
              <span className={styles.logoText}>NATO</span>
            </div>
            <p className={styles.tagline}>
              Crafting digital experiences that leave a mark.
            </p>
            <div className={styles.socialLinks}>
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  className={styles.socialLink}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialIcon type={social.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.footerBottom}>
          <div className={styles.legalLinks}>
            <a href="/privacy" className={styles.legalLink}>Privacy Policy</a>
            <span className={styles.separator}>·</span>
            <a href="/terms" className={styles.legalLink}>Terms of Service</a>
            <span className={styles.separator}>·</span>
            <a href="/cookies" className={styles.legalLink}>Cookie Policy</a>
          </div>

          <div className={styles.copyright}>
            <span>© {new Date().getFullYear()} Nonato. All rights reserved.</span>
          </div>

          <button
            onClick={scrollToTop}
            className={styles.backToTop}
            aria-label="Back to top"
          >
            <ChevronUpIcon />
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className={styles.footerGlow} aria-hidden="true" />
    </footer>
  );
}

// Icon Components
const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M18 15l-6-6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SocialIcon = ({ type }: { type: string }) => {
  const icons: Record<string, React.ReactElement> = {
    twitter: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    linkedin: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    github: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    dribbble: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm8.945 5.375c1.5 1.938 2.438 4.375 2.5 7.063-2.5-.5-4.875-.563-7.063-.188-.188-.438-.375-.875-.625-1.313 2.438-1 4.563-2.5 5.188-5.562zm-1.313-1.125c-.5 2.75-2.375 4.125-4.625 5.063-1.313-2.375-2.75-4.5-4.375-6.375 1.438-.563 3-.875 4.688-.875 1.563 0 3.063.375 4.313 1.063v1.125zm-7.188-1.563c1.688 1.875 3.188 4 4.5 6.375-2.813.75-5.875 1.125-9.188 1.125h-.563c.563-3.375 2.563-6.188 5.25-7.5zm-6.188 9.188c0-.188 0-.375.063-.563 3.5 0 6.813-.438 9.875-1.313.188.375.375.75.563 1.125-3.813 1.188-6.938 3.688-8.438 7.063-1.313-1.688-2.063-3.813-2.063-6.125v-.188zm3.563 7.5c1.313-3 4.125-5.313 7.563-6.375.938 2.438 1.688 5 2.188 7.688-1.188.438-2.5.688-3.875.688-2.188 0-4.188-.688-5.875-1.875v-.125zm8.438 1.313c-.438-2.563-1.125-5-2-7.313 2-.313 4.188-.25 6.5.188-.563 3.125-2.438 5.75-5.063 7.125h.563z" />
      </svg>
    ),
  };

  return icons[type] || null;
};
