"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import BlocksTransition from "./BlocksTransition";

interface TransitionContextType {
  go: (href: string) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<TransitionContextType | null>(null);

export function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const go = useCallback(
    (href: string) => {
      if (isTransitioning || href === pathname) return;
      setPendingHref(href);
      setIsTransitioning(true);
    },
    [isTransitioning, pathname],
  );

  const handleAnimationDone = useCallback(() => {
    if (pendingHref) {
      router.push(pendingHref);
      // หน่วงเวลาให้หน้าใหม่โหลดแป๊บนึงค่อยเอาแผ่นดำออก
      setTimeout(() => {
        setIsTransitioning(false);
        setPendingHref(null);
      }, 150);
    }
  }, [pendingHref, router]);

  return (
    <PageTransitionContext.Provider value={{ go, isTransitioning }}>
      {children}
      <BlocksTransition
        enabled={isTransitioning}
        onDone={handleAnimationDone}
      />
    </PageTransitionContext.Provider>
  );
}

export const usePageTransition = () => {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used within Provider");
  return ctx;
};
