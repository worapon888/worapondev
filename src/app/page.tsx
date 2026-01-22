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
  loading: () => null,
});

export default function Home() {
  // เริ่มต้นเป็น null เพื่อเช็กสถานะ sessionStorage ก่อน render
  const [isLoading, setIsLoading] = useState<boolean | null>(null);

  useEffect(() => {
    const played = sessionStorage.getItem("preloaderPlayed");
    if (played === "1") {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, []);

  // ถ้ายังไม่ได้เช็ก sessionStorage (เช่นช่วงแรกที่โหลดหน้า) ให้คืนค่าว่างไว้ก่อน
  if (isLoading === null) return <div className="bg-black min-h-screen" />;

  // ถ้าต้องโหลด Preloader
  if (isLoading) {
    return (
      <Preloader
        enabled={true}
        durationMs={2800}
        label="Stabilizing Feed"
        onDone={() => {
          sessionStorage.setItem("preloaderPlayed", "1");
          setIsLoading(false); // เปลี่ยนสถานะเมื่อแอนิเมชันเล่นจบจริงๆ เท่านั้น
        }}
      />
    );
  }

  // หน้าเว็บหลัก
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 bg-transparent">
        <Hero />
        <Services />
        <Showcase />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
