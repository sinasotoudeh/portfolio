'use client';

import { useEffect } from 'react';

// globals.css draws focus outlines only while <body> has .keyboard-nav. Tab turns them on; any
// mouse, touch or pen input turns them off again, so pointer users never see them.
export default function KeyboardFocus() {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
        };
        const onPointerDown = () => document.body.classList.remove('keyboard-nav');

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('pointerdown', onPointerDown, { passive: true });
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('pointerdown', onPointerDown);
        };
    }, []);

    return null;
}
