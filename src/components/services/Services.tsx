"use client";

import { useRef, useLayoutEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./services.css";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const copyRef = useRef<HTMLHeadingElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  const subtitleText = useMemo(
    () =>
      "I build production-ready web systems that balance strong user experience with real engineering depth — from modern frontend interfaces to backend architecture, performance, reliability, and scalable application logic.",
    [],
  );

  const words = useMemo(() => subtitleText.trim().split(/\s+/), [subtitleText]);

  const services = useMemo(
    () => [
      {
        title: "Frontend Engineering",
        value: "08",
        note: "UI systems, interaction quality, responsive builds",
      },
      {
        title: "Backend Architecture",
        value: "02",
        note: "API design, data flow, stability, maintainability",
      },
      {
        title: "Production Systems",
        value: "02",
        note: "Deployment thinking, performance, reliability, scale",
      },
      {
        title: "Problem Solving",
        value: "04",
        note: "Structured delivery across product and engineering",
      },
    ],
    [],
  );

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const title = titleRef.current;
      if (!title) return;

      const lines = Array.from(title.querySelectorAll<HTMLElement>("span"));
      if (!lines.length) return;

      gsap.set(lines, { yPercent: 120, autoAlpha: 0 });

      gsap.to(lines, {
        yPercent: 0,
        autoAlpha: 1,
        duration: 1,
        ease: "expo.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: title,
          start: "top 80%",
          toggleActions: "play reverse play reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const el = copyRef.current;
      if (!el) return;

      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile =
        typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

      const wordEls = Array.from(
        el.querySelectorAll<HTMLElement>(".services-word"),
      );
      if (!wordEls.length) return;

      wordEls.forEach((w) => (w.style.color = "var(--base-300)"));

       if (prefersReduced || isMobile) {
        wordEls.forEach((w) => (w.style.color = "var(--base-100)"));
        return;
      }

      let lastFill = -1;

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 75%",
        end: "bottom 30%",
        onUpdate: (self) => {
          const total = wordEls.length;
          const toFill = Math.floor(self.progress * total);

          if (toFill === lastFill) return;
          lastFill = toFill;

          for (let i = 0; i < total; i++) {
            wordEls[i].style.color =
              i < toFill ? "var(--base-100)" : "var(--base-300)";
          }
        },
      });

      return () => st.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const items = containerRef.current?.querySelectorAll(".service-card");
      if (!items || items.length === 0) return;

      gsap.set(items, { opacity: 0, y: 60, scale: 0.95, filter: "blur(6px)" });

      gsap.to(items, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        ease: "expo.out",
        duration: 0.9,
        delay: 0.1,
        stagger: { each: 0.18, from: "start" },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play reverse play reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="services text-white">
      <div className="services-cards-wrap">
        <div ref={containerRef} className="services-grid">
          {services.map((service) => (
            <div key={service.title} className="service-card metric-card">
              <div className="metric-top">
                <span className="metric-dot" />
                <p className="metric-label pointer-events-none">
                  {service.title}
                </p>
              </div>

              <div className="metric-value pointer-events-none">
                {service.value}
              </div>

              <p className="metric-note pointer-events-none">{service.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="services-header">
          <p className="services-kicker">Expertise & Services</p>

          <div className="services-intro-header">
            <h2 ref={titleRef} className="services-title">
              <span>BUILDING DIGITAL</span>
              <span>SYSTEMS THAT LAST</span>
            </h2>
          </div>

          <div className="services-intro-copy">
            <div className="services-intro-copy-wrapper">
              <h3 ref={copyRef} className="services-subtitle">
                {words.map((w, i) => (
                  <span key={i} className="services-word">
                    {w}
                    {i !== words.length - 1 ? " " : ""}
                  </span>
                ))}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
