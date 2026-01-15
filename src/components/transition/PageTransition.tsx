"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { flushSync } from "react-dom";
import BlocksTransition from "./BlocksTransition";

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

  const go = (href: string) => {
    if (enabled) return;
    if (href === pathname) return;

    // ✅ ทำให้ overlay โผล่ "ทันที" ก่อนเริ่ม navigation
    flushSync(() => {
      setEnabled(true);
    });

    // ✅ push ทันที → หน้าเปลี่ยนพร้อมกับ transition
    router.push(href);
  };

  const value = useMemo(() => ({ go, isTransitioning: enabled }), [enabled]);

  return (
    <PageTransitionContext.Provider value={value}>
      {children}

      <BlocksTransition
        enabled={enabled}
        blockSize={60}
        onDone={() => {
          // ✅ จบแอนิเมชันค่อยปิด overlay
          setEnabled(false);
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
