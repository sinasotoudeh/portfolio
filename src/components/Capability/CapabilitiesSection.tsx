// A:\NEXT\Development\Projects\nonato\src\components\Capability\CapabilitiesSection.tsx
"use client";

import React, { useRef, Suspense } from "react";
// 🚀 FIX: useFrame اضافه شد
import { Canvas, useFrame } from "@react-three/fiber";
import { useScroll, useTransform, useSpring, MotionValue, motion } from "framer-motion";
import { Group } from "three";
import { CAPABILITIES, Capability } from "@/data/capabilities";
import { CAPABILITIES_CONFIG as CONFIG } from "@/config/capabilities.config";
import CylinderCard from "./CylinderCard";

interface CylinderSceneProps {
    rotationProgress: MotionValue<number>;
}

function CylinderScene({ rotationProgress }: CylinderSceneProps) {
    const groupRef = useRef<Group>(null);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y = rotationProgress.get();
        }
    });

    return (
        <group ref={groupRef}>
            {CAPABILITIES.map((cap, index) => (
                <CylinderCard
                    key={cap.id}
                    data={cap}
                    index={index}
                    total={CAPABILITIES.length}
                    radius={CONFIG.CYLINDER_RADIUS}
                />
            ))}
        </group>
    );
}

const AccessibleContent = ({ capabilities }: { capabilities: Capability[] }) => (
    <div className="sr-only">
        <h2>Our Capabilities</h2>
        <ul>
            {capabilities.map(cap => (
                <li key={`accessible-${cap.id}`}>
                    <h3>{cap.title}</h3>
                    <p>{cap.desc}</p>
                </li>
            ))}
        </ul>
    </div>
);

export default function CapabilitiesSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const smoothProgress = useSpring(scrollYProgress, CONFIG.SCROLL_SPRING);
    const rotationY = useTransform(smoothProgress, [0, 1], [0, -Math.PI * (CAPABILITIES.length / 2.5)]);

    const thumbWidthPercent = (CONFIG.SCROLLBAR_THUMB_WIDTH_REM * 16 / 400) * 100;
    const scrollbarLeft = useTransform(smoothProgress, [0, 1], [`0%`, `${100 - thumbWidthPercent}%`]);

    return (
        <section
            id="capabilities"
            ref={containerRef}
            className="relative w-full h-[450vh] bg-black"
        >
            <div className="sticky top-0 w-full h-screen overflow-hidden">
                <AccessibleContent capabilities={CAPABILITIES} />

                <div className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing">
                    <Canvas
                        camera={{ position: [0, 0, CONFIG.CAMERA_Z_POSITION], fov: CONFIG.CAMERA_FOV }}
                        gl={{ antialias: true, alpha: true }}
                    >
                        <ambientLight intensity={1.5} />
                        <directionalLight position={[5, 5, 5]} intensity={1} />
                        <Suspense fallback={null}>
                            <CylinderScene rotationProgress={rotationY} />
                        </Suspense>
                    </Canvas>
                </div>

                <div className="absolute bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 w-11/12 max-w-sm z-10 pointer-events-none">
                    <div className="w-full h-1 bg-white/10 mx-auto rounded-full relative">
                        <motion.div
                            className="absolute top-0 h-full bg-white rounded-full"
                            style={{
                                width: `${CONFIG.SCROLLBAR_THUMB_WIDTH_REM}rem`,
                                left: scrollbarLeft
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
