"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./BlocksTransition.module.css";

type Props = {
  enabled: boolean;
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

export default function BlocksTransition({
  enabled,
  onDone,
  blockSize = 60,
}: Props) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const blockElsRef = useRef<HTMLSpanElement[]>([]);
  blockElsRef.current = [];

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

  useEffect(() => {
    if (!enabled) return;

    const overlay = overlayRef.current;
    const blockEls = blockElsRef.current;
    if (!overlay || !blockEls.length) return;

    gsap.killTweensOf([overlay, blockEls]);
    gsap.set(blockEls, { opacity: 1 });

    const tl = gsap.timeline({
      onComplete: () => onDone?.(),
    });

    // ✅ แตกไวแบบ transition
    tl.to(blockEls, {
      opacity: 0,
      duration: 0.18, // จาก 0.14 -> 0.22
      ease: "power2.inOut",
      stagger: { amount: 0.9, each: 0.01, from: "random" }, // จาก 0.55 -> 1.2
    });

    return () => {
      tl.kill();
      gsap.killTweensOf([overlay, blockEls]);
    };
  }, [enabled, onDone]);

  // ✅ ไม่ enabled = ไม่ render (ไม่ติดมา)
  if (!enabled) return null;

  // ✅ รอ viewport ก่อน
  if (!blocks.length) return null;

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
    </div>
  );
}
