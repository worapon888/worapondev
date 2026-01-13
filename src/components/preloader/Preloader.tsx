"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./Preloader.module.css";

type PreloaderProps = {
  enabled?: boolean;
  durationMs?: number; // รวมเวลาทั้งหมดก่อนเริ่ม out
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
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // ✅ เก็บ element ของ block แบบไม่ต้อง querySelectorAll (กันพังกับ module)
  const blockElsRef = useRef<HTMLSpanElement[]>([]);
  blockElsRef.current = [];

  const [ready, setReady] = useState(false);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const onResize = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const blocks: Block[] = useMemo(() => {
    const W = viewport.w;
    const H = viewport.h;
    if (!W || !H) return [];

    const cols = Math.ceil(W / blockSize);
    const rows = Math.ceil(H / blockSize) + 1;
    const offsetX = (W - cols * blockSize) / 2;
    const offsetY = (H - rows * blockSize) / 2;

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
  }, [viewport.w, viewport.h, blockSize]);

  // ✅ บังคับให้ render เมื่อ enabled และมี blocks แล้ว
  useEffect(() => {
    if (!enabled) return;
    if (!blocks.length) return;
    setReady(true);
  }, [enabled, blocks.length]);

  useEffect(() => {
    if (!enabled || !ready) return;

    const overlay = overlayRef.current;
    const wrapper = wrapperRef.current;
    const blockEls = blockElsRef.current;

    if (!overlay || !blockEls.length) return;

    // initial
    gsap.killTweensOf([overlay, wrapper, blockEls]);
    gsap.set(blockEls, { opacity: 1 });
    if (wrapper) gsap.set(wrapper, { opacity: 1 });

    const uiOutMs = 600; // เหมือนต้นแบบ
    const blockDur = 0.18;
    const staggerAmount = 0.8;

    // ให้ถือว่า durationMs คือ “เวลารอก่อนเริ่มออก”
    const delaySec = Math.max(0, (durationMs - uiOutMs * 2) / 1000);

    const tl = gsap.timeline({
      delay: delaySec,
      onComplete: () => {
        onDone?.();
      },
    });

    // UI fade out
    if (wrapper) {
      tl.to(
        wrapper,
        { opacity: 0, duration: uiOutMs / 1000, ease: "power2.out" },
        0
      );
    }

    // blocks out random
    tl.to(
      blockEls,
      {
        opacity: 0,
        duration: blockDur,
        ease: "power2.inOut",
        stagger: { amount: staggerAmount, each: 0.01, from: "random" },
      },
      0.05
    );

    return () => {
      tl.kill();
      gsap.killTweensOf([overlay, wrapper, blockEls]);
    };
  }, [enabled, ready, durationMs, onDone]);

  // ✅ ถ้าไม่ enabled ไม่ต้องโชว์ (เวลาปิดจะ unmount)
  if (!enabled || !ready) return null;

  return (
    <div ref={overlayRef} className={styles.overlay} aria-hidden="true">
      <div className={styles.grid} aria-hidden="true">
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
