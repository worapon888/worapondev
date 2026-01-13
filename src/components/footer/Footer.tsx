"use client";

import React, { useLayoutEffect, useRef } from "react";
import "./Footer.css";
import Image from "next/image";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// ✅ ต้องมี ScrambleTextPlugin (Club/Trial)
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

export default function FooterSection() {
  // ✅ <footer> = HTMLElement (ไม่มี HTMLFooterElement)
  const rootRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const title = titleRef.current;
    if (!root || !title) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const originalText = title.textContent ?? "";
    title.textContent = ""; // ให้ scramble “พิมพ์” ขึ้นมาเหมือนเดโม

    const ctx = gsap.context(() => {
      gsap.set(title, { opacity: 0 });

      if (prefersReduced) {
        title.textContent = originalText;
        gsap.set(title, { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
          once: true,
        },
      });

      tl.set(title, { opacity: 1 }).to(title, {
        duration: 1.8,
        repeat: -1,
        repeatDelay: 2,
        scrambleText: {
          text: originalText,
          oldClass: "scramble-old",
          newClass: "scramble-new",
          // ✅ อยากให้ตัวที่มั่ว “น้อยลง” แนะนำ "01" หรือ "01_"
          chars: "01<>/\\[]{}—_+*#@!?",
          revealDelay: 0.15,
          speed: 0.6,
        },
        ease: "none",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={rootRef}>
      <div className="footer-container">
        <div className="footer-bg-container" />

        <div className="footer-content">
          {/* ===== TOP META ===== */}
          <div className="footer-content-meta">
            <div className="footer-content-col">
              <h3 ref={titleRef}>Send a signal if you want to connect</h3>

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

          {/* ===== BOTTOM META ===== */}
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
