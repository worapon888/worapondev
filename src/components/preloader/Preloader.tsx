"use client";

import React, { useEffect, useRef, useState } from "react";
import "./Preloader.css";

type PreloaderProps = {
  isActive?: boolean;
  autoFinishMs?: number;
  onDone?: () => void;
  label?: string;
};

type Block = {
  id: number;
  left: number;
  top: number;
  w: number;
  h: number;
  delay: number; // seconds
};

type CSSVars = React.CSSProperties & {
  [key: `--${string}`]: string | number;
};

function generateBlocks(cols = 14, rows = 10): Block[] {
  const total = cols * rows;
  const bw = 100 / cols;
  const bh = 100 / rows;

  const arr: Block[] = [];
  for (let i = 0; i < total; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);

    const jitterX = (Math.random() - 0.5) * 0.35;
    const jitterY = (Math.random() - 0.5) * 0.35;

    // ✅ แตกพร้อมขึ้น: ลด max delay
    const delay = Math.random() * 0.25;

    arr.push({
      id: i,
      left: c * bw + jitterX,
      top: r * bh + jitterY,
      w: bw + (Math.random() - 0.5) * 0.2,
      h: bh + (Math.random() - 0.5) * 0.2,
      delay,
    });
  }

  return arr.sort(() => Math.random() - 0.5);
}

export default function Preloader({
  isActive = true,
  autoFinishMs,
  onDone,
  label = "Stabilizing Feed",
}: PreloaderProps) {
  const [bgFading, setBgFading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const timersRef = useRef<number[]>([]);
  const blocksRef = useRef<Block[] | null>(null);
  if (!blocksRef.current) blocksRef.current = generateBlocks(14, 10);
  const blocks = blocksRef.current;

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  // =========================
  // ✅ MUST MATCH CSS
  // =========================
  const BG_FADE_MS = 550; // --bg-fade: 0.55s
  const GRID_OUT_DUR_MS = 1250; // --grid-out: 1.25s
  const GRID_OUT_MAX_DELAY_MS = 250; // max --d: 0.25s
  const POST_GRID_HOLD_MS = 0; // ✅ ตัดช่วงค้างหลังแตก (ไม่ให้วินาที 4-6 ค้าง)
  const OVERLAY_FADE_MS = 800; // --overlay-fade: 0.8s

  const GRID_PHASE_MS = GRID_OUT_DUR_MS + GRID_OUT_MAX_DELAY_MS;

  const startExitSequence = () => {
    clearTimers();

    // 1) BG ดำจางก่อน
    setBgFading(true);

    // 2) แล้วค่อยเริ่ม grid-out + svg/text fade
    timersRef.current.push(
      window.setTimeout(() => setIsExiting(true), BG_FADE_MS)
    );

    // 3) รอให้ grid “จบจริง” แล้วค่อย fade overlay ทั้งก้อน
    timersRef.current.push(
      window.setTimeout(
        () => setIsDone(true),
        BG_FADE_MS + GRID_PHASE_MS + POST_GRID_HOLD_MS
      )
    );

    // 4) onDone หลัง overlay fade จบ
    timersRef.current.push(
      window.setTimeout(
        () => onDone?.(),
        BG_FADE_MS + GRID_PHASE_MS + POST_GRID_HOLD_MS + OVERLAY_FADE_MS
      )
    );
  };

  useEffect(() => {
    clearTimers();

    if (isActive) {
      setBgFading(false);
      setIsExiting(false);
      setIsDone(false);
      return;
    }

    startExitSequence();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  useEffect(() => {
    if (!autoFinishMs || !isActive) return;

    clearTimers();
    timersRef.current.push(window.setTimeout(startExitSequence, autoFinishMs));
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFinishMs, isActive]);

  const shouldRender = isActive || bgFading || isExiting || !isDone;
  if (!shouldRender) return null;

  return (
    <div
      className={[
        "preloader-overlay",
        bgFading ? "preloader--bgfade" : "",
        isExiting ? "preloader--exiting" : "",
        isDone ? "preloader-overlay--done" : "",
      ].join(" ")}
      aria-hidden="true"
    >
      <div className="preloader-solid" aria-hidden="true" />

      <div className="preloader-grid" aria-hidden="true">
        {blocks.map((b) => (
          <span
            key={b.id}
            className="preloader-block"
            style={
              {
                left: `${b.left}%`,
                top: `${b.top}%`,
                width: `${b.w}%`,
                height: `${b.h}%`,
                "--d": `${b.delay}s`,
              } as CSSVars
            }
          />
        ))}
      </div>

      <div className="preloader-animation-wrapper">
        <p className="preloader-text">{label}</p>

        <div className="preloader-ring-frame">
          <span className="preloader-ring preloader-ring--sm" />
          <span className="preloader-ring preloader-ring--md" />
          <span className="preloader-ring preloader-ring--lg" />
        </div>

        <div className="preloader-disc-frame">
          <span className="preloader-disc" />
        </div>
      </div>
    </div>
  );
}
