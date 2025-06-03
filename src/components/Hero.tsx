"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

// Beam type สำหรับเก็บข้อมูลตำแหน่งและสี
type Beam = { left: string; top: string; color: string };

// ฟังก์ชันสร้าง beam แบบปลอดภัย (client-only)
function generateBeams(count: number, direction: "v" | "h"): Beam[] {
  return Array.from({ length: count }).map(() => ({
    left: direction === "v" ? `${Math.random() * 100}%` : "-30px",
    top: direction === "h" ? `${Math.random() * 100}%` : "-30px",
    color: `hsla(${Math.floor(Math.random() * 360)}, 100%, 70%, 0.5)`,
  }));
}

export default function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const btn1Ref = useRef<HTMLAnchorElement>(null);
  const btn2Ref = useRef<HTMLAnchorElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [vBeams, setVBeams] = useState<Beam[]>([]);
  const [hBeams, setHBeams] = useState<Beam[]>([]);

  // สร้าง beam หลัง mount
  useEffect(() => {
    setVBeams(generateBeams(40, "v"));
    setHBeams(generateBeams(25, "h"));
  }, []);

  // Animate content และ background grid
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { duration: 1, ease: "power2.out" } });

    tl.fromTo(headingRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1 })
      .fromTo(
        paragraphRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1 },
        "-=0.8"
      )
      .fromTo(
        btn1Ref.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1 },
        "-=0.7"
      )
      .fromTo(
        btn2Ref.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1 },
        "-=0.8"
      );

    gsap.to(headingRef.current, {
      backgroundPosition: "200% center",
      duration: 6,
      repeat: -1,
      ease: "linear",
    });

    gsap.to(gridRef.current, {
      backgroundPosition: "200% 200%",
      duration: 30,
      repeat: -1,
      ease: "none",
    });
    tl.fromTo(
      btn1Ref.current,
      { y: 20, opacity: 0, scale: 0.95, skewY: 3 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        skewY: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
      },
      "-=0.6"
    );

    tl.fromTo(
      btn2Ref.current,
      { y: 20, opacity: 0, scale: 0.95, skewY: 3 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        skewY: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
      },
      "-=0.5"
    );
  }, []);

  // Animate beams เมื่อถูกสร้างแล้ว
  useEffect(() => {
    if (vBeams.length === 0 || hBeams.length === 0) return;

    gsap.utils.toArray<HTMLElement>(".beam-v").forEach((el, i) => {
      gsap.fromTo(
        el,
        { top: "-20px" },
        {
          top: "100%",
          duration: 3 + Math.random() * 2,
          repeat: -1,
          delay: i * 0.5,
          ease: "none",
        }
      );
    });

    gsap.utils.toArray<HTMLElement>(".beam-h").forEach((el, i) => {
      gsap.fromTo(
        el,
        { left: "-20px" },
        {
          left: "100%",
          duration: 2.5 + Math.random() * 2,
          repeat: -1,
          delay: i * 0.4,
          ease: "none",
        }
      );
    });
  }, [vBeams, hBeams]);

  return (
    <section className="relative py-20 sm:py-32 overflow-hidden bg-black text-white">
      {/* 🔷 Grid Background */}
      <div
        ref={gridRef}
        className="absolute inset-0 z-0 
        bg-[linear-gradient(90deg,#00f2ff22_1px,transparent_1px),linear-gradient(0deg,#00f2ff22_1px,transparent_1px)] 
        bg-[size:3rem_3rem] bg-left 
        [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      />

      {/* 🔦 Beams on Grid */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {vBeams.map((beam, i) => (
          <div
            key={`v-${i}`}
            className="beam-v absolute w-[2px] h-[20px] blur-[0.5px] rounded-sm"
            style={{
              left: beam.left,
              top: beam.top,
              backgroundColor: beam.color,
            }}
          />
        ))}
        {hBeams.map((beam, i) => (
          <div
            key={`h-${i}`}
            className="beam-h absolute h-[2px] w-[20px] blur-[0.5px] rounded-sm"
            style={{
              top: beam.top,
              left: beam.left,
              backgroundColor: beam.color,
            }}
          />
        ))}
      </div>

      {/* ✨ Spinning Glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -inset-1 animate-spin-slow rounded-full 
        bg-[conic-gradient(from_0deg_at_50%_50%,#00f2ff11,#00f2ff33,#00f2ff11)] 
        blur-3xl opacity-20"
        />
      </div>

      {/* 🔺 Content */}
      <div className="relative z-20 text-center">
        <h1
          ref={headingRef}
          className="text-4xl font-bold tracking-tight sm:text-6xl text-transparent bg-clip-text leading-[1.2] pb-1
  bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 
  bg-[length:200%_200%] bg-left
  drop-shadow-[0_0_15px_rgba(165,243,252,0.5)]"
          style={{ WebkitBackgroundClip: "text" }}
        >
          Build Something Amazing
        </h1>

        <p
          ref={paragraphRef}
          className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto"
        >
          Create stunning web applications with our modern tech stack. Fast,
          reliable, and beautiful – just like you imagined.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            ref={btn1Ref}
            href="#contact"
            className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-black shadow-md hover:shadow-[0_0_15px_rgba(255, 255, 255, 0.767)] transition-all duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Get Started
          </a>

          <a
            ref={btn2Ref}
            href="#services"
            className="text-sm font-semibold leading-6 text-white relative group"
          >
            Learn more{" "}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1 inline-block"
            >
              →
            </span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>
      </div>
    </section>
  );
}
