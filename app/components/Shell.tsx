"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LINKS } from "../lib/data";

export const Tile = ({ text, tone }: { text: string; tone: "acid" | "paper" | "ink" }) => (
  <span
    className={`display flex h-full w-full items-center justify-center text-lg ${
      tone === "acid" ? "bg-acid text-black" : tone === "paper" ? "bg-paper text-black" : "bg-ink-sunken text-acid"
    }`}
  >
    {text}
  </span>
);

export function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = requestAnimationFrame(tick);
    const t = setInterval(tick, 20_000);
    return () => {
      cancelAnimationFrame(first);
      clearInterval(t);
    };
  }, []);
  if (!now) return null;
  return (
    <span className="flex flex-col items-end leading-tight text-paper">
      <span>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      <span className="text-faint">{now.toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "numeric" })}</span>
    </span>
  );
}

/** Static window chrome: a title bar over any content. */
export function Frame({
  title,
  active = false,
  className = "",
  children,
}: {
  title: string;
  active?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col border bg-ink-raised ${
        active ? "border-acid shadow-[8px_8px_0_0_var(--acid)]" : "border-[color:var(--line-strong)]"
      } ${className}`}
    >
      <div
        className={`flex h-9 shrink-0 items-center border-b border-[color:var(--line)] bg-ink-sunken px-3 font-mono text-[11px] uppercase tracking-[0.14em] ${
          active ? "text-acid" : "text-muted"
        }`}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

const TASK = "flex h-10 w-10 items-center justify-center transition-colors hover:bg-[rgba(244,241,234,0.08)]";

export function StudioTaskbar() {
  const pathname = usePathname();

  // Re-scrolls to the #hash once fonts load and ScrollTrigger has re-measured its pins.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    let frame = 0;
    document.fonts.ready.then(() => {
      frame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <nav
      aria-label="Taskbar"
      className="fixed inset-x-0 bottom-0 z-50 flex h-12 items-center justify-between border-t border-[color:var(--line)] bg-ink-sunken/90 px-2 backdrop-blur-xl"
    >
      <span className="hidden w-64 font-mono text-[10px] uppercase tracking-[0.14em] text-muted lg:block">
        Websites and clips, Sydney
      </span>
      <div className="flex items-center gap-1">
        <Link href="/" aria-label="Engineering desktop" className={TASK}>
          <span className="h-7 w-7">
            <Tile text="WZ" tone="acid" />
          </span>
        </Link>
        <a href="#packages" aria-label="Packages" className={TASK}>
          <span className="h-7 w-7">
            <Tile text="$" tone="ink" />
          </span>
        </a>
        <Link href="/shop" aria-label="Shop" className={TASK}>
          <span className="h-7 w-7">
            <Tile text="SH" tone="ink" />
          </span>
        </Link>
        <a href={`mailto:${LINKS.email}?subject=Website%20enquiry`} aria-label="Email" className={TASK}>
          <span className="h-7 w-7">
            <Tile text="@" tone="ink" />
          </span>
        </a>
      </div>
      <div className="flex items-center justify-end gap-4 pr-2 font-mono text-[11px] lg:w-64">
        <a href={LINKS.github} target="_blank" rel="noreferrer noopener" className="text-muted transition-colors hover:text-acid">
          GitHub
        </a>
        <Clock />
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[color:var(--line)] bg-ink-sunken px-6 pb-32 pt-24 md:pt-32">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="display max-w-5xl text-[clamp(2.5rem,9vw,7rem)] text-paper">
          Let&apos;s get you
          <br />
          <span className="text-acid">online</span>
        </h2>

        <div className="mt-14 flex flex-wrap gap-4">
          <a
            href={`mailto:${LINKS.email}?subject=Website%20enquiry`}
            className="border border-paper bg-paper px-7 py-4 font-mono text-xs uppercase tracking-[0.14em] text-black transition-transform hover:-translate-y-1"
          >
            {LINKS.email}
          </a>
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="border border-[color:var(--line-strong)] px-7 py-4 font-mono text-xs uppercase tracking-[0.14em] text-paper transition-colors hover:border-acid hover:text-acid"
          >
            LinkedIn
          </a>
        </div>

        <div className="rule mt-20 flex flex-wrap items-center justify-between gap-4 pt-8">
          <span className="font-mono text-[11px] text-faint">© {new Date().getFullYear()} Wasif Zaman, Sydney</span>
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-acid"
          >
            See the engineering work →
          </Link>
        </div>
      </div>
    </footer>
  );
}
