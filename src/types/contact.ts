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
] as const satisfies readonly FaqItem[];

/** Union type of FAQ ids from the data (prevents typos in openId, etc.) */
export type FaqId = (typeof FAQ_DATA)[number]["id"];

export type ContactApiOk = { ok: true };
export type ContactApiErr = { ok: false; error: string };
export type ContactApiResponse = ContactApiOk | ContactApiErr;
