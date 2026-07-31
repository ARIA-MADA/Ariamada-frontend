// HeroSection.tsx - VERSION CORRIGÉE
import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import { useParallax } from "@/hooks/useScrollAnimation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import HeroBackground from "./Hero/HeroBackground";
import HeroContent from "./Hero/HeroContent";
import AriaLogoRain from "./Hero/AriaLogoRain";
import ImageCarousel from "./Hero/ImageCarousel";
import ScrollBadges from "./Hero/ScrollBadges";
import ContactModal from "@/components/Contact/ContactModal";
import "@/styles/animations.css";
import "@/styles/HeroSection.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type HeroSectionProps = {
  onReady?: () => void;
};

// Optimisation : utiliser React.memo pour les composants enfants si nécessaire
const MemoizedHeroBackground = memo(HeroBackground);
const MemoizedHeroContent = memo(HeroContent);

const HeroSection: React.FC<HeroSectionProps> = ({ onReady }) => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [carouselReady, setCarouselReady] = useState(false);

  // Désactiver les animations si l'utilisateur préfère les réductions de mouvement
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const logosRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const { offset } = useParallax(0.3);

  // Référence pour nettoyer les animations
  const animationRefs = useRef<{
    intervalId?: NodeJS.Timeout;
    images?: HTMLElement[];
  }>({
    images: [],
  });

  // Vérifier les préférences de mouvement
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleScrollTo = useCallback((id: string) => {
    if (id === "contact") {
      setIsContactOpen(true);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Attendre que le carousel soit monté
  useEffect(() => {
    if (!carouselContainerRef.current || prefersReducedMotion) return;

    // Utiliser MutationObserver pour détecter quand les images sont chargées
    const observer = new MutationObserver(() => {
      if (carouselContainerRef.current) {
        const images = Array.from(
          carouselContainerRef.current.querySelectorAll(".carousel-image")
        ) as HTMLElement[];

        if (images.length > 0 && !carouselReady) {
          setCarouselReady(true);
        }
      }
    });

    if (carouselContainerRef.current) {
      observer.observe(carouselContainerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    // Vérifier immédiatement si des images sont déjà présentes
    if (carouselContainerRef.current) {
      const existingImages = Array.from(
        carouselContainerRef.current.querySelectorAll(".carousel-image")
      ) as HTMLElement[];

      if (existingImages.length > 0) {
        setCarouselReady(true);
      }
    }

    return () => observer.disconnect();
  }, [prefersReducedMotion, carouselReady]);

  // Animation du carousel - version CORRIGÉE
  useGSAP(
    () => {
      if (
        !carouselReady ||
        !carouselContainerRef.current ||
        prefersReducedMotion
      )
        return;

      const images = Array.from(
        carouselContainerRef.current.querySelectorAll(".carousel-image")
      ) as HTMLElement[];

      if (images.length <= 1) return;

      // Initial state - optimisé
      gsap.set(images, { opacity: 0, scale: 1 });
      gsap.set(images[0], { opacity: 1 });

      let currentIndex = 0;
      let animationActive = true;
      animationRefs.current.images = images;

      const switchImage = () => {
        if (!animationActive || document.hidden || images.length <= 1) return;

        const nextIndex = (currentIndex + 1) % images.length;

        // Timeline simplifiée - moins d'étapes
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

        // Transition
        tl.to(
          images[currentIndex],
          {
            opacity: 0,
            duration: 0.8,
          },
          0
        )
          .to(
            images[nextIndex],
            {
              opacity: 1,
              duration: 1,
            },
            0
          )
          .to(
            images[nextIndex],
            {
              scale: 1.05,
              duration: 0.8,
              yoyo: true,
              repeat: 1,
            },
            0
          );

        currentIndex = nextIndex;
      };

      // Démarrer l'animation avec un intervalle plus long
      animationRefs.current.intervalId = setInterval(switchImage, 4000);

      // Pause/play basé sur la visibilité de la page
      const handleVisibilityChange = () => {
        animationActive = !document.hidden;
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Nettoyage
      return () => {
        animationActive = false;
        if (animationRefs.current.intervalId) {
          clearInterval(animationRefs.current.intervalId);
        }
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );

        // Réinitialiser l'opacité des images
        if (
          animationRefs.current.images &&
          animationRefs.current.images.length > 0
        ) {
          gsap.set(animationRefs.current.images, { opacity: 0 });
          if (animationRefs.current.images[0]) {
            gsap.set(animationRefs.current.images[0], { opacity: 1 });
          }
        }
      };
    },
    {
      dependencies: [carouselReady, prefersReducedMotion],
      scope: carouselContainerRef,
    }
  );

  // Animations d'entrée principales - Version OPTIMISÉE
  useGSAP(
    () => {
      if (prefersReducedMotion) {
        // Mode réduit: animations minimales
        if (containerRef.current) {
          gsap.set(containerRef.current, { opacity: 1, y: 0 });
        }
        onReady?.();
        return;
      }

      // Créer une timeline principale pour regrouper toutes les animations
      const masterTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => onReady?.(),
      });

      // Animation de base - en une seule étape
      if (containerRef.current) {
        masterTl.fromTo(
          containerRef.current,
          { y: 40, opacity: 0.8 },
          { y: 0, opacity: 1, duration: 1.2 },
          0.3
        );
      }

      // Regrouper les animations similaires
      masterTl.from(
        ".hero-title-main",
        {
          opacity: 0,
          y: 30,
          duration: 1,
        },
        0.6
      );

      masterTl.from(
        ".hero-subtitle-main",
        {
          opacity: 0,
          y: 25,
          duration: 0.9,
        },
        0.8
      );

      // Boutons CTA avec animation simplifiée
      gsap.set(".hero-cta-button", {
        opacity: 1,
        display: "inline-flex",
        y: 20,
      });

      masterTl.to(
        ".hero-cta-button",
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "back.out(1.4)",
        },
        1.0
      );

      // Animation des logos
      if (logosRef.current) {
        masterTl.from(
          logosRef.current,
          {
            opacity: 0,
            y: 60,
            scale: 0.98,
            duration: 1.2,
          },
          1.1
        );
      }

      // Animation slogan
      masterTl.from(
        ".hero-slogan",
        {
          opacity: 0,
          y: 35,
          scale: 0.96,
          duration: 1.3,
          ease: "elastic.out(1, 0.6)",
        },
        0.9
      );

      // Logo Aria
      masterTl.from(
        ".aria-logo",
        {
          y: -30,
          opacity: 0,
          scale: 0.95,
          duration: 1.1,
        },
        0.7
      );

      // Badges
      if (badgesRef.current) {
        masterTl.from(
          badgesRef.current,
          {
            y: 30,
            opacity: 0,
            duration: 0.9,
          },
          1.3
        );
      }

      // Effet de lueur UNIQUEMENT si les animations sont autorisées
      if (!prefersReducedMotion) {
        masterTl.to(
          ".hero-slogan",
          {
            textShadow: "0px 0px 12px rgba(255, 255, 255, 0.6)",
            duration: 1.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          },
          1.5
        );
      }
    },
    { scope: sectionRef, dependencies: [onReady, prefersReducedMotion] }
  );

  // Ajuster le padding
  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.style.paddingTop = "4rem";
      sectionRef.current.style.paddingBottom = "3rem";
    }

    // Nettoyage à la destruction du composant
    return () => {
      if (animationRefs.current.intervalId) {
        clearInterval(animationRefs.current.intervalId);
      }
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="accueil"
        className="hero-bg text-white overflow-hidden relative min-h-screen flex flex-col"
        style={{
          transform: prefersReducedMotion
            ? "none"
            : `translateY(${offset * 0.4}px)`,
        }}
      >
        {/* Passer null ou un objet statique à HeroBackground */}
        <MemoizedHeroBackground mousePosition={null} />

        {/* Conteneur principal */}
        <div
          ref={containerRef}
          className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 flex-1 flex flex-col"
        >
          {/* SECTION DU HAUT */}
          <div className="w-full mb-8 md:mb-12 flex-1">
            <MemoizedHeroContent onScrollTo={handleScrollTo} />
          </div>

          {/* SECTION DU BAS */}
          <div className="w-full">
            <div className="relative mt-4">
              <img
                src="/images/aria-logo.png"
                alt="Logo Aria"
                loading="lazy"
                decoding="async"
                className="aria-logo absolute -top-12 left-1/2 transform -translate-x-1/2 z-40 w-40 sm:w-44 md:w-48 h-auto object-contain filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
              />

              <div
                ref={logosRef}
                className="relative rounded-3xl h-full flex flex-col items-center justify-center overflow-hidden p-6 pt-20 mt-4 
                 bg-black/40
                 backdrop-blur-sm
                 border border-gray-500/40
                 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]
                 shadow-gray-900/50"
              >
                <div
                  className="absolute -top-10 left-0 right-0 h-20 z-30 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
                    maskImage:
                      "radial-gradient(ellipse 60% 50% at 50% 0%, black 40%, transparent 70%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 60% 50% at 50% 0%, black 40%, transparent 70%)",
                  }}
                />

                {!prefersReducedMotion && <AriaLogoRain />}

                <div
                  ref={carouselContainerRef}
                  className="w-full h-full relative"
                >
                  <ImageCarousel />
                </div>
              </div>
            </div>
          </div>
          <ScrollBadges badgesRef={badgesRef} />
        </div>
      </section>

      {isContactOpen && (
        <ContactModal
          onClose={() => setIsContactOpen(false)}
          onSubmitSuccess={() => setIsContactOpen(false)}
        />
      )}
    </>
  );
};

export default memo(HeroSection);
