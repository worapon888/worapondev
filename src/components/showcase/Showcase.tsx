"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PinContainer } from "@/components/ui/3d-pin";
import "./Showcase.css";

gsap.registerPlugin(ScrollTrigger);

// 1. เพิ่มตัวแปร projects กลับเข้ามาก่อนฟังก์ชัน Showcase
const projects = [
  {
    title: "MinimalMart",
    description: "Immersive e-commerce concept with animation-first UI.",
    image: "/projects/Minimalmart3.webm",
    link: "https://minimart-three.vercel.app/",
  },
  {
    title: "TaskSync",
    description: "A calm, gamified task system with real-time drag & drop.",
    image: "/projects/tasksync.webm",
    link: "https://tasksync-chi.vercel.app/",
  },
  {
    title: "Insightify",
    description: "Futuristic analytics dashboard with real data hooks.",
    image: "/projects/insightify.webm",
    link: "https://insighttify-dashboard.vercel.app/",
  },
  {
    title: "Code404",
    description: "Your portal to clean code, immersive UI, and dev identity.",
    image: "/projects/code404.webm",
    link: "https://code404-five.vercel.app/",
  },
];

export default function Showcase() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const svgWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const wrap = svgWrapRef.current;
      const container = containerRef.current;

      if (!section) return;

      // ========= HEADER (FADE IN) =========
      if (container) {
        gsap.fromTo(
          container,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              once: true,
            },
          },
        );
      }

      // ========= CARDS =========
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // ========= SVG BACKGROUND (CORE LOGIC) =========
      if (!wrap) return;

      const wrapScaleX = 1.85;
      const wrapScaleY = 1.45;
      let isKilled = false;
      let svgEl: SVGSVGElement | null = null;
      let drawables: SVGGeometryElement[] = [];
      const tracerEls: SVGGeometryElement[] = []; // ใช้ const ตามคำแนะนำของ Lint
      let enterTl: gsap.core.Timeline | null = null;
      let tracerTweens: gsap.core.Tween[] = [];
      let pulseTween: gsap.core.Tween | null = null;

      const HEAD = 90;
      const GAP_MIN = 180;

      const killLoops = () => {
        tracerTweens.forEach((t) => t.kill());
        tracerTweens = [];
        pulseTween?.kill();
        pulseTween = null;
      };

      const ensureGlowFilter = (svg: SVGSVGElement) => {
        if (svg.querySelector("#__woraponGlow")) return;
        const defs =
          svg.querySelector("defs") ||
          svg.insertBefore(
            document.createElementNS("http://www.w3.org/2000/svg", "defs"),
            svg.firstChild,
          );
        const filter = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "filter",
        );
        filter.setAttribute("id", "__woraponGlow");
        filter.innerHTML = `
          <feGaussianBlur stdDeviation="4.2" result="blur"/>
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1.25 0" result="glow"/>
          <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>`;
        defs.appendChild(filter);
      };

      const build = async () => {
        if (svgEl) return;
        const res = await fetch("/texture/circuit-board.svg");
        const svgText = await res.text();
        if (isKilled) return;

        wrap.innerHTML = svgText;
        const svg = wrap.querySelector("svg");
        if (!svg) return;
        svgEl = svg;

        svg.style.cssText =
          "width:100%; height:100%; display:block; overflow:visible;";

        drawables = Array.from(
          svg.querySelectorAll<SVGGeometryElement>(
            "path, line, polyline, polygon, circle, rect, ellipse",
          ),
        ).filter(
          (el) =>
            !(
              el.tagName === "rect" &&
              (el as SVGRectElement).width.baseVal.value > 400
            ),
        );

        drawables.forEach((el) => {
          const len = el.getTotalLength();
          el.style.cssText = `fill:none; stroke:rgba(34,211,238,0.32); stroke-width:2.2; stroke-linecap:round; stroke-dasharray:${len}; stroke-dashoffset:${len};`;
        });

        ensureGlowFilter(svg);
        const tracerGroup = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g",
        );
        tracerGroup.style.filter = "url(#__woraponGlow)";

        drawables.forEach((el) => {
          const clone = el.cloneNode(true) as SVGGeometryElement;
          const len = clone.getTotalLength();
          clone.style.cssText = `fill:none; stroke:rgba(34,211,238,0.62); stroke-width:3.4; opacity:0; stroke-linecap:round; stroke-dasharray:${HEAD} ${Math.max(GAP_MIN, len)}; stroke-dashoffset:${len};`;
          tracerGroup.appendChild(clone);
          tracerEls.push(clone);
        });
        svg.appendChild(tracerGroup);
      };

      const playSequence = async () => {
        await build();
        if (isKilled || !svgEl) return;

        killLoops();
        enterTl?.kill();
        enterTl = gsap.timeline();

        // เล่น Animation เข้าครั้งแรก
        enterTl
          .to(wrap, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            scaleX: wrapScaleX,
            scaleY: wrapScaleY,
            duration: 1.2,
            ease: "power2.out",
          })
          .to(
            drawables,
            { strokeDashoffset: 0, duration: 1.7, stagger: 0.006 },
            0.15,
          )
          .to(
            tracerEls,
            { opacity: 1, duration: 0.25, stagger: 0.01 },
            "-=0.95",
          );

        // Loop วิ่งวนของ Tracer
        tracerTweens = tracerEls.map((el, i) =>
          gsap.to(el, {
            strokeDashoffset: -el.getTotalLength(),
            duration: 5.2 + (i % 7) * 0.35,
            repeat: -1,
            ease: "none",
            delay: 0.15 + (i % 9) * 0.06,
          }),
        );

        pulseTween = gsap.to(tracerEls, {
          opacity: 0.82,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: { each: 0.22, repeat: -1 },
        });
      };

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top 110%",
        onEnter: playSequence,
      });

      return () => {
        isKilled = true;
        st.kill();
        enterTl?.kill();
        killLoops();
        if (wrap) wrap.innerHTML = "";
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="showcase"
      ref={sectionRef}
      className="relative z-10 py-24 sm:py-32 mt-20 overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          ref={svgWrapRef}
          className="absolute inset-0 opacity-60"
          style={{ willChange: "transform, opacity, filter" }}
        />
      </div>

      <div className="text-center" ref={containerRef}>
        <h2 className="showcase-header">Featured Projects</h2>
        <p className="mt-5 text-[9px] md:text-[11px] tracking-[0.15em] md:tracking-[0.28em] uppercase text-white/45 max-w-[80%] md:max-w-full text-center mx-auto leading-relaxed">
          Handcrafted experiences built for the future
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 px-4 md:px-0">
        {projects.map((project, index) => (
          <div
            key={project.title}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
          >
            <PinContainer title={project.title} href={project.link}>
              <div className="flex flex-col w-[18rem] h-[20rem] bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:border-cyan-400/50 transition-all">
                <div className="flex-1 bg-black overflow-hidden">
                  <video
                    src={project.image}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-48 object-cover opacity-80"
                  />
                </div>
                <div className="p-4 text-white bg-zinc-900/40">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="text-sm text-white/70 mt-2">
                    {project.description}
                  </p>
                </div>
              </div>
            </PinContainer>
          </div>
        ))}
      </div>
    </section>
  );
}
