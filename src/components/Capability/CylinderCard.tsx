import type { CSSProperties } from "react";
import { Capability } from "@/data/capabilities";
import { CYLINDER, cardAngle, cardDepth } from "./cylinder";
import styles from "./Capabilities.module.css";

interface CylinderCardProps {
    data: Capability;
    index: number;
    total: number;
}

// One face of the cylinder, rendered on the server. The slot places it on the ring
// (rotateY(angle) translateZ(radius) scale, from Capabilities.module.css); the card inside carries
// its depth styling — here for the ring at rest, then CapabilitiesController updates it per frame.
export default function CylinderCard({ data, index, total }: CylinderCardProps) {
    const angle = cardAngle(index, total);
    const depth = cardDepth(angle);
    const depthStyle: CSSProperties = depth.hidden
        ? { visibility: 'hidden' }
        : { visibility: 'visible', opacity: depth.opacity, transform: depth.transform, pointerEvents: depth.pointerEvents };

    return (
        <div className={styles.slot} style={{ '--card-angle': `${angle}rad` } as CSSProperties}>
            <div
                data-cap-card={angle}
                className="flex flex-col justify-start relative overflow-hidden group"
                style={{
                    width: `${CYLINDER.cardWidth}px`,
                    height: `${CYLINDER.cardHeight}px`,
                    backgroundColor: '#111111', // استفاده از رنگ سالید به جای ترانسپرنت + بلر برای پرفورمنس
                    borderRadius: '28px',
                    padding: '36px 28px',
                    color: '#ffffff',
                    boxShadow: `0 20px 50px -15px ${data.color}30`,
                    border: `1px solid ${data.color}40`,
                    willChange: 'transform, opacity',
                    ...depthStyle,
                }}
            >
                {/* بک‌گراند گرادیانت رنگی */}
                <div
                    className="absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20 pointer-events-none"
                    style={{
                        background: `linear-gradient(135deg, ${data.color} 0%, transparent 70%)`
                    }}
                />

                <div className="flex justify-between items-center mb-8 relative z-10">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg"
                        style={{
                            backgroundColor: data.color,
                            color: '#111',
                        }}
                        aria-hidden="true"
                    >
                        {data.icon.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white/20 text-4xl font-black font-mono tracking-tighter">{data.number}</span>
                </div>

                <h3 className="text-2xl font-extrabold mb-4 text-white relative z-10">{data.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-auto relative z-10 font-medium">
                    {data.desc}
                </p>

                <ul className="flex flex-wrap gap-2 mt-6 relative z-10">
                    {data.tags.slice(0, 3).map((tag, i) => (
                        <li
                            key={i}
                            // کلاس inline-block اضافه شد
                            className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 text-white/80 border border-white/10"
                        >
                            {tag}
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    );
}
