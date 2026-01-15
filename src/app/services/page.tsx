"use client";

import { SERVICES } from "@/data/services";
import type { PriceRange, ServiceItem } from "@/types/service";
import Image from "next/image";
import React, { useMemo, useRef, useState } from "react";
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

export default function ServicesPage({ title = "Zone / Services" }: Props) {
  // ✅ เตรียม list ก่อน
  const list = SERVICES ?? [];

  // ✅ Hooks ต้องอยู่บนสุดเสมอ
  const [index, setIndex] = useState(0);
  const [svc, setSvc] = useState<ServiceItem | null>(list[0] ?? null);
  const [isAnimating, setIsAnimating] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);

  const priceText = useMemo(() => formatPrice(svc?.price), [svc?.price]);

  // ✅ ค่อย return empty state ทีหลัง
  if (!svc || list.length === 0) {
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

  const animateTo = (dir: 1 | -1) => {
    if (isAnimating) return;
    setIsAnimating(true);

    const nextIndex = wrapIndex(index + dir, list.length);
    const nextSvc = list[nextIndex];
    const card = cardRef.current;

    if (!card) {
      setIndex(nextIndex);
      setSvc(nextSvc);
      setIsAnimating(false);
      return;
    }

    const xOut = dir === 1 ? -56 : 56;
    const xIn = dir === 1 ? 56 : -56;

    gsap
      .timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => setIsAnimating(false),
      })
      .to(card, { x: xOut, autoAlpha: 0, duration: 0.28 })
      .add(() => {
        setIndex(nextIndex);
        setSvc(nextSvc);
      })
      .set(card, { x: xIn, autoAlpha: 0 })
      .to(card, { x: 0, autoAlpha: 1, duration: 0.35 });
  };

  return (
    <section className="services-container">
      {/* TOP NAV */}
      <div className="services-nav">
        <div className="services-logo">
          <p>{title}</p>
        </div>
        <div className="service-name">
          <p>{svc.name}</p>
        </div>
      </div>

      {/* FOOTER STATUS */}
      <div className="services-footer">
        <p>Archive Unit Connected</p>
        <p>Playback Channel Stable</p>
      </div>

      {/* CONTROLLER (DIAL) */}
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

        <button
          type="button"
          className="controller-inner"
          aria-label="Close"
          onClick={() => {
            // ถ้าจะผูกเป็นปุ่มกลับ/ปิด modal ทีหลัง
            // เช่น router.back()
          }}
        />
      </div>

      {/* CARD */}
      <div
        ref={cardRef}
        className="services-card"
        role="article"
        aria-label={svc.name}
      >
        {/* MEDIA */}
        <div className="services-card__media">
          <Image
            src={svc.image}
            alt={svc.name}
            fill
            priority={index === 0}
            sizes="(max-width: 900px) 100vw, 420px"
            style={{ objectFit: "cover" }}
          />

          <div className="services-card__mediaOverlay" aria-hidden="true" />

          <div className="services-card__badge">
            <span className="code">{svc.code}</span>
            <span className="tag">{svc.tag}</span>
          </div>
        </div>

        {/* BODY */}
        <div className="services-card__body">
          <header className="services-card__header">
            <h3>{svc.name}</h3>
            <p className="headline">{svc.headline}</p>
          </header>

          <p className="desc">{svc.description}</p>

          {/* META */}
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

          {/* COLUMNS */}
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

          {/* Highlights */}
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

          {/* Tech chips */}
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
    </section>
  );
}
