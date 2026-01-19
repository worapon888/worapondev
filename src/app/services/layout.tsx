import Navbar from "@/components/Navbar/Navbar";
import FooterSection from "@/components/footer/Footer";
import "./services.css";
import "./topnav.css";
import "./controller.css";
import "./sevicecard.css";
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
