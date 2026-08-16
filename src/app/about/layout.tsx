import type { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";
import FooterSection from "@/components/footer/Footer";
import "./about.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Worapon Jintajirakul, a full-stack engineer focused on production-ready web systems, frontend experiences, backend architecture, and practical product problem solving.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Worapon Jintajirakul",
    description:
      "Full-stack engineering profile covering frontend, backend, system design, product thinking, and production-focused software delivery.",
    url: "/about",
  },
  twitter: {
    title: "About Worapon Jintajirakul",
    description:
      "Full-stack engineer focused on production-ready systems and practical product problem solving.",
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

      <main className="min-h-screen ">{children}</main>

      <FooterSection />
    </>
  );
}
