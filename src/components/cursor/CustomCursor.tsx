'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Cursor.module.css';

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    // ذخیره موقعیت برای Lerp (انیمیشن نرم)
    const mouse = useRef({ x: 0, y: 0 });
    const ring = useRef({ x: 0, y: 0 });

    const [cursorState, setCursorState] = useState<'default' | 'hover' | 'magnetic' | 'text'>('default');
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        // 1. آپدیت موقعیت دقیق ماوس
        const onMouseMove = (e: MouseEvent) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        };

        // 2. حلقه انیمیشن (Performance Optimized)
        let animationFrameId: number;
        const render = () => {
            // نقطه مستقیماً به ماوس می‌چسبد
            if (dotRef.current) {
                dotRef.current.style.transform = `translate(calc(${mouse.current.x}px - 50%), calc(${mouse.current.y}px - 50%))`;
            }

            // حلقه بیرونی با تاخیر (Lerp) دنبال می‌کند
            ring.current.x += (mouse.current.x - ring.current.x) * 0.15; // سرعت دنبال کردن
            ring.current.y += (mouse.current.y - ring.current.y) * 0.15;

            if (ringRef.current) {
                ringRef.current.style.transform = `translate(calc(${ring.current.x}px - 50%), calc(${ring.current.y}px - 50%))`;
            }

            animationFrameId = requestAnimationFrame(render);
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

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseover', onMouseOver);
        window.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);

        // شروع حلقه انیمیشن
        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', onMouseOver);
            window.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            cancelAnimationFrame(animationFrameId);
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
