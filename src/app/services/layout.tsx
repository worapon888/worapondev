import type { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";
import FooterSection from "@/components/footer/Footer";
import "./services.css";
import "./topnav.css";
import "./controller.css";
import "./sevicecard.css";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web development services by Worapon.Dev, from clean motion landing pages to cinematic brand sites and immersive interactive experiences built with Next.js, React, and GSAP.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Services",
    description:
      "Explore production-ready web services including landing pages, motion systems, brand experiences, and immersive interactive websites.",
    url: "/services",
  },
  twitter: {
    title: "Services",
    description:
      "Landing pages, cinematic brand sites, and immersive interactive web experiences by Worapon.Dev.",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">{children}</main>

      <FooterSection />
    </>
  );
}
