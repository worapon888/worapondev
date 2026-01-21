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
  const timerRef = useRef<HTMLParagraphElement>(null);

  const headingPattern = useMemo(
    () => ["A", "R", "E", "Y", "T", " ", "!", "Q"],
    [],
  );

  // ✅ GSAP animations
  useHeroAnimations({
    rootRef,
    headingRef,
    paragraphRef,
    btn1Ref,
    btn2Ref,
    availabilityRef,
    lineRef,
    brandHudRef,
    timerRef, // ✅ ส่งให้ hook ใช้ “เฉพาะ ref” ไม่ทำ timer loop ซ้ำ
    systemLogRef,
    systemStatusRef,
  });

  // ✅ Timer: เหลือที่เดียว (ลดงานซ้ำ / ลด TBT)
  useEffect(() => {
    const el = timerRef.current;
    if (!el) return;

    // Intl formatter สร้างครั้งเดียว (เบากว่า toLocaleTimeString ซ้ำ ๆ)
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Toronto",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    let raf = 0;
    let lastSec = -1;

    const tick = () => {
      const parts = fmt.formatToParts(new Date());
      const hh = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
      const mm = parts.find((p) => p.type === "minute")?.value ?? "00";
      const ss = parts.find((p) => p.type === "second")?.value ?? "00";
      const sec = Number(ss);

      // อัปเดตเฉพาะเมื่อ “วินาทีเปลี่ยนจริง”
      if (sec !== lastSec) {
        lastSec = sec;
        const sector = Math.floor(hh / 4) + 1;
        el.textContent = `ZONE ${String(sector).padStart(2, "0")}  —  ${String(hh).padStart(2, "0")}:${mm}:${ss}`;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative hero hero--preload h-[100vh] overflow-hidden flex items-center"
    >
      {/* 🧩 Brand HUD */}
      <div
        ref={brandHudRef}
        className="brand-hud absolute top-6 left-6 md:top-12 md:left-20 lg:top-25 lg:left-45 px-4 py-3 font-mono uppercase text-[11px] md:text-[13px] tracking-[0.25em] md:tracking-[0.32em] text-cyan-300/60 pointer-events-none select-none border border-cyan-300/20 rounded-sm bg-black/40 backdrop-blur-md md:backdrop-blur-sm shadow-[0_0_20px_rgba(34,211,238,0.08)] min-w-[160px] md:min-w-[200px]"
      >
        <span className="font-bold text-cyan-200/80">WORAPON.DEV</span>
        <p className="mt-1 text-[8px] md:text-[9px] tracking-[0.2em] md:tracking-[0.28em] text-cyan-100/40">
          IMMERSIVE WEB SYSTEMS
        </p>
        <p
          ref={timerRef}
          className="mt-2 text-[8px] md:text-[9px] tracking-[0.28em] text-cyan-200/35 border-t border-cyan-300/10 pt-2"
        />
      </div>

      {/* 🔺 Main Content */}
      <div className="relative z-10 w-full text-center px-6 translate-y-[-1vh]">
        <h1
          ref={headingRef}
          className="hero-heading font-mono uppercase text-[clamp(2.6rem,6.6vw,5.8rem)] sm:text-[clamp(3.2rem,7.2vw,6.8rem)] lg:text-[clamp(4.2rem,8.2vw,8.2rem)] tracking-[0.05em] sm:tracking-[0.1em] lg:tracking-[0.12em] neon-text leading-[1.1] sm:leading-tight"
          style={{ fontFamily: "var(--font-beon)" }}
        >
          <span className="hero-line block mb-2 sm:mb-0">
            {buildHeroChars("Crafting ", headingPattern, 8)}
            <span className="neon-purple">
              {buildHeroChars("Immersive", headingPattern, 8)}
            </span>
          </span>

          <span className="hero-line block">
            <span className="neon-purple">
              {buildHeroChars("Web", headingPattern, 0)}
            </span>
            {buildHeroChars(" Experiences", headingPattern, 0)}
          </span>
        </h1>

        <div ref={lineRef} className="mt-5 mx-auto neon-line" />

        <p
          ref={paragraphRef}
          className="mt-7 mx-auto max-w-xl text-[clamp(14px,4vw,16.5px)] leading-[1.6] md:leading-7 text-cyan-100/65 tracking-[0.04em] px-6 md:px-0"
        >
          Frontend Developer specializing in high-end interactions and cinematic
          interfaces. Merging technical precision with creative vision.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-y-8 sm:gap-x-10">
          <a
            ref={btn1Ref}
            href="#contact"
            className="neon-btn relative inline-flex items-center justify-center px-8 py-4 sm:px-7 sm:py-3.5 text-[13px] sm:text-sm font-medium uppercase tracking-[0.18em] text-cyan-100 rounded-md border border-cyan-300/40 bg-black/40 backdrop-blur transition-all duration-300 hover:scale-[1.06] hover:text-white w-full sm:w-auto max-w-[280px] sm:max-w-none"
          >
            Work with me
          </a>

          <a
            ref={btn2Ref}
            href="#services"
            className="relative text-[13px] sm:text-sm uppercase tracking-[0.22em] text-white/70 transition-all duration-300 hover:text-cyan-200 group py-2"
          >
            View Projects
            <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
            <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-gradient-to-r from-transparent via-cyan-300 to-transparent transition-all duration-300 group-hover:w-full" />
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
        className="system-log absolute bottom-10 left-6 md:bottom-20 md:left-20 lg:left-40 max-w-[240px] md:max-w-sm text-left font-mono text-[10px] md:text-[11px] leading-relaxed tracking-[0.18em] md:tracking-[0.22em] text-cyan-100/50 pointer-events-none hidden sm:block"
      >
        <div className="mb-2 md:mb-3 flex items-center gap-x-3 md:gap-x-4 text-cyan-300/60 uppercase">
          <span className="whitespace-nowrap">Zone / 01</span>
          <span className="opacity-60">—</span>
          <span className="whitespace-nowrap">ID: 00.239</span>
        </div>
        <p className="mb-1 md:mb-2 uppercase text-cyan-300/70 font-semibold">
          System Observation Log
        </p>
        <p className="line-clamp-3 md:line-clamp-none opacity-80">
          Interactive interfaces and motion systems are monitored, refined, and
          deployed to explore how humans perceive depth, time, and interaction
          within digital environments.
        </p>
      </div>

      {/* 📡 System Status */}
      <div
        ref={systemStatusRef}
        className="system-status absolute bottom-10 right-6 md:bottom-20 md:right-20 lg:right-40 font-mono text-[10px] md:text-[11px] leading-relaxed tracking-[0.18em] md:tracking-[0.22em] text-cyan-100/45 pointer-events-none text-right hidden sm:block"
      >
        <p className="mb-2 md:mb-3 uppercase text-cyan-300/60 font-semibold tracking-widest">
          System Status
        </p>
        <div className="space-y-1 opacity-80">
          <p className="flex items-center justify-end gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            SIGNAL: STABLE
          </p>
          <p>RENDER: IMMERSIVE</p>
          <p className="hidden lg:block">FRAME SYNC: ACTIVE</p>
        </div>
      </div>
    </section>
  );
}
