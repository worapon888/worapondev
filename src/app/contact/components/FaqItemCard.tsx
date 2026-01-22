"use client";

import type { FaqItemCardProps } from "@/types/contact";

export default function FaqItemCard({
  item,
  isOpen,
  onToggle,
  panelRef,
  chevRef,
}: FaqItemCardProps) {
  return (
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
}
