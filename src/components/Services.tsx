"use client";

import { Code2, Palette, Rocket, Globe, Bot, BrainCog } from "lucide-react";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const containerRef = useRef<HTMLDivElement>(null);

  const services = [
    {
      title: "Immersive Web Experiences",
      description:
        "Build futuristic websites with smooth animations, interactive 3D, and storytelling that captivates your audience.",
      icon: <Code2 className="w-8 h-8 text-cyan-400" />,
    },
    {
      title: "UX/UI Design That Resonates",
      description:
        "Design user journeys that are both beautiful and intuitive — tailored for real-world users, not just trends.",
      icon: <Palette className="w-8 h-8 text-pink-400" />,
    },
    {
      title: "High-Impact Landing Pages",
      description:
        "Convert visitors into clients with clean layouts, strong messaging, and optimized page speed.",
      icon: <Rocket className="w-8 h-8 text-indigo-400" />,
    },
    {
      title: "Showcase & Personal Portfolios",
      description:
        "Craft developer and artist portfolios that stand out in seconds — elegant, minimal, and truly personal.",
      icon: <Globe className="w-8 h-8 text-emerald-400" />,
    },
    {
      title: "AI-Driven Productivity Tools",
      description:
        "Turn your vision into real SaaS tools. From task boards to reflective AI apps — build it with clarity and care.",
      icon: <Bot className="w-8 h-8 text-violet-400" />,
    },
    {
      title: "Creative Dev Solutions",
      description:
        "From concept to code — get bespoke interactive builds that defy the ordinary and spark curiosity.",
      icon: <BrainCog className="w-8 h-8 text-yellow-400" />,
    },
  ];

  useEffect(() => {
    const items = containerRef.current?.querySelectorAll(".service-card");
    if (items) {
      gsap.fromTo(
        items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play reverse play reverse", // ✅ เล่นซ้ำตอน scroll ย้อนกลับ
            markers: false, // เปิดเป็น true ได้ถ้าอยาก debug
          },
        }
      );
    }
  }, []);

  return (
    <section id="services" className="py-20 sm:py-32 text-white">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          What I Do
        </h2>
        <p className="mt-4 text-lg text-gray-400">
          Tailored solutions for bold ideas — beautifully built, carefully
          coded.
        </p>
      </div>

      <div
        ref={containerRef}
        className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {services.map((service) => (
          <div
            key={service.title}
            className="service-card relative rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-cyan-400/50 backdrop-blur-sm transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] group opacity-0 translate-y-10"
          >
            <div className="mb-4">{service.icon}</div>
            <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">
              {service.title}
            </h3>
            <p className="mt-4 text-gray-300">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
