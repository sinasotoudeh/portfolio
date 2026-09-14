'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/motion/gsap';

interface LenisProviderProps {
    children: ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
    // The root instance rendered below, published through Lenis' root store once created.
    const lenis = useLenis();

    // One frame loop for the page: GSAP's ticker advances Lenis (autoRaf: false) and every Lenis
    // scroll step updates ScrollTrigger in the same frame. Lag smoothing is off so a long frame
    // never holds the scroll clock back — Lenis' own loop always ran on real time.
    useEffect(() => {
        if (!lenis) return;

        const updateScrollTrigger = () => ScrollTrigger.update();
        const advance = (time: number) => lenis.raf(time * 1000);

        lenis.on('scroll', updateScrollTrigger);
        gsap.ticker.add(advance);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(advance);
            lenis.off('scroll', updateScrollTrigger);
        };
    }, [lenis]);

    return (
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true, autoRaf: false }}>
            {children}
        </ReactLenis>
    );
}
