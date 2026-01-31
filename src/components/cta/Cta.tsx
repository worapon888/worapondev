"use client";
import "./Cta.css";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger, SplitText);

type SplitTextInstance = {
  lines?: HTMLElement[];
  revert: () => void;
};

export default function CtaSection() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let split: SplitTextInstance | null = null;

    const ctx = gsap.context(() => {
      const logo = root.querySelector(".cta-logo") as HTMLElement | null;
      const copyText = root.querySelector(
        ".cta-copy .bodyCopy",
      ) as HTMLElement | null;
      const btn = root.querySelector(".cta .btn a.btn") as HTMLElement | null;
      const rows = Array.from(
        root.querySelectorAll(".cta-row"),
      ) as HTMLElement[];

      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const run = async () => {
        // รอให้ Font โหลดเสร็จก่อนคำนวณ SplitText (จุดสำคัญที่ทำให้ Production เละ)
        if (typeof document !== "undefined" && document.fonts) {
          try {
            await document.fonts.ready;
          } catch (e) {
            console.error("Font loading failed", e);
          }
        }

        if (copyText) {
          // ใช้ SplitText.create และ cast type ให้ถูกต้อง
          const splitResult = SplitText.create(copyText, {
            type: "lines",
            linesClass: "line",
          });

          split = splitResult as unknown as SplitTextInstance;

          split.lines?.forEach((line) => {
            const mask = document.createElement("div");
            mask.className = "line-mask";
            line.parentNode?.insertBefore(mask, line);
            mask.appendChild(line);
          });

          gsap.set(split.lines ?? [], { yPercent: 100 });

          gsap.to(split.lines ?? [], {
            yPercent: 0,
            duration: prefersReduced ? 0 : 0.5,
            ease: "power1.out",
            stagger: prefersReduced ? 0 : 0.1,
            scrollTrigger: {
              trigger: root,
              start: "top 25%",
              toggleActions: "play reverse play reverse",
            },
          });
        }

        if (logo) {
          gsap.set(logo, { scale: 0 });
          gsap.to(logo, {
            scale: 1,
            duration: prefersReduced ? 0 : 0.5,
            ease: "power1.out",
            scrollTrigger: {
              trigger: root,
              start: "top 25%",
              toggleActions: "play reverse play reverse",
            },
          });
        }

        if (btn) {
          gsap.set(btn, { y: 25, opacity: 0 });
          gsap.to(btn, {
            y: 0,
            opacity: 1,
            duration: prefersReduced ? 0 : 0.5,
            ease: "power1.out",
            delay: prefersReduced ? 0 : 0.3,
            scrollTrigger: {
              trigger: root,
              start: "top 25%",
              toggleActions: "play reverse play reverse",
            },
          });
        }

        // --- คง Logic การคำนวณการเลื่อนของ Card ไว้เหมือนเดิม ---
        const leftXValues = [-800, -900, -400];
        const rightXValues = [800, 900, 400];
        const leftRotationValues = [-30, -20, -35];
        const rightRotationValues = [30, 20, 35];
        const yValues = [100, -150, -400];

        rows.forEach((row, index) => {
          const cardLeft = row.querySelector(
            ".cta-card-left",
          ) as HTMLElement | null;
          const cardRight = row.querySelector(
            ".cta-card-right",
          ) as HTMLElement | null;
          if (!cardLeft || !cardRight) return;

          const i = Math.min(index, leftXValues.length - 1);
          gsap.set([cardLeft, cardRight], { clearProps: "transform" });

          ScrollTrigger.create({
            trigger: root,
            start: "top center",
            end: "150% bottom",
            scrub: prefersReduced ? false : true,
            onUpdate: (self) => {
              const p = self.progress;
              cardLeft.style.transform = `translateX(${p * leftXValues[i]}px) translateY(${p * yValues[i]}px) rotate(${p * leftRotationValues[i]}deg)`;
              cardRight.style.transform = `translateX(${p * rightXValues[i]}px) translateY(${p * yValues[i]}px) rotate(${p * rightRotationValues[i]}deg)`;
            },
          });
        });

        // บังคับ Refresh อีกรอบเพื่อให้ ScrollTrigger คำนวณตำแหน่งจาก Layout ที่นิ่งแล้ว
        ScrollTrigger.refresh();
      };

      run();

      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }, root);

    return () => {
      if (split) {
        try {
          split.revert();
        } catch (e) {}
      }
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section ref={rootRef} className="cta">
      <div className="cta-content">
        <div className="cta-logo">
          <Image
            src="/Logo_worapon.webp"
            alt="worapon.dev"
            width={150}
            height={150}
            priority
          />
        </div>

        <div className="cta-copy">
          <p className="bodyCopy lg ">
            Already have an idea for your website? Let’s talk about how to make
            it stand out.
          </p>
        </div>

        <div className="btn">
          <a href="/contact" className="btn btn-cta">
            <span className="btn-sweep"></span>
            <span className="btn-line" />
            Start the conversation →
          </a>
        </div>
      </div>

      <div className="cta-row">
        <div className="cta-card cta-card-left">
          <div className="cta-card-frame">
            <div className="cta-card-img cta-img-wrap">
              <Image
                src="/index/cta_img_01.webp"
                alt="CTA image 01"
                fill
                sizes="(max-width: 1000px) 50vw, 50vw"
              />
            </div>
            <div className="cta-card-gradient" />
          </div>
        </div>

        <div className="cta-card cta-card-right">
          <div className="cta-card-frame">
            <div className="cta-card-img cta-img-wrap">
              <Image
                src="/index/cta_img_02.webp"
                alt="CTA image 02"
                fill
                sizes="(max-width: 1000px) 50vw, 50vw"
              />
            </div>
            <div className="cta-card-gradient" />
          </div>
        </div>
      </div>

      <div className="cta-row">
        <div className="cta-card cta-card-left">
          <div className="cta-card-frame">
            <div className="cta-card-img cta-img-wrap">
              <Image
                src="/index/cta_img_03.webp"
                alt="CTA image 03"
                fill
                sizes="(max-width: 1000px) 50vw, 50vw"
              />
            </div>
            <div className="cta-card-gradient" />
          </div>
        </div>

        <div className="cta-card cta-card-right">
          <div className="cta-card-frame">
            <div className="cta-card-img cta-img-wrap">
              <Image
                src="/index/cta_img_04.webp"
                alt="CTA image 04"
                fill
                sizes="(max-width: 1000px) 50vw, 50vw"
              />
            </div>
            <div className="cta-card-gradient" />
          </div>
        </div>
      </div>

      <div className="cta-row">
        <div className="cta-card cta-card-left">
          <div className="cta-card-frame">
            <div className="cta-card-img cta-img-wrap">
              <Image
                src="/index/cta_img_05.webp"
                alt="CTA image 05"
                fill
                sizes="(max-width: 1000px) 50vw, 50vw"
              />
            </div>
            <div className="cta-card-gradient" />
          </div>
        </div>

        <div className="cta-card cta-card-right">
          <div className="cta-card-frame">
            <div className="cta-card-img cta-img-wrap">
              <Image
                src="/index/cta_img_06.webp"
                alt="CTA image 06"
                fill
                sizes="(max-width: 1000px) 50vw, 50vw"
              />
            </div>
            <div className="cta-card-gradient" />
          </div>
        </div>
      </div>
    </section>
  );
}
