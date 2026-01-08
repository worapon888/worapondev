import Services from "@/components/Services";
import Showcase from "@/components/Showcase";
import Contact from "@/components/Contact";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/hero/Hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-16">
        <Hero />
        <Services />
        <Showcase />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
