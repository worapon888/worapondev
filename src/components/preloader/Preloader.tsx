"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./Preloader.module.css";

type PreloaderProps = {
  enabled?: boolean;
  durationMs?: number;
  label?: string;
  onDone?: () => void;
  blockSize?: number;
};

type Block = {
  id: number;
  left: number;
  top: number;
  w: number;
  h: number;
};

export default function Preloader({
  enabled = true,
  durationMs = 2800,
  label = "Stabilizing Feed",
  onDone,
  blockSize = 60,
}: PreloaderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const blockElsRef = useRef<HTMLSpanElement[]>([]);

  // ล้างค่า Array ทุกครั้งที่เรนเดอร์ใหม่เพื่อป้องกัน Element ซ้ำ
  blockElsRef.current = [];

  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  useEffect(() => {
    setIsMounted(true);
    const onResize = () => {
      setViewport({
        w: document.documentElement.clientWidth || window.innerWidth,
        h: document.documentElement.clientHeight || window.innerHeight,
      });
    };
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const blocks: Block[] = useMemo(() => {
    if (!isMounted || !viewport.w || !viewport.h) return [];

    const cols = Math.ceil(viewport.w / blockSize);
    const rows = Math.ceil(viewport.h / blockSize) + 1;
    const offsetX = (viewport.w - cols * blockSize) / 2;
    const offsetY = (viewport.h - rows * blockSize) / 2;

    const arr: Block[] = [];
    let id = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        arr.push({
          id: id++,
          left: c * blockSize + offsetX,
          top: r * blockSize + offsetY,
          w: blockSize,
          h: blockSize,
        });
      }
    }
    return arr;
  }, [viewport.w, viewport.h, blockSize, isMounted]);

  useEffect(() => {
    if (!enabled || !isMounted || blocks.length === 0) return;

    const wrapper = wrapperRef.current;
    const blockEls = blockElsRef.current;

    if (blockEls.length === 0) return;

    // --- 1. SETUP INITIAL STATE ---
    // ให้บล็อกทุกตัวทึบแสง (เป็นพื้นหลังดำ) และ UI พร้อมแสดง
    gsap.set(blockEls, { opacity: 1 });
    if (wrapper) gsap.set(wrapper, { opacity: 1 });

    const tl = gsap.timeline({
      // เรียก onDone เมื่อบล็อกสุดท้ายหายไปสนิทเท่านั้น
      onComplete: () => {
        if (onDone) onDone();
      },
    });

    // --- 2. THE ANIMATION SEQUENCE ---

    // STEP A: แสดง UI (วงกลม/ข้อความ) ค้างไว้ตามเวลาที่กำหนด (ลบเวลาจางออกนิดหน่อย)
    const holdTime = Math.max(0, durationMs - 800) / 1000;
    tl.to({}, { duration: holdTime });

    // STEP B: จาง UI ออก
    if (wrapper) {
      tl.to(wrapper, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    }

    // STEP C: เริ่มสลาย Blocks (เล่นต่อจาก UI จาง หรือเหลื่อมกันนิดหน่อย)
    tl.to(
      blockEls,
      {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        stagger: {
          amount: 0.7, // ระยะเวลาทั้งหมดที่ใช้ในการสุ่มจางบล็อกทังหมด
          from: "random",
        },
      },
      "-=0.3", // เริ่มสลายบล็อกก่อน UI จะจางหายสนิท 0.3 วินาที เพื่อความลื่นไหล
    );

    return () => {
      tl.kill();
    };
  }, [enabled, isMounted, blocks.length, durationMs, onDone]);

  if (!enabled || !isMounted || blocks.length === 0) return null;

  return (
    <div ref={overlayRef} className={styles.overlay}>
      {/* GRID ของแผ่นสี่เหลี่ยมสีดำที่ทำหน้าที่เป็นฉากหลัง */}
      <div className={styles.grid} suppressHydrationWarning>
        {blocks.map((b) => (
          <span
            key={b.id}
            className={styles.block}
            style={{
              left: b.left,
              top: b.top,
              width: b.w,
              height: b.h,
              position: "absolute",
              backgroundColor: "#000", // สีพื้นหลังของม่าน
            }}
            ref={(el) => {
              if (el) blockElsRef.current.push(el);
            }}
          />
        ))}
      </div>

      {/* UI ส่วนหน้า (ข้อความและวงกลม) */}
      <div ref={wrapperRef} className={styles.ui}>
        <p className={styles.text}>{label}</p>
        <div className={styles.ringFrame}>
          <span className={`${styles.ring} ${styles.ringSm}`} />
          <span className={`${styles.ring} ${styles.ringMd}`} />
          <span className={`${styles.ring} ${styles.ringLg}`} />
        </div>
        <div className={styles.discFrame}>
          <span className={styles.disc} />
        </div>
      </div>
    </div>
  );
}
