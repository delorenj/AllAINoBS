"use client";

interface ProgressiveBlurProps {
  side: "left" | "right";
  width?: number;
  className?: string;
}

export function ProgressiveBlur({
  side,
  width = 80,
  className,
}: ProgressiveBlurProps) {
  const gradientDirection = side === "left" ? "to right" : "to left";

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        [side]: 0,
        width,
        zIndex: 10,
        pointerEvents: "none",
        background: `linear-gradient(${gradientDirection}, var(--blur-from-color, #000) 0%, transparent 100%)`,
      }}
    />
  );
}
