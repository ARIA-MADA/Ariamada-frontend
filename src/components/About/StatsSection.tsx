import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const StatsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  const sections = [
    {
      id: 1,
      text: "ARIA s'appuie sur une équipe de <span class='highlight-text'>25 talents expérimentés</span>, dont un pôle central de développeurs seniors disposant de <span class='highlight-text'>plusieurs années d'expérience dans la conception et le déploiement de solutions digitales complexes. </span>",
      position: 'left'
    },
    {
      id: 2,
      text: "Nos développeurs maîtrisent l'ensemble de la chaîne technique : architecture applicative, développement web et mobile, solutions cloud, sécurité, performance et intégration de l'intelligence artificielle. Habitués à travailler sur des projets à forts enjeux, ils conçoivent des plateformes <span class='highlight-text'>robustes, évolutives et orientées résultats</span>, capables d'accompagner la croissance des entreprises sur le long terme.",
      position: 'center'
    },
    {
      id: 3,
      text: "Autour de ce socle technique solide, nos community managers et monteurs vidéo assurent la cohérence de l'image, la visibilité des marques et la valorisation des contenus sur l'ensemble des canaux digitaux.",
      position: 'right'
    },
    {
      id: 4,
      text: "Cette organisation permet à ARIA de proposer des solutions complètes, maîtrisées de bout en bout, avec un haut niveau d'exigence technique et stratégique.",
      position: 'center'
    }
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animation du titre - plus rapide
      gsap.fromTo(titleRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1, // Réduit de 1.5 à 1
          delay: 0.3, // Réduit de 0.5 à 0.3
          ease: "power4.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 90%"
          }
        }
      );

      // Animation séquentielle des sections - plus rapide
      contentRefs.current.forEach((section, index) => {
        if (!section) return;

        const delay = 0.5 + (index * 0.2); // Réduit de 0.8 à 0.5 et 0.3 à 0.2
        const direction = index % 2 === 0 ? -50 : 50;

        gsap.fromTo(section,
          {
            opacity: 0,
            x: direction,
            scale: 0.95,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8, // Réduit de 1.2 à 0.8
            delay: delay,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Animation des textes en surbrillance - plus rapide
      gsap.fromTo('.highlight-text',
        {
          opacity: 0,
          scale: 0.95,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6, // Réduit de 0.8 à 0.6
          delay: 0.7, // Réduit de 1 à 0.7
          stagger: 0.08, // Réduit de 0.1 à 0.08
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @keyframes titleGlow {
          0%, 100% { 
            filter: drop-shadow(0 0 20px rgba(249, 115, 22, 0.5));
          }
          50% { 
            filter: drop-shadow(0 0 35px rgba(249, 115, 22, 0.8));
          }
        }
        
        .animate-title-glow { 
          animation: titleGlow 4s ease-in-out infinite; 
        }
        
        .highlight-text {
          font-weight: 700;
          color: #fb923c;
          position: relative;
          display: inline-block;
        }
        
        .highlight-text::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, rgba(251, 146, 60, 0.8), rgba(251, 146, 60, 0.2));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        
        .section-content:hover .highlight-text::after {
          transform: scaleX(1);
        }
        
        .section-content p {
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
          line-height: 1.9; /* Augmenté de 1.8 à 1.9 */
          font-size: 1.25rem; /* Augmenté de 1.125rem à 1.25rem */
        }
        
        .image-caption {
          font-style: italic;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.95rem; /* Légèrement augmenté */
          margin-top: 0.75rem; /* Légèrement augmenté */
          text-align: center;
        }
        
        .image-placeholder {
          background: linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8));
          border-radius: 0.75rem;
          overflow: hidden;
          position: relative;
        }
        
        .image-placeholder::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent, rgba(249, 115, 22, 0.1), transparent);
        }
      `}</style>

      {/* Section avec fond normal */}
<section 
  ref={containerRef} 
  className="relative bg-gradient-to-br from-gray-900 via-gray-850 to-gray-950 py-24 w-screen -mx-4 -ml-[calc(50vw-50%)] -mr-[calc(50vw-50%)] px-[calc(50vw-50%)]"
>
        {/* Titre principal - légèrement plus grand */}
        <div className="text-center mb-16">
          <div ref={titleRef} className="inline-block">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4"> {/* Changé de lg:text-6xl à lg:text-7xl */}
              Notre <span className="text-orange-400">équipe</span>
            </h2>
            <div className="w-48 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto rounded-full mt-6"></div>
          </div>
        </div>

        {/* Contenu avec mise en page spécifique */}
        <div className="max-w-7xl mx-auto space-y-24"> {/* Augmenté de space-y-20 à space-y-24 */}

          {/* Section 1: Paragraphe à gauche, image à droite */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div
              ref={el => (contentRefs.current[0] = el)}
              className="section-content"
            >
              <p
                className="text-xl md:text-2xl text-white/95 leading-relaxed text-center" 
                dangerouslySetInnerHTML={{ __html: sections[0].text }}
              />
            </div>
            <div className="image-placeholder aspect-video">
             
                <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src="/images/equipe2.png" 
                  alt="Une partie de l'équipe de direction et ses développeurs"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              
                <p className="text-white/70 text-center text-lg mt-4"> {/* Ajouté text-lg et mt-4 */}
                  Équipe de talents travaillant en collaboration
                </p>
                <p className="text-sm text-white/50 mt-2">Dans bureau</p>
              </div>
            </div>
          </div>

          {/* Section 2: Paragraphe centré */}
          <div
            ref={el => (contentRefs.current[1] = el)}
            className="section-content max-w-5xl mx-auto"
          >
            <p className="text-xl md:text-2xl text-white/95 leading-relaxed text-center" /* Changé de text-lg md:text-xl à text-xl md:text-2xl */
              dangerouslySetInnerHTML={{ __html: sections[1].text }} />

          </div>

          {/* Section 3: Image à gauche, paragraphe à droite */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              {/* Remplacez le placeholder par votre vraie image */}
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src="/images/equipe.PNG" // Chemin de votre image
                  alt="Une partie de l'équipe de direction et ses développeurs"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <p className="image-caption mt-4 text-base"> {/* Ajouté text-base */}
                « Une partie de l'équipe de direction et ses développeurs »
              </p>
            </div>
            <div
              ref={el => (contentRefs.current[2] = el)}
              className="section-content order-1 lg:order-2"
            >
              <p className="text-xl md:text-2xl text-white/95 leading-relaxed text-center"> {/* Changé de text-lg md:text-xl à text-xl md:text-2xl */}
                {sections[2].text}
              </p>
            </div>
          </div>

          {/* Section 4: Paragraphe centré */}
          <div
            ref={el => (contentRefs.current[3] = el)}
            className="section-content max-w-4xl mx-auto"
          >
            <p className="text-xl md:text-2xl text-white/95 leading-relaxed text-center"> {/* Changé de text-lg md:text-xl à text-xl md:text-2xl */}
              {sections[3].text}
            </p>
          </div>

        </div>

        {/* Indicateur de fin de section */}
        <div className="mt-20 flex justify-center">
          <div className="flex items-center space-x-3 text-orange-300/90">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-orange-400/50"></div>
            <span className="text-sm font-light">Notre expertise</span>
            <div className="w-8 h-px bg-gradient-to-r from-orange-400/50 to-transparent"></div>
          </div>
        </div>

      </section>
    </>
  );
};

export default StatsSection;