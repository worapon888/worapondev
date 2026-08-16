"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./Preloader.module.css";

type PreloaderProps = {
  enabled?: boolean;
  durationMs?: number;
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
  onDone,
  blockSize = 60,
}: PreloaderProps) {
  const [isMounted, setIsMounted] = useState(false);
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

    const blockEls = blockElsRef.current;

    if (blockEls.length === 0) return;

    gsap.set(blockEls, { opacity: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        onDone?.();
      },
    });

    const holdTime = Math.max(0, durationMs - 800) / 1000;
    tl.to({}, { duration: holdTime });

    tl.to(blockEls, {
      opacity: 0,
      duration: 0.45,
      ease: "power2.inOut",
      stagger: {
        amount: 0.8,
        from: "random",
      },
    });

    return () => {
      tl.kill();
    };
  }, [enabled, isMounted, blocks.length, durationMs, onDone]);

  if (!enabled || !isMounted || blocks.length === 0) return null;

  return (
    <div className={styles.overlay}>
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
            }}
            ref={(el) => {
              if (el) blockElsRef.current.push(el);
            }}
          />
        ))}
      </div>
    </div>
  );
}
