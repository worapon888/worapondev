import type { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Selected case studies from Worapon.Dev, including full-stack products, e-commerce architecture, productivity tools, real-time dashboards, and cinematic frontend experiences.",
  alternates: {
    canonical: "/case-studies",
  },
  openGraph: {
    title: "Case Studies",
    description:
      "Explore selected full-stack systems and frontend experiences built for reliability, clarity, performance, and product value.",
    url: "/case-studies",
    images: [
      {
        url: "/case-studies/slider_img_4.webp",
        alt: "Worapon.Dev case studies",
      },
    ],
  },
  twitter: {
    title: "Case Studies",
    description:
      "Selected full-stack systems, dashboards, e-commerce architecture, and creative frontend work.",
    images: ["/case-studies/slider_img_4.webp"],
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
    </>
  );
}
