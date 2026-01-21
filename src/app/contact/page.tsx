"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import gsap from "gsap";

// --- Types ---
type FaqItem = {
  id: string;
  title: string;
  body?: string;
};

type TypewriterOpts = {
  typeSpeed?: number;
  endHoldMs?: number;
  repeatDelayMs?: number;
  glitchChance?: number;
  glitchChars?: string;
};

interface FaqItemCardProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  panelRef: (el: HTMLDivElement | null) => void;
  chevRef: (el: HTMLSpanElement | null) => void;
}

// --- Logic: Typewriter Hook ---
function useTypewriterLoop(
  enabled: boolean,
  text: string,
  opts: TypewriterOpts,
) {
  const {
    typeSpeed = 40,
    endHoldMs = 1400,
    repeatDelayMs = 2500,
    glitchChance = 0.1,
    glitchChars = "01<>/\\[]{}—_+*#@!?",
  } = opts;

  const [out, setOut] = useState(text);
  const state = useRef({ running: false, raf: 0, t1: 0, t2: 0 });

  const clear = useCallback((currentState: typeof state.current) => {
    cancelAnimationFrame(currentState.raf);
    clearTimeout(currentState.t1);
    clearTimeout(currentState.t2);
  }, []);

  const runOnce = useCallback(
    () =>
      new Promise<void>((resolve) => {
        const currentState = state.current;
        clear(currentState);
        currentState.running = true;
        let i = 0,
          last = 0;
        setOut("");

        const tick = (now: number) => {
          if (!currentState.running) return;
          if (now - last < typeSpeed) {
            currentState.raf = requestAnimationFrame(tick);
            return;
          }
          last = now;
          i = Math.min(text.length, i + 1);
          const next =
            i < text.length && Math.random() < glitchChance
              ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
              : "";
          setOut(text.slice(0, i) + next);

          if (i < text.length) {
            currentState.raf = requestAnimationFrame(tick);
          } else {
            setOut(text);
            currentState.t1 = window.setTimeout(resolve, endHoldMs);
            currentState.running = false;
          }
        };
        currentState.raf = requestAnimationFrame(tick);
      }),
    [text, typeSpeed, glitchChance, glitchChars, endHoldMs, clear],
  );

  useLayoutEffect(() => {
    if (!enabled) return;
    let isMounted = true;
    const currentState = state.current; // Copy ref value here

    const loop = async () => {
      while (isMounted && enabled) {
        await runOnce();
        await new Promise(
          (r) => (currentState.t2 = window.setTimeout(r, repeatDelayMs)),
        );
      }
    };
    loop();

    return () => {
      isMounted = false;
      currentState.running = false;
      clear(currentState); // Use the copied value
      setOut(text);
    };
  }, [enabled, text, repeatDelayMs, runOnce, clear]);

  return out;
}

// --- Main Component ---
export default function ContactPage() {
  const FAQ_DATA: FaqItem[] = useMemo(
    () => [
      {
        id: "suitable-projects",
        title: "Is this service suitable for small or simple websites?",
        body: "Yes. I work on both minimal websites and immersive experiences.",
      },
      {
        id: "budget-range",
        title: "What is the typical project budget range?",
        body: "Budgets vary depending on scope and complexity.",
      },
      {
        id: "process",
        title: "How does the collaboration process work?",
        body: "Each project begins with a discussion to clarify goals.",
      },
      {
        id: "timeline",
        title: "How long does a project usually take?",
        body: "Most projects are completed within a few weeks.",
      },
      {
        id: "revisions",
        title: "How many revisions are included?",
        body: "Revisions are included within the agreed scope.",
      },
      {
        id: "portfolio",
        title: "Where can I see your previous work?",
        body: "You can explore selected projects in the Case Studies section.",
      },
      {
        id: "contact",
        title: "How do I get in touch?",
        body: "Use the form to send your message.",
      },
    ],
    [],
  );

  const [openId, setOpenId] = useState<string>("suitable-projects");
  const [heroActive, setHeroActive] = useState(false);

  const panelRefs = useRef<Record<string, HTMLElement | null>>({});
  const chevRefs = useRef<Record<string, HTMLElement | null>>({});

  const prefersReduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
    [],
  );

  const heroTyped = useTypewriterLoop(
    heroActive && !prefersReduced,
    "Initiate Contact",
    { typeSpeed: 46, endHoldMs: 1200, repeatDelayMs: 2600, glitchChance: 0 },
  );

  useEffect(() => {
    setHeroActive(true);
  }, []);

  // GSAP: Initial State
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      FAQ_DATA.forEach(({ id }) => {
        const isOpen = id === openId;
        const panel = panelRefs.current[id];
        const chev = chevRefs.current[id];
        if (panel)
          gsap.set(panel, {
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          });
        if (chev) gsap.set(chev, { rotate: isOpen ? 45 : -45 });
      });
    });
    return () => ctx.revert();
  }, [FAQ_DATA, openId]); // Added dependencies

  const toggle = (id: string) => {
    const isClosing = id === openId;
    const nextId = isClosing ? "" : id;

    if (openId && panelRefs.current[openId]) {
      gsap.to(panelRefs.current[openId], {
        height: 0,
        opacity: 0,
        duration: 0.45,
        ease: "power3.out",
      });
      gsap.to(chevRefs.current[openId], { rotate: -45, duration: 0.35 });
    }

    if (!isClosing && panelRefs.current[id]) {
      gsap.fromTo(
        panelRefs.current[id],
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.55, ease: "power3.out" },
      );
      gsap.to(chevRefs.current[id], { rotate: 45, duration: 0.4 });
    }

    setOpenId(nextId);
  };

  return (
    <main className="contact-page">
      <section className="hero contact-hero">
        <div className="contact-hero-clip">
          <div className="contact-hero-bg" />
        </div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="container">
              <div className="hero-content-footer">
                <div className="hero-content-header">
                  <h3>
                    {prefersReduced ? "Initiate Contact" : heroTyped}
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
            <div className="contact-form-col">
              <div className="contact-form-header">
                <h3>Initiate a Transmission</h3>
                <p className="contact-desc">
                  Use this channel regarding projects.
                </p>
              </div>
            </div>
            <div className="contact-form-col">
              <InputGroup />
              <div className="form-item">
                <a className="contact-submit" href="#">
                  <span className="btn-line" />
                  Send Message
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-container">
        <div className="container">
          <div className="faq-header">
            <h3>Frequently Asked Questions</h3>
          </div>
          <div className="faq-wrapper">
            {FAQ_DATA.map((item) => (
              <FaqItemCard
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => toggle(item.id)}
                panelRef={(el) => {
                  panelRefs.current[item.id] = el;
                }}
                chevRef={(el) => {
                  chevRefs.current[item.id] = el;
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const InputGroup = () => (
  <>
    <div className="form-item">
      <input type="text" placeholder="Your Name" />
    </div>
    <div className="form-item">
      <input type="text" placeholder="Email" />
    </div>
    <div className="form-item">
      <textarea rows={6} placeholder="Details" />
    </div>
  </>
);

const FaqItemCard = ({
  item,
  isOpen,
  onToggle,
  panelRef,
  chevRef,
}: FaqItemCardProps) => (
  <div className={`faq-item ${isOpen ? "is-open" : ""}`}>
    <button
      type="button"
      className="faq-trigger"
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      <h4>{item.title}</h4>
      <span className="faq-chevron" ref={chevRef} aria-hidden="true" />
    </button>
    <div className="faq-panel" ref={panelRef}>
      {item.body && <p className="bodyCopy">{item.body}</p>}
    </div>
  </div>
);
