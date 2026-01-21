"use client";

import { SERVICES } from "@/data/services";
import type { PriceRange, ServiceItem } from "@/types/service";
import Image from "next/image";
import React, { useLayoutEffect, useRef, useState, useCallback } from "react";
import { IoPlayBackSharp, IoPlayForwardSharp } from "react-icons/io5";
import gsap from "gsap";

/** ===== Helpers ===== */
function formatUSD(n: number) {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function formatPrice(p?: PriceRange) {
  if (!p) return "—";
  if (p.to != null) return `$${formatUSD(p.from)}–$${formatUSD(p.to)}`;
  return `$${formatUSD(p.from)}+`;
}

function wrapIndex(i: number, len: number) {
  return ((i % len) + len) % len;
}

/** ===== 3D Poses Config ===== */
type PoseKey = "left" | "center" | "right";
type ElKey = "L" | "C" | "R";

const POSES: Record<PoseKey, gsap.TweenVars> = {
  left: {
    xPercent: -120,
    yPercent: -50,
    z: -250,
    rotateY: 25,
    scale: 0.8,
    autoAlpha: 0.3,
    filter: "blur(2px)",
    zIndex: 1,
    overwrite: true,
  },
  center: {
    xPercent: -50,
    yPercent: -50,
    z: 0,
    rotateY: 0,
    scale: 1,
    autoAlpha: 1,
    filter: "blur(0px)",
    zIndex: 10,
    overwrite: true,
  },
  right: {
    xPercent: 20,
    yPercent: -50,
    z: -250,
    rotateY: -25,
    scale: 0.8,
    autoAlpha: 0.3,
    filter: "blur(2px)",
    zIndex: 1,
    overwrite: true,
  },
};

/** ===== Components ===== */
function ServiceCard({
  svc,
  priceText,
  isActive,
}: {
  svc: ServiceItem;
  priceText: string;
  isActive: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useLayoutEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (isActive) {
      const p = v.play();
      if (p && typeof p.then === "function") p.catch(() => {});
    } else {
      v.pause();
      try {
        v.currentTime = 0;
      } catch {}
    }
  }, [isActive]);

  return (
    <div className="services-card">
      <div className="services-card__media">
        {svc.media.type === "video" ? (
          <video
            ref={videoRef}
            className="services-card__video"
            src={svc.media.src}
            poster={svc.media.poster}
            muted
            loop
            playsInline
            preload="metadata"
            autoPlay={isActive}
          />
        ) : (
          <Image
            src={svc.media.src}
            alt={svc.name}
            fill
            sizes="(max-width: 900px) 100vw, 420px"
            style={{ objectFit: "cover" }}
            priority
          />
        )}
        <div className="services-card__mediaOverlay" />
        <div className="services-card__badge">
          <span className="code">{svc.code}</span>
          <span className="tag">{svc.tag}</span>
        </div>
      </div>

      <div className="services-card__body">
        <header className="services-card__header">
          <h3>{svc.name}</h3>
          <p className="headline">{svc.headline}</p>
        </header>
        <p className="desc">{svc.description}</p>
        <div className="services-card__meta">
          <div className="meta-row">
            <span className="k">ETA</span>
            <span className="v">{svc.timeline}</span>
          </div>
          <div className="meta-row">
            <span className="k">PRICE</span>
            <span className="v">
              {priceText}{" "}
              {svc.price?.note && <em className="note">({svc.price.note})</em>}
            </span>
          </div>
        </div>
        <div className="services-card__cols">
          <div className="col">
            <p className="col-title">Deliverables</p>
            <ul>{svc.deliverables?.map((it) => <li key={it}>{it}</li>)}</ul>
          </div>
          <div className="col">
            <p className="col-title">Scope</p>
            <ul>{svc.scope?.map((it) => <li key={it}>{it}</li>)}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ แก้ไข Props ของหน้า ServicesPage เพื่อไม่ให้ชนกับ PageProps ของ Next.js
export default function ServicesPage() {
  const displayTitle = "Zone / Services"; // กำหนดตัวแปรข้างในแทนรับผ่าน Props
  const list = SERVICES || [];
  const len = list.length;

  const [centerIndex, setCenterIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);

  // สร้าง Refs แยกทีละตัวเพื่อความง่ายในการระบุ Dependency
  const refL = useRef<HTMLDivElement>(null);
  const refC = useRef<HTMLDivElement>(null);
  const refR = useRef<HTMLDivElement>(null);

  const currentPoses = useRef<Record<ElKey, PoseKey>>({
    L: "left",
    C: "center",
    R: "right",
  });

  useLayoutEffect(() => {
    const targets = [refL.current, refC.current, refR.current];
    gsap.set(targets, {
      position: "absolute",
      left: "50%",
      top: "50%",
      transformPerspective: 1200,
      transformStyle: "preserve-3d",
      transition: "none",
      force3D: true,
    });

    if (refL.current) gsap.set(refL.current, POSES.left);
    if (refC.current) gsap.set(refC.current, POSES.center);
    if (refR.current) gsap.set(refR.current, POSES.right);
  }, []); // ตัวนี้เซ็ตแค่ตอน mount

  const animateTo = useCallback(
    (dir: 1 | -1) => {
      if (isAnimating || len <= 1) return;
      setIsAnimating(true);

      const nextIndex = wrapIndex(centerIndex + dir, len);

      const getNextPose = (p: PoseKey): PoseKey => {
        if (dir === 1)
          return p === "left" ? "right" : p === "center" ? "left" : "center";
        return p === "left" ? "center" : p === "center" ? "right" : "left";
      };

      const newPoses: Record<ElKey, PoseKey> = {
        L: getNextPose(currentPoses.current.L),
        C: getNextPose(currentPoses.current.C),
        R: getNextPose(currentPoses.current.R),
      };

      const tl = gsap.timeline({
        onComplete: () => {
          currentPoses.current = newPoses;
          setCenterIndex(nextIndex);
          setIsAnimating(false);

          stageRef.current
            ?.querySelectorAll(".services-card__body")
            .forEach((el) => ((el as HTMLElement).scrollTop = 0));
        },
      });

      // ใส่ dependencies refs เข้าไปใน timeline
      if (refL.current)
        tl.to(
          refL.current,
          { ...POSES[newPoses.L], duration: 0.6, ease: "expo.out" },
          0,
        );
      if (refC.current)
        tl.to(
          refC.current,
          { ...POSES[newPoses.C], duration: 0.6, ease: "expo.out" },
          0,
        );
      if (refR.current)
        tl.to(
          refR.current,
          { ...POSES[newPoses.R], duration: 0.6, ease: "expo.out" },
          0,
        );
    },
    [centerIndex, isAnimating, len], // refs ไม่ต้องใส่ใน dep ของ useCallback เพราะมันเสถียร
  );

  const getSvcByPose = useCallback(
    (pose: PoseKey) => {
      if (pose === "center") return list[centerIndex];
      if (pose === "left") return list[wrapIndex(centerIndex - 1, len)];
      return list[wrapIndex(centerIndex + 1, len)];
    },
    [centerIndex, len, list],
  );

  if (len === 0) return null;

  return (
    <section className="services-container">
      <div className="services-nav">
        <div className="services-logo">
          <p>{displayTitle}</p>
        </div>
        <div className="service-name">
          <p>{list[centerIndex].name}</p>
        </div>
      </div>

      <div className="services-footer">
        <p>Archive Unit Connected</p>
        <p>Playback Channel Stable</p>
      </div>

      <div className="controller">
        <div className="controller-outer">
          <div className="controller-label">
            <p>Select</p>
          </div>
          <button
            className="services-controller-nav-btn prev"
            onClick={() => animateTo(-1)}
            disabled={isAnimating}
          >
            <IoPlayBackSharp />
          </button>
          <button
            className="services-controller-nav-btn next"
            onClick={() => animateTo(1)}
            disabled={isAnimating}
          >
            <IoPlayForwardSharp />
          </button>
        </div>
        <button className="controller-inner" />
      </div>

      <div ref={stageRef} className="services-stage">
        {(["L", "C", "R"] as ElKey[]).map((key) => {
          const pose = currentPoses.current[key];
          const svc = getSvcByPose(pose);
          const activeRef = key === "L" ? refL : key === "C" ? refC : refR;

          return (
            <div
              key={key}
              ref={activeRef}
              className={`services-slot services-slot--${key}`}
            >
              <ServiceCard
                key={svc.code}
                svc={svc}
                priceText={formatPrice(svc.price)}
                isActive={pose === "center"}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
