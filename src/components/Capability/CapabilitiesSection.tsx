"use client";

import React, { useRef, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useScroll, useSpring, useTransform, MotionValue, motion } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import { Group } from "three";
import { CAPABILITIES } from "@/data/capabilities";
import { CAPABILITIES_CONFIG as CONFIG } from "@/config/capabilities.config";
import CylinderCard from "./CylinderCard";

interface CylinderSceneProps {
    rotationProgress: MotionValue<number>;
    dragRotation: number;
}

function CylinderScene({ rotationProgress, dragRotation }: CylinderSceneProps) {
    const groupRef = useRef<Group>(null);

    useFrame(() => {
        if (groupRef.current) {
            // ترکیب چرخش اسکرول و درگ (Drag)
            groupRef.current.rotation.y = rotationProgress.get() + dragRotation;
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

export default function CapabilitiesSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dragRotation, setDragRotation] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const smoothProgress = useSpring(scrollYProgress, CONFIG.SCROLL_SPRING);

    const maxRotation = -Math.PI * (CAPABILITIES.length / 2);

    // تبدیل مستقیم مقدار اسکرول به زاویه چرخش بدون نیاز به رندر مجدد
    const rotationY = useTransform(smoothProgress, [0, 1], [0, maxRotation]);

    // هندل کردن درگ ماوس/لمس (اضافه شده)
    const bindDrag = useDrag(({ offset: [x] }) => {
        setDragRotation(x * 0.005);
    }, { axis: 'x' });

    return (
        <section
            id="capabilities"
            ref={containerRef}
            className="relative w-full h-[400vh] bg-[#050505] text-white"
        >
            <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col-reverse lg:flex-row items-center">

                {/* 
                  تغییرات: 
                  ۱. تبدیل div به motion.div
                  ۲. تغییر Y به y (حرف کوچک)
                */}
                <motion.div
                    className="absolute inset-0 pointer-events-none opacity-20 bg-center bg-cover bg-no-repeat mix-blend-screen z-0"
                    style={{
                        backgroundImage: "url('/images/capability/back.webp')",
                        height: "120vh",
                        // حرکت دادن عکس به سمت بالا هنگام اسکرول
                        y: useTransform(smoothProgress, [0, 1], ["0%", "-15%"])
                    }}
                />

                {/* گردونه سه‌بعدی */}
                <div
                    {...bindDrag()}
                    className="relative w-full lg:w-1/2 h-[50vh] lg:h-full z-10 cursor-grab active:cursor-grabbing touch-none"
                >
                    <Canvas
                        camera={{ position: [0, 0, CONFIG.CAMERA_Z_POSITION], fov: CONFIG.CAMERA_FOV }}
                        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                        dpr={[1, 2]}
                    >
                        <ambientLight intensity={2} />
                        <directionalLight position={[10, 10, 10]} intensity={1.5} />
                        <Suspense fallback={null}>
                            <CylinderScene rotationProgress={rotationY} dragRotation={dragRotation} />
                        </Suspense>
                    </Canvas>
                </div>

                {/* محتوای متنی */}
                <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-full flex flex-col justify-center px-8 py-12 lg:py-0 lg:pl-16 lg:pr-32 z-20 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="pointer-events-auto"
                    >
                        <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-4 lg:mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
                            What We Master.
                        </h2>
                        <p className="text-base sm:text-lg lg:text-xl text-white/60 leading-relaxed font-light mb-6 lg:mb-8">
                            We blend engineering precision with artistic vision. Scroll or drag the cylinder to explore our core competencies and discover how we build the future.
                        </p>
                        <div className="w-16 lg:w-24 h-1 bg-gradient-to-r from-white to-transparent rounded-full" />
                    </motion.div>
                </div>

            </div>
        </section>
    );


}
