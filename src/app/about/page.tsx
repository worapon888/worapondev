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

  const titleRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const panelClipRef = useRef<HTMLDivElement | null>(null);
  const panelBgRef = useRef<HTMLDivElement | null>(null);
  const panelNavRef = useRef<HTMLDivElement | null>(null);
  const signatureRef = useRef<HTMLParagraphElement | null>(null);
  const proofRef = useRef<HTMLParagraphElement | null>(null);
  const bioRef = useRef<HTMLParagraphElement | null>(null);
  const stackRef = useRef<HTMLDivElement | null>(null);
  const availabilityRef = useRef<HTMLParagraphElement | null>(null);

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
      `I am a full-stack engineer focused on building production-ready web systems that balance strong user experience with real engineering depth.
My work spans both frontend and backend — from interface design and interaction quality to architecture, performance, reliability, and application logic.
I care deeply about how systems behave in real-world conditions, not just how they look in isolation.
Every decision is intentional: clear structure, practical problem solving, and interfaces that feel polished, useful, and built to last.`,
    [],
  );

  const techStack = useMemo(
    () => [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "NestJS",
      "PostgreSQL",
      "Redis",
      "Docker",
    ],
    [],
  );

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
    const stackEl = stackRef.current;
    const availableEl = availabilityRef.current;

    if (!sectionEl || !clipEl || !bgEl) return;

    const ctx = gsap.context(() => {
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

      if (bioEl) {
        gsap.fromTo(
          bioEl,
          { y: 10, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionEl,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      if (stackEl) {
        gsap.fromTo(
          stackEl,
          { y: 12, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
              trigger: stackEl,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      if (availableEl) {
        gsap.fromTo(
          availableEl,
          { y: 8, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: availableEl,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

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
      <div className="about-nav">
        <div className="about-logo">
          <p>Zone / About</p>
        </div>
        <div className="service-name">
          <p>Full-Stack Systems</p>
        </div>
      </div>

      <ParticlesCursorBG />

      <div className="title-about" ref={titleRef}>
        <h3>
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

      <section className="hero about-hero about-hero--bio" ref={sectionRef}>
        <div className="about-hero-clip" aria-hidden="true" ref={panelClipRef}>
          <div className="about-hero-bg" ref={panelBgRef} />
        </div>

        <div className="hero-container">
          <div className="hero-content">
            <div className="about-panel-nav" ref={panelNavRef}>
              <div className="about-logo">
                <p>Folder_01</p>
              </div>
              <div className="service-name">
                <p>Profile</p>
              </div>
            </div>

            <p
              className="about-signature about-signature--left"
              ref={signatureRef}
            >
              Building systems where engineering serves clarity.
            </p>

            <p className="about-proof about-proof--right" ref={proofRef}>
              Full-Stack · Reliability · UX · Problem Solving
            </p>

            <div className="container">
              <div className="hero-content-footer">
                <div className="callout">
                  <p className="about-bio" ref={bioRef}>
                    {bio}
                  </p>

                  <div className="about-tech-stack" ref={stackRef}>
                    <p className="about-tech-title">Tech Stack</p>
                    <div className="about-tech-grid">
                      {techStack.map((item) => (
                        <span key={item} className="about-tech-item">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="about-availability" ref={availabilityRef}>
                    Currently available for freelance and contract projects.
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
