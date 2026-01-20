"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import styles from "./Preloader.module.css";

type PreloaderProps = {
  enabled?: boolean;
  durationMs?: number;
  label?: string;
  onDone?: () => void;
  blockSize?: number;
};

export default function Preloader({
  enabled = true,
  durationMs = 2800,
  label = "Stabilizing Feed",
  onDone,
  blockSize = 60,
}: PreloaderProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const blockElsRef = useRef<HTMLSpanElement[]>([]);

  const [ready, setReady] = useState(false);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  // 1. Optimize Viewport Resize
  useEffect(() => {
    const handleResize = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Calculate Blocks Data
  const blocks = useMemo(() => {
    const { w: W, h: H } = viewport;
    if (!W || !H) return [];

    const cols = Math.ceil(W / blockSize);
    const rows = Math.ceil(H / blockSize) + 1;
    const offsetX = (W - cols * blockSize) / 2;
    const offsetY = (H - rows * blockSize) / 2;

    return Array.from({ length: rows * cols }, (_, i) => ({
      id: i,
      left: (i % cols) * blockSize + offsetX,
      top: Math.floor(i / cols) * blockSize + offsetY,
    }));
  }, [viewport, blockSize]);

  useEffect(() => {
    if (enabled && blocks.length > 0) setReady(true);
  }, [enabled, blocks.length]);

  // 3. Animation Logic
  useLayoutEffect(() => {
    if (!enabled || !ready) return;

    const ctx = gsap.context(() => {
      const blockEls = blockElsRef.current;
      const uiWrapper = wrapperRef.current;

      const uiOutSec = 0.6;
      const delaySec = Math.max(0, (durationMs - uiOutSec * 2000) / 1000);

      const tl = gsap.timeline({
        delay: delaySec,
        onComplete: () => onDone?.(),
      });

      // UI Out
      tl.to(
        uiWrapper,
        {
          opacity: 0,
          duration: uiOutSec,
          ease: "power2.out",
        },
        0,
      );

      // Blocks Out (Random Stagger)
      tl.to(
        blockEls,
        {
          opacity: 0,
          scale: 0.8, // เพิ่มลูกเล่นเล็กน้อยให้ดูเบาบางลงตอนออก
          duration: 0.25,
          ease: "power2.inOut",
          stagger: {
            amount: 0.8,
            from: "random",
          },
        },
        0.1,
      );
    }, scopeRef);

    return () => ctx.revert();
  }, [enabled, ready, durationMs, onDone]);

  if (!enabled || !ready) return null;

  return (
    <div ref={scopeRef} className={styles.overlay} aria-hidden="true">
      {/* Grid of Blocks */}
      <div className={styles.grid}>
        {blocks.map((b, i) => (
          <span
            key={b.id}
            ref={(el) => {
              if (el) blockElsRef.current[i] = el;
            }}
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

      {/* Center UI */}
      <div ref={wrapperRef} className={styles.ui}>
        <p className={styles.text}>{label}</p>

        <div className={styles.ringContainer}>
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
    </div>
  );
}
