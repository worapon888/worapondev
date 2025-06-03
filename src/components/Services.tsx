"use client";

import { Code2, Palette, Rocket, Globe, Bot, BrainCog } from "lucide-react";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CardSpotlight } from "@/components/ui/card-spotlight";

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
      gsap.set(items, {
        opacity: 0,
        y: 60, // เพิ่มระยะ drop-in เล็กน้อย
        scale: 0.95,
      });

      gsap.to(items, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        ease: "expo.out", // ✅ ลื่นขึ้นกว่าของเดิม
        duration: 0.9,
        delay: 0.1,
        stagger: {
          each: 0.18,
          from: "start",
        },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play reverse play reverse",
        },
      });
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
          <CardSpotlight
            key={service.title}
            className="service-card h-full w-full p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm transition-all hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]"
          >
            <div className="relative z-10">
              {" "}
              {/* ✅ ป้องกันข้อความถูกบัง */}
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-white tracking-tight transition-colors">
                {service.title}
              </h3>
              <p className="mt-4 text-gray-300">{service.description}</p>
            </div>
          </CardSpotlight>
        ))}
      </div>
    </section>
  );
}
