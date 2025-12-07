import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import PlatformsSection from "@/components/home/PlatformsSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>TradeID - Instant Trading ID Activation | Automated WhatsApp Onboarding</title>
        <meta name="description" content="Get your trading account activated instantly with our WhatsApp-powered automated system. Platform selection, UPI payments, and instant ID activation." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <HowItWorksSection />
          <PlatformsSection />
          <BenefitsSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
