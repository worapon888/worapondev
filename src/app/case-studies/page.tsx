"use client";

import React, { useLayoutEffect, useMemo, useRef } from "react";
import "./case-studies.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

type SlideItem = { title: string; desc: string; image: string };

export default function CaseStudiesPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const slideData: SlideItem[] = useMemo(
    () => [
      {
        title: "TaskSync",
        desc: "A self-reflective task system focused on energy, not pressure",
        image: "/case-studies/slider_img_1.webp",
      },
      {
        title: "Tech Futuristic Landing",
        desc: "Exploring cinematic motion as a communication layer",
        image: "/case-studies/slider_img_2.webp",
      },
      {
        title: "Luxe One",
        desc: "Luxury product experience driven by mood and visual hierarchy",
        image: "/case-studies/slider_img_3.webp",
      },
      {
        title: "Minimal Mart",
        desc: "Designing a calm e-commerce flow with reduced cognitive load",
        image: "/case-studies/slider_img_4.webp",
      },
      {
        title: "Insightfy Dashboard",
        desc: "Turning complex analytics into intuitive visual narratives",
        image: "/case-studies/slider_img_5.webp",
      },
    ],
    [],
  );

  // state refs (ไม่ให้ rerender)
  const frontIndexRef = useRef(0);
  const animatingRef = useRef(false);

  // wheel/touch accumulator refs
  const wheelAccRef = useRef(0);
  const wheelActiveRef = useRef(false);

  const touchStartYRef = useRef(0);
  const touchStartXRef = useRef(0);
  const touchActiveRef = useRef(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const slider = sliderRef.current;
    if (!container || !slider) return;

    // clear
    slider.innerHTML = "";

    // helper: build slide
    const buildSlideEl = (data: SlideItem) => {
      const slide = document.createElement("div");
      slide.className = "cs-slide";
      slide.innerHTML = `
        <img src="${data.image}" alt="${data.title}" class="cs-slide-image" />
        <h1 class="cs-slide-title">${data.title}</h1>
        <p class="cs-slide-desc">${data.desc}</p>
      `;
      return slide;
    };

    // init slides
    slideData.forEach((data) => {
      slider.appendChild(buildSlideEl(data));
    });

    const slides = Array.from(
      slider.querySelectorAll(".cs-slide"),
    ) as HTMLElement[];

    // split titles (only title)
    slides.forEach((slide) => {
      const title = slide.querySelector(
        ".cs-slide-title",
      ) as HTMLElement | null;
      if (!title) return;
      new SplitText(title, { type: "words", mask: "words" });
    });

    // set initial stack
    slides.forEach((slide, i) => {
      gsap.set(slide, {
        y: -15 + 15 * i + "%", // stack spacing
        z: 15 * i,
        opacity: 1,
      });
    });

    // --- logic ---
    const handleSlideChange = (direction: "down" | "up") => {
      if (animatingRef.current) return;
      animatingRef.current = true;

      if (direction === "down") handleScrollDown();
      else handleScrollUp();
    };

    const handleScrollDown = () => {
      const currentSlides = Array.from(
        slider.querySelectorAll(".cs-slide"),
      ) as HTMLElement[];
      const firstSlide = currentSlides[0];

      frontIndexRef.current = (frontIndexRef.current + 1) % slideData.length;

      const newBackIndex = (frontIndexRef.current + 4) % slideData.length;
      const next = slideData[newBackIndex];

      const newSlide = buildSlideEl(next);

      // SplitText for new title
      const newTitle = newSlide.querySelector(
        ".cs-slide-title",
      ) as HTMLElement | null;
      let split: SplitText | null = null;

      if (newTitle) {
        split = new SplitText(newTitle, { type: "words", mask: "words" });
        gsap.set(split.words, { yPercent: 100 });
      }

      // desc in
      const newDesc = newSlide.querySelector(
        ".cs-slide-desc",
      ) as HTMLElement | null;
      if (newDesc) gsap.set(newDesc, { y: 10, opacity: 0 });

      slider.appendChild(newSlide);

      gsap.set(newSlide, {
        y: -15 + 15 * 5 + "%", // 6th position
        z: 15 * 5,
        opacity: 0,
      });

      const all = Array.from(
        slider.querySelectorAll(".cs-slide"),
      ) as HTMLElement[];

      all.forEach((slide, i) => {
        const targetPos = i - 1;

        gsap.to(slide, {
          y: -15 + 15 * targetPos + "%",
          z: 15 * targetPos,
          opacity: targetPos < 0 ? 0 : 1,
          duration: 1,
          ease: "power3.inOut",
          onComplete: () => {
            if (i === 0) {
              firstSlide?.remove();
              animatingRef.current = false;
            }
          },
        });
      });

      if (split) {
        gsap.to(split.words, {
          yPercent: 0,
          duration: 0.75,
          ease: "power4.out",
          stagger: 0.12,
          delay: 0.45,
        });
      }

      if (newDesc) {
        gsap.to(newDesc, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.55,
        });
      }
    };

    const handleScrollUp = () => {
      const currentSlides = Array.from(
        slider.querySelectorAll(".cs-slide"),
      ) as HTMLElement[];
      const lastSlide = currentSlides[currentSlides.length - 1];

      frontIndexRef.current =
        (frontIndexRef.current - 1 + slideData.length) % slideData.length;

      const prev = slideData[frontIndexRef.current];

      const newSlide = buildSlideEl(prev);

      // SplitText for new title
      const newTitle = newSlide.querySelector(
        ".cs-slide-title",
      ) as HTMLElement | null;
      if (newTitle) new SplitText(newTitle, { type: "words", mask: "words" });

      // desc in
      const newDesc = newSlide.querySelector(
        ".cs-slide-desc",
      ) as HTMLElement | null;
      if (newDesc) gsap.set(newDesc, { y: 10, opacity: 0 });

      slider.prepend(newSlide);

      gsap.set(newSlide, {
        y: -15 + 15 * -1 + "%", // above stack
        z: 15 * -1,
        opacity: 0,
      });

      const queue = Array.from(
        slider.querySelectorAll(".cs-slide"),
      ) as HTMLElement[];

      queue.forEach((slide, i) => {
        const targetPos = i;

        gsap.to(slide, {
          y: -15 + 15 * targetPos + "%",
          z: 15 * targetPos,
          opacity: targetPos > 4 ? 0 : 1,
          duration: 1,
          ease: "power3.inOut",
          onComplete: () => {
            if (i === queue.length - 1) {
              lastSlide?.remove();
              animatingRef.current = false;
            }
          },
        });
      });

      if (newDesc) {
        gsap.to(newDesc, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.35,
        });
      }
    };

    // --- events ---
    const wheelThreshold = 100;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (animatingRef.current || wheelActiveRef.current) return;

      wheelAccRef.current += Math.abs(e.deltaY);

      if (wheelAccRef.current >= wheelThreshold) {
        wheelActiveRef.current = true;
        wheelAccRef.current = 0;

        const direction: "down" | "up" = e.deltaY > 0 ? "down" : "up";
        handleSlideChange(direction);

        window.setTimeout(() => {
          wheelActiveRef.current = false;
        }, 1200);
      }
    };

    const touchThreshold = 50;

    const onTouchStart = (e: TouchEvent) => {
      if (animatingRef.current || touchActiveRef.current) return;
      touchStartYRef.current = e.touches[0].clientY;
      touchStartXRef.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (animatingRef.current || touchActiveRef.current) return;

      const endY = e.changedTouches[0].clientY;
      const endX = e.changedTouches[0].clientX;

      const deltaY = touchStartYRef.current - endY;
      const deltaX = Math.abs(touchStartXRef.current - endX);

      if (Math.abs(deltaY) > deltaX && Math.abs(deltaY) > touchThreshold) {
        touchActiveRef.current = true;
        const direction: "down" | "up" = deltaY > 0 ? "down" : "up";
        handleSlideChange(direction);

        window.setTimeout(() => {
          touchActiveRef.current = false;
        }, 1200);
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);

      slider.innerHTML = "";
      animatingRef.current = false;
      wheelActiveRef.current = false;
      touchActiveRef.current = false;
      wheelAccRef.current = 0;
    };
  }, [slideData]);

  return (
    <section className="cs-page" ref={containerRef}>
      {/* TOP HUD */}
      <div className="casestudies-nav">
        <div className="casestudies-logo">
          <p>Zone / casestudies</p>
        </div>
        <div className="service-name">
          <p>Motion landing</p>
        </div>
      </div>

      {/* Slider Stage */}
      <div className="cs-slider" ref={sliderRef} />
    </section>
  );
}
