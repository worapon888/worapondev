"use client";

import { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import confetti from "canvas-confetti";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const formRef = useRef<HTMLDivElement>(null);
  const [showCongrats, setShowCongrats] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const triggerConfetti = () => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 1000,
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        ...defaults,
        particleCount: 3,
        origin: {
          x: Math.random(),
          y: Math.random() - 0.2,
        },
      });
    }, 200);
  };
  // ✅ Animate form container on scroll
  useEffect(() => {
    if (!formRef.current) return;

    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 60, filter: "blur(6px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 85%",
          toggleActions: "play reverse play reverse",
        },
      }
    );
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    emailjs
      .send(
        "service_7w851wt",
        "template_ctmiw2a",
        formData,
        "sFcgMAbWiZPsmKL7u"
      )
      .then(
        () => {
          setShowCongrats(true);
          triggerConfetti();
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          console.error(error);
          alert("Failed to send.");
        }
      );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="py-24 sm:py-32 text-white">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Get in Touch
        </h2>
        <p className="mt-4 text-lg text-gray-400">
          Ready to start your next project? Let&apos;s talk.
        </p>
      </div>

      {/* ✅ apply ref here */}
      <div
        ref={formRef}
        className="mx-auto mt-16 max-w-xl rounded-2xl bg-white/5 p-8 border border-white/10 backdrop-blur-md shadow-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* input fields */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-300"
            >
              Message
            </label>
            <textarea
              name="message"
              id="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
              placeholder="Write your message here..."
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full cursor-pointer rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black shadow-md transition-all hover:shadow-[0_0_20px_rgba(255, 255, 255, 0.3)] hover:bg-slate-300"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
      {showCongrats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="relative max-w-md w-full rounded-xl border border-white/10 bg-white/5 px-8 py-10 text-center shadow-[0_0_40px_rgba(0,255,255,0.1)] backdrop-blur-md"
          >
            <h3 className="text-2xl font-bold text-white drop-shadow-sm">
              🎉 Message Sent!
            </h3>
            <p className="mt-3 text-gray-300 text-sm">
              Thank you for reaching out. I’ll get back to you shortly.
            </p>
            <button
              onClick={() => setShowCongrats(false)}
              className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-md bg-cyan-400 px-5 py-2 text-sm font-semibold text-white hover:bg-cyan-400/80 transition-all duration-300 shadow-md hover:shadow-cyan-500/30"
            >
              Close
            </button>

            {/* decorative glowing ring */}
            <div className="absolute -inset-1 rounded-xl border border-cyan-300/10 blur-[2px] opacity-20 pointer-events-none" />
          </div>
        </div>
      )}
    </section>
  );
}
