import { CAPABILITIES } from "@/data/capabilities";
import CapabilitiesController from "./CapabilitiesController";
import CylinderCard from "./CylinderCard";
import styles from "./Capabilities.module.css";

// Server-rendered Capabilities: the cylinder is plain HTML and CSS 3D (D-1) — six real cards with
// headings and text in the page. CapabilitiesController (client leaf) turns the ring with scroll
// (spring-smoothed) and drag, shades each card by depth, moves the background and reveals the text.
export default function CapabilitiesSection() {
    return (
        <CapabilitiesController
            id="capabilities"
            data-pause-offscreen=""
            aria-labelledby="capabilities-title"
            className="relative w-full h-[400vh] bg-[#050505] text-white"
        >
            <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col-reverse lg:flex-row items-center">

                {/* Background, drifting up while the section scrolls (own GPU layer: moving it never repaints) */}
                <div
                    data-cap-bg=""
                    className="absolute inset-0 pointer-events-none opacity-20 bg-center bg-cover bg-no-repeat mix-blend-screen z-0 will-change-transform"
                    style={{
                        backgroundImage: "url('/images/capability/back.webp')",
                        height: "120vh",
                    }}
                />

                {/* گردونه سه‌بعدی — touch: vertical swipes scroll the page (which turns the ring), sideways swipes drag it */}
                <div
                    data-cap-stage=""
                    className={`${styles.stage} relative w-full lg:w-1/2 h-[50vh] lg:h-full z-10 cursor-grab active:cursor-grabbing touch-pan-y`}
                >
                    <div data-cap-ring="" className={styles.ring}>
                        {CAPABILITIES.map((cap, index) => (
                            <CylinderCard key={cap.id} data={cap} index={index} total={CAPABILITIES.length} />
                        ))}
                    </div>
                </div>

                {/* محتوای متنی */}
                <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-full flex flex-col justify-center px-8 py-12 lg:py-0 lg:pl-16 lg:pr-32 z-20 pointer-events-none">
                    <div
                        data-cap-text=""
                        className="pointer-events-auto"
                        style={{ opacity: 0, transform: "translateX(50px)" }}
                    >
                        <h2 id="capabilities-title" className="text-4xl sm:text-5xl lg:text-7xl font-black mb-4 lg:mb-6 tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-white to-white/40">
                            Core Expertise.
                        </h2>
                        <p className="text-base sm:text-lg lg:text-xl text-white/60 leading-relaxed font-light mb-6 lg:mb-8">
                            I blend engineering precision with artistic vision. Scroll or drag the cylinder to explore my capabilities and discover how we can build your next digital product.
                        </p>
                        <div className="w-16 lg:w-24 h-1 bg-linear-to-r from-white to-transparent rounded-full" />
                    </div>
                </div>

            </div>
        </CapabilitiesController>
    );
}
