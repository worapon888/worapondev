import type { Metadata } from "next";
import { geistSans, geistMono, clashDisplay, beon, schabo } from "@/data/font";

import "./globals.css";

import SmoothScroll from "@/components/hook/SmoothScroll";
import SiteBackground from "@/components/SiteBackground";

// ✅ เพิ่ม
import { PageTransitionProvider } from "@/components/transition/PageTransition";

// ===== METADATA =====
export const metadata: Metadata = {
  title: "Worapon.Dev | Creative Developer & Frontend Specialist",
  description:
    "Specializing in high-end interactions and cinematic web experiences. Merging technical precision with creative vision.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
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
        {/* 🌌 Global Background (อยู่นอก SmoothScroll) */}
        <SiteBackground />

        {/* ✅ Provider ต้องอยู่ “ครอบ” ทั้งระบบ เพื่อให้ overlay โผล่ได้ทุกหน้า */}
        <PageTransitionProvider>
          {/* 🔼 Content Layer */}
          <SmoothScroll>
            <div className="app-shell relative z-10">{children}</div>
          </SmoothScroll>
        </PageTransitionProvider>
      </body>
    </html>
  );
}
