import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const ProcessSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const processSteps = [
    { step: "1", title: "Analyse et stratégie", description: "Nous prenons le temps de comprendre vos enjeux pour bâtir une stratégie sur-mesure adaptée à vos objectifs." },
    { step: "2", title: "Conception & maquette", description: "Nous créons des maquettes interactives qui préfigurent le résultat final avant tout développement." },
    { step: "3", title: "Développement & intégration", description: "Nous développons des solutions robustes, performantes et sécurisées avec les technologies les plus récentes." },
    { step: "4", title: "Lancement & suivi", description: "Nous assurons le déploiement et un accompagnement continu pour optimiser vos performances." }
  ];

  useEffect(() => {
    if (!containerRef.current || stepRefs.current.length !== 4) return;

    // Animation de la vidéo
    gsap.fromTo(videoRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out"
      }
    );

    const container = containerRef.current;
    const steps = stepRefs.current.filter(Boolean) as HTMLDivElement[];

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        isMobile: '(max-width: 767px)',
      },
      (context) => {
        const { isDesktop, isMobile } = context.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
        };

        if (isDesktop) {
          // === DESKTOP : ANIMATIONS COMPLÈTES ===
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: "+=1200px",
              pin: container,
              scrub: 1.5,
              anticipatePin: 1
            }
          });

          tl.fromTo(steps[0],
            { opacity: 0, scale: 0.7, y: 60, rotationY: -90, filter: "brightness(0.4) blur(10px)" },
            { opacity: 1, scale: 1, y: 0, rotationY: 0, filter: "brightness(1) blur(0px)", duration: 1.2, ease: "elastic.out(1, 0.4)" },
            0
          )
            .fromTo(steps[1],
              { opacity: 0, scale: 0.75, y: 70, rotationY: 90, filter: "brightness(0.4) blur(10px)" },
              { opacity: 1, scale: 1, y: 0, rotationY: 0, filter: "brightness(1) blur(0px)", duration: 1.3, ease: "elastic.out(1, 0.4)" },
              0.4
            )
            .fromTo(steps[2],
              { opacity: 0, scale: 0.8, y: 80, rotationX: 45, filter: "brightness(0.4) blur(10px)" },
              { opacity: 1, scale: 1, y: 0, rotationX: 0, filter: "brightness(1) blur(0px)", duration: 1.4, ease: "back.out(1.7)" },
              0.8
            )
            .fromTo(steps[3],
              { opacity: 0, scale: 0.65, y: 90, rotationX: -45, rotationY: 180, filter: "brightness(0.4) blur(10px)" },
              { opacity: 1, scale: 1, y: 0, rotationX: 0, rotationY: 0, filter: "brightness(1) blur(0px)", duration: 1.5, ease: "elastic.out(1.3)" },
              1.2
            )
            .to({}, { duration: 2 }, 3.0)
            .to(steps, {
              y: "-=12",
              rotationY: "+=8",
              scale: 1.02,
              stagger: 0.1,
              duration: 1.5,
              ease: "sine.inOut"
            }, 5.0)
            .to(steps, {
              y: -80,
              scale: 1.1,
              opacity: 0,
              rotationX: -20,
              filter: "brightness(1.5) blur(8px)",
              stagger: { amount: 0.5, from: "end" },
              duration: 1.8,
              ease: "power3.in"
            }, 6.0);

          return () => {
            tl.kill();
          };
        } else {
          // === MOBILE : ENTRÉE UNIQUEMENT, PAS DE SORTIE ===
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            }
          });

          tl.fromTo(steps[0],
            { opacity: 0, scale: 0.7, y: 60, rotationY: -90, filter: "brightness(0.4) blur(10px)" },
            { opacity: 1, scale: 1, y: 0, rotationY: 0, filter: "brightness(1) blur(0px)", duration: 1.2, ease: "elastic.out(1, 0.4)" },
            0
          )
            .fromTo(steps[1],
              { opacity: 0, scale: 0.75, y: 70, rotationY: 90, filter: "brightness(0.4) blur(10px)" },
              { opacity: 1, scale: 1, y: 0, rotationY: 0, filter: "brightness(1) blur(0px)", duration: 1.3, ease: "elastic.out(1, 0.4)" },
              0.3
            )
            .fromTo(steps[2],
              { opacity: 0, scale: 0.8, y: 80, rotationX: 45, filter: "brightness(0.4) blur(10px)" },
              { opacity: 1, scale: 1, y: 0, rotationX: 0, filter: "brightness(1) blur(0px)", duration: 1.4, ease: "back.out(1.7)" },
              0.6
            )
            .fromTo(steps[3],
              { opacity: 0, scale: 0.65, y: 90, rotationX: -45, rotationY: 180, filter: "brightness(0.4) blur(10px)" },
              { opacity: 1, scale: 1, y: 0, rotationX: 0, rotationY: 0, filter: "brightness(1) blur(0px)", duration: 1.5, ease: "elastic.out(1.3)" },
              0.9
            );

          return () => {
            tl.kill();
          };
        }
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <>
      <style>{`
        /* Style pour la section full width */
        .full-width-section {
          width: 100vw;
          position: relative;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
        }
        
        /* Pour les écrans très larges */
        @media (min-width: 1920px) {
          .full-width-section {
            max-width: 100vw;
          }
        }
        
        /* Animation pour les numéros d'étape */
        @keyframes stepGlow {
          0%, 100% { 
            box-shadow: 0 0 15px rgba(249, 115, 22, 0.3);
          }
          50% { 
            box-shadow: 0 0 25px rgba(249, 115, 22, 0.5);
          }
        }
      `}</style>

      {/* Section avec vidéo de fond et largeur complète */}
      <section 
        ref={sectionRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden py-16 full-width-section"
      >
        {/* Vidéo de fond pour toute la section */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="images/baoba.webm" type="video/webm" />
            {/* Fallback si la vidéo ne charge pas */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          </video>

          {/* Overlay sombre avec flou pour améliorer la lisibilité */}
          <div className="absolute inset-0  backdrop-blur-[5px]" />
        </div>

        {/* Contenu principal */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={containerRef}
            className="flex flex-col items-center justify-center mb-16 sm:mb-20"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-white mb-8 sm:mb-12 sm:mb-16 leading-tight tracking-wide max-w-4xl mx-auto px-2">
              Un process simple et transparent
            </h3>
            <p className="text-gray-300/80 text-center max-w-2xl mx-auto mb-12 md:mb-20 text-sm md:text-lg leading-relaxed backdrop-blur-sm bg-black/30 rounded-xl py-3 px-4">
              Pour que votre projet avance sereinement et efficacement, nous suivons un processus clair en 4 étapes.
            </p>

            {/* ✅ MOBILE: 1 COLONNE, DESKTOP: 4 COLONNES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto w-full px-2 md:px-4">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  ref={el => stepRefs.current[index] = el}
                  className="process-step group h-[280px] md:h-[320px] lg:h-[360px] perspective-1000"
                  style={{ perspective: '1000px' }}
                >
                  <div className="relative h-full bg-gradient-to-br from-gray-800/70 to-gray-900/60 backdrop-blur-xl rounded-2xl p-5 md:p-7 border border-orange-400/20 hover:border-orange-300/40 transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(249,115,22,0.25)] shadow-xl overflow-hidden flex flex-col justify-center transform-style-3d">
                  
                    {/* Numéro de l'étape avec animation */}
                    <div className="flex items-center justify-center mb-4 md:mb-6 relative z-10">
                      <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-200 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-orange-500/20 border border-orange-400/30 animate-step-glow" 
                           style={{ animation: 'stepGlow 3s ease-in-out infinite' }}>
                        {step.step}
                      </div>
                    </div>

                    <h4 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 relative z-10 leading-tight text-center px-2">
                      {step.title}
                    </h4>

                    <p className="text-gray-300/90 text-xs md:text-sm leading-relaxed flex-grow relative z-10 px-2 text-center">
                      {step.description}
                    </p>

                    {/* Effet de lumière au hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-400/0 to-orange-300/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-orange-400/30 to-transparent transform -translate-x-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProcessSection;