'use client';

import { useEffect } from 'react';

// Marks each [data-pause-offscreen] section with data-offscreen while it is more than one screen out
// of view; globals.css then pauses its CSS animation loops and releases its will-change layers (not
// visible there; the margin gives them a screen of scrolling to come back before they are).
export default function OffscreenPause() {
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            for (const entry of entries) entry.target.toggleAttribute('data-offscreen', !entry.isIntersecting);
        }, { rootMargin: '100% 0px' });
        document.querySelectorAll('[data-pause-offscreen]').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return null;
}
