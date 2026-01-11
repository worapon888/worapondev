"use client";

import React, { useLayoutEffect } from "react";
import gsap from "gsap";

type Ref<T> = React.RefObject<T | null>;
type NavRefs = { navRef: Ref<HTMLElement> };

export function useNavIntro({ navRef }: NavRefs) {
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const bg = nav.querySelector(".nav-bg") as HTMLElement | null;
      const header = nav.querySelector(
        ".nav-mobile-header"
      ) as HTMLElement | null;
      const items = Array.from(
        nav.querySelectorAll(".nav-item")
      ) as HTMLElement[];

      // ✅ กัน pulse ซ้อนตอน HMR / rerender
      gsap.killTweensOf([nav, bg, header, items]);

      // กัน flash
      gsap.set(nav, { autoAlpha: 1 });

      if (prefersReduced) {
        nav.classList.remove("nav--preload");
        gsap.set([nav, bg, header, items], { clearProps: "all" });
        return;
      }

      // ---- helpers (เหมือน hero panels) ----
      const bootFlicker = (el: HTMLElement, finalOpacity = 1) => {
        const t = gsap.timeline({ defaults: { ease: "none" } });

        t.set(el, { autoAlpha: 0, y: -6 })
          .to(el, { autoAlpha: 0.18, duration: 0.05 })
          .to(el, { autoAlpha: 0.55, duration: 0.08 })
          .to(el, { autoAlpha: 0.12, duration: 0.05 })
          .to(el, { autoAlpha: 0.82, duration: 0.09 })
          .to(el, {
            autoAlpha: finalOpacity,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
          });

        return t;
      };

      const startPulse = (el: HTMLElement, min = 0.72, max = 1) => {
        gsap.fromTo(
          el,
          { opacity: max },
          {
            opacity: min,
            duration: 1.9,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          }
        );
      };

      // ---- initial state (คล้าย hero) ----
      gsap.set(nav, { y: -10, autoAlpha: 0 });
      if (bg)
        gsap.set(bg, {
          autoAlpha: 0,
          scaleX: 0.92,
          transformOrigin: "50% 50%",
        });
      if (header) gsap.set(header, { autoAlpha: 0, y: -6 });
      gsap.set(items, { autoAlpha: 0 });

      // ปลด preload หลัง set ครบ
      nav.classList.remove("nav--preload");

      // ---- timeline ----
      const tl = gsap.timeline({ paused: true });

      // nav panel เข้า
      tl.to(nav, { y: 0, autoAlpha: 1, duration: 0.55, ease: "expo.out" });

      // bg “boot flicker” แล้วค่อย scale เต็ม
      if (bg) {
        tl.add(bootFlicker(bg, 1), "<-0.25");
        tl.to(bg, { scaleX: 1, duration: 0.55, ease: "expo.out" }, "<-0.15");
        tl.add(() => startPulse(bg, 0.85, 1), ">"); // pulse เบามาก
      }

      // header boot flicker
      if (header) {
        tl.add(bootFlicker(header, 1), "<-0.25");
        tl.add(() => startPulse(header, 0.78, 1), ">");
      }

      // items stagger แบบ hero-ish
      if (items.length) {
        tl.to(
          items,
          {
            autoAlpha: 1,
            duration: 0.35,
            stagger: 0.03,
            ease: "power2.out",
          },
          "<-0.25"
        );
      }

      tl.play();
    }, nav);

    return () => ctx.revert();
  }, [navRef]);
}
