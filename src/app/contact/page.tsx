"use client";

import React, { useEffect, useMemo, useState } from "react";
import "./contact.css";

import FaqItemCard from "./components/FaqItemCard";
import { useTypewriterLoop } from "./hooks/useTypewriterLoop";
import { useFaqAccordion } from "./components/useFaqAccordion";
import { FAQ_DATA } from "@/types/contact";
import type {
  ContactPayload,
  Status,
  FaqId,
  ContactApiResponse,
} from "@/types/contact";

const EMPTY_FORM: ContactPayload = {
  name: "",
  email: "",
  message: "",
  website: "",
};

function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export default function ContactPage() {
  const faqData = useMemo(() => FAQ_DATA, []);
  const [openId, setOpenId] = useState<FaqId | "">("suitable-projects");

  const [heroActive, setHeroActive] = useState(false);

  // ✅ controlled form state
  const [form, setForm] = useState<ContactPayload>(EMPTY_FORM);

  // ✅ confirm modal
  const [showConfirm, setShowConfirm] = useState(false);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const prefersReduced = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
    );
  }, []);

  const heroTyped = useTypewriterLoop(
    heroActive && !prefersReduced,
    "Initiate Contact",
    { typeSpeed: 46, endHoldMs: 1200, repeatDelayMs: 2600, glitchChance: 0 },
  );

  useEffect(() => setHeroActive(true), []);

  const { panelRefs, chevRefs, toggle } = useFaqAccordion(faqData, openId);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const closeConfirm = () => {
    setShowConfirm(false);
    setStatus("idle"); // ✅ ให้ส่งซ้ำได้
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (status === "sending") return;

    setStatus("sending");
    setErrorMsg("");

    const payload: ContactPayload = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      website: (form.website ?? "").trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus("err");
      setErrorMsg("Please fill in name, email, and message.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      const data = safeJsonParse<ContactApiResponse>(text);

      console.log("CONTACT SUBMIT:", res.status, data);

      if (!res.ok) {
        setStatus("err");
        const msg =
          data && "error" in data ? data.error : `Send failed (${res.status})`;

        setErrorMsg(msg);
        return;
      }

      // ✅ success
      setStatus("ok");
      setForm(EMPTY_FORM); // ✅ reset controlled inputs ถูกวิธี
      setShowConfirm(true); // ✅ เปิด modal
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // dev / HMR / fast refresh case
        setStatus("ok");
        setForm(EMPTY_FORM);
        setShowConfirm(true);
        return;
      }

      console.error("CONTACT FETCH ERROR:", err);

      setStatus("err");
      setErrorMsg("Network error. Please try again.");
    }
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

            <form className="contact-form-col" onSubmit={onSubmit}>
              <div className="form-item">
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Your Name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-item">
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Email"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="form-item">
                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  rows={6}
                  placeholder="Details"
                  required
                />
              </div>

              {/* honeypot */}
              <input
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                name="website"
                value={form.website ?? ""}
                onChange={onChange}
                aria-hidden="true"
              />

              <div className="form-item">
                <button
                  className="contact-submit"
                  type="submit"
                  disabled={status === "sending"}
                >
                  <span className="btn-line" />
                  {status === "sending" ? "Sending..." : "Send Message"}
                </button>

                {status === "err" && (
                  <p className="form-error" role="alert">
                    {errorMsg}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="faq-container">
        <div className="container">
          <div className="faq-header">
            <h3>Frequently Asked Questions</h3>
          </div>

          <div className="faq-wrapper">
            {faqData.map((item) => (
              <FaqItemCard
                key={item.id}
                item={item}
                isOpen={openId === item.id}
                onToggle={() => toggle(item.id, setOpenId)}
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

      {/* ✅ SCI-FI CONFIRM MODAL */}
      {showConfirm && (
        <div className="confirm-overlay" role="dialog" aria-modal="true">
          <div className="confirm-panel">
            <p className="confirm-eyebrow">SYSTEM RESPONSE</p>
            <h4 className="confirm-title">TRANSMISSION RECEIVED</h4>
            <p className="confirm-desc">
              Your message has been successfully delivered.
              <br />I typically respond within 24–48 hours.
            </p>

            <button className="confirm-btn" onClick={closeConfirm}>
              CONFIRM
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
