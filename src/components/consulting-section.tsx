"use client";

import { MessageSquare, Clock, Target } from "lucide-react";
import { motion } from "framer-motion";

const pillars = [
  {
    icon: Clock,
    title: "45 Minutes",
    description: "Focused, no-filler session on your specific challenge.",
  },
  {
    icon: Target,
    title: "Your Agenda",
    description: "You set the topic. Architecture, tools, strategy, whatever.",
  },
  {
    icon: MessageSquare,
    title: "Actionable Output",
    description: "You leave with a concrete plan, not vague advice.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function ConsultingSection() {
  return (
    <section id="consulting" className="bg-black py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="font-mono text-sm tracking-widest text-emerald-400 uppercase">
            1-on-1 Consulting
          </span>
          <h2 className="mt-4 text-3xl font-bold text-white md:text-5xl">
            45 minutes. Your problem. Let&apos;s solve it.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
            Bring whatever you&apos;re stuck on. Architecture decisions, workflow
            design, agent coordination, integration strategy, team adoption. We
            dig in, get specific, and you leave with a clear path forward.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {pillars.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-emerald-400/20 hover:bg-white/[0.05]"
              variants={cardVariants}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <Icon className="mx-auto h-8 w-8 text-emerald-400" />
              <h3 className="mt-4 font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-white/50">{description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.a
          href="#contact"
          className="mt-12 inline-block rounded-full bg-emerald-500 px-8 py-4 text-lg font-semibold text-black transition-colors hover:bg-emerald-400"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Book a Session
        </motion.a>
      </div>
    </section>
  );
}
