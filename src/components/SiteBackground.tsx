"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

type CSSWithWebkitMask = CSSStyleDeclaration & {
  WebkitMaskImage?: string;
  WebkitMaskSize?: string;
  WebkitMaskRepeat?: string;
};

export default function SiteBackground() {
  const gridRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    const dots = dotsRef.current;

    // grid loop
    if (grid) {
      gsap.to(grid, {
        backgroundPosition: "200% 200%",
        duration: 30,
        repeat: -1,
        ease: "none",
      });
    }

    // dots setup + loop
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
      gsap.killTweensOf(grid);
      gsap.killTweensOf(dots);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {/* 🔷 Grid Background */}
      <div
        ref={gridRef}
        className="absolute inset-0
          bg-[linear-gradient(90deg,#00f2ff22_1px,transparent_1px),linear-gradient(0deg,#00f2ff22_1px,transparent_1px)]
          bg-[size:3rem_3rem] bg-[position:0_0]"
      />

      {/* ✨ Neon Dots Flow */}
      <div ref={dotsRef} className="absolute inset-0" />

      {/* ✅ Vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.65)_70%,rgba(0,0,0,0.95)_100%)]" />

      {/* ✨ Spinning Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -inset-1 animate-spin-slow rounded-full
          bg-[conic-gradient(from_0deg_at_50%_50%,#00f2ff11,#00f2ff33,#00f2ff11)]
          blur-3xl opacity-20"
        />
      </div>
    </div>
  );
}
