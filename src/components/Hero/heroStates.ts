// The Hero's four scroll states, as fractions of the pin's travel (section height − viewport):
// 0 sphere + tagline, 1 burst cards, 2 fluid work list, 3 connect CTA. Shared by the state
// controller (which layer is showing) and the canvas engine (particle morph + colour).
export const HERO_STATES = {
    0: { threshold: 0.00 },
    1: { threshold: 0.25 },
    2: { threshold: 0.55 },
    3: { threshold: 0.80 },
};

// Progress through the pin: 0 when the section's top reaches the viewport top, 1 when its bottom
// reaches the viewport bottom, measured against window.innerHeight like the engine always was.
export function heroProgress(section: HTMLElement, sectionTop: number = section.offsetTop): number {
    const pinDuration = section.offsetHeight - window.innerHeight;
    const scrollInPin = window.scrollY - sectionTop;
    return pinDuration > 0 ? Math.min(1, Math.max(0, scrollInPin / pinDuration)) : 0;
}

export function heroStateFor(progress: number): number {
    if (progress >= HERO_STATES[3].threshold) return 3;
    if (progress >= HERO_STATES[2].threshold) return 2;
    if (progress >= HERO_STATES[1].threshold) return 1;
    return 0;
}
