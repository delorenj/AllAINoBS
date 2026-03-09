"use client";

import { InfiniteSlider } from "./ui/infinite-slider";
import { ProgressiveBlur } from "./ui/progressive-blur";

const clients = [
  "ClassPass",
  "Warby Parker",
  "RepRally",
  "Curi",
  "Kinetik",
  "Splash",
  "BAE Systems",
  "SoBe Life Water",
  "Chase Bank",
  "Wrigley's",
  "Justworks",
];

export function ClientMarquee() {
  return (
    <div
      className="relative overflow-hidden py-8 border-y border-white/10"
      style={{ "--blur-from-color": "#000" } as React.CSSProperties}
    >
      <ProgressiveBlur side="left" width={100} />
      <ProgressiveBlur side="right" width={100} />

      <InfiniteSlider duration={35} gap={64} className="py-1">
        {clients.map((client) => (
          <span
            key={client}
            className="text-lg font-medium text-white/40 transition-colors hover:text-white/80 md:text-xl whitespace-nowrap cursor-default select-none"
          >
            {client}
          </span>
        ))}
      </InfiniteSlider>
    </div>
  );
}
