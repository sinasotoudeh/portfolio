'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Cursor.module.css';

// Cursor.module.css hides the cursor under exactly this query; there the engine never runs.
const HIDDEN_CURSOR_QUERY = '(hover: none) and (pointer: coarse)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// Below this distance (px) the ring snaps onto the pointer and the loop sleeps until the next move.
const SETTLE_DISTANCE = 0.01;

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    // ذخیره موقعیت برای Lerp (انیمیشن نرم)
    const mouse = useRef({ x: 0, y: 0 });
    const ring = useRef({ x: 0, y: 0 });

    const [cursorState, setCursorState] = useState<'default' | 'hover' | 'magnetic' | 'text'>('default');
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const hiddenCursor = window.matchMedia(HIDDEN_CURSOR_QUERY);
        const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);

        // 2. حلقه انیمیشن (Performance Optimized)
        let animationFrameId = 0; // 0 while the loop sleeps
        const render = () => {
            // نقطه مستقیماً به ماوس می‌چسبد
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(calc(${mouse.current.x}px - 50%), calc(${mouse.current.y}px - 50%))`;
            }

            // حلقه بیرونی با تاخیر (Lerp) دنبال می‌کند — with reduced motion it sits on the pointer
            const follow = reducedMotion.matches ? 1 : 0.15; // سرعت دنبال کردن
            ring.current.x += (mouse.current.x - ring.current.x) * follow;
            ring.current.y += (mouse.current.y - ring.current.y) * follow;

            const settled =
                Math.abs(mouse.current.x - ring.current.x) < SETTLE_DISTANCE &&
                Math.abs(mouse.current.y - ring.current.y) < SETTLE_DISTANCE;
            if (settled) {
                ring.current.x = mouse.current.x;
                ring.current.y = mouse.current.y;
            }

            if (ringRef.current) {
                ringRef.current.style.transform = `translate(calc(${ring.current.x}px - 50%), calc(${ring.current.y}px - 50%))`;
            }

            animationFrameId = settled ? 0 : requestAnimationFrame(render);
        };
        const wake = () => {
            if (!animationFrameId) animationFrameId = requestAnimationFrame(render);
        };

        // 1. آپدیت موقعیت دقیق ماوس
        const onMouseMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
            wake();
        };

        // 3. سیستم تشخیص Hover (Event Delegation)
        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            if (target.closest('[data-cursor="text"], input, textarea')) {
                setCursorState('text');
            } else if (target.closest('[data-magnetic], .btn-magnetic')) {
                setCursorState('magnetic');
            } else if (target.closest('a, button, [data-cursor="hover"]')) {
                setCursorState('hover');
            } else {
                setCursorState('default');
            }
        };

        // رویدادهای کلیک
        const onMouseDown = () => setIsClicked(true);
        const onMouseUp = () => setIsClicked(false);

        // The engine (listeners + loop) runs only while the cursor is visible, following the
        // media query live — e.g. a tablet that gains a mouse.
        let running = false;
        const start = () => {
            if (running) return;
            running = true;
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseover', onMouseOver);
            window.addEventListener('mousedown', onMouseDown);
            window.addEventListener('mouseup', onMouseUp);
            wake(); // شروع حلقه انیمیشن
        };
        const stop = () => {
            if (!running) return;
            running = false;
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', onMouseOver);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            cancelAnimationFrame(animationFrameId);
            animationFrameId = 0;
        };
        const syncWithMedia = () => (hiddenCursor.matches ? stop() : start());

        syncWithMedia();
        hiddenCursor.addEventListener('change', syncWithMedia);

        return () => {
            hiddenCursor.removeEventListener('change', syncWithMedia);
            stop();
        };
    }, []);

    // ترکیب کلاس‌های وضعیت
    const stateClass =
        cursorState === 'hover' ? styles.isHovering :
            cursorState === 'magnetic' ? styles.isMagnetic :
                cursorState === 'text' ? styles.isText : '';

    const clickClass = isClicked ? styles.isClicked : '';

    return (
        <div className={`${styles.cursorContainer} ${stateClass} ${clickClass}`} aria-hidden="true">
            <div ref={ringRef} className={styles.cursorRing} />
            <div ref={dotRef} className={styles.cursorDot} />
        </div>
    );
}
