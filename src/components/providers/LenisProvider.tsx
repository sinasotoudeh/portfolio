'use client';

import { ReactLenis, type LenisRef } from 'lenis/react';
import { ReactNode, useEffect, useRef } from 'react';

interface LenisProviderProps {
    children: ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
    const lenisRef = useRef<LenisRef>(null);

    // Lenis is advanced from this loop instead of its own (autoRaf: false), one step per
    // animation frame exactly as before. Phase 2.0 hands this clock to GSAP's ticker so
    // scrolling and ScrollTrigger animations share a single frame loop.
    useEffect(() => {
        let frameId = requestAnimationFrame(function update(time: number) {
            lenisRef.current?.lenis?.raf(time);
            frameId = requestAnimationFrame(update);
        });
        return () => cancelAnimationFrame(frameId);
    }, []);

    return (
        <ReactLenis root ref={lenisRef} options={{ lerp: 0.1, duration: 1.5, smoothWheel: true, autoRaf: false }}>
            {children}
        </ReactLenis>
    );
}
