import type { ServiceItem } from "@/types/service";

export const SERVICES: ServiceItem[] = [
  {
    id: "svc-01",
    code: "UNIT-LITE-01",
    name: "Lite Motion Landing",
    tag: "Entry / Motion",

    // ✅ IMAGE
    media: {
      type: "image",
      src: "/services_card/Lite-Motion-Landing.jpg",
    },

    // ✅ slightly more “approachable” tone (optional)
    headline: "Simple, clean, and ready to ship.",
    description:
      "A straightforward landing build with subtle motion — designed to look premium without heavy complexity or long timelines.",

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

    // ✅ shorter / more realistic for “easy work”
    timeline: "3–7 days",

    // ✅ NEW: entry-level pricing (easier to sell)
    price: { currency: "USD", from: 450, to: 650, note: "Starting range" },

    highlights: [
      "Great for quick launches & campaigns",
      "Clean scope, low overhead",
    ],
    tech: ["Next.js", "React", "GSAP", "CSS/SCSS"],
    accent: { rgb: [120, 255, 255] }, // ✅ CYAN
  },

  {
    id: "svc-02",
    code: "UNIT-CINE-02",
    name: "Cinematic Brand Landing",
    tag: "Core / Cinematic",

    // ✅ VIDEO
    media: {
      type: "video",
      src: "/services_card/Cinematic-Brand-Landing.mp4",
    },

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

    // ✅ keep price
    // ✅ soften note so it doesn’t feel like “hard sell”
    price: { currency: "USD", from: 1500, to: 3000, note: "Selected projects" },

    highlights: [
      "Flagship page for premium brands",
      "High perceived value & clarity",
    ],
    tech: ["Next.js", "React", "GSAP + ScrollTrigger", "Lenis (optional)"],
    accent: { rgb: [110, 230, 255] }, // ✅ TEAL/BLUE
  },

  {
    id: "svc-03",
    code: "UNIT-IMM-03",
    name: "Immersive Interactive Experience",
    tag: "Immersive / Experimental",

    // ✅ VIDEO
    media: {
      type: "video",
      src: "/services_card/Immersive-Interactive-Experience.mp4",
    },

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

    // ✅ keep price (special work)
    price: {
      currency: "USD",
      from: 3500,
      note: "Starting at • Quoted after briefing",
    },

    highlights: ["Awards/showcase-ready", "Maximum differentiation"],
    tech: ["GSAP", "R3F/Three.js (optional)", "Custom shaders (optional)"],
    accent: { rgb: [185, 130, 255] }, // ✅ VIOLET
  },
];
