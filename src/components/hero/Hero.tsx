"use client";

import React, { useEffect, useMemo, useState } from "react";
import "./hero.css";
import { useTypewriterLoop } from "@/app/contact/hooks/useTypewriterLoop";

export default function Hero() {
  const [isActive, setIsActive] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const headingText = "Building Real-World Web Systems.";

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

  const typedHeading = useTypewriterLoop(
    isActive && !prefersReduced,
    headingText,
    {
      typeSpeed: 42,
      endHoldMs: 1600,
      repeatDelayMs: 3600,
      glitchChance: 0,
    },
  );

  const headingParts = useMemo(() => {
    const text = prefersReduced ? headingText : typedHeading;
    const before = text.slice(0, Math.min(text.length, "Building ".length));
    const realWorldStart = "Building ".length;
    const realWorldEnd = realWorldStart + "Real-World".length;
    const accent =
      text.length > realWorldStart
        ? text.slice(realWorldStart, Math.min(text.length, realWorldEnd))
        : "";
    const after = text.length > realWorldEnd ? text.slice(realWorldEnd) : "";

    return { before, accent, after };
  }, [prefersReduced, typedHeading]);

  return (
    <section className="hero" id="home">
      <div className="hero-shell">
        <aside className="hero-rail" aria-label="Brand status">
          <div>
            <p className="hero-rail-label">Control Surface / 24.07</p>
            <p className="hero-brand">WORAPON.DEV</p>
          </div>

          <div className="hero-rail-bottom">
            <p>System Status</p>
            <p>Signal: Stable</p>
            <p>Systems: Online</p>
          </div>
        </aside>

        <div className="hero-stage">
          <div className="hero-main">
            <div className="hero-main-top">
              <p>Production Web Systems</p>
              <p>Full-Stack Engineering</p>
            </div>

            <div className="hero-copy">
              <h1 className="hero-heading" aria-label={headingText}>
                <span className="hero-heading-measure" aria-hidden="true">
                  Building
                  <span>Real-World</span>
                  Web Systems.
                </span>
                <span className="hero-heading-live" aria-hidden="true">
                  {headingParts.before}
                  <span>{headingParts.accent}</span>
                  {headingParts.after}
                  <span className="hero-typing-cursor">|</span>
                </span>
              </h1>

              <p className="hero-subtitle">
                Full-stack engineer and product builder focused on building
                practical, production-ready software. I work across frontend,
                backend, system design, and product thinking -- turning
                real-world problems into useful, scalable experiences.
              </p>

              <div className="hero-proof-grid" aria-label="Core strengths">
                <p>Architecture</p>
                <p>Performance</p>
                <p>User Experience</p>
              </div>
            </div>
          </div>

          <div className="hero-actions" aria-label="Primary actions">
            <a href="#contact" className="hero-primary">
              Work with me
            </a>

            <a href="#projects" className="hero-secondary">
              View Projects <span aria-hidden="true">-&gt;</span>
            </a>
          </div>

          <div className="hero-footer">
            <div>
              <p className="hero-footer-label">Observation Log</p>
              <p>
                Production-ready systems are designed, tested, and refined to
                handle real-world complexity from interface logic to performance,
                reliability, and scalable architecture.
              </p>
            </div>

            <p className="hero-availability">
              Available for freelance projects and contract work
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
