"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useHeroAnimations } from "./useHeroAnimations";
import { buildHeroChars } from "./hero.utils";
import "./hero.css";

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const btn1Ref = useRef<HTMLAnchorElement>(null);
  const btn2Ref = useRef<HTMLAnchorElement>(null);
  const brandHudRef = useRef<HTMLDivElement>(null);
  const systemLogRef = useRef<HTMLDivElement>(null);
  const systemStatusRef = useRef<HTMLDivElement>(null);

  const availabilityRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  // ✅ Timer element (inside Brand HUD)
  const timerRef = useRef<HTMLParagraphElement>(null);

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
    availabilityRef,
    lineRef,
    brandHudRef,
    timerRef,
    systemLogRef,
    systemStatusRef,
  });

  // ✅ Toronto time + Zone (updates every minute)
  useEffect(() => {
    const el = timerRef.current;
    if (!el) return;

    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "America/Toronto",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit", // ✅ เพิ่มวินาที
      };

      const torontoTime = new Date().toLocaleTimeString("en-US", options);
      const hour = parseInt(torontoTime.split(":")[0], 10);

      // 4-hour sectors (01–06)
      const sector = Math.floor(hour / 4) + 1;
      const sectorFormatted = String(sector).padStart(2, "0");

      el.textContent = `ZONE ${sectorFormatted}  —  ${torontoTime}`;
    };

    updateTime();
    const id = window.setInterval(updateTime, 1000); // ✅ ทุกวินาที
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative hero hero--preload h-[100vh] overflow-hidden flex items-center"
    >
      {/* 🧩 Brand HUD (Logo + Tagline + Timer) */}
      <div
        ref={brandHudRef}
        className="
    brand-hud
    absolute top-25 left-45
    px-4 py-3
    font-mono uppercase
    text-[13px]
    tracking-[0.32em]
    text-cyan-300/60
    pointer-events-none
    select-none

    border border-cyan-300/20
    rounded-sm
    bg-black/20 backdrop-blur-sm
    shadow-[0_0_20px_rgba(34,211,238,0.08)]
  "
      >
        WORAPON.DEV
        <p className="mt-1 text-[9px] tracking-[0.28em] text-cyan-100/40">
          IMMERSIVE WEB SYSTEMS
        </p>
        {/* Live time */}
        <p
          ref={timerRef}
          className="mt-2 text-[9px] tracking-[0.28em] text-cyan-200/35"
        />
      </div>

      {/* 🔺 Main Content */}
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

      {/* 🧭 System Observation Log */}
      <div
        ref={systemLogRef}
        className="
    system-log
    absolute bottom-20 left-40
    max-w-sm text-left
    font-mono
    text-[11px] leading-relaxed
    tracking-[0.22em]
    text-cyan-100/50
    pointer-events-none
  "
      >
        <div className="mb-3 flex items-center gap-x-4 text-cyan-300/60 uppercase">
          <span>Zone / 01</span>
          <span className="opacity-60">—</span>
          <span>Observation ID: 00.239</span>
        </div>

        <p className="mb-2 uppercase text-cyan-300/70">
          System Observation Log
        </p>

        <p>
          Interactive interfaces and motion systems are monitored, refined, and
          deployed to explore how humans perceive depth, time, and interaction
          within digital environments.
        </p>
      </div>

      {/* 📡 System Status */}
      <div
        ref={systemStatusRef}
        className="
    system-status
    absolute bottom-20 right-40
    font-mono
    text-[11px] leading-relaxed
    tracking-[0.22em]
    text-cyan-100/45
    pointer-events-none
    text-right
  "
      >
        <p className="mb-3 uppercase text-cyan-300/60">System Status</p>
        <p>SIGNAL: STABLE</p>
        <p>RENDER MODE: IMMERSIVE</p>
        <p>FRAME SYNC: ACTIVE</p>
      </div>
    </section>
  );
}
