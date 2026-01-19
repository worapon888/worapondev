import Navbar from "@/components/Navbar/Navbar";
import FooterSection from "@/components/footer/Footer";
import "./about.css";

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
