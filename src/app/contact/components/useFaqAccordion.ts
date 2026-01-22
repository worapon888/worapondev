"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { FaqId, FaqItem } from "@/types/contact";

type ElMap = Record<string, HTMLElement | null>;

export function useFaqAccordion(
  faqData: readonly FaqItem[],
  openId: FaqId | "",
) {
  const panelRefs = useRef<ElMap>({});
  const chevRefs = useRef<ElMap>({});

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      faqData.forEach(({ id }) => {
        const isOpen = id === openId;
        const panel = panelRefs.current[id];
        const chev = chevRefs.current[id];

        if (panel) {
          gsap.set(panel, {
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          });
        }
        if (chev) gsap.set(chev, { rotate: isOpen ? 45 : -45 });
      });
    });

    return () => ctx.revert();
  }, [faqData, openId]);

  const toggle = (id: FaqId, setOpenId: (v: FaqId | "") => void) => {
    const isClosing = id === openId;
    const nextId = isClosing ? "" : id;

    if (openId && panelRefs.current[openId]) {
      gsap.to(panelRefs.current[openId]!, {
        height: 0,
        opacity: 0,
        duration: 0.45,
        ease: "power3.out",
      });
      if (chevRefs.current[openId]) {
        gsap.to(chevRefs.current[openId]!, { rotate: -45, duration: 0.35 });
      }
    }

    if (!isClosing && panelRefs.current[id]) {
      gsap.fromTo(
        panelRefs.current[id]!,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.55, ease: "power3.out" },
      );
      if (chevRefs.current[id]) {
        gsap.to(chevRefs.current[id]!, { rotate: 45, duration: 0.4 });
      }
    }

    setOpenId(nextId);
  };

  return { panelRefs, chevRefs, toggle };
}
