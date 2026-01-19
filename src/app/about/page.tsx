"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ParticlesCursorBG from "@/components/ParticlesCursorBG";
import "./about.css";

type TypewriterOpts = {
  typeSpeed?: number;
  endHoldMs?: number;
  repeatDelayMs?: number;
  glitchChance?: number;
  glitchChars?: string;
};

function useTypewriterLoop(
  enabled: boolean,
  text: string,
  opts: TypewriterOpts,
) {
  const {
    typeSpeed = 40,
    endHoldMs = 1400,
    repeatDelayMs = 2500,
    glitchChance = 0.1,
    glitchChars = "01<>/\\[]{}—_+*#@!?",
  } = opts;

  const [out, setOut] = useState(text);
  const runningRef = useRef(false);
  const rafRef = useRef<number>(0);
  const t1Ref = useRef<number>(0);
  const t2Ref = useRef<number>(0);

  const randChar = () =>
    glitchChars[Math.floor(Math.random() * glitchChars.length)];

  const clearTimers = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;

    if (t1Ref.current) window.clearTimeout(t1Ref.current);
    if (t2Ref.current) window.clearTimeout(t2Ref.current);
    t1Ref.current = 0;
    t2Ref.current = 0;
  };

  const stop = () => {
    runningRef.current = false;
    clearTimers();
  };

  const runOnce = () =>
    new Promise<void>((resolve) => {
      stop();
      runningRef.current = true;

      const final = text ?? "";
      const len = final.length;

      let i = 0;
      let last = 0;

      setOut("");

      const tick = (now: number) => {
        if (!runningRef.current) return;

        if (now - last < typeSpeed) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        last = now;

        i = Math.min(len, i + 1);
        const next = i < len && Math.random() < glitchChance ? randChar() : "";
        setOut(final.slice(0, i) + next);

        if (i < len) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setOut(final);
          t1Ref.current = window.setTimeout(() => resolve(), endHoldMs);
          runningRef.current = false;
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    });

  const loop = async () => {
    if (!enabled) return;

    while (enabled && !runningRef.current) {
      await runOnce();

      await new Promise<void>((r) => {
        t2Ref.current = window.setTimeout(() => r(), repeatDelayMs);
      });

      if (!enabled) break;
    }
  };

  useLayoutEffect(() => {
    if (!enabled) return;

    stop();
    loop();

    return () => {
      stop();
      setOut(text);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enabled,
    text,
    typeSpeed,
    endHoldMs,
    repeatDelayMs,
    glitchChance,
    glitchChars,
  ]);

  return out;
}

export default function AboutPage() {
  const heroText = "Worapon Jintajirakul";
  const [heroActive, setHeroActive] = useState(false);

  // ✅ กัน SSR/hydration: ค่อยอ่าน prefersReduced ใน useEffect
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    setHeroActive(true);

    // ✅ ให้ mq เป็น MediaQueryList ชัดๆ
    const mq: MediaQueryList = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    // set ค่าเริ่มต้น
    setPrefersReduced(mq.matches);

    // ✅ handler แบบถูก type (ใช้ได้ทั้ง addEventListener / addListener)
    const onChange = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
    };

    // ✅ modern browsers
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }

    // ✅ Safari / old
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  const heroTyped = useTypewriterLoop(heroActive && !prefersReduced, heroText, {
    typeSpeed: 46,
    endHoldMs: 1200,
    repeatDelayMs: 2600,
    glitchChance: 0,
  });

  // (optional) คุมข้อความกลางกล่องไว้ในตัวแปร อ่านง่าย
  const bio = useMemo(
    () =>
      `I design and build immersive web experiences where motion, interaction, and clarity work together. 
My focus is not just how things look, but how people feel while navigating a digital space. 
Every animation and transition is intentional — not decoration. 
I work independently, blending design thinking, frontend engineering, and experimental visuals to create interfaces that feel alive, precise, and human.`,
    [],
  );

  return (
    <>
      {/* TOP HUD (global) */}
      <div className="about-nav">
        <div className="about-logo">
          <p>Zone / About-us</p>
        </div>
        <div className="service-name">
          <p>Motion landing</p>
        </div>
      </div>

      <ParticlesCursorBG />

      {/* BIG TITLE */}
      <div className="title-about">
        <h3 data-typing={heroActive ? "1" : "0"}>
          {prefersReduced ? heroText : heroTyped}
          <span className="typing-cursor" aria-hidden="true">
            |
          </span>
        </h3>
      </div>

      {/* ABOUT BIO PANEL */}
      <section className="hero about-hero about-hero--bio">
        {/* GLASS PANEL (background only) */}
        <div className="about-hero-clip" aria-hidden="true">
          <div className="about-hero-bg" />
        </div>

        <div className="hero-container">
          <div className="hero-content">
            {/* PANEL HUD (inside the box - top) */}
            <div className="about-panel-nav">
              <div className="about-logo">
                <p>Floder_1</p>
              </div>
              <div className="service-name">
                <p>Biology</p>
              </div>
            </div>

            {/* PANEL HUD (inside the box - bottom) */}
            <p className="about-signature about-signature--left">
              Designing interfaces where motion serves meaning.
            </p>
            <p className="about-proof about-proof--right">
              Independent · Clarity · Rhythm · Restraint
            </p>

            {/* CENTER CONTENT */}
            <div className="container">
              <div className="hero-content-footer">
                <div className="callout">
                  <p className="about-bio">{bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
