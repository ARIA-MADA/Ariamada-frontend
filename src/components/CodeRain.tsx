import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const CODE_TOKENS = [
  "<div>",
  "</div>",
  "<section>",
  "</section>",
  "<main>",
  "</main>",
  "<header>",
  "</header>",
  "<footer>",
  "</footer>",
  "<button>",
  "</button>",
  "<span>",
  "</span>",
  "<nav>",
  "</nav>",
  "<article>",
  "</article>",
  "<h1>",
  "</h1>",
  "<p>",
  "</p>",
  "{ }",
  "()",
  "</>",
  "=>",
];

const COLUMN_COUNT = 22;

const CodeRain: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Rendre le conteneur visible immédiatement
    gsap.set(containerRef.current, { opacity: 1 });

    const elements = Array.from(
      containerRef.current.querySelectorAll<HTMLSpanElement>(".code-rain-item")
    );

    // Nettoyer les animations précédentes
    animationRef.current.forEach(anim => anim.kill());
    animationRef.current = [];

    elements.forEach((el, index) => {
      // CONSERVER LES VALEURS ORIGINALES DE VITESSE
      const delay = Math.random() * 3; // Même délai qu'avant
      const duration = 7 + Math.random() * 5; // Même durée qu'avant
      const startY = -120 - Math.random() * 160; // Même position de départ
      const endY = window.innerHeight + 160;

      const baseX = parseFloat(el.dataset.baseX || "0");
      const drift = 8 + Math.random() * 18;
      const rotate = (Math.random() - 0.5) * 10;

      // Définir l'état initial visible immédiatement mais à sa position de départ
      gsap.set(el, {
        y: startY,
        x: baseX,
        opacity: 0.4, // Un peu plus visible dès le début
        rotate,
        filter: "blur(0.8px)",
      });

      // Démarrer l'animation immédiatement avec les paramètres originaux
      const anim = gsap.to(el, {
        y: endY,
        opacity: 0.85,
        duration,
        delay,
        repeat: -1,
        ease: "none", // Même ease qu'avant
        immediateRender: true, // IMPORTANT: rendu immédiat
        onUpdate() {
          const t = (this as any).time();
          const offsetX = Math.sin(t * 0.7 + index) * drift;
          el.style.transform = `translate3d(${offsetX}px, ${el.style.transform
            .match(/translate3d\([^,]+, ([^,]+),/)
            ?.at(1) || "0px"}, 0) rotate(${rotate}deg)`;
        },
        onRepeat: () => {
          // Réinitialiser à la position de départ
          gsap.set(el, { 
            y: startY, 
            opacity: 0.4,
            filter: "blur(0.8px)"
          });
        }
      });

      animationRef.current.push(anim);
    });

    // Nettoyage
    return () => {
      animationRef.current.forEach(anim => anim.kill());
      animationRef.current = [];
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-0"
    >
      {Array.from({ length: COLUMN_COUNT }).map((_, i) => {
        const randomOffset = Math.random() * 10 - 5;
        const baseX = randomOffset;
        const randomTop = -40 - Math.random() * 80; // Même position initiale
        const isBig = Math.random() > 0.4;

        // palette de couleurs type "code" - avec opacité initiale
        const colorClass = [
          "text-aria-cream/50", // Légèrement plus visible au début
          "text-aria-gold/60",
          "text-aria-teal/50",
        ][i % 3];

        return (
          <span
            key={i}
            className={`code-rain-item absolute font-mono whitespace-nowrap ${colorClass} ${
              isBig
                ? "text-[13px] sm:text-sm drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]"
                : "text-[11px] sm:text-xs opacity-70"
            }`}
            style={{
              left: `${(i / COLUMN_COUNT) * 100}%`,
              top: `${randomTop}px`,
            }}
            data-base-x={baseX}
          >
            {CODE_TOKENS[i % CODE_TOKENS.length]}
          </span>
        );
      })}
    </div>
  );
};

export default CodeRain;