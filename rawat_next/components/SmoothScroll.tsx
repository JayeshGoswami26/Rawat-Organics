"use client";

import React, { useEffect } from "react";
import { ReactLenis, useLenis } from "@studio-freight/react-lenis";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenis = useLenis(({ scroll }) => {
    // any global scroll hooks could go here if needed
  });

  // Optionally stop Lenis when unmounting (usually handled by the wrapper)
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.12, // faster response (higher = snappier)
        duration: 0.6, // reduce delay
        smoothWheel: true,
        syncTouch: true,
        wheelMultiplier: 1.2, // 🔥 makes scroll feel more "alive"
      }}
    >
      {children}
    </ReactLenis>
  );
}
