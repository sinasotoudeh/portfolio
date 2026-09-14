// The page's single animation runtime (D-2). Every motion consumer imports gsap, ScrollTrigger
// and useGSAP from here, never from the packages directly: `gsap/ScrollTrigger` and
// `gsap/dist/ScrollTrigger` are separate builds, and each import path would bring its own
// ScrollTrigger instance with its own trigger list — Lenis' scroll updates would then miss the
// triggers created through the other copy. Imported only by client components.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
