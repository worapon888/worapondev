import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ✅ โหลดฟอนต์ Google
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ ตั้งค่า metadata + favicon
export const metadata: Metadata = {
  title: "Worapon Portfolio", // ← แก้ชื่อเว็บที่แสดงบนแท็บ
  description: "Immersive UI & Frontend Developer Portfolio", // ← คำอธิบาย SEO
  icons: {
    icon: "/favicon.ico", // ← ใส่ favicon (วางไว้ใน public/favicon.ico)
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
