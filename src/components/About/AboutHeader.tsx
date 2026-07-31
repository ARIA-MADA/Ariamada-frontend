import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const AboutHeader = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const storyContainerRef = useRef<HTMLDivElement>(null);
  const storyLinesRef = useRef<(HTMLDivElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const story = [
    "<span class='highlight-text'>ARIA</span> est née d'une conviction simple : <span class='highlight-text'> le digital n'a de valeur que s'il crée de la croissance réelle. </span>",
    "  À la croisée de la stratégie, du design et de la technologie, ARIA accompagne les entreprises dans la conception de <span class='highlight-text'> sites web, d'applications, d'identités visuelles et de solutions d'intelligence artificielle</span> pensées pour durer.",
    "Chaque projet débute par l'écoute, se construit avec exigence et se mesure par l'impact. Nous ne cherchons pas l'effet de mode, mais <span class='highlight-text'> la justesse, la performance et la cohérence. </span> ",
    "ARIA, c'est une équipe qui transforme des idées ambitieuses en <span class='highlight-text'> outils concrets,</span> capables de structurer une marque, d'optimiser un business et d'accompagner sa croissance sur le long terme",
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animation de la vidéo - plus rapide
      gsap.fromTo(videoRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out"
        }
      );

      // Animation d'entrée principale - plus rapide
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.5,
          delay: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animation du titre - plus rapide
      gsap.fromTo(titleRef.current,
        {
          opacity: 0,
          y: 40,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 92%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animation séquentielle des lignes de l'histoire - plus rapide
      storyLinesRef.current.forEach((line, index) => {
        if (!line) return;

        gsap.fromTo(line,
          {
            opacity: 0,
            y: 15,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: 0.2 + (index * 0.05),
            ease: "power2.out",
            scrollTrigger: {
              trigger: line,
              start: "top 95%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Animation des textes en surbrillance - plus rapide
      gsap.fromTo('.highlight-text',
        {
          opacity: 0,
          scale: 0.98,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          delay: 0.3,
          stagger: 0.03,
          ease: "power1.out",
          scrollTrigger: {
            trigger: storyContainerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animation optimisée pour la ligne décorative
      gsap.fromTo('.w-48.h-1',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.4,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Effet parallax pour le contenu
      gsap.to(sectionRef.current, {
        y: 100,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });

    }, sectionRef);

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
          animation: titleGlow 3s ease-in-out infinite;
        }
        
        .highlight-text {
          font-weight: 700;
          color: #fb923c;
          position: relative;
          display: inline-block;
          transition: all 0.2s ease;
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
          transition: transform 0.2s ease;
        }
        
        .story-line:hover .highlight-text::after {
          transform: scaleX(1);
        }
        
        .story-line p {
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
          line-height: 1.6;
        }
        
        .section-subtitle {
          position: relative;
          display: inline-block;
          margin-bottom: 3rem;
        }
        
        .section-subtitle::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, transparent, #fb923c, transparent);
        }
        
        /* Style pour la vidéo fixed */
        .video-fixed-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          z-index: 0;
          pointer-events: none;
        }
        
        /* Style pour la section de contenu */
        .content-section {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
          
      `}</style>

      {/* Conteneur vidéo fixed */}
      <div ref={videoContainerRef} className="video-fixed-container">
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="images/baobab.webm" type="video/webm" />
            {/* Fallback image si la vidéo ne charge pas */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          </video>

          {/* Overlay sombre pour améliorer la lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>
      </div>

      {/* Section de contenu qui défile */}
      <section ref={sectionRef} className="content-section overflow-hidden">
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Titre principal */}
          <div ref={titleRef} className="mb-8 text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Découvrez <span className="text-orange-400">notre équipe</span>
            </h2>
            <div className="w-48 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto rounded-full mt-6 transform origin-left"></div>
          </div>

          {/* Conteneur de l'histoire - une seule carte */}
          <div
            ref={storyContainerRef}
            className="relative group"
          >
            {/* Effet de flou avec transparence pour voir la vidéo en arrière-plan */}
            <div className="relative backdrop-blur-lg bg-black/40 rounded-2xl p-8 md:p-10 lg:p-12 border border-white/20 shadow-2xl shadow-black/50">
              <div className="space-y-6 text-center">
                {story.map((line, index) => (
                  <div
                    key={index}
                    ref={el => (storyLinesRef.current[index] = el)}
                    className="story-line transition-all duration-150 hover:translate-x-1"
                  >
                    <p
                      className="text-lg md:text-xl text-white/95 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: line }}
                    />
                  </div>
                ))}
              </div>

              {/* Signature en bas à droite */}
              <div className="mt-10 pt-8 border-t border-white/20 flex justify-end">
                <div className="text-right">
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-400">
                    ARIA
                  </div>
                  <div className="text-sm text-white/60 mt-1">
                    Votre partenaire digital de confiance
                  </div>
                </div>
              </div>

              {/* Points décoratifs */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-orange-500/30 rounded-full blur-sm"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-orange-500/30 rounded-full blur-sm"></div>
            </div>
          </div>

          {/* Indicateur de scroll */}
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-3 text-orange-300/90">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-orange-400/50"></div>
              <span className="text-sm font-light">Notre histoire</span>
              <div className="w-8 h-px bg-gradient-to-r from-orange-400/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutHeader;