"use client";

import React from "react";
import { ReactLenis } from "@studio-freight/react-lenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis
      root
      options={{
        // Native wheel/trackpad — avoids Lenis “floaty” lag (~1s catch-up)
        smoothWheel: false,
        syncTouch: true,
        touchMultiplier: 1,
        wheelMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
