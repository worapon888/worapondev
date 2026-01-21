import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

// ===== BODY FONT =====
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ===== HERO FONT =====
export const clashDisplay = localFont({
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
export const beon = localFont({
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

export const schabo = localFont({
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
