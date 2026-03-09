"use client";

import { motion } from "framer-motion";
import { ClientMarquee } from "./client-marquee";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const, delay },
  }),
};

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center bg-black pt-20">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Pulsing emerald gradient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]"
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
        <motion.p
          className="mb-4 font-mono text-sm tracking-widest text-emerald-400 uppercase"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          All AI, No BS
        </motion.p>

        <motion.h1
          className="text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.15}
        >
          Stop guessing how to use AI.
          <br />
          <span className="text-white/50">Start shipping with it.</span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg text-white/60 md:text-xl"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
        >
          Practical workshops, live webinars, and hands-on consulting that help
          teams and businesses integrate AI workflows that actually work. No
          hype. No theory. Just results.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.45}
        >
          <a
            href="#webinar"
            className="rounded-full bg-emerald-500 px-8 py-4 text-lg font-semibold text-black transition-colors hover:bg-emerald-400"
          >
            Join the Free Webinar
          </a>
          <a
            href="#workshops"
            className="rounded-full border border-white/20 px-8 py-4 text-lg font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
          >
            See Workshops
          </a>
        </motion.div>
      </div>

      <ClientMarquee />
    </section>
  );
}
