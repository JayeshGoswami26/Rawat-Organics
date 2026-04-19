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
        smoothWheel: false,   // Native wheel — no floaty lag
        syncTouch: false,     // Native touch scroll — no RAF overhead
        lerp: 1,              // lerp=1 means instant, zero easing cost
        duration: 0,
      }}
    >
      {children}
    </ReactLenis>
  );
}
