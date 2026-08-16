import type { Metadata } from "next";
import { geistSans, geistMono, clashDisplay, beon, schabo } from "@/data/font";

import "./globals.css";

import SmoothScroll from "@/components/hook/SmoothScroll";
import { PageTransitionProvider } from "@/components/transition/PageTransition";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.worapon.dev"),
  applicationName: "Worapon.Dev",
  title: {
    default: "Worapon.Dev | Full-Stack Engineer & System Problem Solver",
    template: "%s | Worapon.Dev",
  },
  description:
    "Full-stack engineer focused on building production-ready systems and high-quality web experiences. Experienced in handling real-world challenges such as concurrency, scalability, and system reliability through projects like MinimalMart.",
  keywords: [
    "Worapon.Dev",
    "Worapon Jintajirakul",
    "full-stack engineer",
    "Next.js developer",
    "React developer",
    "web application development",
    "system design",
    "frontend engineer",
    "backend engineer",
  ],
  authors: [{ name: "Worapon Jintajirakul", url: "https://www.worapon.dev" }],
  creator: "Worapon Jintajirakul",
  publisher: "Worapon.Dev",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Worapon.Dev",
    title: "Worapon.Dev | Full-Stack Engineer & System Problem Solver",
    description:
      "Production-ready web systems, polished frontend experiences, backend architecture, and real-world problem solving by Worapon Jintajirakul.",
    images: [
      {
        url: "/Logo_worapon.webp",
        alt: "Worapon.Dev",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Worapon.Dev | Full-Stack Engineer & System Problem Solver",
    description:
      "Production-ready web systems, polished frontend experiences, backend architecture, and real-world problem solving.",
    images: ["/Logo_worapon.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
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
        <PageTransitionProvider>
          <SmoothScroll>
            <div className="app-shell relative z-10">{children}</div>
          </SmoothScroll>
        </PageTransitionProvider>
      </body>
    </html>
  );
}
