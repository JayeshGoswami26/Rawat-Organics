"use client";

/**
 * HeroSection — Canvas-Based Image Sequence Scrubbing
 * ─────────────────────────────────────────────────────────────────────────────
 * Video scrubbers are notoriously prone to decoder jank.
 * This architecture uses an Image Sequence (121 frames of high-res .pngs).
 *
 * 1. Preload 121 `HTMLImageElement`s into memory during mount.
 * 2. Connect Framer Motion's scroll directly to target frame index.
 * 3. Draw `images[currentIndex]` to `<canvas>` synchronously in the RAF loop.
 *
 * This creates a perfect, zero-lag timeline identical to Apple's implementation.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useRef, useEffect, useCallback, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useVelocity } from "framer-motion";

// ─── Constants ───────────────────────────────────────────────────────────────
const FRAME_COUNT = 121;
const MIN_DELTA = 0.001;
const ZOOM_START = 1.0;
const ZOOM_END = 1.1;
const BRIGHTNESS_START = 0.88;
const BRIGHTNESS_MID = 0.65;
const BRIGHTNESS_END = 0.52;

// ─── Utility helpers ─────────────────────────────────────────────────────────
const clamp = (v: number, lo: number, hi: number) =>
  Math.min(Math.max(v, lo), hi);
const mapRange = (v: number, a: number, b: number, c: number, d: number) =>
  c + ((v - a) / (b - a)) * (d - c);

export default function HeroSection() {
  // ─── DOM refs ──────────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  // ─── State & Refs ──────────────────────────────────────────────────────────
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const canvasSize = useRef({ w: 0, h: 0 });
  const targetProgress = useRef(0);
  const smoothProgress = useRef(0);
  const lastDrawnFrame = useRef(-1);

  // ─── Framer Motion scroll ─────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Tighter Spring: Instant but smooth tracking for mouse wheels, no lag for trackpads
  // const springProgress = useSpring(scrollYProgress, {
  //   stiffness: 400,
  //   damping: 40,
  //   mass: 0.2,
  //   restDelta: 0.001,
  // })
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 120, // lower = smoother glide
    damping: 20, // controls bounce
    mass: 0.3,
  });

  const velocity = useVelocity(scrollYProgress);

  // ─── Framer Motion derived values ─────────────────────────────────────────
  const textOpacity = useTransform(springProgress, [0, 0.22], [1, 0]);
  const textY = useTransform(springProgress, [0, 0.35], ["0%", "-28%"]);
  const fogOpacity = useTransform(springProgress, [0, 0.7], [0.25, 0.75]);
  const indicatorOpacity = useTransform(springProgress, [0, 0.1], [1, 0]);

  // ─── Draw Frame to Canvas ─────────────────────────────────────────────────
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false }); // Disable alpha for huge perf boost
    if (!ctx) return;

    const imgs = imagesRef.current;
    if (!imgs[frameIndex]) return;

    const img = imgs[frameIndex];

    // Set canvas internal resolution to match the image exactly (e.g. 1280x720)
    // CSS object-fit: cover scales it up for free on the GPU
    const scale = 0.75; // tweak this
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    // const w = img.naturalWidth || 1280;
    // const h = img.naturalHeight || 720;

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    ctx.drawImage(img, 0, 0, w, h);
    lastDrawnFrame.current = frameIndex;
  }, []);

  // ─── Initialization & Preloading ──────────────────────────────────────────
  useEffect(() => {
    // 1. Preload image sequence efficiently without freezing React main thread-`
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const checkAllLoaded = () => {
      if (loadedCount === FRAME_COUNT) {
        const loaderOverlay = document.getElementById("hero-loader");
        if (loaderOverlay) {
          loaderOverlay.style.opacity = "0";
          setTimeout(() => {
            loaderOverlay.style.pointerEvents = "none";
          }, 800);
        }
      }
    };

    const preloadBatch = async (start: number, end: number) => {
      for (let i = start; i <= end; i++) {
        const img = new Image();
        const paddedIndex = i.toString().padStart(4, "0");
        img.src = `/frames/frame_${paddedIndex}.webp`;

        await img.decode(); // 🔥 ensures no frame stutter later

        loadedCount++;

        const loaderText = document.getElementById("hero-loading-text");
        if (loaderText) {
          loaderText.innerText = `Loading Experience... ${Math.round((loadedCount / FRAME_COUNT) * 100)}%`;
        }

        checkAllLoaded();

        loadedImages[i] = img;
        imagesRef.current = loadedImages;

        // draw first frame immediately
        if (i === 1 && lastDrawnFrame.current === -1) {
          drawFrame(1);
        }
      }
    };

    // Load first chunk fast (critical for UX)
    preloadBatch(1, 30);

    // Load rest in background (non-blocking)
    setTimeout(() => preloadBatch(31, 80), 100);
    setTimeout(() => preloadBatch(81, FRAME_COUNT), 200);

    // 2. Setup Resize Handler
    // Canvas internal buffer size is now locked to the image size.
    // CSS handles resizing completely.
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initial paint if resize occurs before scroll
    const updateSize = () => {
      if (lastDrawnFrame.current !== -1) {
        drawFrame(lastDrawnFrame.current);
      }
    };
    window.addEventListener("resize", updateSize);

    // 3. Subscribe to Scroll
    // By subscribing directly to springProgress instead of scrollYProgress,
    // we get Framer Motion's buttery smooth spring physics out of the box,
    // completely eliminating the need for a manual lerp loop that causes jumpiness!
    targetProgress.current = springProgress.get();
    smoothProgress.current = targetProgress.current;

    const unsubscribe = springProgress.on("change", (v) => {
      targetProgress.current = v;
    });

    // 4. Main Animation Loop
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);

      if (imagesRef.current.length < 2) return;

      const progress = springProgress.get();
      // springProgress already handles the physics! No lerp needed.
      const prev = progress;
      // smoothProgress.current = clamp(targetProgress.current, 0, 1);

      const delta = Math.abs(progress - prev);

      if (delta > MIN_DELTA || lastDrawnFrame.current === -1) {

        // Map 0..1 to 1..121
        const floatFrame = mapRange(progress, 0, 1, 1, FRAME_COUNT);
        const targetFrame = Math.floor(floatFrame);

        // Only draw if the frame actually changed
        // if (targetFrame !== lastDrawnFrame.current && imagesRef.current[targetFrame]?.complete)
        if (
          targetFrame !== lastDrawnFrame.current &&
          imagesRef.current[targetFrame] &&
          imagesRef.current[targetFrame].complete
        ) {
          drawFrame(targetFrame);
        }
      }

      // Parallax / Zoom / Brightness (Hardware Accelerated style mutations)
      const zoom = mapRange(progress, 0, 1, ZOOM_START, ZOOM_END);
      if (canvasWrapRef.current) {
        canvasWrapRef.current.style.transform = `scale(${zoom.toFixed(4)})`;
      }

      // Convert Brightness range to Darkness Opacity
      const p = progress;
      const darkness =
        p < 0.5
          ? mapRange(p, 0, 0.5, 1 - BRIGHTNESS_START, 1 - BRIGHTNESS_MID)
          : mapRange(p, 0.5, 1, 1 - BRIGHTNESS_MID, 1 - BRIGHTNESS_END);

      const darkOverlay = document.getElementById("hero-dark-overlay");
      if (darkOverlay) {
        darkOverlay.style.opacity = darkness.toFixed(3);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateSize);
      unsubscribe();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollYProgress, drawFrame]);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="relative"
      // style={{ height: "300vh" }}
      style={{ height: "180vh" }}
      id="hero"
    >
      {/* Loading Overlay manually controlled by DOM to avoid React render freezes */}
      <div
        id="hero-loader"
        className="fixed inset-0 z-50 flex items-center justify-center bg-background text-primary transition-opacity duration-1000 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-headline tracking-widest uppercase flex flex-col items-center gap-4"
        >
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span id="hero-loading-text">Loading Experience... 0%</span>
        </motion.div>
      </div>

      {/* Viewport-pinned scene */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          ref={canvasWrapRef}
          style={{
            position: "absolute",
            inset: 0,
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              // Removed filter willChange for performance
            }}
          />
          {/* Hardware accelerated dark overlay replaces expensive filter */}
          <div
            id="hero-dark-overlay"
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#000",
              opacity: 1 - BRIGHTNESS_START,
              willChange: "opacity",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* ── FOG / DEPTH OVERLAY ──────────────────────────────────────────── */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            opacity: fogOpacity,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 120% 60% at 50% 100%, rgba(2,28,16,0.85) 0%, transparent 70%)",
          }}
        />

        {/* ── GRADIENT OVERLAY ────────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 11,
            pointerEvents: "none",
            background:
              "linear-gradient(to bottom, rgba(2,28,16,0.38) 0%, rgba(2,28,16,0.08) 40%, rgba(2,28,16,0.55) 100%)",
          }}
        />

        {/* ── FILM GRAIN ──────────────────────────────────────────────────── */}
        <div className="noise-overlay" style={{ zIndex: 12 }} />

        {/* ── HERO TEXT ────────────────────────────────────────────────────── */}
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
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-br from-primary-fixed to-primary-fixed-dim text-primary font-headline font-bold text-base rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl"
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

        {/* ── SCROLL INDICATOR ────────────────────────────────────────────── */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: indicatorOpacity, zIndex: 30 }}
        >
          <span className="text-white/50 font-headline text-xs tracking-[0.3em] uppercase">
            Scroll to explore
          </span>
          <div className="scroll-indicator w-px h-14 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>

        {/* ── PROGRESS BAR ────────────────────────────────────────────────── */}
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
