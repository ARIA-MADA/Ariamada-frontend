import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const PrinciplesGrid = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cosmicCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const principles = [
    {
      title: "Équipe pluridisciplinaire",
      description: "Développeurs, designers, marketeurs et spécialistes IA travaillent ensemble pour couvrir tous les aspects de votre projet.",
      features: ["Expertise technique", "Créativité design", "Stratégie marketing", "Innovation IA"]
    },
    {
      title: "Approche orientée résultats",
      description: "Chaque livrable est pensé pour atteindre un objectif : plus de visibilité, plus de demandes, meilleure organisation interne.",
      features: ["Objectifs mesurables", "ROI optimisé", "Performance garantie", "Suivi continu"]
    },
    {
      title: "Process clair, sans jargon",
      description: "Nous vous expliquons chaque étape, avec un interlocuteur dédié et des points réguliers. Pas de surprise, pas de termes techniques incompréhensibles.",
      features: ["Communication transparente", "Pas de jargon technique", "Points réguliers", "Suivi simplifié"]
    },
    {
      title: "Accompagnement sur la durée",
      description: "Après la mise en ligne, nous restons là : maintenance, mises à jour, évolutions, nouveaux besoins.",
      features: ["Support continu", "Maintenance proactive", "Évolutions régulières", "Partenaire à long terme"]
    }
  ];

  useEffect(() => {
    if (!containerRef.current || cosmicCardsRef.current.length !== 4) return;

    const container = containerRef.current;
    const cards = cosmicCardsRef.current.filter(Boolean) as HTMLDivElement[];

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isMobile: '(max-width: 1023px)',
      },
      (context) => {
        const { isDesktop, isMobile } = context.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
        };

        if (isDesktop) {
          tl.current = gsap.timeline({
            scrollTrigger: {
              trigger: container,
              start: "top top",
              end: "+=1200px",
              pin: container,
              scrub: 1,
              anticipatePin: 1,
              markers: false
            }
          });

          tl.current
            // Phase 1 : cartes du centre (index 0 et 3 dans ton code fromTo)
            .fromTo(
              [cards[0], cards[3]],
              {
                opacity: 1,
                y: 0,
                scale: 1,
                rotationX: 0,
                rotationY: [0, 0],
                filter: "brightness(0.5) blur(10px)"
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                rotationX: 0,
                rotationY: [0, 0],
                filter: "brightness(1) blur(0px)",
                duration: 1.5,
                ease: "back.out(1.4)"
              },
              0
            )
            // Phase 2 : cartes extérieures (index 1 et 2)
            .fromTo(
              [cards[1], cards[2]],
              {
                opacity: 0,
                x: [-150, 150],
                y: 80,
                scale: 0.7,
                rotationX: 25,
                rotationY: [-20, 20],
                filter: "brightness(0.4) blur(15px)"
              },
              {
                opacity: 1,
                x: [0, 0],
                y: 0,
                scale: 1,
                rotationX: 0,
                rotationY: [0, 0],
                filter: "brightness(1) blur(0px)",
                duration: 1.8,
                ease: "back.out(1.5)"
              },
              0.8
            );
          // (tu peux ajouter une phase 3 ici si besoin, uniquement desktop)
        }

        if (isMobile) {
          // Sur mobile : aucune animation, cartes déjà affichées nettes
          gsap.set(cards, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotationX: 0,
            rotationY: 0,
            filter: "brightness(1) blur(0px)"
          });
        }

        // Hover (desktop + mobile, tu gardes ton comportement)
        cards.forEach((card, index) => {
          const enter = () => {
            gsap.to(card, {
              y: -8,
              scale: 1.03,
              rotationY: index % 2 === 0 ? -4 : 4,
              duration: 0.4,
              ease: "power2.out"
            });
          };

          const leave = () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              rotationY: 0,
              duration: 0.4,
              ease: "power2.out"
            });
          };

          card.addEventListener('mouseenter', enter);
          card.addEventListener('mouseleave', leave);

          // nettoyage listeners
          context.add(() => {
            card.removeEventListener('mouseenter', enter);
            card.removeEventListener('mouseleave', leave);
          });
        });

        return () => {
          if (tl.current) {
            tl.current.scrollTrigger?.kill();
            tl.current.kill();
            tl.current = null;
          }
          context.revert();
        };
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-subtle-float { animation: subtle-float 5s ease-in-out infinite; }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.2); }
          50% { box-shadow: 0 0 30px rgba(249, 115, 22, 0.4); }
        }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
      `}</style>

      <div
        ref={containerRef}
        className="relative max-w-7xl mx-auto mb-20 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full max-w-6xl">
          {principles.map((principle, index) => (
            <div
              key={index}
              ref={el => (cosmicCardsRef.current[index] = el)}
              className="group relative h-[320px] md:h-[360px] lg:h-[380px]"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/10 via-orange-400/5 to-orange-500/10 rounded-2xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

              <div className="relative h-full rounded-2xl bg-gradient-to-br from-gray-800/60 to-slate-900/50 backdrop-blur-xl border border-orange-400/20 hover:border-orange-300/40 transition-all duration-500 group-hover:shadow-[0_15px_40px_rgba(249,115,22,0.2)] shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                <div className="relative p-5 md:p-6 lg:p-7 h-full flex flex-col z-10">
                  <h3 className="text-base md:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-orange-300 mb-3 group-hover:from-orange-100 group-hover:to-orange-200 transition-colors duration-300">
                    {principle.title}
                  </h3>

                  <p className="text-xs md:text-sm text-gray-300/85 mb-5 md:mb-6 flex-grow leading-relaxed">
                    {principle.description}
                  </p>

                  <div className="mt-auto pt-4 md:pt-5 border-t border-orange-400/15">
                    <ul className="space-y-2">
                      {principle.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center group/feature">
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full mr-2.5 group-hover/feature:scale-110 transition-transform duration-300" />
                          <span className="text-xs md:text-sm text-gray-300/75 group-hover/feature:text-orange-200 transition-colors	duration-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="absolute top-3 left-3 w-1 h-1 bg-orange-400/50 rounded-full blur-sm animate-pulse" />
                <div className="absolute bottom-3 right-3 w-1 h-1 bg-orange-400/50 rounded-full blur-sm animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PrinciplesGrid;
