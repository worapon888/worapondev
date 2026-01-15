"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";

type FaqItem = {
  id: string;
  title: string;
  body?: string;
};

/* ===============================
   Typewriter Hook (inline)
   - ยกมาจาก Footer ของคุณ
================================ */
type TypewriterOpts = {
  typeSpeed?: number; // ms ต่อ 1 ตัว
  endHoldMs?: number; // ค้างหลังพิมพ์จบก่อนวนรอบ
  repeatDelayMs?: number; // เว้นก่อนเริ่มรอบใหม่
  glitchChance?: number; // 0..1
  glitchChars?: string;
};

function useTypewriterLoop(
  enabled: boolean,
  text: string,
  opts: TypewriterOpts
) {
  const {
    typeSpeed = 40,
    endHoldMs = 1400,
    repeatDelayMs = 2500,
    glitchChance = 0.1,
    glitchChars = "01<>/\\[]{}—_+*#@!?",
  } = opts;

  const [out, setOut] = useState(text); // default = ของจริง (กัน flash)
  const runningRef = useRef(false);
  const rafRef = useRef<number>(0);
  const t1Ref = useRef<number>(0);
  const t2Ref = useRef<number>(0);

  const randChar = () =>
    glitchChars[Math.floor(Math.random() * glitchChars.length)];

  const clearTimers = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;

    if (t1Ref.current) window.clearTimeout(t1Ref.current);
    if (t2Ref.current) window.clearTimeout(t2Ref.current);
    t1Ref.current = 0;
    t2Ref.current = 0;
  };

  const stop = () => {
    runningRef.current = false;
    clearTimers();
  };

  const runOnce = () =>
    new Promise<void>((resolve) => {
      stop();
      runningRef.current = true;

      const final = text ?? "";
      const len = final.length;

      let i = 0;
      let last = 0;

      // เริ่มจากว่าง
      setOut("");

      const tick = (now: number) => {
        if (!runningRef.current) return;

        if (now - last < typeSpeed) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        last = now;

        i = Math.min(len, i + 1);

        const next = i < len && Math.random() < glitchChance ? randChar() : "";
        setOut(final.slice(0, i) + next);

        if (i < len) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          // จบ: เซ็ตของจริงชัวร์
          setOut(final);

          // ค้างหลังพิมพ์จบ
          t1Ref.current = window.setTimeout(() => {
            resolve();
          }, endHoldMs);

          runningRef.current = false;
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    });

  const loop = async () => {
    if (!enabled) return;

    // loop แบบนุ่ม ๆ
    while (enabled && !runningRef.current) {
      await runOnce();

      // เว้นก่อนเริ่มรอบใหม่
      await new Promise<void>((r) => {
        t2Ref.current = window.setTimeout(() => r(), repeatDelayMs);
      });

      // กันหลุด enabled ระหว่างรอ
      if (!enabled) break;
    }
  };

  useLayoutEffect(() => {
    if (!enabled) return;

    stop();
    loop();

    return () => {
      stop();
      setOut(text); // กลับเป็น text จริงกันค้าง
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    enabled,
    text,
    typeSpeed,
    endHoldMs,
    repeatDelayMs,
    glitchChance,
    glitchChars,
  ]);

  return out;
}

export default function ContactPage() {
  const FAQ_DATA: FaqItem[] = useMemo(
    () => [
      {
        id: "suitable-projects",
        title: "Is this service suitable for small or simple websites?",
        body: `Yes. I work on both minimal websites and immersive experiences.
Each project is scoped based on your goals, requirements, and budget,
so you don’t need a large or complex brief to get started.`,
      },
      {
        id: "budget-range",
        title: "What is the typical project budget range?",
        body: `Budgets vary depending on scope and complexity.
Projects usually start from a defined baseline and scale upward
based on features, interaction level, and overall requirements.`,
      },
      {
        id: "process",
        title: "How does the collaboration process work?",
        body: `Each project begins with a discussion to clarify goals, scope, and timeline.
Design and development are handled in structured phases with clear checkpoints
to ensure alignment throughout the process.`,
      },
      {
        id: "timeline",
        title: "How long does a project usually take?",
        body: `Most projects are completed within a few weeks.
More complex or experimental work may require additional time,
which will be discussed in advance.`,
      },
      {
        id: "revisions",
        title: "How many revisions are included?",
        body: `Revisions are included within the agreed scope.
Significant changes beyond the original direction may be discussed separately
to keep the project timeline and quality on track.`,
      },
      {
        id: "portfolio",
        title: "Where can I see your previous work?",
        body: `You can explore selected projects in the Case Studies section,
or browse experimental work and visual explorations throughout the site.`,
      },
      {
        id: "contact",
        title: "How do I get in touch or start a conversation?",
        body: `Use the communication form to send your message.
Once a stable connection is established, you will receive a response
through the same channel.`,
      },
    ],
    []
  );

  // ✅ ของเดิม "open-channel" ไม่มีใน FAQ_DATA แล้ว
  const [openId, setOpenId] = useState<string>("suitable-projects");

  // refs เก็บ DOM ของ panel + chevron
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const chevronRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  // ===============================
  // HERO typewriter (เฉพาะ Initiate Contact)
  // ===============================
  const heroText = "Initiate Contact";
  const [heroActive, setHeroActive] = useState(false);

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const heroTyped = useTypewriterLoop(heroActive && !prefersReduced, heroText, {
    typeSpeed: 46,
    endHoldMs: 1200,
    repeatDelayMs: 2600,
    glitchChance: 0, // ✅ header อ่านง่าย
    glitchChars: "01<>/\\[]{}—_+*#@!?",
  });

  useEffect(() => {
    setHeroActive(true);
  }, []);

  // ✅ ตั้งค่าเริ่มต้น (เปิดอันเดียว) แบบไม่กระพริบ
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      FAQ_DATA.forEach((item) => {
        const panel = panelRefs.current[item.id];
        const chev = chevronRefs.current[item.id];
        if (!panel) return;

        if (item.id === openId) {
          gsap.set(panel, { height: "auto", opacity: 1 });
          if (chev) gsap.set(chev, { rotate: 45 });
        } else {
          gsap.set(panel, { height: 0, opacity: 0 });
          if (chev) gsap.set(chev, { rotate: -45 });
        }
      });
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id: string) => {
    if (id === openId) {
      const panel = panelRefs.current[id];
      const chev = chevronRefs.current[id];
      if (!panel) return;

      gsap.to(panel, {
        height: 0,
        opacity: 0,
        duration: 0.45,
        ease: "power3.out",
      });
      if (chev)
        gsap.to(chev, { rotate: -45, duration: 0.35, ease: "power3.out" });

      setOpenId("");
      return;
    }

    if (openId) {
      const prevPanel = panelRefs.current[openId];
      const prevChev = chevronRefs.current[openId];

      if (prevPanel) {
        gsap.to(prevPanel, {
          height: 0,
          opacity: 0,
          duration: 0.45,
          ease: "power3.out",
        });
      }
      if (prevChev) {
        gsap.to(prevChev, { rotate: -45, duration: 0.35, ease: "power3.out" });
      }
    }

    const panel = panelRefs.current[id];
    const chev = chevronRefs.current[id];

    if (panel) {
      gsap.fromTo(
        panel,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.55, ease: "power3.out" }
      );
    }
    if (chev) {
      gsap.to(chev, { rotate: 45, duration: 0.4, ease: "power3.out" });
    }

    setOpenId(id);
  };

  return (
    <>
      <main className="contact-page">
        {/* HERO */}
        <section className="hero contact-hero">
          <div className="contact-hero-clip">
            <div className="contact-hero-bg" />
          </div>

          <div className="hero-container">
            <div className="hero-img-container" />

            <div className="hero-content">
              <div className="container">
                <div className="hero-content-footer">
                  <div className="hero-content-header">
                    <h3 data-typing={heroActive ? "1" : "0"}>
                      {prefersReduced ? heroText : heroTyped}
                      <span className="typing-cursor" aria-hidden="true">
                        |
                      </span>
                    </h3>
                  </div>

                  <div className="hero-callout">
                    <p>LINK ESTABLISHED / 03.221</p>
                    <p>AWAITING YOUR TRANSMISSION</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT FORM */}
        <section className="contact-form">
          <div className="container">
            <div className="contact-form-bg-wrapper">
              <div className="contact-form-bg" />
            </div>

            <div className="contact-form-row">
              <p>Communication Channel</p>
              <p>Send a message to discuss your project</p>
            </div>

            <div className="contact-form-row">
              {/* LEFT */}
              <div className="contact-form-col">
                <div className="contact-form-header">
                  <h3>Initiate a Transmission</h3>
                  <p className="contact-desc">
                    Use this channel to get in touch regarding projects or
                    inquiries. Messages are reviewed once a stable connection is
                    established.
                  </p>
                </div>

                <div className="contact-form-availability">
                  <p>Channel Open for Project Inquiries</p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="contact-form-col">
                <div className="form-item">
                  <input type="text" placeholder="Your Name / Identification" />
                </div>

                <div className="form-item">
                  <input type="text" placeholder="Contact Address (Email)" />
                </div>

                <div className="form-item">
                  <textarea rows={6} placeholder="Transmission Details" />
                </div>

                <div className="form-item">
                  <a className="contact-submit" href="#">
                    <span className="btn-line" aria-hidden="true"></span>
                    Send Message
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq-container">
          <div className="container">
            <div className="faq-header">
              <h3>Frequently Asked Questions</h3>
            </div>

            <div className="faq-wrapper">
              {FAQ_DATA.map((item) => {
                const isOpen = item.id === openId;

                return (
                  <div
                    key={item.id}
                    className={`faq-item${isOpen ? " is-open" : ""}`}
                  >
                    <button
                      type="button"
                      className="faq-trigger"
                      onClick={() => toggle(item.id)}
                      aria-expanded={isOpen}
                    >
                      <h4>{item.title}</h4>

                      <span
                        className="faq-chevron"
                        ref={(el) => {
                          chevronRefs.current[item.id] = el;
                        }}
                        aria-hidden="true"
                      />
                    </button>

                    <div
                      className="faq-panel"
                      ref={(el) => {
                        panelRefs.current[item.id] = el;
                      }}
                    >
                      {item.body ? (
                        <p className="bodyCopy">{item.body}</p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
