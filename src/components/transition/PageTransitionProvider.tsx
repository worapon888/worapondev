"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import Preloader from "@/components/preloader/Preloader";

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

  // ใช้เป้าหมาย (href) เป็นสถานะเดียวเพื่อบอกว่ากำลังเปลี่ยนหน้าหรือไม่
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const go = useCallback(
    (href: string) => {
      // ป้องกันการคลิกซ้ำหน้าเดิม หรือคลิกขณะกำลังโหลด
      if (pendingHref || href === pathname) return;
      setPendingHref(href);
    },
    [pendingHref, pathname],
  );

  const onAnimationDone = useCallback(() => {
    if (pendingHref) {
      router.push(pendingHref);
      setPendingHref(null);
    }
  }, [pendingHref, router]);

  const value = useMemo(
    () => ({
      go,
      isTransitioning: !!pendingHref,
    }),
    [go, pendingHref],
  );

  return (
    <PageTransitionContext.Provider value={value}>
      {children}

      <Preloader
        enabled={!!pendingHref}
        durationMs={0}
        blockSize={60}
        onDone={onAnimationDone}
      />
    </PageTransitionContext.Provider>
  );
}

export const usePageTransition = () => {
  const ctx = useContext(PageTransitionContext);
  if (!ctx)
    throw new Error(
      "usePageTransition must be used within PageTransitionProvider",
    );
  return ctx;
};
