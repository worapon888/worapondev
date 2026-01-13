"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import "./Footer.css";
import Image from "next/image";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type TypewriterOpts = {
  typeSpeed?: number; // ms ต่อ 1 ตัว
  endHoldMs?: number; // ค้างหลังพิมพ์จบก่อนวนรอบ
  repeatDelayMs?: number; // เว้นก่อนเริ่มรอบใหม่
  glitchChance?: number; // 0..1
  glitchChars?: string;
};

function useTypewriterLoop(
  enabled: boolean,
  text: string,
  opts: TypewriterOpts
) {
  const {
    typeSpeed = 40,
    endHoldMs = 1400,
    repeatDelayMs = 2500,
    glitchChance = 0.1,
    glitchChars = "01<>/\\[]{}—_+*#@!?",
  } = opts;

  const [out, setOut] = useState(text); // default = ของจริง (กัน flash)
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

      // เริ่มจากว่าง
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
          // จบ: เซ็ตของจริงชัวร์
          setOut(final);

          // ค้างหลังพิมพ์จบ
          t1Ref.current = window.setTimeout(() => {
            resolve();
          }, endHoldMs);

          runningRef.current = false;
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    });

  const loop = async () => {
    if (!enabled) return;

    // loop แบบนุ่ม ๆ
    while (enabled && !runningRef.current) {
      await runOnce();

      // เว้นก่อนเริ่มรอบใหม่
      await new Promise<void>((r) => {
        t2Ref.current = window.setTimeout(() => r(), repeatDelayMs);
      });

      // กันหลุด enabled ระหว่างรอ
      if (!enabled) break;
    }
  };

  useLayoutEffect(() => {
    if (!enabled) return;

    // start loop
    stop();
    loop();

    return () => {
      stop();
      // กลับเป็น text จริงกันค้าง
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

export default function FooterSection() {
  const rootRef = useRef<HTMLElement | null>(null);

  // ✅ ใช้ state render text แทนการ set textContent
  const originalText = "Send a signal if you want to connect";

  const [isActive, setIsActive] = useState(false);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const typedText = useTypewriterLoop(
    isActive && !prefersReduced,
    originalText,
    {
      typeSpeed: 42, // ✅ ช้าลง/เร็วขึ้นได้
      endHoldMs: 1600, // ✅ ค้างตอนพิมพ์จบให้นานขึ้น
      repeatDelayMs: 3200, // ✅ เว้นก่อนวนรอบให้นานขึ้น
      glitchChance: 0.08, // ✅ ลด/เพิ่มความมั่ว (0 = ไม่มั่ว)
      glitchChars: "01<>/\\[]{}—_+*#@!?",
    }
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (prefersReduced) return;

      ScrollTrigger.create({
        trigger: root,
        start: "top 85%",
        once: true,
        onEnter: () => {
          setIsActive(true);

          // กันกรณีเพิ่งหลุดจาก preloader/lenis
          requestAnimationFrame(() => ScrollTrigger.refresh());
          setTimeout(() => ScrollTrigger.refresh(), 150);
        },
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <footer ref={rootRef}>
      <div className="footer-container">
        <div className="footer-bg-container" />

        <div className="footer-content">
          <div className="footer-content-meta">
            <div className="footer-content-col">
              <h3 data-typing={isActive ? "1" : "0"}>
                {prefersReduced ? originalText : typedText}
                <span className="typing-cursor" aria-hidden="true">
                  |
                </span>
              </h3>

              <div className="footer-form">
                <input type="text" placeholder="Unit Address" />
                <div className="btn">
                  <a href="/contact" className="btn">
                    <span className="btn-line" />
                    Transmit Message
                  </a>
                </div>
              </div>
            </div>

            <div className="footer-content-col">
              <p className="bodyCopy">
                Worapon.dev is a personal creative lab devoted to crafting
                immersive web experiences. Every interaction is intentionally
                built, merging technical precision with high-end aesthetics.
              </p>

              <div className="footer-socials">
                {[
                  { label: "[ Instagram ]", href: "/contact" },
                  { label: "[ YouTube Signals ]", href: "/contact" },
                  { label: "[ Twitter ]", href: "/contact" },
                  { label: "[ LinkedIn ]", href: "/contact" },
                  { label: "[ GitHub Repository ]", href: "/contact" },
                  { label: "[ Discord Hub ]", href: "/contact" },
                  { label: "[ Dribbble ]", href: "/contact" },
                  { label: "[ Behance Archive ]", href: "/contact" },
                  { label: "[ Homebase ]", href: "/contact" },
                ].map((item) => (
                  <div className="footer-social" key={item.label}>
                    <a href={item.href}>{item.label}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-content-meta">
            <div className="footer-content-col">
              <p>[ Constructed by Worapon.dev ]</p>
              <p>[ Template Release / Jan 2026 ]</p>
            </div>

            <div className="footer-content-col footer-brand-wrap">
              <div className="footer-brand">
                <Image
                  src="/Logo_worapon.png"
                  alt="worapon.dev"
                  width={500}
                  height={500}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
