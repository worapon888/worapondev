"use client";

import { SERVICES } from "@/data/services";
import type { PriceRange, ServiceItem } from "@/types/service";
import Image from "next/image";
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import { IoPlayBackSharp, IoPlayForwardSharp } from "react-icons/io5";
import gsap from "gsap";

type Props = {
  title?: string;
};

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

/** ===== 3D Poses (ซ้าย/กลาง/ขวา) ===== */
type PoseKey = "left" | "center" | "right";

const POSES: Record<PoseKey, gsap.TweenVars> = {
  left: {
    xPercent: -108, // -50 - 58
    yPercent: -50,
    z: -180,
    rotateY: 22,
    scale: 0.86,
    autoAlpha: 0.25,
    filter: "blur(1.4px)",
  },
  center: {
    xPercent: -50,
    yPercent: -50,
    z: 0,
    rotateY: 0,
    scale: 1,
    autoAlpha: 1,
    filter: "blur(0px)",
  },
  right: {
    xPercent: 8, // -50 + 58
    yPercent: -50,
    z: -180,
    rotateY: -22,
    scale: 0.86,
    autoAlpha: 0.25,
    filter: "blur(1.4px)",
  },
};

function ServiceCard({
  svc,
  priceText,
}: {
  svc: ServiceItem;
  priceText: string;
}) {
  return (
    <div className="services-card" role="article" aria-label={svc.name}>
      <div className="services-card__media">
        <Image
          src={svc.image}
          alt={svc.name}
          fill
          sizes="(max-width: 900px) 100vw, 420px"
          style={{ objectFit: "cover" }}
        />
        <div className="services-card__mediaOverlay" aria-hidden="true" />
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
              {svc.price?.note ? (
                <em className="note">({svc.price.note})</em>
              ) : null}
            </span>
          </div>

          <p className="meta-footnote">
            Scope & final quote are confirmed after briefing.
          </p>
        </div>

        <div className="services-card__cols">
          <div className="col">
            <p className="col-title">Deliverables</p>
            <ul>
              {(svc.deliverables ?? []).map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>

          <div className="col">
            <p className="col-title">Scope</p>
            <ul>
              {(svc.scope ?? []).map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        </div>

        {svc.highlights?.length ? (
          <div className="services-card__cols services-card__cols--single">
            <div className="col">
              <p className="col-title">Highlights</p>
              <ul>
                {svc.highlights.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {svc.tech?.length ? (
          <div className="services-card__chips" aria-label="Technology stack">
            {svc.tech.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function ServicesPage({ title = "Zone / Services" }: Props) {
  const list = SERVICES ?? [];
  const len = list.length;

  // ✅ Hooks ต้องอยู่บนสุดเสมอ
  const [centerIndex, setCenterIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // ✅ refs ของ slot (GSAP ขยับ slot ไม่ใช่ card)
  const stageRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const centerRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  // ✅ init poses
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const L = leftRef.current;
    const C = centerRef.current;
    const R = rightRef.current;
    if (!stage || !L || !C || !R) return;

    const ctx = gsap.context(() => {
      gsap.set([L, C, R], {
        transformPerspective: 1200,
        transformOrigin: "50% 50%",
        force3D: true,
      });

      gsap.set(L, POSES.left);
      gsap.set(C, POSES.center);
      gsap.set(R, POSES.right);
    }, stage);

    return () => ctx.revert();
  }, []);

  // empty state
  if (len === 0) {
    return (
      <section className="services-container">
        <div className="services-nav">
          <div className="services-logo">
            <p>{title}</p>
          </div>
        </div>
        <div className="services-footer">
          <p>Archive Unit Connected</p>
          <p>Playback Channel Stable</p>
        </div>
        <div style={{ opacity: 0.7 }}>No services configured.</div>
      </section>
    );
  }

  const leftIndex = wrapIndex(centerIndex - 1, len);
  const rightIndex = wrapIndex(centerIndex + 1, len);

  const centerSvc = list[centerIndex];
  const leftSvc = list[leftIndex];
  const rightSvc = list[rightIndex];

  const priceCenter = useMemo(
    () => formatPrice(centerSvc?.price),
    [centerSvc?.price]
  );
  const priceLeft = useMemo(
    () => formatPrice(leftSvc?.price),
    [leftSvc?.price]
  );
  const priceRight = useMemo(
    () => formatPrice(rightSvc?.price),
    [rightSvc?.price]
  );

  const animateTo = (dir: 1 | -1) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const L = leftRef.current;
    const C = centerRef.current;
    const R = rightRef.current;

    if (!L || !C || !R) {
      setCenterIndex((prev) => wrapIndex(prev + dir, len));
      setIsAnimating(false);
      return;
    }

    const mapNext: Record<PoseKey, PoseKey> = {
      left: "right",
      center: "left",
      right: "center",
    };
    const mapPrev: Record<PoseKey, PoseKey> = {
      left: "center",
      center: "right",
      right: "left",
    };
    const map = dir === 1 ? mapNext : mapPrev;

    gsap
      .timeline({
        defaults: { ease: "power3.inOut", duration: 0.6, overwrite: "auto" },
        onComplete: () => {
          // เปลี่ยนข้อมูลหลัง motion จบ
          setCenterIndex((prev) => wrapIndex(prev + dir, len));

          // reset poses ให้พร้อมรอบถัดไป
          gsap.set(L, POSES.left);
          gsap.set(C, POSES.center);
          gsap.set(R, POSES.right);

          setIsAnimating(false);
        },
      })
      .to(L, POSES[map.left], 0)
      .to(C, POSES[map.center], 0)
      .to(R, POSES[map.right], 0);
  };

  return (
    <section className="services-container">
      {/* TOP NAV */}
      <div className="services-nav">
        <div className="services-logo">
          <p>{title}</p>
        </div>
        <div className="service-name">
          <p>{centerSvc.name}</p>
        </div>
      </div>

      {/* FOOTER STATUS */}
      <div className="services-footer">
        <p>Archive Unit Connected</p>
        <p>Playback Channel Stable</p>
      </div>

      {/* CONTROLLER */}
      <div className="controller" role="group" aria-label="Service selector">
        <div className="controller-outer">
          <div className="controller-label">
            <p>Select</p>
          </div>

          <button
            type="button"
            className="services-controller-nav-btn prev"
            aria-label="Previous"
            onClick={() => animateTo(-1)}
            disabled={isAnimating}
          >
            <IoPlayBackSharp />
          </button>

          <button
            type="button"
            className="services-controller-nav-btn next"
            aria-label="Next"
            onClick={() => animateTo(1)}
            disabled={isAnimating}
          >
            <IoPlayForwardSharp />
          </button>
        </div>

        <button type="button" className="controller-inner" aria-label="Close" />
      </div>

      {/* ===== 3-CARD STAGE ===== */}
      <div
        ref={stageRef}
        className="services-stage"
        aria-label="Services carousel"
      >
        <div
          ref={leftRef}
          className="services-slot services-slot--left"
          aria-hidden="true"
        >
          <ServiceCard svc={leftSvc} priceText={priceLeft} />
        </div>

        <div ref={centerRef} className="services-slot services-slot--center">
          <ServiceCard svc={centerSvc} priceText={priceCenter} />
        </div>

        <div
          ref={rightRef}
          className="services-slot services-slot--right"
          aria-hidden="true"
        >
          <ServiceCard svc={rightSvc} priceText={priceRight} />
        </div>
      </div>
    </section>
  );
}
