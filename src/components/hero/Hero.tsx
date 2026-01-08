"use client";

import React, { useRef, useMemo } from "react";
import { useHeroAnimations } from "./useHeroAnimations";
import { buildHeroChars } from "./hero.utils";
import "./hero.css";

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const btn1Ref = useRef<HTMLAnchorElement>(null);
  const btn2Ref = useRef<HTMLAnchorElement>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const availabilityRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const headingPattern = useMemo(
    () => ["A", "R", "E", "Y", "T", " ", "!", "Q"],
    []
  );

  useHeroAnimations({
    rootRef,
    headingRef,
    paragraphRef,
    btn1Ref,
    btn2Ref,
    gridRef,
    dotsRef,
    availabilityRef,
    lineRef,
  });

  return (
    <section
      ref={rootRef}
      className="relative hero hero--preload min-h-screen overflow-hidden bg-black text-white flex items-center"
    >
      {/* 🔷 Grid Background */}
      <div
        ref={gridRef}
        className="absolute inset-0 z-0
          bg-[linear-gradient(90deg,#00f2ff22_1px,transparent_1px),linear-gradient(0deg,#00f2ff22_1px,transparent_1px)]
          bg-[size:3rem_3rem] bg-[position:0_0]"
      />

      {/* ✨ Neon Dots Flow */}
      <div ref={dotsRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* ✅ Vignette overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.65)_70%,rgba(0,0,0,0.95)_100%)]" />

      {/* ✨ Spinning Glow */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
        <div
          className="absolute -inset-1 animate-spin-slow rounded-full
          bg-[conic-gradient(from_0deg_at_50%_50%,#00f2ff11,#00f2ff33,#00f2ff11)]
          blur-3xl opacity-20"
        />
      </div>

      {/* 🔺 Content */}
      <div className="relative z-10 w-full text-center px-6 translate-y-[-1vh]">
        <h1
          ref={headingRef}
          className="
            hero-heading font-mono uppercase
            text-[clamp(2.6rem,6.6vw,5.8rem)]
            sm:text-[clamp(3.2rem,7.2vw,6.8rem)]
            lg:text-[clamp(4.2rem,8.2vw,8.2rem)]
            tracking-[0.05em] sm:tracking-[0.1em] lg:tracking-[0.12em]
            neon-text
          "
          style={{ fontFamily: "var(--font-beon)" }}
        >
          <span className="hero-line">
            {buildHeroChars("Crafting ", headingPattern, 8)}
            <span className="neon-purple">
              {buildHeroChars("Immersive", headingPattern, 8)}
            </span>
          </span>

          <span className="hero-line">
            <span className="neon-purple">
              {buildHeroChars("Web", headingPattern, 0)}
            </span>
            {buildHeroChars(" Experiences", headingPattern, 0)}
          </span>
        </h1>

        <div ref={lineRef} className="mt-5 mx-auto neon-line purple" />

        <p
          ref={paragraphRef}
          className="
            mt-7 text-[16.5px] leading-7
            text-cyan-100/65 max-w-xl mx-auto
            tracking-[0.04em]
          "
        >
          Frontend Developer specializing in high-end interactions and cinematic
          interfaces. Merging technical precision with creative vision.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            ref={btn1Ref}
            href="#contact"
            className="
              relative inline-flex items-center justify-center
              px-7 py-3.5 text-sm font-medium uppercase tracking-[0.18em]
              text-cyan-100 rounded-md
              border border-cyan-300/40 bg-black/40 backdrop-blur
              transition-all duration-300
              hover:scale-[1.06] hover:text-white
              focus-visible:outline-none
              neon-btn
            "
          >
            Work with me
          </a>

          <a
            ref={btn2Ref}
            href="#services"
            className="
              relative text-sm uppercase tracking-[0.22em]
              text-white/70 transition-all duration-300
              hover:text-cyan-200 group
            "
          >
            View Projects
            <span
              aria-hidden="true"
              className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
            <span
              className="
                absolute -bottom-1 left-0
                h-[1px] w-0
                bg-gradient-to-r from-transparent via-cyan-300 to-transparent
                transition-all duration-300
                group-hover:w-full
              "
            />
          </a>
        </div>

        <p
          ref={availabilityRef}
          className="mt-5 text-[11px] tracking-[0.28em] uppercase text-white/45"
        >
          Available for select projects
        </p>
      </div>
    </section>
  );
}
