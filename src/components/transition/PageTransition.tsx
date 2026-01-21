"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
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

  // ใช้ useCallback เพื่อป้องกันการสร้างฟังก์ชันใหม่ซ้ำๆ
  const go = useCallback(
    (href: string) => {
      if (isTransitioning || href === pathname) return;

      // เริ่ม Transition และสั่งเปลี่ยนเส้นทางพร้อมกัน
      // React 18 จัดการเรื่องลำดับการอัปเดตได้ดีเยี่ยมโดยไม่ต้องใช้ flushSync
      setIsTransitioning(true);
      router.push(href);
    },
    [isTransitioning, pathname, router],
  );

  const value = useMemo(
    () => ({
      go,
      isTransitioning,
    }),
    [go, isTransitioning],
  );

  return (
    <PageTransitionContext.Provider value={value}>
      {children}

      <BlocksTransition
        enabled={isTransitioning}
        blockSize={60}
        onDone={() => setIsTransitioning(false)}
      />
    </PageTransitionContext.Provider>
  );
}

export const usePageTransition = () => {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) {
    throw new Error(
      "usePageTransition must be used within a PageTransitionProvider",
    );
  }
  return ctx;
};
