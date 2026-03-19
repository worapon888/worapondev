/* ===============================
   Contact / FAQ Types
================================ */

/** Contact form submit status */
export type Status = "idle" | "sending" | "ok" | "err";

/** Payload that your /api/contact expects */
export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  website?: string; // honeypot
};

/** Typewriter options */
export type TypewriterOpts = {
  typeSpeed?: number;
  endHoldMs?: number;
  repeatDelayMs?: number;
  glitchChance?: number;
  glitchChars?: string;
};

/** FAQ item */
export type FaqItem = {
  id: string;
  title: string;
  body?: string;
};

/** FAQ Card props */
export interface FaqItemCardProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  panelRef: (el: HTMLDivElement | null) => void;
  chevRef: (el: HTMLSpanElement | null) => void;
}
/* ===============================
   FAQ Data (single source of truth)
================================ */

export const FAQ_DATA = [
  {
    id: "suitable-projects",
    title: "What kind of projects do you work on?",
    body: "I work on full-stack web applications, landing pages, and product systems — from simple builds to more complex, production-ready platforms.",
  },
  {
    id: "budget-range",
    title: "What is the typical project budget?",
    body: "It depends on scope, complexity, and system requirements. Smaller projects are more straightforward, while full systems require deeper planning and engineering.",
  },
  {
    id: "process",
    title: "How do you approach a project?",
    body: "I start by understanding the problem and goals, then design the structure before building. Every step focuses on clarity, performance, and real-world usability.",
  },
  {
    id: "timeline",
    title: "How long does a project take?",
    body: "Simple projects can take a few weeks. More complex systems may take longer depending on features, backend logic, and integrations.",
  },
  {
    id: "revisions",
    title: "How do revisions work?",
    body: "Revisions are handled within a defined scope to keep the project focused and efficient. Additional changes can be discussed if needed.",
  },
  {
    id: "portfolio",
    title: "Where can I see your work?",
    body: "You can explore selected projects in the Case Studies section, including real-world systems and production-focused builds.",
  },
  {
    id: "contact",
    title: "How can I start a project with you?",
    body: "Send a message through the contact form with your idea or requirements, and I’ll get back to you to discuss the next steps.",
  },
] as const satisfies readonly FaqItem[];

/** Union type of FAQ ids from the data (prevents typos in openId, etc.) */
export type FaqId = (typeof FAQ_DATA)[number]["id"];

export type ContactApiOk = { ok: true };
export type ContactApiErr = { ok: false; error: string };
export type ContactApiResponse = ContactApiOk | ContactApiErr;
