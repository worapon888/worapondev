"use client";

import "./Cta.css";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTypewriterLoop } from "@/app/contact/hooks/useTypewriterLoop";

const ctaImages = [
  "/index/cta_img_01.webp",
  "/index/cta_img_02.webp",
  "/index/cta_img_03.webp",
  "/index/cta_img_04.webp",
  "/index/cta_img_05.webp",
  "/index/cta_img_06.webp",
];

export default function CtaSection() {
  const [isActive, setIsActive] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const ctaTitle = useMemo(
    () =>
      "Have a product, platform, or website idea? Let’s build something production-ready, reliable, and designed to work in the real world.",
    [],
  );

  useEffect(() => {
    setIsActive(true);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const typedTitle = useTypewriterLoop(isActive && !prefersReduced, ctaTitle, {
    typeSpeed: 24,
    endHoldMs: 1800,
    repeatDelayMs: 3600,
    glitchChance: 0,
  });

  return (
    <section className="cta" aria-labelledby="cta-title">
      <div className="cta-shell">
        <div className="cta-panel">
          <div className="cta-meta">
            <p>Project Intake</p>
            <p>Production Build Request</p>
          </div>

          <div className="cta-main">
            <div className="cta-logo">
              <Image
                src="/Logo_worapon.webp"
                alt="worapon.dev"
                width={150}
                height={150}
                priority
              />
            </div>

            <p
              id="cta-title"
              className="bodyCopy lg cta-typing-title"
              aria-label={ctaTitle}
            >
              <span className="cta-title-measure" aria-hidden="true">
                {ctaTitle}
              </span>
              <span className="cta-title-live" aria-hidden="true">
                {prefersReduced ? ctaTitle : typedTitle}
                <span className="cta-typing-cursor">|</span>
              </span>
            </p>
          </div>

          <a href="/contact" className="cta-link">
            Start a project <span aria-hidden="true">-&gt;</span>
          </a>
        </div>

        <div className="cta-gallery" aria-hidden="true">
          {ctaImages.map((src, index) => (
            <div className="cta-card" key={src}>
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width: 900px) 50vw, 20vw"
                priority={index < 2}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
