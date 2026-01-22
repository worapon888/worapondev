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
  blockSize = 50,
}: BlocksTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setViewport({ w, h });
      if (w > 0) setIsReady(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const blocks = useMemo(() => {
    if (!isReady || viewport.w === 0) return [];
    const cols = Math.ceil(viewport.w / blockSize);
    const rows = Math.ceil(viewport.h / blockSize) + 1;
    return Array.from({ length: rows * cols }, (_, i) => ({
      id: i,
      left: (i % cols) * blockSize,
      top: Math.floor(i / cols) * blockSize,
    }));
  }, [viewport, blockSize, isReady]);

  useEffect(() => {
    if (!enabled || !isReady || blocks.length === 0 || !containerRef.current)
      return;

    const el = containerRef.current;
    const blocksEls = el.querySelectorAll(`.${styles.block}`);

    if (blocksEls.length === 0) return;

    gsap.set(blocksEls, { opacity: 1 });

    const tl = gsap.timeline({
      onComplete: () => {
        if (onDone) onDone();
      },
    });

    tl.to(blocksEls, {
      opacity: 0,
      duration: 0.4,
      stagger: {
        amount: 0.6,
        from: "random",
      },
      ease: "power2.inOut",
    });

    return () => {
      tl.kill();
    };
  }, [enabled, isReady, blocks.length, onDone]);

  if (!enabled || !isReady || blocks.length === 0) return null;

  return (
    <div ref={containerRef} className={styles.overlay}>
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
  );
}
