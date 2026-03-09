"use client";

import { Play, Lock } from "lucide-react";
import { motion } from "framer-motion";

const videos = [
  {
    title: "Building Your First AI Agent",
    duration: "42 min",
    free: true,
  },
  {
    title: "RAG Pipelines That Actually Work",
    duration: "55 min",
    free: false,
  },
  {
    title: "AI Workflow Patterns for Teams",
    duration: "38 min",
    free: false,
  },
  {
    title: "From Prompt to Production",
    duration: "1h 10min",
    free: true,
  },
  {
    title: "Multi-Agent Coordination",
    duration: "48 min",
    free: false,
  },
  {
    title: "Automation That Scales",
    duration: "35 min",
    free: false,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
};

export function ContentSection() {
  return (
    <section id="content" className="bg-zinc-950 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="font-mono text-sm tracking-widest text-emerald-400 uppercase">
            Video Content
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-5xl">
            Deep dives you can revisit.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
            Recorded workshops, tutorials, and walkthroughs. Some free, some
            premium. All practical.
          </p>
        </motion.div>

        <motion.div
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {videos.map((video) => (
            <motion.div
              key={video.title}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-colors hover:border-emerald-400/30"
              variants={cardVariants}
              whileHover={{ scale: 1.025, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              {/* Placeholder thumbnail */}
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-emerald-500/10 to-transparent relative overflow-hidden">
                {/* Play button with shimmer */}
                <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-transform group-hover:scale-110">
                  {video.free ? (
                    <>
                      {/* Shimmer ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            "conic-gradient(from 0deg, transparent 0%, rgba(52,211,153,0.6) 20%, transparent 40%)",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <div className="absolute inset-[2px] rounded-full bg-zinc-950/80" />
                      <Play className="relative h-5 w-5 text-emerald-400" />
                    </>
                  ) : (
                    <Lock className="h-5 w-5 text-white/40" />
                  )}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2">
                  {video.free ? (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                      Free
                    </span>
                  ) : (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white/50">
                      Premium
                    </span>
                  )}
                  <span className="text-xs text-white/30">
                    {video.duration}
                  </span>
                </div>
                <h3 className="mt-2 font-semibold text-white">{video.title}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
