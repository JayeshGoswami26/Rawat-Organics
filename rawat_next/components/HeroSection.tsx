"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";
import dynamic from "next/dynamic";
const LightPillar = dynamic(() => import("./LightPillar"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />,
});

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const springProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.3,
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollProgressRef.current = v;
  });

  const textOpacity = useTransform(springProgress, [0, 0.22], [1, 0]);
  const textY = useTransform(springProgress, [0, 0.35], ["0%", "-28%"]);
  const indicatorOpacity = useTransform(springProgress, [0, 0.1], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: "180vh" }}
      id="hero"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* Light pillar */}
        <div className="absolute inset-0 z-0">
          <div
            style={{
              width: "100%",
              height: "100%",
              minHeight: "600px",
              position: "relative",
            }}
          >
            <LightPillar
              topColor="#10b9a2"
              bottomColor="#40d03c"
              intensity={1}
              rotationSpeed={0.3}
              glowAmount={0.005}
              pillarWidth={5}
              pillarHeight={0.4}
              noiseIntensity={0.2}
              pillarRotation={25}
              interactive={false}
              mixBlendMode="screen"
              quality="high"
              scrollProgressRef={scrollProgressRef}
            />
          </div>
        </div>

        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 11,
            pointerEvents: "none",
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        <div className="noise-overlay" style={{ zIndex: 12 }} />

        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          style={{ opacity: textOpacity, y: textY, zIndex: 20 }}
        >
          <motion.span
            className="text-white/60 font-headline font-semibold tracking-[0.35em] uppercase text-xs md:text-sm mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            The Botanical Atelier
          </motion.span>
          <motion.h1
            className="text-white font-headline font-extrabold text-5xl md:text-8xl tracking-tighter mb-8 leading-[1.05]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.1,
              delay: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            Pure.{" "}
            <span className="italic font-light text-primary-fixed/90">
              Natural.
            </span>{" "}
            Organic.
          </motion.h1>
          <motion.p
            className="text-white/80 text-base md:text-xl font-light mb-12 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.75 }}
          >
            Experience the heritage of soil. A botanical atelier dedicated to
            cultivating the essence of nature&apos;s most refined harvests.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1 }}
          >
            <a
              href="#collection"
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-br from-primary-fixed to-primary-fixed-dim text-on-primary-fixed font-headline font-bold text-base rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl"
            >
              Inquire Now
            </a>
            <a
              href="#story"
              className="w-full sm:w-auto px-10 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-headline font-bold text-base hover:bg-white/20 transition-all duration-300"
            >
              Our Story
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: indicatorOpacity, zIndex: 30 }}
        >
          <span className="text-white/50 font-headline text-xs tracking-[0.3em] uppercase">
            Scroll to explore
          </span>
          <div className="scroll-indicator w-px h-14 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>

        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-primary-fixed/60"
          style={{
            scaleX: springProgress,
            transformOrigin: "left",
            zIndex: 30,
          }}
        />
      </div>
    </div>
  );
}
