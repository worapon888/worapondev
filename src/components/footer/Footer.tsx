"use client";

import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
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
  opts: TypewriterOpts,
) {
  const {
    typeSpeed = 40,
    endHoldMs = 1400,
    repeatDelayMs = 2500,
    glitchChance = 0.1,
    glitchChars = "01<>/\\[]{}—_+*#@!?",
  } = opts;

  const [out, setOut] = useState(text); // กัน flash
  const rafRef = useRef<number | null>(null);
  const tRef = useRef<number | null>(null);

  const enabledRef = useRef(enabled);
  const textRef = useRef(text);

  enabledRef.current = enabled;
  textRef.current = text;

  const clearAll = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;

    if (tRef.current) window.clearTimeout(tRef.current);
    tRef.current = null;
  };

  const randChar = () =>
    glitchChars[Math.floor(Math.random() * glitchChars.length)];

  useLayoutEffect(() => {
    // ถ้าไม่ enable: คืนค่าเป็น text จริงเสมอ
    if (!enabled) {
      clearAll();
      setOut(text);
      return;
    }

    let cancelled = false;

    const typeOnce = () =>
      new Promise<void>((resolve) => {
        clearAll();

        const final = textRef.current ?? "";
        const len = final.length;

        let i = 0;
        let last = 0;

        setOut(""); // เริ่มว่าง

        const tick = (now: number) => {
          if (cancelled || !enabledRef.current) return;

          if (now - last < typeSpeed) {
            rafRef.current = requestAnimationFrame(tick);
            return;
          }
          last = now;

          i = Math.min(len, i + 1);

          const next =
            i < len && Math.random() < glitchChance ? randChar() : "";
          setOut(final.slice(0, i) + next);

          if (i < len) {
            rafRef.current = requestAnimationFrame(tick);
          } else {
            setOut(final); // จบ: เซ็ตของจริงชัวร์
            tRef.current = window.setTimeout(() => resolve(), endHoldMs);
          }
        };

        rafRef.current = requestAnimationFrame(tick);
      });

    const loop = async () => {
      // loop แบบนุ่ม ๆ
      while (!cancelled && enabledRef.current) {
        await typeOnce();
        if (cancelled || !enabledRef.current) break;

        await new Promise<void>((r) => {
          tRef.current = window.setTimeout(() => r(), repeatDelayMs);
        });
      }
    };

    loop();

    return () => {
      cancelled = true;
      clearAll();
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

  const originalText = "Send a signal if you want to connect";
  const [isActive, setIsActive] = useState(false);

  const prefersReduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
    );
  }, []);

  const typedText = useTypewriterLoop(
    isActive && !prefersReduced,
    originalText,
    {
      typeSpeed: 42,
      endHoldMs: 1600,
      repeatDelayMs: 3200,
      glitchChance: 0.08,
      glitchChars: "01<>/\\[]{}—_+*#@!?",
    },
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
              {/* ✅ ใช้ data-typing ให้ CSS คุมสีได้จริง */}
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

          <div className="footer-content-meta footer-bottom">
            <div className="footer-content-col footer-meta">
              <p>[ Constructed by Worapon.dev ]</p>
              <p>[ Template Release / Jan 2026 ]</p>
            </div>

            <div className="footer-content-col footer-brand-wrap">
              <div className="footer-brand">
                <Image
                  src="/Logo_worapon.webp"
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
