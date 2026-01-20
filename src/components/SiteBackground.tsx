"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function SiteBackground() {
  const scopeRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ใช้ gsap.context เพื่อความคลีนและเบาเครื่อง
    const ctx = gsap.context(() => {
      // 1. Grid Animation
      gsap.to(gridRef.current, {
        backgroundPosition: "200% 200%",
        duration: 30,
        repeat: -1,
        ease: "none",
      });

      // 2. Dots Animation
      if (dotsRef.current) {
        gsap.to(dotsRef.current, {
          backgroundPosition: "240px 0px, 0px 320px",
          duration: 4.8,
          repeat: -1,
          ease: "none",
        });

        gsap.to(dotsRef.current, {
          opacity: 0.65,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, scopeRef);

    return () => ctx.revert(); // ล้าง Animation ทั้งหมดทันทีที่ปิดหน้า
  }, []);

  // เก็บสไตล์เดิมไว้ทั้งหมดที่นี่เพื่อให้ JSX อ่านง่าย
  const dotsStyle: React.CSSProperties = {
    backgroundImage: `
      repeating-radial-gradient(circle, rgba(34,211,238,0.9) 0 1.2px, rgba(34,211,238,0) 1.35px 26px),
      repeating-radial-gradient(circle, rgba(167,139,250,0.65) 0 1.05px, rgba(167,139,250,0) 1.2px 34px)
    `,
    backgroundSize: "80px 80px, 96px 96px",
    backgroundPosition: "0px 0px, 0px 0px",
    mixBlendMode: "screen",
    filter: "drop-shadow(0 0 12px rgba(34,211,238,0.75))",
    WebkitMaskImage: `
      linear-gradient(90deg, #000 0 1px, transparent 1px 100%),
      linear-gradient(0deg, #000 0 1px, transparent 1px 100%)
    `,
    WebkitMaskSize: "3rem 3rem",
    WebkitMaskRepeat: "repeat",
    willChange: "background-position, opacity", // ช่วยให้เบาเครื่องขึ้น
  };

  return (
    <div
      ref={scopeRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* 🔷 Grid Background */}
      <div
        ref={gridRef}
        className="absolute inset-0 opacity-100 will-change-[background-position]
          bg-[linear-gradient(90deg,#00f2ff22_1px,transparent_1px),linear-gradient(0deg,#00f2ff22_1px,transparent_1px)]
          bg-[size:3rem_3rem]"
      />

      {/* ✨ Neon Dots Flow */}
      <div
        ref={dotsRef}
        style={dotsStyle}
        className="absolute inset-0 opacity-55"
      />

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
