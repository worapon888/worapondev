"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Hero from "@/components/hero/Hero";
import Services from "@/components/services/Services";
import Showcase from "@/components/showcase/Showcase";
import Contact from "@/components/cta/Cta";
import Footer from "@/components/footer/Footer";
import Preloader from "@/components/preloader/Preloader";

export default function Home() {
  // 1. เริ่มต้นเป็น true เพื่อให้โชว์ Preloader ทันที
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // เช็กจาก sessionStorage ว่าเคยเล่นไปหรือยัง (ถ้าไม่อยากให้เล่นซ้ำทุกครั้งที่กด Home)
    const played = sessionStorage.getItem("initialPreloaderPlayed");
    if (played === "1") {
      setIsLoading(false);
      return;
    }

    // ถ้ายังไม่เคยเล่น ให้รอเวลา (durationMs) แล้วค่อยปิด
    // หมายเหตุ: หากใน Preloader มี onDone ให้ใช้ onDone ปิดจะเนียนกว่า
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("initialPreloaderPlayed", "1");
    }, 4000); // ปรับให้ตรงกับเวลา Animation ของคุณ

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* 2. แสดง Preloader เมื่อ isLoading เป็น true */}
      {isLoading && (
        <Preloader enabled={true} onDone={() => setIsLoading(false)} />
      )}

      {/* 3. เนื้อหาหลักของหน้า Page */}
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
