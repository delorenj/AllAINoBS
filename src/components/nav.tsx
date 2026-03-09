"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#webinar", label: "Free Webinar" },
  { href: "#workshops", label: "Workshops" },
  { href: "#consulting", label: "1-on-1" },
  { href: "#content", label: "Content" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="font-mono text-lg font-bold tracking-tight text-white">
          allainobs<span className="text-emerald-400">.</span>com
        </a>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#webinar"
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-emerald-400"
          >
            Join Free Webinar
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="text-white md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-black/95 px-6 py-4 md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-white/60 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#webinar"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-full bg-emerald-500 px-5 py-3 text-center text-sm font-semibold text-black"
          >
            Join Free Webinar
          </a>
        </div>
      )}
    </nav>
  );
}
