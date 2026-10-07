"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Respect the OS setting. GSAP has no equivalent of the CSS media query. */
function reduced() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Scrubbing text reveal. Words start dim and light up in sequence as the block
 * passes through the viewport.
 */
export function ScrubText({
  text,
  className = "",
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  as?: "p" | "h2" | "h3";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduced()) {
        gsap.set(".reveal-word", { opacity: 1 });
        return;
      }
      gsap.to(".reveal-word", {
        opacity: 1,
        stagger: 0.06,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 82%",
          end: "bottom 55%",
          scrub: true,
        },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref}>
      <Tag className={className}>
        {text.split(" ").map((w, i) => (
          <span key={`${w}-${i}`} className="reveal-word">
            {w}{" "}
          </span>
        ))}
      </Tag>
    </div>
  );
}

/**
 * Media scales up on entry and dims on exit, so a long page of cards reads as
 * depth rather than as a flat list.
 */
export function ScaleFade({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      gsap.fromTo(
        ref.current,
        { scale: 0.86, opacity: 0.25 },
        {
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            end: "top 45%",
            scrub: true,
          },
        }
      );
      gsap.to(ref.current, {
        opacity: 0.22,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "bottom 32%",
          end: "bottom 2%",
          scrub: true,
        },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Simple entrance used for headings and rows. */
export function Rise({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from(ref.current, {
        y: 44,
        opacity: 0,
        duration: 0.9,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 88%" },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Pinned split: the heading holds while the column beside it scrolls. Disabled
 * below the lg breakpoint, where there is no room for two columns.
 */
export function PinnedSplit({
  aside,
  children,
}: {
  aside: React.ReactNode;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        ScrollTrigger.create({
          trigger: ref.current,
          start: "top 18%",
          end: "bottom 85%",
          pin: asideRef.current,
          pinSpacing: false,
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
      <div ref={asideRef} className="lg:col-span-4">
        {aside}
      </div>
      <div className="lg:col-span-8">{children}</div>
    </div>
  );
}

export type Segment = { t: string; c?: string };

/** Heading whose letters rise in a wave on load. */
export function WaveTitle({ lines, className = "" }: { lines: Segment[][]; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from(".wave-letter", {
        yPercent: 110,
        rotate: 8,
        opacity: 0,
        duration: 0.9,
        ease: "back.out(1.8)",
        stagger: 0.035,
        delay: 0.15,
      });
    },
    { scope: ref }
  );

  const label = lines.map((l) => l.map((s) => s.t).join("")).join(" ");

  return (
    <h1 ref={ref} className={className} aria-label={label}>
      {lines.map((line, i) => (
        <span key={i} aria-hidden className="block">
          {line.map((seg, j) => (
            <span key={j} className={seg.c}>
              {seg.t.split(/(\s+)/).map((word, w) =>
                /^\s+$/.test(word) ? (
                  word
                ) : (
                  <span key={w} className="inline-block whitespace-nowrap">
                    {[...word].map((ch, k) => (
                      <span key={k} className="wave-letter inline-block">
                        {ch}
                      </span>
                    ))}
                  </span>
                )
              )}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

/** Children flip up into place in sequence. */
export function FlipIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduced()) return;
      gsap.from(el.children, {
        rotationX: -70,
        transformPerspective: 900,
        transformOrigin: "50% 0%",
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 82%" },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
