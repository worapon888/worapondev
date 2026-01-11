import Services from "@/components/services/Services";
import Showcase from "@/components/Showcase";
import Contact from "@/components/Contact";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/hero/Hero";

export default function Home() {
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
