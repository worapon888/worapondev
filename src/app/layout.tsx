import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import SmoothScroll from "@/components/hook/SmoothScroll";
import SiteBackground from "@/components/SiteBackground"; // ✅ เพิ่ม

// ===== BODY FONT =====
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ===== HERO FONT =====
const clashDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/ClashDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-clash-display",
});

// ===== NEON / DISPLAY FONT =====
const beon = localFont({
  src: [
    {
      path: "../../public/fonts/Beon-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Beon-Regular.woff",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-beon",
});
const schabo = localFont({
  src: [
    {
      path: "../../public/fonts/SCHABO-Condensed.woff2",

      style: "normal",
    },
    {
      path: "../../public/fonts/SCHABO-Condensed.woff",

      style: "normal",
    },
  ],
  variable: "--font-schabo",
  display: "swap",
});

// ===== METADATA =====
export const metadata: Metadata = {
  title: "Worapon.Dev | Creative Developer & Frontend Specialist",
  description:
    "Specializing in high-end interactions and cinematic web experiences. Merging technical precision with creative vision.",
  icons: {
    icon: "/logo_favico.png?v=2",
  },
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

        {/* 🔼 Content Layer */}
        <SmoothScroll>
          <div className="app-shell relative z-10">{children}</div>
        </SmoothScroll>
      </body>
    </html>
  );
}
