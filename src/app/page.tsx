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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setIsLoading(false), 2800);
    return () => window.clearTimeout(t);
  }, []);

  if (isLoading) {
    return (
      <Preloader
        enabled={true}
        label="Stabilizing Feed"
        onDone={() => setIsLoading(false)}
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
