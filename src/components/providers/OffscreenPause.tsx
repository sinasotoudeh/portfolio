'use client';

import { useEffect } from 'react';

// Marks each [data-pause-offscreen] section with data-offscreen while it is more than 200 px out of
// view; globals.css then pauses the CSS animation loops inside it (they're not visible there).
export default function OffscreenPause() {
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            for (const entry of entries) entry.target.toggleAttribute('data-offscreen', !entry.isIntersecting);
        }, { rootMargin: '200px 0px' });
        document.querySelectorAll('[data-pause-offscreen]').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return null;
}
