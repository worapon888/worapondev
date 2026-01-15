"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Preloader from "@/components/preloader/Preloader";

type Ctx = {
  go: (href: string) => void;
  isTransitioning: boolean;
};

const PageTransitionContext = createContext<Ctx | null>(null);

export function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [enabled, setEnabled] = useState(false);
  const [nextHref, setNextHref] = useState<string | null>(null);

  const go = (href: string) => {
    // ✅ 1) กันเล่นซ้ำตอนกำลังเล่นอยู่
    if (enabled) return;

    // ✅ 2) กันเล่นซ้ำถ้ากด route เดิม
    if (href === pathname) return;

    setNextHref(href);
    setEnabled(true);
  };

  const value = useMemo(() => ({ go, isTransitioning: enabled }), [enabled]);

  return (
    <PageTransitionContext.Provider value={value}>
      {children}

      {/* ✅ ตัวนี้จะไม่เล่นเอง เพราะ enabled เริ่มต้นเป็น false */}
      <Preloader
        enabled={enabled}
        durationMs={0} // ไม่ต้องรอ
        blockSize={60}
        onDone={() => {
          if (nextHref) router.push(nextHref);
          setEnabled(false);
          setNextHref(null);
        }}
      />
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) throw new Error("usePageTransition must be used in provider");
  return ctx;
}
