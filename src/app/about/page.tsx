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

import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

  const [prefersReduced, setPrefersReduced] = useState(false);

  // ===== refs สำหรับ scroll motion =====
  const titleRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const panelClipRef = useRef<HTMLDivElement | null>(null);
  const panelBgRef = useRef<HTMLDivElement | null>(null);
  const panelNavRef = useRef<HTMLDivElement | null>(null);
  const signatureRef = useRef<HTMLParagraphElement | null>(null);
  const proofRef = useRef<HTMLParagraphElement | null>(null);
  const bioRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    setHeroActive(true);

    const mq: MediaQueryList = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    setPrefersReduced(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }

    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  const heroTyped = useTypewriterLoop(heroActive && !prefersReduced, heroText, {
    typeSpeed: 46,
    endHoldMs: 1200,
    repeatDelayMs: 2600,
    glitchChance: 0,
  });

  const bio = useMemo(
    () =>
      `I design and build immersive web experiences where motion, interaction, and clarity work together.
My focus is not just how things look, but how people feel while navigating a digital space.
Every animation and transition is intentional — not decoration.
I work independently, blending design thinking, frontend engineering, and experimental visuals to create interfaces that feel alive, precise, and human.`,
    [],
  );

  // ===== subtle scroll motion =====
  useLayoutEffect(() => {
    if (prefersReduced) return;

    const titleEl = titleRef.current;
    const sectionEl = sectionRef.current;
    const clipEl = panelClipRef.current;
    const bgEl = panelBgRef.current;
    const navEl = panelNavRef.current;
    const sigEl = signatureRef.current;
    const proofEl = proofRef.current;
    const bioEl = bioRef.current;

    if (!sectionEl || !clipEl || !bgEl) return;

    const ctx = gsap.context(() => {
      // 1) Title: ขยับลงนิด + fade (subtle)
      if (titleEl) {
        gsap.fromTo(
          titleEl,
          { y: -10, opacity: 1 },
          {
            y: 15,
            opacity: 0.92,
            ease: "none",
            scrollTrigger: {
              trigger: sectionEl,
              start: "top 85%",
              end: "top 20%",
            },
          },
        );
      }

      // 2) Panel: parallax เบา ๆ + เงา/ไฮไลท์นิด
      gsap.fromTo(
        clipEl,
        { y: 0 },
        {
          y: 10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionEl,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.7,
          },
        },
      );

      gsap.fromTo(
        bgEl,
        { opacity: 0.95 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionEl,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.5,
          },
        },
      );

      // 3) Content: เข้าแบบเนียน ๆ
      if (bioEl) {
        gsap.fromTo(
          bioEl,
          { y: 10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionEl,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // 4) HUD top: float นิด ๆ
      if (navEl) {
        gsap.fromTo(
          navEl,
          { y: -6, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionEl,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // 5) HUD bottom left/right: slide เบามาก ๆ
      if (sigEl) {
        gsap.fromTo(
          sigEl,
          { x: -10, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionEl,
              start: "top 65%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      if (proofEl) {
        gsap.fromTo(
          proofEl,
          { x: 10, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionEl,
              start: "top 65%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, sectionEl);

    return () => ctx.revert();
  }, [prefersReduced]);

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
      <div className="title-about" ref={titleRef}>
        <h3>
          {/* 1. ข้อความ "ผี" จองพื้นที่ 2 บรรทัดไว้ (มองไม่เห็น) */}
          <span
            style={{
              visibility: "hidden",
              display: "block",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            {heroText}
          </span>

          {/* 2. ข้อความที่กำลังพิมพ์ (Absolute Overlay) */}
          <span
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              width: "100%",
            }}
          >
            {prefersReduced ? heroText : heroTyped}
            <span className="typing-cursor" aria-hidden="true">
              |
            </span>
          </span>
        </h3>
      </div>

      {/* ABOUT BIO PANEL */}
      <section className="hero about-hero about-hero--bio" ref={sectionRef}>
        {/* GLASS PANEL (background only) */}
        <div className="about-hero-clip" aria-hidden="true" ref={panelClipRef}>
          <div className="about-hero-bg" ref={panelBgRef} />
        </div>

        <div className="hero-container">
          <div className="hero-content">
            {/* PANEL HUD (inside the box - top) */}
            <div className="about-panel-nav" ref={panelNavRef}>
              <div className="about-logo">
                <p>Floder_1</p>
              </div>
              <div className="service-name">
                <p>Biology</p>
              </div>
            </div>

            {/* PANEL HUD (inside the box - bottom) */}
            <p
              className="about-signature about-signature--left"
              ref={signatureRef}
            >
              Designing interfaces where motion serves meaning.
            </p>
            <p className="about-proof about-proof--right" ref={proofRef}>
              Independent · Clarity · Rhythm · Restraint
            </p>

            {/* CENTER CONTENT */}
            <div className="container">
              <div className="hero-content-footer">
                <div className="callout">
                  <p className="about-bio" ref={bioRef}>
                    {bio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
