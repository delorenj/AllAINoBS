"use client";

import { Users, Clock, Video, Zap } from "lucide-react";
import { motion } from "framer-motion";

const cardBase = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
} as const;

interface WorkshopCardProps {
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

function AnimatedCard({ delay = 0, children, className }: WorkshopCardProps) {
  return (
    <motion.div
      className={className}
      variants={cardBase}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        delay,
        duration: 0.6,
        ease: "easeOut",
        type: "spring" as const,
        stiffness: 80,
        damping: 18,
      }}
      whileHover={{ y: -4, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }}
    >
      {children}
    </motion.div>
  );
}

export function WorkshopsSection() {
  return (
    <section id="workshops" className="bg-zinc-950 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="font-mono text-sm tracking-widest text-emerald-400 uppercase">
            Paid Workshops
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-5xl">
            Small cohort. Big transformation.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
            Intensive, hands-on workshops limited to 8 people. You won&apos;t
            just watch. You&apos;ll build AI workflows tailored to your actual
            work during the session.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {/* Workshop card */}
          <AnimatedCard
            delay={0}
            className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-colors hover:border-emerald-400/40 overflow-hidden"
          >
            {/* Gradient border glow on hover */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "radial-gradient(400px circle at 50% 50%, rgba(52,211,153,0.06), transparent 60%)",
                boxShadow: "inset 0 0 0 1px rgba(52,211,153,0.15)",
              }}
            />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Zap className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">
                AI Workflow Bootcamp
              </h3>
            </div>
            <p className="mt-4 text-white/60">
              Go from zero to deploying your first production AI workflow.
              Covers agent patterns, prompt architecture, RAG pipelines, and
              integration strategies your team can adopt on Monday.
            </p>
            <div className="mt-6 space-y-3 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Max 8 participants</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>4 sessions over 2 weeks</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span>Recorded sessions + lifetime access</span>
              </div>
            </div>
            <a
              href="#contact"
              className="mt-8 inline-block rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-emerald-400"
            >
              Join Waitlist
            </a>
          </AnimatedCard>

          {/* Custom workshop */}
          <AnimatedCard
            delay={0.15}
            className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-colors hover:border-emerald-400/40 overflow-hidden"
          >
            {/* Gradient border glow on hover */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                boxShadow: "inset 0 0 0 1px rgba(52,211,153,0.15)",
                background:
                  "radial-gradient(400px circle at 50% 50%, rgba(52,211,153,0.05), transparent 60%)",
              }}
            />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Users className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Custom Team Workshop
              </h3>
            </div>
            <p className="mt-4 text-white/60">
              Tailored specifically to your team&apos;s stack, domain, and
              goals. I audit your current workflows, identify the highest-impact
              AI integration points, and we build them together live.
            </p>
            <div className="mt-6 space-y-3 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Your team (up to 8)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Flexible scheduling</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span>Custom curriculum + recordings</span>
              </div>
            </div>
            <a
              href="#contact"
              className="mt-8 inline-block rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
            >
              Inquire
            </a>
          </AnimatedCard>
        </div>
      </div>
    </section>
  );
}
