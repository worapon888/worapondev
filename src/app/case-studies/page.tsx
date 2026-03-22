"use client";

import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import "./case-studies.css";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

type SlideItem = {
  title: string;
  desc: React.ReactNode;
  image: string;
  tag: string;
};

export default function CaseStudiesPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slideData: SlideItem[] = useMemo(
    () => [
      {
        title: "MinimalMart",
        tag: "Full-Stack / E-Commerce System",
        desc: (
          <>
            <p>
              E-commerce breaks under real load, especially during flash sales
              where hundreds of users hit the system at once. MinimalMart was
              built to solve exactly that.
            </p>
            <p>
              <strong>Inventory Reservation</strong>
              Used Redis DECR instead of the standard SQL read-then-write
              pattern. Being an atomic operation by nature, race conditions are
              impossible regardless of concurrent request volume.
            </p>
            <p>
              <strong>Payment Retry</strong>
              Exponential backoff with a dead letter queue for orders that
              exhaust all retry attempts. No order gets stuck in a limbo state.
            </p>
            <p>
              <strong>Webhook Idempotency</strong>
              Every incoming event is checked against a stored event_id with a
              unique constraint before processing, making duplicate webhook
              delivery completely safe.
            </p>
            <p>
              <strong>Stack:</strong> Next.js · NestJS · PostgreSQL · Redis ·
              Docker
            </p>
          </>
        ),
        image: "/case-studies/slider_img_4.webp",
      },
      {
        title: "TaskSync",
        tag: "Full-Stack / Productivity App",
        desc: (
          <>
            <p>
              Designed and built a productivity platform with a frontend
              architecture capable of handling real-world complexity.
            </p>
            <p>
              Multi-layer state management, task lifecycle workflows,
              drag-and-drop interactions, create/edit modals, calendar
              integration, and a component structure built to scale at
              production level.
            </p>
          </>
        ),
        image: "/case-studies/slider_img_1.webp",
      },
      {
        title: "Insightfy Dashboard",
        tag: "Frontend / Data Experience",
        desc: (
          <>
            <p>
              Designed a data-heavy dashboard with emphasis on information
              hierarchy, modular UI structure, filter and navigation
              interactions.
            </p>
            <p>
              Built with a frontend system capable of managing complex
              dashboard state alongside reusable data visualization
              components.
            </p>
          </>
        ),
        image: "/case-studies/slider_img_5.webp",
      },
      {
        title: "Luxe One",
        tag: "Brand Experience / Landing Page",
        desc: (
          <>
            <p>
              Developed a premium web experience focused on interaction system
              design, visual hierarchy, and clean frontend structure.
            </p>
            <p>
              Used reusable UI patterns and fluid motion to create an
              experience that communicates brand identity while supporting
              conversion.
            </p>
          </>
        ),
        image: "/case-studies/slider_img_3.webp",
      },
      {
        title: "Tech Futuristic Landing",
        tag: "Creative Frontend / Experimental UI",
        desc: (
          <>
            <p>
              Built an immersive landing page with a frontend system designed
              to support cinematic interactions, sequenced animation control,
              responsive motion, and directed user flow.
            </p>
            <p>
              Engineered to capture and hold attention effectively.
            </p>
          </>
        ),
        image: "/case-studies/slider_img_2.webp",
      },
    ],
    [],
  );

  const frontIndexRef = useRef(0);
  const animatingRef = useRef(false);

  const wheelAccRef = useRef(0);
  const wheelActiveRef = useRef(false);

  const touchStartYRef = useRef(0);
  const touchStartXRef = useRef(0);
  const touchActiveRef = useRef(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const slider = sliderRef.current;
    if (!container || !slider) return;

    slider.innerHTML = "";

    const buildSlideEl = (data: SlideItem) => {
      const slide = document.createElement("div");
      slide.className = "cs-slide";

      slide.innerHTML = `
        <img src="${data.image}" alt="${data.title}" class="cs-slide-image" />
        <div class="cs-slide-overlay"></div>
        <div class="cs-slide-copy">
          <p class="cs-slide-tag">${data.tag}</p>
          <h2 class="cs-slide-title">${data.title}</h2>
        </div>
      `;
      return slide;
    };

    slideData.forEach((data) => {
      slider.appendChild(buildSlideEl(data));
    });

    const slides = Array.from(
      slider.querySelectorAll(".cs-slide"),
    ) as HTMLElement[];

    slides.forEach((slide) => {
      const title = slide.querySelector(
        ".cs-slide-title",
      ) as HTMLElement | null;
      if (!title) return;
      new SplitText(title, { type: "words", mask: "words" });
    });

    const setStack = (items: HTMLElement[]) => {
      items.forEach((slide, i) => {
        const copy = slide.querySelector(".cs-slide-copy");
        gsap.set(slide, {
          y: `${i * 10}%`,
          scale: 1 - i * 0.03,
          opacity: i > 4 ? 0 : 1,
          zIndex: 20 - i,
        });
        if (copy) {
          gsap.set(copy, {
            opacity: i === 0 ? 1 : 0,
          });
        }
      });
    };

    setStack(slides);

    const animateInCopy = (slide: HTMLElement, delay = 0.25) => {
      const tag = slide.querySelector(".cs-slide-tag");
      const titleWords = slide.querySelectorAll(".cs-slide-title .word");

      if (tag) gsap.set(tag, { y: 12, opacity: 0 });
      if (titleWords.length) gsap.set(titleWords, { yPercent: 100 });

      if (tag) {
        gsap.to(tag, {
          y: 0,
          opacity: 1,
          duration: 0.45,
          ease: "power3.out",
          delay,
        });
      }

      if (titleWords.length) {
        gsap.to(titleWords, {
          yPercent: 0,
          duration: 0.7,
          ease: "power4.out",
          stagger: 0.08,
          delay: delay + 0.08,
        });
      }

    };

    if (slides[0]) animateInCopy(slides[0], 0.15);

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
      setActiveIndex(frontIndexRef.current);
      const newBackIndex = (frontIndexRef.current + 4) % slideData.length;
      const next = slideData[newBackIndex];

      const newSlide = buildSlideEl(next);

      const newTitle = newSlide.querySelector(
        ".cs-slide-title",
      ) as HTMLElement | null;
      if (newTitle) {
        new SplitText(newTitle, { type: "words", mask: "words" });
      }

      slider.appendChild(newSlide);

      gsap.set(newSlide, {
        y: "54%",
        scale: 0.84,
        opacity: 0,
        zIndex: 1,
      });

      const newCopy = newSlide.querySelector(".cs-slide-copy");
      if (newCopy) {
        gsap.set(newCopy, { opacity: 0 });
      }

      const all = Array.from(
        slider.querySelectorAll(".cs-slide"),
      ) as HTMLElement[];

      all.forEach((slide, i) => {
        const targetPos = i - 1;
        const copy = slide.querySelector(".cs-slide-copy");

        gsap.to(slide, {
          y: `${targetPos * 10}%`,
          scale: 1 - targetPos * 0.03,
          opacity: targetPos < 0 ? 0 : targetPos > 4 ? 0 : 1,
          duration: 0.9,
          ease: "power3.inOut",
          onStart: () => {
            slide.style.zIndex = String(20 - Math.max(targetPos, 0));
          },
          onComplete: () => {
            if (i === 0) {
              firstSlide?.remove();
              const updated = Array.from(
                slider.querySelectorAll(".cs-slide"),
              ) as HTMLElement[];
              updated.forEach((s, idx) => {
                s.style.zIndex = String(20 - idx);
              });
              animateInCopy(updated[0], 0.05);
              animatingRef.current = false;
            }
          },
        });

        if (copy) {
          gsap.to(copy, {
            opacity: targetPos === 0 ? 1 : 0,
            duration: 0.35,
            ease: "power2.out",
          });
        }
      });
    };

    const handleScrollUp = () => {
      const currentSlides = Array.from(
        slider.querySelectorAll(".cs-slide"),
      ) as HTMLElement[];

      const lastSlide = currentSlides[currentSlides.length - 1];

      frontIndexRef.current =
        (frontIndexRef.current - 1 + slideData.length) % slideData.length;
      setActiveIndex(frontIndexRef.current);

      const prev = slideData[frontIndexRef.current];
      const newSlide = buildSlideEl(prev);

      const newTitle = newSlide.querySelector(
        ".cs-slide-title",
      ) as HTMLElement | null;
      if (newTitle) {
        new SplitText(newTitle, { type: "words", mask: "words" });
      }

      slider.prepend(newSlide);

      gsap.set(newSlide, {
        y: "-10%",
        scale: 1.03,
        opacity: 0,
        zIndex: 21,
      });

      const newCopy = newSlide.querySelector(".cs-slide-copy");
      if (newCopy) {
        gsap.set(newCopy, { opacity: 0 });
      }

      const queue = Array.from(
        slider.querySelectorAll(".cs-slide"),
      ) as HTMLElement[];

      queue.forEach((slide, i) => {
        const copy = slide.querySelector(".cs-slide-copy");
        gsap.to(slide, {
          y: `${i * 10}%`,
          scale: 1 - i * 0.03,
          opacity: i > 4 ? 0 : 1,
          duration: 0.9,
          ease: "power3.inOut",
          onStart: () => {
            slide.style.zIndex = String(20 - i);
          },
          onComplete: () => {
            if (i === queue.length - 1) {
              lastSlide?.remove();
              const updated = Array.from(
                slider.querySelectorAll(".cs-slide"),
              ) as HTMLElement[];
              updated.forEach((s, idx) => {
                s.style.zIndex = String(20 - idx);
              });
              animateInCopy(updated[0], 0.08);
              animatingRef.current = false;
            }
          },
        });

        if (copy) {
          gsap.to(copy, {
            opacity: i === 0 ? 1 : 0,
            duration: 0.35,
            ease: "power2.out",
          });
        }
      });
    };

    const wheelThreshold = 90;

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
        }, 1000);
      }
    };

    const touchThreshold = 45;

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
        }, 1000);
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

  const activeSlide = slideData[activeIndex];
  const activeNumber = String(activeIndex + 1).padStart(2, "0");
  const totalSlides = String(slideData.length).padStart(2, "0");

  return (
    <section className="cs-page" ref={containerRef}>
      <div className="casestudies-nav">
        <div className="casestudies-logo">
          <p>Zone / Case Studies</p>
        </div>
        <div className="service-name">
          <p>Selected Work</p>
        </div>
      </div>

      <div className="cs-page-intro">
        <p className="cs-kicker">Projects & Systems</p>
        <h1 className="cs-heading">Case Studies</h1>
        <p className="cs-intro-copy">
          A selection of full-stack products, frontend systems, and digital
          experiences — presented through their purpose, structure, and
          problem-solving value.
        </p>
      </div>

      <div className="cs-reading-rail" aria-live="polite">
        <div className="cs-reading-meta">
          <p className="cs-reading-label">Now Viewing</p>
          <p className="cs-reading-count">
            {activeNumber} / {totalSlides}
          </p>
        </div>

        <div className="cs-reading-card">
          <p className="cs-reading-tag">{activeSlide.tag}</p>
          <h2 className="cs-reading-title">{activeSlide.title}</h2>
          <div className="cs-reading-desc">{activeSlide.desc}</div>
        </div>

        <p className="cs-reading-hint">Scroll or swipe to move through the work.</p>
      </div>

      <div className="cs-slider-wrap">
        <div className="cs-slider" ref={sliderRef} />
      </div>
    </section>
  );
}
