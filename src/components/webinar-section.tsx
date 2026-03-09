import { Radio, Users, Calendar } from "lucide-react";

export function WebinarSection() {
  return (
    <section id="webinar" className="bg-black py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Info */}
          <div>
            <span className="font-mono text-sm tracking-widest text-emerald-400 uppercase">
              Free Bi-Weekly Webinar
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-5xl">
              See what&apos;s actually possible with AI.
            </h2>
            <p className="mt-6 text-lg text-white/60">
              Every other week, I go live and demo real AI workflows, agent
              systems, and automation patterns you can use immediately. No
              slides. No sales pitch. Just live builds that will change how you
              think about your work.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-white/70">
                <Calendar className="h-5 w-5 text-emerald-400" />
                <span>Every other Thursday, 12pm ET</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Radio className="h-5 w-5 text-emerald-400" />
                <span>Live on Cloudflare Stream</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Users className="h-5 w-5 text-emerald-400" />
                <span>Q&A + live troubleshooting</span>
              </div>
            </div>
          </div>

          {/* Right: Signup card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white">
              Get notified for the next session
            </h3>
            <p className="mt-2 text-white/50">
              Drop your email. No spam, just a reminder before each webinar.
            </p>
            <form className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="you@company.com"
                className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
              <button
                type="submit"
                className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-black transition-colors hover:bg-emerald-400"
              >
                Notify Me
              </button>
            </form>
            <p className="mt-4 text-xs text-white/30">
              Free forever. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
