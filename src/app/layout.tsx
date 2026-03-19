import type { Metadata } from "next";
import { geistSans, geistMono, clashDisplay, beon, schabo } from "@/data/font";

import "./globals.css";

import SmoothScroll from "@/components/hook/SmoothScroll";
import SiteBackground from "@/components/SiteBackground";
import { PageTransitionProvider } from "@/components/transition/PageTransition";

export const metadata: Metadata = {
  title: "Worapon.Dev | Full-Stack Engineer & System Problem Solver",
  description:
    "Full-stack engineer focused on building production-ready systems and high-quality web experiences. Experienced in handling real-world challenges such as concurrency, scalability, and system reliability through projects like MinimalMart.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 1. เพิ่ม suppressHydrationWarning เพื่อหยุด Error เรื่องภาษา (lang)
    <html lang="en" suppressHydrationWarning>
      <body
        // 2. เพิ่ม suppressHydrationWarning ที่ body ด้วยเพื่อความชัวร์
        suppressHydrationWarning
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${clashDisplay.variable}
          ${beon.variable}
          ${schabo.variable}
          antialiased
          bg-black
          text-white
        `}
      >
        <SiteBackground />

        <PageTransitionProvider>
          <SmoothScroll>
            <div className="app-shell relative z-10">{children}</div>
          </SmoothScroll>
        </PageTransitionProvider>
      </body>
    </html>
  );
}
