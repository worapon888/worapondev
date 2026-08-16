import type { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";
import FooterSection from "@/components/footer/Footer";
import "./contact.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Worapon.Dev to discuss full-stack web applications, landing pages, product systems, frontend experiences, backend architecture, and project collaboration.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Worapon.Dev",
    description:
      "Start a project conversation with Worapon.Dev for production-ready web systems and polished digital experiences.",
    url: "/contact",
  },
  twitter: {
    title: "Contact Worapon.Dev",
    description:
      "Discuss full-stack web applications, landing pages, backend systems, and project collaboration.",
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
