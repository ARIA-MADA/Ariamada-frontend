import React, { useEffect, useRef } from "react";

const HeroBackground = React.memo(({ mousePosition }: { mousePosition: { x: number; y: number } | null }) => {
  const particlesRef = useRef<HTMLDivElement>(null);

  // Particules flottantes OPTIMISÉES
  useEffect(() => {
    if (!particlesRef.current) return;
    const container = particlesRef.current;
    const particlesCount = 15;

    for (let i = 0; i < particlesCount; i++) {
      const particle = document.createElement("div");
      particle.className = "floating-particle";
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = 2 + Math.random() * 3;
      const duration = 3 + Math.random() * 4;
      const delay = Math.random() * 2;

      particle.style.cssText = `
        position: absolute;
        left: ${left}%;
        top: ${top}%;
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, rgba(249,115,22,0.3), rgba(59,130,246,0.3));
        border-radius: 50%;
        opacity: ${0.3 + Math.random() * 0.4};
        animation: float-particle ${duration}s ease-in-out ${delay}s infinite;
      `;
      container.appendChild(particle);
    }

    return () => {
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <>
      {/* Fond - Couvre toute la zone */}
      <div className="baobab-bg absolute inset-0 w-full h-full object-cover" />
      
      {/* Overlay - Couvre toute la zone */}
      <div className="baobab-overlay absolute inset-0 w-full h-full" />

      {/* Orbes statiques (sans dépendance à la souris) */}
      <div className="pointer-events-none absolute -right-20 -top-20 w-48 h-48 rounded-full bg-gradient-to-r from-orange-500/10 via-blue-500/10 to-purple-500/10 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 w-40 h-40 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-orange-500/10 blur-3xl animate-float-slow" />

      {/* Particules - Couvre toute la zone */}
      <div ref={particlesRef} className="floating-particles absolute inset-0 w-full h-full" />
    </>
  );
});

HeroBackground.displayName = "HeroBackground";
export default HeroBackground;