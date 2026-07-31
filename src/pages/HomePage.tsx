// HomePage.tsx
import React from 'react';
import HeroSection from '@/components/HeroSection';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Section Hero (Uniquement sur la page d'accueil) */}
      <section id="accueil" className="scroll-mt-20">
        <HeroSection />
      </section>
    </div>
  );
};

export default HomePage;