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

const useCardAnimation = (
    groupRef: React.RefObject<Group | null>,
    htmlRef: React.RefObject<HTMLDivElement | null>,
    baseAngle: number
) => {
    useFrame(() => {
        if (!groupRef.current || !htmlRef.current) return;

        const parentRotation = groupRef.current.parent?.rotation.y || 0;
        const globalAngle = baseAngle + parentRotation;

        // محاسبه عمق کارت برای تغییر استایل (بدون استفاده از فیلترهای سنگین blur)
        const normalizedZ = (Math.cos(globalAngle) + 1) / 2;

        const opacity = Math.pow(normalizedZ, 2); // توان کمتر برای نرمی بیشتر
        const scale = 0.9 + (normalizedZ * 0.1); // تغییر مقیاس ملایم‌تر

        const el = htmlRef.current;

        // پرفورمنس: عدم رندر کارت‌هایی که در پشت هستند
        if (opacity < 0.05) {
            el.style.visibility = 'hidden';
            return;
        }

        el.style.visibility = 'visible';
        el.style.opacity = opacity.toFixed(2);
        el.style.transform = `scale(${scale.toFixed(3)})`;
        el.style.pointerEvents = opacity > 0.9 ? "auto" : "none";
    });
};

const CylinderCardComponent = ({ data, index, total, radius }: CylinderCardProps) => {
    const groupRef = useRef<Group>(null);
    const htmlContainerRef = useRef<HTMLDivElement>(null);

    const angle = (index / total) * Math.PI * 2;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;

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
                occlude={false} // غیرفعال کردن occlude برای افزایش شدید پرفورمنس
                zIndexRange={[100, 0]}
                style={{
                    transformStyle: 'preserve-3d', // جلوگیری از پیکسلی شدن در مرورگرهای WebKit
                    WebkitFontSmoothing: 'antialiased'
                }}
            >
                <div
                    ref={htmlContainerRef}
                    className="flex flex-col justify-start relative overflow-hidden group"
                    style={{
                        width: `${CAPABILITIES_CONFIG.CARD_WIDTH_PX}px`,
                        height: `${CAPABILITIES_CONFIG.CARD_HEIGHT_PX}px`,
                        backgroundColor: '#111111', // استفاده از رنگ سالید به جای ترانسپرنت + بلر برای پرفورمنس
                        borderRadius: '28px',
                        padding: '36px 28px',
                        color: '#ffffff',
                        boxShadow: `0 20px 50px -15px ${data.color}30`,
                        border: `1px solid ${data.color}40`,
                        willChange: 'transform, opacity',
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
                        >
                            {data.icon.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white/20 text-4xl font-black font-mono tracking-tighter">{data.number}</span>
                    </div>

                    <h3 className="text-2xl font-extrabold mb-4 text-white relative z-10">{data.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-auto relative z-10 font-medium">
                        {data.desc}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-6 relative z-10">
                        {data.tags.slice(0, 3).map((tag, i) => (
                            <span
                                key={i}
                                // کلاس inline-block اضافه شد
                                className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 text-white/80 border border-white/10"
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
