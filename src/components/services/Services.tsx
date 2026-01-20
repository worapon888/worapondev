"use client";

import { Code2, Palette, Rocket, BrainCog } from "lucide-react";
import { useRef, useLayoutEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./services.css";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const copyRef = useRef<HTMLHeadingElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ เพิ่ม ref สำหรับ title (slide)
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  const subtitleText = useMemo(
    () =>
      "From personal websites to professional business pages, I design and build websites that are clear, reliable, and tailored to your needs.",
    [],
  );

  const words = useMemo(() => subtitleText.trim().split(/\s+/), [subtitleText]);

  const services = [
    {
      title: "Immersive Web Experiences",
      value: "12",
      icon: <Code2 className="w-8 h-8 text-cyan-400" />,
    },
    {
      title: "High-Impact Landing Pages",
      value: "53",
      icon: <Rocket className="w-8 h-8 text-indigo-400" />,
    },
    {
      title: "Strategic UX/UI Design",
      value: "23",
      icon: <Palette className="w-8 h-8 text-pink-400" />,
    },
    {
      title: "Bespoke Creative Solutions",
      value: "09",
      icon: <BrainCog className="w-8 h-8 text-yellow-400" />,
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ===== 0) TITLE SLIDE (เหมือน intro-header h1 slide) =====
      const title = titleRef.current;
      if (!title) return;

      const lines = Array.from(title.querySelectorAll<HTMLElement>("span"));
      if (!lines.length) return;

      // initial (ซ่อนแล้วดันลง)
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
      // ===== 1) TEXT FILL (WORD-BY-WORD) =====
      const el = copyRef.current;
      if (!el) return;

      const wordEls = Array.from(
        el.querySelectorAll<HTMLElement>(".services-word"),
      );
      if (!wordEls.length) return;

      wordEls.forEach((w) => (w.style.color = "var(--base-300)"));

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
      // ===== 2) CARDS ENTER =====
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
      {/* ===== Cards Grid ===== */}
      <div className="services-cards-wrap">
        <div ref={containerRef} className="services-grid mt-16">
          {services.map((service) => (
            <div key={service.title} className="service-card metric-card">
              <div className="metric-top">
                <span className="metric-dot" />
                <p className="metric-label font-mono text-[11px] leading-relaxed tracking-[0.22em] text-cyan-100/45 pointer-events-none">
                  {service.title}
                </p>
              </div>

              <div className="metric-value font-mono text-cyan-100/45 pointer-events-none">
                {service.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        {/* ===== Header ===== */}
        <div className="services-header">
          <p className="services-kicker">Expertise & Services</p>

          <div className="services-intro-header">
            {/* ✅ ใส่ ref ตรงนี้ */}
            <h2 ref={titleRef} className="services-title">
              <span>BUILDING WEBSITES</span>
              <span>THAT WORK</span>
            </h2>
          </div>

          {/* ===== Intro Copy (Text Fill on Scroll) ===== */}
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
