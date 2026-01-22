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
  const [isLoading, setIsLoading] = useState(false); // ✅ เริ่ม false ไว้ก่อน

  useEffect(() => {
    // ✅ เคยเล่นแล้ว = ไม่เล่นซ้ำ
    const played = sessionStorage.getItem("preloaderPlayed");
    if (played === "1") {
      setIsLoading(false);
      return;
    }

    // ✅ ครั้งแรกในแท็บนี้ = เล่น
    setIsLoading(true);

    const t = window.setTimeout(() => {
      sessionStorage.setItem("preloaderPlayed", "1");
      setIsLoading(false);
    }, 2800);

    return () => window.clearTimeout(t);
  }, []);

  if (isLoading) {
    return (
      <Preloader
        enabled={true}
        label="Stabilizing Feed"
        onDone={() => {
          sessionStorage.setItem("preloaderPlayed", "1"); // ✅ กันหลุด
          setIsLoading(false);
        }}
      />
    );
  }

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
