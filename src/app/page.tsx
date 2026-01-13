"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/hero/Hero";
import Services from "@/components/services/Services";
import Showcase from "@/components/showcase/Showcase";
import Contact from "@/components/cta/Cta";
import Footer from "@/components/footer/Footer";

const Preloader = dynamic(() => import("@/components/preloader/Preloader"), {
  ssr: false,
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Preloader
        isActive={isLoading}
        label="Stabilizing Feed"
        onDone={() => {
          // เผื่ออยากทำอะไรหลังจบจริง ๆ
        }}
      />

      {/* ✅ หน้าเว็บ mount ตลอด แต่ซ่อนตอนกำลังโหลด */}
      <div
        style={{
          opacity: isLoading ? 0 : 1,
          pointerEvents: isLoading ? "none" : "auto",
          transition: "opacity 0.6s ease",
        }}
      >
        <Navbar />
        <main className="min-h-screen pt-16 bg-transparent">
          <Hero />
          <Services />
          <Showcase />
          <Contact />
          <Footer />
        </main>
      </div>
    </>
  );
}
