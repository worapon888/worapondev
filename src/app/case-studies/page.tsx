import FooterSection from "@/components/footer/Footer";
import Navbar from "@/components/Navbar/Navbar";

// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="max-w-5xl mx-auto px-6">
          <h1 className="header-service">About</h1>

          <p className="text-white/70 leading-relaxed">
            This is the casestudie page.
          </p>
        </section>
      </main>
      <FooterSection />
    </>
  );
}
