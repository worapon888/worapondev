"use client";

import React, { useLayoutEffect } from "react";
import gsap from "gsap";

type Ref<T> = React.RefObject<T | null>;

type HeroRefs = {
  rootRef: Ref<HTMLElement>;
  headingRef: Ref<HTMLHeadingElement>;
  paragraphRef: Ref<HTMLParagraphElement>;
  btn1Ref: Ref<HTMLAnchorElement>;
  btn2Ref: Ref<HTMLAnchorElement>;
  availabilityRef: Ref<HTMLParagraphElement>;
  lineRef: Ref<HTMLDivElement>;

  // ✅ Brand HUD (logo box) + timer line
  brandHudRef?: Ref<HTMLDivElement>;
  timerRef?: Ref<HTMLParagraphElement>;

  // ✅ System panels
  systemLogRef?: Ref<HTMLDivElement>;
  systemStatusRef?: Ref<HTMLDivElement>;

  // ✅ optional bg
  gridRef?: Ref<HTMLDivElement>;
  dotsRef?: Ref<HTMLDivElement>;
};

type CSSWithWebkitMask = CSSStyleDeclaration & {
  WebkitMaskImage?: string;
  WebkitMaskSize?: string;
  WebkitMaskRepeat?: string;
};

export function useHeroAnimations(refs: HeroRefs) {
  const {
    rootRef,
    headingRef,
    paragraphRef,
    btn1Ref,
    btn2Ref,
    gridRef,
    dotsRef,
    availabilityRef,
    lineRef,
    systemLogRef,
    systemStatusRef,
    brandHudRef,
    timerRef,
  } = refs;

  useLayoutEffect(() => {
    // ใช้ gsap.context เพื่อจัดการ cleanup ได้ง่าย
    const ctx = gsap.context(() => {
      const root = rootRef.current;
      const heading = headingRef.current;

      const grid = gridRef?.current ?? null;
      const dots = dotsRef?.current ?? null;

      const hud = brandHudRef?.current ?? null;
      const timerEl = timerRef?.current ?? null;

      const log = systemLogRef?.current ?? null;
      const status = systemStatusRef?.current ?? null;

      if (!root || !heading) return;

      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // ---------- DOM helpers ----------
      const getHeroChars = () =>
        Array.from(root.querySelectorAll(".hero-char")) as HTMLElement[];

      const getRealEls = (chars: HTMLElement[]) =>
        chars
          .map((el) => el.querySelector(".hero-real"))
          .filter(Boolean) as HTMLElement[];

      const getGhostEls = (chars: HTMLElement[]) =>
        chars
          .map((el) => el.querySelector(".hero-ghost"))
          .filter(Boolean) as HTMLElement[];

      // ---------- Brand HUD Timer ----------
      const updateHudTime = () => {
        if (!timerEl) return;

        const options: Intl.DateTimeFormatOptions = {
          timeZone: "America/Toronto",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        };

        const time = new Date().toLocaleTimeString("en-US", options);
        const hour = parseInt(time.split(":")[0] || "0", 10);

        const sector = Math.floor(hour / 4) + 1;
        const sectorFormatted = String(sector).padStart(2, "0");

        timerEl.textContent = `ZONE ${sectorFormatted} — ${time}`;

        if (!prefersReduced) {
          gsap.fromTo(
            timerEl,
            { opacity: 0.25 },
            { opacity: 0.55, duration: 0.25, ease: "power1.out" },
          );
        }
      };

      updateHudTime();
      const timerId = window.setInterval(updateHudTime, 1000);

      // ---------- flicker system ----------
      let flickerCalls: gsap.core.Tween[] = [];
      let flickerBursts: (gsap.core.Tween | gsap.core.Timeline)[] = [];

      const killFlicker = () => {
        flickerCalls.forEach((c) => c.kill());
        flickerBursts.forEach((t) => t.kill());
        flickerCalls = [];
        flickerBursts = [];
      };

      const markPurpleChars = () => {
        const chars = getHeroChars();
        chars.forEach((ch) => {
          if (ch.closest(".neon-purple")) ch.classList.add("hero-char--purple");
        });
      };

      const startFlicker = (chars: HTMLElement[]) => {
        if (prefersReduced || chars.length === 0) return;

        const rand = gsap.utils.random;

        const flickerOne = (node: HTMLElement) => {
          const run = () => {
            const dips = Math.floor(rand(2, 6));
            const tl = gsap.timeline();
            const isPurple = node.classList.contains("hero-char--purple");

            const glowOn = isPurple
              ? "brightness(1.18) drop-shadow(0 0 10px rgba(167,139,250,0.55))"
              : "brightness(1.18) drop-shadow(0 0 10px rgba(34,211,238,0.55))";

            const glowStrong = isPurple
              ? "brightness(1.28) drop-shadow(0 0 14px rgba(167,139,250,0.7))"
              : "brightness(1.28) drop-shadow(0 0 14px rgba(34,211,238,0.7))";

            for (let i = 0; i < dips; i++) {
              tl.to(node, {
                opacity: rand(0.08, 0.45),
                filter: "brightness(0.78)",
                duration: rand(0.04, 0.09),
                ease: "none",
              }).to(node, {
                opacity: 1,
                filter: glowOn,
                duration: rand(0.05, 0.11),
                ease: "none",
              });
            }

            tl.to(node, {
              opacity: 1,
              filter: glowStrong,
              duration: rand(0.1, 0.18),
              ease: "power1.out",
            });

            flickerBursts.push(tl);
            flickerCalls.push(gsap.delayedCall(rand(2.4, 6.5), run));
          };

          flickerCalls.push(gsap.delayedCall(rand(0.8, 3.0), run));
        };

        chars.forEach(flickerOne);
      };

      // ---------- intro timeline ----------
      const buildIntroTl = () => {
        killFlicker();
        const chars = getHeroChars();
        const realEls = getRealEls(chars);
        const ghostEls = getGhostEls(chars);

        if (hud) gsap.killTweensOf(hud);
        if (log) gsap.killTweensOf(log);
        if (status) gsap.killTweensOf(status);

        const bootFlicker = (el: HTMLElement, finalOpacity = 1) => {
          const t = gsap.timeline({ defaults: { ease: "none" } });
          t.set(el, { autoAlpha: 0, y: 10 })
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

        const startPulse = (el: HTMLElement, min = 0.7, max = 1) => {
          gsap.killTweensOf(el);
          gsap.fromTo(
            el,
            { opacity: max },
            {
              opacity: min,
              duration: 2.0,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            },
          );
        };

        // INITIAL SETTINGS
        gsap.set(heading, { autoAlpha: 1 });
        gsap.set(chars, { yPercent: -103 });
        gsap.set(realEls, { autoAlpha: 0 });
        gsap.set(ghostEls, { autoAlpha: 1 });

        if (paragraphRef.current)
          gsap.set(paragraphRef.current, { autoAlpha: 0, y: 26 });
        if (btn1Ref.current)
          gsap.set(btn1Ref.current, { autoAlpha: 0, y: 18, scale: 0.96 });
        if (btn2Ref.current)
          gsap.set(btn2Ref.current, { autoAlpha: 0, y: 18, scale: 0.96 });
        if (availabilityRef.current)
          gsap.set(availabilityRef.current, { autoAlpha: 0, y: 12 });
        if (lineRef.current) {
          gsap.set(lineRef.current, {
            autoAlpha: 0,
            scaleX: 0.2,
            y: -6,
            transformOrigin: "50% 50%",
          });
        }

        if (hud) gsap.set(hud, { autoAlpha: 0, y: 10 });
        if (log) gsap.set(log, { autoAlpha: 0, y: 12 });
        if (status) gsap.set(status, { autoAlpha: 0, y: 12 });

        root.classList.remove("hero--preload");

        const tl = gsap.timeline({ paused: true });

        tl.to(chars, {
          duration: 1,
          yPercent: 0,
          stagger: 0.05,
          ease: "expo.inOut",
        });

        const exitChars = chars.filter((el) => {
          const ch = el.dataset.char;
          return ch !== "." && el.dataset.skip !== "1" && ch !== " ";
        });

        tl.to(exitChars, {
          duration: 1,
          yPercent: 103,
          stagger: 0.1,
          ease: "expo.inOut",
        });

        if (lineRef.current) {
          tl.set(lineRef.current, { autoAlpha: 1 }).fromTo(
            lineRef.current,
            { scaleX: 0 },
            { scaleX: 1, y: 0, duration: 0.95, ease: "power3.out" },
            ">-0.05",
          );
        }

        tl.add(() => {
          markPurpleChars();
          startFlicker(chars);
        }, ">");

        if (paragraphRef.current) {
          tl.to(
            paragraphRef.current,
            { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" },
            ">",
          );
        }

        if (!prefersReduced) {
          if (hud) {
            tl.add(bootFlicker(hud, 1), ">-0.05");
            tl.add(() => startPulse(hud, 0.7, 1), ">");
          }
          if (log) {
            tl.add(bootFlicker(log, 1), ">-0.35");
            tl.add(() => startPulse(log, 0.78, 1), ">");
          }
          if (status) {
            tl.add(bootFlicker(status, 1), ">-0.45");
            tl.add(() => startPulse(status, 0.72, 1), ">");
          }
        } else {
          if (hud) tl.set(hud, { autoAlpha: 1, y: 0 });
          if (log) tl.set(log, { autoAlpha: 1, y: 0 });
          if (status) tl.set(status, { autoAlpha: 1, y: 0 });
        }

        if (btn1Ref.current) {
          tl.to(
            btn1Ref.current,
            {
              y: 0,
              autoAlpha: 1,
              scale: 1,
              duration: 0.55,
              ease: "back.out(1.7)",
            },
            ">",
          );
        }
        if (btn2Ref.current) {
          tl.to(
            btn2Ref.current,
            {
              y: 0,
              autoAlpha: 1,
              scale: 1,
              duration: 0.55,
              ease: "back.out(1.7)",
            },
            ">-0.45",
          );
        }
        if (availabilityRef.current) {
          tl.fromTo(
            availabilityRef.current,
            { y: -14, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" },
            ">+0.45",
          );
        }

        return tl;
      };

      let introTl = buildIntroTl();

      const st = gsap.to(
        {},
        {
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            end: "bottom top",
            onEnter: () => {
              introTl = buildIntroTl();
              introTl.restart();
            },
          },
        },
      );

      gsap.to(getHeroChars(), {
        backgroundPosition: "200% 50%",
        duration: 6,
        repeat: -1,
        ease: "linear",
      });

      if (grid) {
        gsap.to(grid, {
          backgroundPosition: "200% 200%",
          duration: 30,
          repeat: -1,
          ease: "none",
        });
      }

      if (dots) {
        dots.style.backgroundImage = `
          repeating-radial-gradient(circle, rgba(34,211,238,0.9) 0 1.2px, rgba(34,211,238,0) 1.35px 26px),
          repeating-radial-gradient(circle, rgba(167,139,250,0.65) 0 1.05px, rgba(167,139,250,0) 1.2px 34px)
        `;
        dots.style.backgroundSize = "80px 80px, 96px 96px";
        dots.style.mixBlendMode = "screen";
        dots.style.opacity = "0.55";
        dots.style.filter = "drop-shadow(0 0 12px rgba(34,211,238,0.75))";

        const ds = dots.style as unknown as CSSWithWebkitMask;
        ds.WebkitMaskImage =
          "linear-gradient(90deg, #000 0 1px, transparent 1px 100%), linear-gradient(0deg, #000 0 1px, transparent 1px 100%)";
        ds.WebkitMaskSize = "3rem 3rem";

        gsap.to(dots, {
          backgroundPosition: "240px 0px, 0px 320px",
          duration: 4.8,
          repeat: -1,
          ease: "none",
        });

        gsap.to(dots, {
          opacity: 0.65,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      return () => {
        st.kill();
        killFlicker();
        window.clearInterval(timerId);
      };
    }, rootRef);

    return () => ctx.revert();

    // ✅ ใส่ refs ทั้งหมดเข้า dependency array เพื่อให้ ESLint พอใจ
    // แต่ค่า refs เหล่านี้จะไม่เปลี่ยนบ่อยเพราะเป็น ref object
    // และการใช้ gsap.context ด้านบนช่วยป้องกันการรันซ้ำที่ซ้อนกันได้
  }, [
    rootRef,
    headingRef,
    paragraphRef,
    btn1Ref,
    btn2Ref,
    gridRef,
    dotsRef,
    availabilityRef,
    lineRef,
    systemLogRef,
    systemStatusRef,
    brandHudRef,
    timerRef,
  ]);
}
