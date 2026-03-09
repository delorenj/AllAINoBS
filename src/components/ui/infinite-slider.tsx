"use client";

import { useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "framer-motion";

interface InfiniteSliderProps {
  children: React.ReactNode;
  duration?: number;
  gap?: number;
  className?: string;
}

export function InfiniteSlider({
  children,
  duration = 40,
  gap = 48,
  className,
}: InfiniteSliderProps) {
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const speed = hovered ? duration * 3 : duration;

  useAnimationFrame((_, delta) => {
    const innerWidth = innerRef.current?.scrollWidth ?? 0;
    const halfWidth = innerWidth / 2;
    if (halfWidth === 0) return;

    const pxPerMs = halfWidth / (speed * 1000);
    let next = x.get() - pxPerMs * delta;
    if (Math.abs(next) >= halfWidth) {
      next = next + halfWidth;
    }
    x.set(next);
  });

  const translateX = useTransform(x, (v) => `${v}px`);

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ overflow: "hidden" }}
    >
      <motion.div
        ref={innerRef}
        style={{ x: translateX, display: "flex", gap }}
        className="w-max"
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
