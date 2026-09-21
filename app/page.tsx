import Background from "@/components/Background";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import LogoCloud from "@/components/LogoCloud";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05050a] text-white">
      <Background />
      <Navbar />
      <Hero />
      <LogoCloud />
      <Features />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
