"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PinContainer } from "@/components/ui/3d-pin";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "MinimalMart",
    description: "Immersive e-commerce concept with animation-first UI.",
    image: "/projects/minimalmart.png",
    link: "https://minimart-three.vercel.app/",
  },
  {
    title: "TaskSync",
    description: "A calm, gamified task system with real-time drag & drop.",
    image: "/projects/Tasksycn.png",
    link: "https://tasksync-chi.vercel.app/",
  },
  {
    title: "Insightify",
    description: "Futuristic analytics dashboard with real data hooks.",
    image: "/projects/insightify.png",
    link: "https://insighttify-dashboard.vercel.app/",
  },
  {
    title: "Code404",
    description: "Your portal to clean code, immersive UI, and dev identity.",
    image: "/projects/code404.png",
    link: "https://code404-five.vercel.app/",
  },
];

export default function Showcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }
    );

    cardsRef.current.forEach((card, index) => {
      if (card) {
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
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });
  }, []);

  return (
    <section id="showcase" className="relative z-10 py-24 sm:py-32">
      <div className="text-center" ref={containerRef}>
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Featured Projects
        </h2>
        <p className="mt-4 text-lg text-white/70">
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
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg">
                    {project.title}
                  </h3>
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
