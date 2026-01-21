"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./BlocksTransition.module.css";

interface BlocksTransitionProps {
  enabled: boolean;
  onDone?: () => void;
  blockSize?: number;
}

export default function BlocksTransition({
  enabled,
  onDone,
  blockSize = 60,
}: BlocksTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  // 1. Optimized Resize Handler
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Memoized Blocks Calculation
  const blocks = useMemo(() => {
    const { w: W, h: H } = viewport;
    if (!W || !H) return [];

    const cols = Math.ceil(W / blockSize);
    const rows = Math.ceil(H / blockSize) + 1;
    const offsetX = (W - cols * blockSize) / 2;
    const offsetY = (H - rows * blockSize) / 2;

    return Array.from({ length: rows * cols }, (_, i) => {
      const r = Math.floor(i / cols);
      const c = i % cols;
      return {
        id: i,
        left: c * blockSize + offsetX,
        top: r * blockSize + offsetY,
      };
    });
  }, [viewport, blockSize]);

  // 3. Animation Logic
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const blocksEls = containerRef.current.querySelectorAll(`.${styles.block}`);
    if (!blocksEls.length) return;

    // Reset State ก่อนเริ่ม
    gsap.set(blocksEls, { opacity: 1 });

    const tl = gsap.timeline({
      onComplete: () => onDone?.(),
      defaults: { ease: "power2.inOut" },
    });

    tl.to(blocksEls, {
      opacity: 0,
      duration: 0.2,
      stagger: {
        amount: 0.8,
        from: "random",
      },
    });

    return () => {
      tl.kill();
      gsap.killTweensOf(blocksEls);
    };
  }, [enabled, onDone, blocks.length]); // รันเมื่อ blocks พร้อม

  if (!enabled || !blocks.length) return null;

  return (
    <div ref={containerRef} className={styles.overlay} aria-hidden="true">
      <div className={styles.grid}>
        {blocks.map((b) => (
          <span
            key={b.id}
            className={styles.block}
            style={{
              left: b.left,
              top: b.top,
              width: blockSize,
              height: blockSize,
            }}
          />
        ))}
      </div>
    </div>
  );
}
