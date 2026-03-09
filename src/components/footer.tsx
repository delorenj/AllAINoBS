export function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 bg-black py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Let&apos;s figure out your AI strategy.
            </h2>
            <p className="mt-4 text-white/50">
              Whether you&apos;re exploring, stuck, or ready to scale, reach out
              and we&apos;ll find the right path.
            </p>
            <a
              href="mailto:jarad@allainobs.com"
              className="mt-6 inline-block font-mono text-emerald-400 transition-colors hover:text-emerald-300"
            >
              jarad@allainobs.com
            </a>
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end md:text-right">
            <a
              href="#"
              className="font-mono text-lg font-bold text-white"
            >
              allainobs<span className="text-emerald-400">.</span>com
            </a>
            <div className="flex gap-6 text-sm text-white/40">
              <a href="#webinar" className="transition-colors hover:text-white">
                Webinar
              </a>
              <a
                href="#workshops"
                className="transition-colors hover:text-white"
              >
                Workshops
              </a>
              <a
                href="#consulting"
                className="transition-colors hover:text-white"
              >
                Consulting
              </a>
              <a href="#content" className="transition-colors hover:text-white">
                Content
              </a>
            </div>
            <p className="text-sm text-white/20">
              &copy; {new Date().getFullYear()} Jarad DeLorenzo. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
