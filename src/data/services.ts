import type { ServiceItem } from "@/types/service";

export const SERVICES: ServiceItem[] = [
  {
    id: "svc-01",
    code: "UNIT-LITE-01",
    name: "Lite Motion Landing",
    tag: "Entry / Motion",
    image: "/Services/service_lite.jpg",
    headline: "Clean presence. Fast deployment.",
    description:
      "A focused landing experience with subtle motion — built to look premium without heavy complexity.",
    deliverables: [
      "Hero + core sections",
      "Subtle motion & micro-interactions",
      "Responsive + performance pass",
      "Deploy-ready build",
    ],
    scope: [
      "Single-page by default",
      "Expandable sections if needed",
      "Additional pages quoted after briefing",
    ],
    timeline: "5–10 days",
    price: { currency: "USD", from: 800, to: 1200, note: "Typical range" },
    highlights: [
      "Great for launches & campaigns",
      "Premium look with controlled scope",
    ],
    tech: ["Next.js", "GSAP", "CSS/SCSS"],
    accent: { rgb: [120, 255, 255] }, // ✅ CYAN
  },
  {
    id: "svc-02",
    code: "UNIT-CINE-02",
    name: "Cinematic Brand Landing",
    tag: "Core / Cinematic",
    image: "/Services/service_cinematic.jpg",
    headline: "Story-driven motion designed to convert.",
    description:
      "Cinematic pacing, scroll-linked transitions, and a brand-first interaction system for flagship pages.",
    deliverables: [
      "Story-driven structure",
      "GSAP animation timeline",
      "Scroll-linked transitions",
      "Responsive + performance pass",
    ],
    scope: [
      "Single or multi-page structure",
      "Expandable paths / sections",
      "Final scope confirmed after briefing",
    ],
    timeline: "10–18 days",
    price: { currency: "USD", from: 1500, to: 3000, note: "Most selected" },
    highlights: [
      "Flagship page for premium brands",
      "High perceived value & clarity",
    ],
    tech: ["Next.js", "GSAP + ScrollTrigger", "Lenis (optional)"],
    accent: { rgb: [110, 230, 255] }, // ✅ TEAL/BLUE
  },
  {
    id: "svc-03",
    code: "UNIT-IMM-03",
    name: "Immersive Interactive Experience",
    tag: "Immersive / Experimental",
    image: "/Services/service_immersive.jpg",
    headline: "Built for impact. Designed to be remembered.",
    description:
      "An immersive web experience with advanced choreography and optional pseudo-3D / shader elements.",
    deliverables: [
      "Immersive interaction system",
      "Advanced motion choreography",
      "Optional pseudo-3D / shader layer",
      "Custom experience design",
    ],
    scope: [
      "Multi-page / multi-path capable",
      "Quoted based on complexity & assets",
      "Final quote after briefing",
    ],
    timeline: "18–35 days",
    price: {
      currency: "USD",
      from: 3500,
      note: "Starting at / Quoted after briefing",
    },
    highlights: ["Awards/showcase-ready", "Maximum differentiation"],
    tech: ["GSAP", "R3F/Three.js (optional)", "Custom shaders (optional)"],
    accent: { rgb: [185, 130, 255] }, // ✅ VIOLET
  },
];
