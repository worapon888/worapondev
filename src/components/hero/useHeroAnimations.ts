"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";

type Ref<T> = React.RefObject<T | null>;

type HeroRefs = {
  rootRef: Ref<HTMLElement>;
  headingRef: Ref<HTMLHeadingElement>;
  paragraphRef: Ref<HTMLParagraphElement>;
  btn1Ref: Ref<HTMLAnchorElement>;
  btn2Ref: Ref<HTMLAnchorElement>;
  gridRef: Ref<HTMLDivElement>;
  dotsRef: Ref<HTMLDivElement>;
  availabilityRef: Ref<HTMLParagraphElement>;
  lineRef: Ref<HTMLDivElement>;
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
  } = refs;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const root = rootRef.current;
      const heading = headingRef.current;
      const grid = gridRef.current;
      const dots = dotsRef.current;

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

        // ===== INITIAL =====
        gsap.set(heading, { autoAlpha: 1 });
        gsap.set(chars, { yPercent: -103 });
        gsap.set(realEls, { autoAlpha: 0 });
        gsap.set(ghostEls, { autoAlpha: 1 });

        // ✅ initial for content (กัน flash + กันค้าง)
        gsap.set(paragraphRef.current, { autoAlpha: 0, y: 26 });
        gsap.set(btn1Ref.current, { autoAlpha: 0, y: 18, scale: 0.96 });
        gsap.set(btn2Ref.current, { autoAlpha: 0, y: 18, scale: 0.96 });
        gsap.set(availabilityRef.current, { autoAlpha: 0, y: 12 });
        gsap.set(lineRef.current, {
          autoAlpha: 0,
          scaleX: 0.2,
          y: -6,
          transformOrigin: "50% 50%",
        });

        // ✅ ปลด preload หลังจาก initial ถูก set ครบแล้ว
        root.classList.remove("hero--preload");

        const tl = gsap.timeline({ paused: true });

        // 1) H1 enter
        tl.to(chars, {
          duration: 1,
          yPercent: 0,
          stagger: 0.05,
          ease: "expo.inOut",
        });

        // 2) H1 exit
        const exitChars = chars.filter((el) => {
          const ch = el.dataset.char;
          const isDot = ch === ".";
          const isSpace = el.dataset.skip === "1" || ch === " ";
          return !isDot && !isSpace;
        });

        tl.to(exitChars, {
          duration: 1,
          yPercent: 103,
          stagger: 0.1,
          ease: "expo.inOut",
        });

        tl.set(lineRef.current, { autoAlpha: 1 }) // โผล่ทันที
          .fromTo(
            lineRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              y: 0,
              duration: 0.95,
              ease: "power3.out",
            },
            ">-0.05"
          );

        // 3) flicker
        tl.add(() => {
          markPurpleChars();
          startFlicker(chars);
        }, ">");

        // 4) paragraph
        tl.to(
          paragraphRef.current,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            ease: "power3.out",
          },
          ">"
        );

        // 5) btn1
        tl.to(
          btn1Ref.current,
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.55,
            ease: "back.out(1.7)",
          },
          ">" // เริ่มหลัง paragraph จบ
        );

        // 6) btn2 (ตามหลัง btn1 แต่ overlap นิดเดียว)
        tl.to(
          btn2Ref.current,
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.55,
            ease: "back.out(1.7)",
          },
          ">-0.45"
        );

        // 7) availability (ตามหลัง btn2)
        tl.fromTo(
          availabilityRef.current,
          {
            y: -14,
            autoAlpha: 0,
          },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.45,
            ease: "power3.out",
          },
          ">+0.45"
        );

        return tl;
      };

      let introTl = buildIntroTl();

      // ScrollTrigger (ต้องแน่ใจว่า register แล้วในโปรเจกต์)
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
            onEnterBack: () => {
              introTl = buildIntroTl();
              introTl.restart();
            },
          },
        }
      );

      // gradient loop
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
          repeating-radial-gradient(
            circle,
            rgba(34,211,238,0.9) 0 1.2px,
            rgba(34,211,238,0) 1.35px 26px
          ),
          repeating-radial-gradient(
            circle,
            rgba(167,139,250,0.65) 0 1.05px,
            rgba(167,139,250,0) 1.2px 34px
          )
        `;
        dots.style.backgroundSize = "80px 80px, 96px 96px";
        dots.style.backgroundPosition = "0px 0px, 0px 0px";
        dots.style.mixBlendMode = "screen";
        dots.style.opacity = "0.55";
        dots.style.filter = "drop-shadow(0 0 12px rgba(34,211,238,0.75))";

        const ds = dots.style as unknown as CSSWithWebkitMask;
        ds.WebkitMaskImage = `
          linear-gradient(90deg, #000 0 1px, transparent 1px 100%),
          linear-gradient(0deg,  #000 0 1px, transparent 1px 100%)
        `;
        ds.WebkitMaskSize = "3rem 3rem";
        ds.WebkitMaskRepeat = "repeat";

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
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);
}
