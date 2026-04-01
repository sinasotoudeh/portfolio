// A:\NEXT\Development\Projects\nonato\src\components\Capability\CylinderCard.tsx
"use client";

import React, { useRef, memo } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { Capability } from "@/data/capabilities";
import { CAPABILITIES_CONFIG } from "@/config/capabilities.config";

interface CylinderCardProps {
    data: Capability;
    index: number;
    total: number;
    radius: number;
}

// 🚀 FIX: تایپ پارامتر htmlRef نیز برای پذیرش null اصلاح شد
const useCardAnimation = (
    groupRef: React.RefObject<Group | null>,
    htmlRef: React.RefObject<HTMLDivElement | null>,
    baseAngle: number
) => {
    useFrame(() => {
        if (!groupRef.current || !htmlRef.current) return;

        const parentRotation = groupRef.current.parent?.rotation.y || 0;
        const globalAngle = baseAngle + parentRotation;
        const normalizedZ = (Math.cos(globalAngle) + 1) / 2;

        const opacity = Math.pow(normalizedZ, 3);
        const blur = (1 - normalizedZ) * 8;
        const scale = 0.85 + (normalizedZ * 0.15);

        const el = htmlRef.current;

        el.style.display = opacity < 0.01 ? 'none' : 'flex';
        if (el.style.display === 'none') return;

        el.style.opacity = opacity.toFixed(3);
        el.style.filter = `blur(${blur.toFixed(1)}px)`;
        el.style.transform = `scale(${scale.toFixed(3)})`;
        el.style.pointerEvents = opacity > 0.95 ? "auto" : "none";
    });
};

const CylinderCardComponent = ({ data, index, total, radius }: CylinderCardProps) => {
    const groupRef = useRef<Group>(null);
    const htmlContainerRef = useRef<HTMLDivElement>(null);

    const angle = (index / total) * Math.PI * 2;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

    // اکنون هر دو ref با نوع صحیح به هوک پاس داده می‌شوند و خطایی وجود نخواهد داشت
    useCardAnimation(groupRef, htmlContainerRef, angle);

    return (
        <group
            ref={groupRef}
            position={[x, 0, z]}
            rotation={[0, angle, 0]}
        >
            <Html
                transform
                center
                distanceFactor={CAPABILITIES_CONFIG.CARD_DISTANCE_FACTOR}
                occlude="blending"
                zIndexRange={[100, 0]}
            >
                <div
                    ref={htmlContainerRef}
                    className="will-change-transform-opacity flex flex-col justify-start transition-colors duration-300"
                    style={{
                        width: `${CAPABILITIES_CONFIG.CARD_WIDTH_PX}px`,
                        height: `${CAPABILITIES_CONFIG.CARD_HEIGHT_PX}px`,
                        backgroundColor: 'rgba(22, 22, 24, 0.75)',
                        backdropFilter: 'blur(12px) saturate(1.2)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '24px',
                        padding: '32px 24px',
                        color: '#f1f1f1',
                        boxShadow: '0 16px 40px -15px rgba(0,0,0,0.6)',
                        overflow: 'hidden'
                    }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border"
                            style={{
                                backgroundColor: `${data.color}20`,
                                color: data.color,
                                borderColor: `${data.color}40`
                            }}
                        >
                            {data.icon.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white/30 text-2xl font-light font-mono">{data.number}</span>
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-white">{data.title}</h3>
                    <p className="text-white/70 text-base leading-relaxed mb-auto">
                        {data.desc}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-6">
                        {data.tags.slice(0, 3).map((tag, i) => (
                            <span
                                key={i}
                                className="text-xs uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 text-white/60 border border-white/10"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </Html>
        </group>
    );
};

export default memo(CylinderCardComponent);
