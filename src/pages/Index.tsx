// pages/index.tsx ou app/page.tsx
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import ServicesSection from "@/components/Services/ServiceSection";
import ChatbotButton from "@/components/ChatbotButton";
import LoadingScreen from "@/components/LoadingScreen";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  // sécurité : au cas où onReady ne se déclenche jamais
  useEffect(() => {
    const failSafe = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(failSafe);
  }, []);

  const handleHeroReady = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      <div className="relative z-10">
        <Header />
        <HeroSection onReady={handleHeroReady} />
        <AboutSection />
        <ProjectsSection />
        <ServicesSection />
        <ContactSection />
        <ChatbotButton position="bottom-right" />
        <Footer />
      </div>
    </div>
  );
};

export default Index;