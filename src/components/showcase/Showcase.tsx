"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PinContainer } from "@/components/ui/3d-pin";
import "./Showcase.css";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "MinimalMart",
    description: "Immersive e-commerce concept with animation-first UI.",
    image: "/projects/Minimalmart3.mp4",
    link: "https://minimart-three.vercel.app/",
  },
  {
    title: "TaskSync",
    description: "A calm, gamified task system with real-time drag & drop.",
    image: "/projects/tasksync.mp4",
    link: "https://tasksync-chi.vercel.app/",
  },
  {
    title: "Insightify",
    description: "Futuristic analytics dashboard with real data hooks.",
    image: "/projects/insightify.mp4",
    link: "https://insighttify-dashboard.vercel.app/",
  },
  {
    title: "Code404",
    description: "Your portal to clean code, immersive UI, and dev identity.",
    image: "/projects/code404.mp4",
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

      // ========= HEADER: scrolltrigger intro (fade only) =========
      if (container) {
        gsap.set(container, {
          autoAlpha: 0,
          y: 30, // ขยับนิดเดียว ดูพรีเมียมกว่า fade ตรง ๆ
          willChange: "transform, opacity",
        });

        ScrollTrigger.create({
          trigger: section,
          start: "top 85%",
          once: true, // ถ้าอยากให้เล่นซ้ำ ลบอันนี้ออก
          onEnter: () => {
            gsap.to(container, {
              autoAlpha: 1,
              y: 0,
              duration: 1.2,
              ease: "power2.out",
              overwrite: true,
            });
          },
        });
      }

      // ========= CARDS: เดิมของคุณ =========
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
          }
        );
      });

      // ========= SVG BG: เดิมของคุณ =========
      if (!wrap) return;

      const wrapScaleX = 1.85;
      const wrapScaleY = 1.45;

      gsap.set(wrap, {
        autoAlpha: 0,
        y: 20,
        filter: "blur(8px)",
        scaleX: wrapScaleX * 1.03,
        scaleY: wrapScaleY * 1.03,
        transformOrigin: "50% 50%",
        willChange: "transform, filter, opacity",
      });

      let isKilled = false;

      let svgEl: SVGSVGElement | null = null;
      let drawables: SVGGeometryElement[] = [];
      let tracerEls: SVGGeometryElement[] = [];

      let enterTl: gsap.core.Timeline | null = null;
      let tracerTweens: gsap.core.Tween[] = [];
      let pulseTween: gsap.core.Tween | null = null;

      const TRACER_RATIO = 1;
      const MIN_LEN = 0;

      const HEAD = 90;
      const GAP_MIN = 180;

      const pickForTracer = (el: SVGGeometryElement, i: number) => {
        const len = el.getTotalLength();
        if (len < MIN_LEN) return false;
        if (TRACER_RATIO >= 1) return true;

        const seeded = (i * 9301 + 49297) % 233280;
        return seeded / 233280 < TRACER_RATIO;
      };

      const killLoops = () => {
        tracerTweens.forEach((t) => t.kill());
        tracerTweens = [];
        pulseTween?.kill();
        pulseTween = null;
      };

      const resetState = () => {
        if (!svgEl) return;

        drawables.forEach((el) => {
          const len = el.getTotalLength();
          el.style.strokeDasharray = `${len}`;
          el.style.strokeDashoffset = `${len}`;
        });

        tracerEls.forEach((el) => {
          const len = el.getTotalLength();
          el.style.opacity = "0";
          el.style.strokeDashoffset = `${len}`;
        });

        gsap.set(wrap, {
          autoAlpha: 0,
          y: 20,
          filter: "blur(8px)",
          scaleX: wrapScaleX * 1.03,
          scaleY: wrapScaleY * 1.03,
        });

        killLoops();
      };

      const ensureGlowFilter = (svg: SVGSVGElement) => {
        const defs =
          svg.querySelector("defs") ||
          svg.insertBefore(
            document.createElementNS("http://www.w3.org/2000/svg", "defs"),
            svg.firstChild
          );

        if (svg.querySelector("#__woraponGlow")) return;

        const filter = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "filter"
        );
        filter.setAttribute("id", "__woraponGlow");
        filter.setAttribute("x", "-80%");
        filter.setAttribute("y", "-80%");
        filter.setAttribute("width", "260%");
        filter.setAttribute("height", "260%");

        const blur = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "feGaussianBlur"
        );
        blur.setAttribute("stdDeviation", "4.2");
        blur.setAttribute("result", "blur");

        const color = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "feColorMatrix"
        );
        color.setAttribute("in", "blur");
        color.setAttribute("type", "matrix");
        color.setAttribute(
          "values",
          `
1 0 0 0 0
0 1 0 0 0
0 0 1 0 0
0 0 0 1.25 0
`
        );
        color.setAttribute("result", "glow");

        const merge = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "feMerge"
        );
        const m1 = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "feMergeNode"
        );
        m1.setAttribute("in", "glow");
        const m2 = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "feMergeNode"
        );
        m2.setAttribute("in", "SourceGraphic");
        merge.appendChild(m1);
        merge.appendChild(m2);

        filter.appendChild(blur);
        filter.appendChild(color);
        filter.appendChild(merge);
        defs.appendChild(filter);
      };

      const build = async () => {
        if (svgEl) return;

        const res = await fetch("/texture/circuit-board.svg");
        const svgText = await res.text();
        if (isKilled) return;

        wrap.innerHTML = svgText;

        const svg = wrap.querySelector("svg") as SVGSVGElement | null;
        if (!svg) return;

        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.display = "block";
        svg.style.overflow = "visible";

        svgEl = svg;

        drawables = Array.from(
          svg.querySelectorAll<SVGGeometryElement>(
            "path, line, polyline, polygon, circle, rect, ellipse"
          )
        ).filter((el) => {
          const tag = el.tagName.toLowerCase();
          if (tag === "rect") {
            const w = (el as SVGRectElement).width?.baseVal?.value ?? 0;
            const h = (el as SVGRectElement).height?.baseVal?.value ?? 0;
            if (w > 400 && h > 400) return false;
          }
          return true;
        });

        drawables.forEach((el) => {
          el.style.fill = "none";
          el.style.stroke = "rgba(34,211,238,0.32)";
          el.style.strokeWidth = "2.2";
          el.style.strokeLinecap = "round";
          el.style.strokeLinejoin = "round";

          const len = el.getTotalLength();
          el.style.strokeDasharray = `${len}`;
          el.style.strokeDashoffset = `${len}`;
        });

        ensureGlowFilter(svg);

        const tracerGroup = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "g"
        );
        tracerGroup.setAttribute("data-tracer", "1");
        tracerGroup.style.filter = "url(#__woraponGlow)";

        tracerEls = [];
        drawables.forEach((el, i) => {
          if (!pickForTracer(el, i)) return;

          const clone = el.cloneNode(true) as SVGGeometryElement;
          clone.style.fill = "none";
          clone.style.stroke = "rgba(34,211,238,0.62)";
          clone.style.strokeWidth = "3.4";
          clone.style.opacity = "0";
          clone.style.strokeLinecap = "round";
          clone.style.strokeLinejoin = "round";

          const len = clone.getTotalLength();
          const GAP = Math.max(GAP_MIN, len);
          clone.style.strokeDasharray = `${HEAD} ${GAP}`;
          clone.style.strokeDashoffset = `${len}`;

          tracerGroup.appendChild(clone);
          tracerEls.push(clone);
        });

        svg.appendChild(tracerGroup);
      };

      const playSequence = async () => {
        await build();
        if (isKilled || !svgEl) return;

        enterTl?.kill();
        killLoops();
        resetState();

        enterTl = gsap.timeline({ defaults: { ease: "none" } });

        enterTl.to(wrap, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          scaleX: wrapScaleX,
          scaleY: wrapScaleY,
          duration: 1.2,
          ease: "power2.out",
        });

        enterTl.to(
          drawables,
          {
            strokeDashoffset: 0,
            duration: 1.7,
            stagger: 0.006,
          },
          0.15
        );

        enterTl.to(
          tracerEls,
          { opacity: 1, duration: 0.25, stagger: 0.01 },
          "-=0.95"
        );

        tracerTweens = tracerEls.map((el, i) => {
          const len = el.getTotalLength();
          return gsap.to(el, {
            strokeDashoffset: -len,
            duration: 5.2 + (i % 7) * 0.35,
            repeat: -1,
            ease: "none",
            delay: 0.15 + (i % 9) * 0.06,
          });
        });

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
        end: "bottom -40%",
        onEnter: () => playSequence(),
        onEnterBack: () => playSequence(),
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
        <div ref={svgWrapRef} className="absolute inset-0 opacity-60" />
      </div>

      <div className="text-center" ref={containerRef}>
        <h2 className="showcase-header">Featured Projects</h2>
        <p className="mt-5 text-[11px] tracking-[0.28em] uppercase text-white/45">
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
                <div className="flex-1 bg-black">
                  <video
                    src={project.image}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-48 object-cover"
                  />
                </div>

                <div className="p-4 text-white">
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
