"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/hero/Hero";
import Services from "@/components/services/Services";
import Showcase from "@/components/showcase/Showcase";
import Contact from "@/components/cta/Cta";
import Footer from "@/components/footer/Footer";

// ปิด SSR เพื่อเลี่ยง Hydration Error
const Preloader = dynamic(() => import("@/components/preloader/Preloader"), {
  ssr: false,
});

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean | null>(null);

  useEffect(() => {
    const played = sessionStorage.getItem("preloaderPlayed");
    if (played === "1") {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, []);

  // 1. ถ้ากำลังโหลด ให้โชว์ Preloader อย่างเดียว
  if (isLoading === true) {
    return (
      <Preloader
        enabled={true}
        onDone={() => {
          sessionStorage.setItem("preloaderPlayed", "1");
          setIsLoading(false);
        }}
      />
    );
  }

  // 2. ถ้าโหลดเสร็จแล้ว ค่อยโชว์หน้าเว็บ
  if (isLoading === false) {
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

  // 3. ช่วงที่กำลังเช็กสถานะ (isLoading === null) ให้จอดำไว้ก่อน
  return <div className="bg-black w-screen h-screen" />;
}
