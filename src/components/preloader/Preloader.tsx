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
  // ✅ ป้องกัน Hydration Error โดยเช็กว่า Mount หรือยัง
  const [isMounted, setIsMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const blockElsRef = useRef<HTMLSpanElement[]>([]);

  // ล้างค่า Array ทุกครั้งที่เรนเดอร์ใหม่
  blockElsRef.current = [];

  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  useEffect(() => {
    setIsMounted(true);
    const onResize = () => {
      // ใช้ดักค่าที่แม่นยำขึ้นสำหรับมือถือ
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
    // ห้ามคำนวณจนกว่าจะอยู่บน Client และมีขนาดหน้าจอ
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
    // รอให้ blocks พร้อมจริงๆ ก่อนเริ่ม Animation
    if (!enabled || !isMounted || blocks.length === 0) return;

    const overlay = overlayRef.current;
    const wrapper = wrapperRef.current;
    const blockEls = blockElsRef.current;

    if (!overlay || blockEls.length === 0) return;

    gsap.killTweensOf([overlay, wrapper, blockEls]);
    gsap.set(blockEls, { opacity: 1 });
    if (wrapper) gsap.set(wrapper, { opacity: 1 });

    const uiOutMs = 600;
    const blockDur = 0.2;
    const staggerAmount = 0.8;
    const delaySec = Math.max(0, (durationMs - uiOutMs * 2) / 1000);

    const tl = gsap.timeline({
      delay: delaySec,
      onComplete: () => onDone?.(),
    });

    if (wrapper) {
      tl.to(
        wrapper,
        {
          opacity: 0,
          duration: uiOutMs / 1000,
          ease: "power2.out",
        },
        0,
      );
    }

    tl.to(
      blockEls,
      {
        opacity: 0,
        duration: blockDur,
        ease: "power2.inOut",
        stagger: { amount: staggerAmount, from: "random" },
      },
      0.1,
    );

    return () => {
      tl.kill();
    };
  }, [enabled, isMounted, blocks.length, durationMs, onDone]);

  // ✅ ถ้ายังไม่พร้อม ห้าม Render เด็ดขาด
  if (!enabled || !isMounted || blocks.length === 0) return null;

  return (
    <div ref={overlayRef} className={styles.overlay}>
      {/* ใช้ suppressHydrationWarning เพื่อกัน Error จากการสุ่มตำแหน่ง */}
      <div className={styles.grid} suppressHydrationWarning>
        {blocks.map((b) => (
          <span
            key={b.id}
            className={styles.block}
            style={{ left: b.left, top: b.top, width: b.w, height: b.h }}
            ref={(el) => {
              if (el) blockElsRef.current.push(el);
            }}
          />
        ))}
      </div>

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
