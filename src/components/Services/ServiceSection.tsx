import React, { useRef, useEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ServiceModal from './ServiceModal';

const serviceImages = [
  "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1677442135451-3ad6f001d8b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1676299081911-4c2c8fb4c0dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
];

gsap.registerPlugin(ScrollTrigger);

interface Step {
  title: string;
  description: string;
}

interface Example {
  icon?: string;
  title: string;
  description: string;
}

interface Service {
  title: string;
  description: string;
  features: string[];
  cta: string;
  detailedDescription: string;
  process: Step[];
  technologies: string[];
  benefits: string[];
  examples: Example[];
}

const ServiceSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerSectionRef = useRef<HTMLDivElement>(null);
  const headerContentRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardsSectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [hoveredTitleLetters, setHoveredTitleLetters] = useState<Set<number>>(new Set());
  const [hoveredSubtitleLetters, setHoveredSubtitleLetters] = useState<Set<number>>(new Set());
  const autoSpinIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Texte du titre
  const titleText = "AU SERVICE DE VOTRE CROISSANCE";
  // Texte du sous-titre
  const subtitleText = "Nous vous accompagnons à chaque étape de votre présence digitale : de l'idée à la mise en ligne, puis à l'optimisation de vos résultats.";

  const handleTitleLetterMouseEnter = (index: number) => {
    setHoveredTitleLetters(prev => new Set([...prev, index]));
    setTimeout(() => {
      setHoveredTitleLetters(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }, 400);
  };

  const handleSubtitleLetterMouseEnter = (index: number) => {
    setHoveredSubtitleLetters(prev => new Set([...prev, index]));
    setTimeout(() => {
      setHoveredSubtitleLetters(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }, 400);
  };

  // Animation automatique toutes les 10 secondes
  useEffect(() => {
    const spinRandomLetters = () => {
      // Pour le titre
      const titleLength = titleText.length;
      const subtitleLength = subtitleText.length;

      // Choisir 3 lettres aléatoires dans le titre
      const titleIndices = new Set<number>();
      while (titleIndices.size < 3) {
        const randomIndex = Math.floor(Math.random() * titleLength);
        if (titleText[randomIndex] !== ' ') {
          titleIndices.add(randomIndex);
        }
      }

      // Choisir 5 lettres aléatoires dans le sous-titre
      const subtitleIndices = new Set<number>();
      while (subtitleIndices.size < 5) {
        const randomIndex = Math.floor(Math.random() * subtitleLength);
        if (subtitleText[randomIndex] !== ' ' && subtitleText[randomIndex] !== ':') {
          subtitleIndices.add(randomIndex);
        }
      }

      // Appliquer l'animation
      setHoveredTitleLetters(titleIndices);
      setHoveredSubtitleLetters(subtitleIndices);

      // Enlever l'animation après 400ms
      setTimeout(() => {
        setHoveredTitleLetters(new Set());
        setHoveredSubtitleLetters(new Set());
      }, 400);
    };

    // Lancer l'animation automatique toutes les 10 secondes
    autoSpinIntervalRef.current = setInterval(spinRandomLetters, 10000);

    // Lancer une première animation après 2 secondes
    const initialTimeout = setTimeout(spinRandomLetters, 2000);

    return () => {
      if (autoSpinIntervalRef.current) {
        clearInterval(autoSpinIntervalRef.current);
      }
      clearTimeout(initialTimeout);
    };
  }, []);

  // Memoize services data
  const services = useMemo<Service[]>(() => [
    {
      title: "Développement Web & Mobile",
      description: "Des sites et applications modernes, rapides et pensées pour convertir.",
      features: ["Site vitrine professionnel", "Site e-commerce", "Application web sur-mesure", "Imagination de vos outils métier"],
      cta: "Découvrir nos solutions",
      detailedDescription: "Nous créons des solutions digitales performantes qui allient esthétique, fonctionnalité et expérience utilisateur. Chaque projet est conçu pour répondre spécifiquement à vos besoins métier tout en garantissant une performance optimale sur tous les appareils.",
      process: [
        { title: "Analyse & Stratégie", description: "Compréhension approfondie de vos besoins et objectifs" },
        { title: "Design UX/UI", description: "Création d'interfaces intuitives et engageantes" },
        { title: "Développement", description: "Codage avec les technologies les plus récentes" },
        { title: "Tests & Optimisation", description: "Assurance qualité et performances" },
        { title: "Déploiement", description: "Mise en ligne et configuration" },
        { title: "Maintenance", description: "Support continu et évolutions" }
      ],
      technologies: ["React", "Next.js", "Node.js", "TypeScript", "React Native", "MongoDB", "AWS", "Docker"],
      benefits: [
        "Temps de chargement ultra-rapide",
        "Design responsive optimisé",
        "SEO intégré dès la conception",
        "Sécurité renforcée",
        "Évolutivité garantie",
        "Support technique 24/7"
      ],
      examples: [
        { icon: "", title: "Portail Entreprise", description: "Solution complète avec gestion des employés" },
        { icon: "", title: "E-commerce Premium", description: "Plateforme avec paiement sécurisé" },
        { icon: "", title: "Application Mobile", description: "App iOS & Android synchronisée" }
      ]
    },
    {
      title: "Branding & Design Graphique",
      description: "Une identité visuelle forte pour une marque mémorable.",
      features: ["Création ou refonte de logo", "Charte graphique complète", "Cartes de visite, plaquettes, affiches", "Visuels pour réseaux sociaux"],
      cta: "Voir nos réalisations",
      detailedDescription: "Nous donnons vie à votre identité de marque à travers des designs distinctifs et cohérents. Notre approche créative combine stratégie marketing et design pour créer une identité visuelle qui parle à votre audience et renforce votre positionnement.",
      process: [
        { title: "Audit de Marque", description: "Analyse de votre positionnement actuel" },
        { title: "Direction Artistique", description: "Définition de l'univers visuel" },
        { title: "Création Logo", description: "Design d'un symbole mémorable" },
        { title: "Charte Graphique", description: "Développement de l'identité complète" },
        { title: "Applications", description: "Adaptation sur tous supports" },
        { title: "Guide d'Utilisation", description: "Manuel pour une utilisation cohérente" }
      ],
      technologies: ["Adobe Creative Suite", "Figma", "Blender 3D", "After Effects", "Procreate", "Sketch"],
      benefits: [
        "Identité unique et mémorable",
        "Cohérence sur tous supports",
        "Adaptation à tous formats",
        "Évolution dans le temps",
        "Impact visuel immédiat",
        "Renforcement de la notoriété"
      ],
      examples: [
        { title: "Rebranding", description: "Rafraîchissement complet d'identité" },
        { title: "Identité Startup", description: "Création de A à Z pour lancement" },
        { title: "Packaging", description: "Design de produits physiques" }
      ]
    },
    {
      title: "Marketing Digital & Réseaux Sociaux",
      description: "Plus de visibilité, plus de clients, moins de perte de temps.",
      features: ["Gestion de réseaux sociaux", "Création de contenu", "Campagnes publicitaires", "Stratégie digitale sur mesure"],
      cta: "Booster ma visibilité",
      detailedDescription: "Nous développons et exécutons des stratégies digitales qui génèrent des résultats mesurables. De la création de contenu engageant à l'optimisation des campagnes publicitaires, nous maximisons votre ROI digital.",
      process: [
        { title: "Audit Digital", description: "Analyse complète de votre présence en ligne" },
        { title: "Stratégie Contenu", description: "Planification éditoriale adaptée" },
        { title: "Création de Contenu", description: "Production de contenus engageants" },
        { title: "Gestion Réseaux", description: "Animation et communauté" },
        { title: "Campagnes Pub", description: "Publicités ciblées et optimisées" },
        { title: "Analyse & Reporting", description: "Suivi des performances et ajustements" }
      ],
      technologies: ["Google Ads", "Meta Business", "LinkedIn Ads", "SEMrush", "HubSpot", "Mailchimp", "Hootsuite"],
      benefits: [
        "Visibilité accrue",
        "Lead generation qualifiée",
        "ROI mesurable",
        "Communauté engagée",
        "Contenu viral optimisé",
        "Croissance organique"
      ],
      examples: [
        { title: "Campagne LinkedIn", description: "Génération de leads B2B qualifiés" },
        { title: "Stratégie Instagram", description: "Développement de communauté" },
        { title: "Email Marketing", description: "Automation et personnalisation" }
      ]
    },
    {
      title: "Solutions Entreprises (IA & Automatisation)",
      description: "Gagnez en efficacité grâce à des outils intelligents.",
      features: ["Chatbots et call centers IA", "Automatisation des processus", "Outils internes & dashboards", "Intégration d'API et systèmes"],
      cta: "Découvrir nos solutions IA",
      detailedDescription: "Nous concevons et implémentons des solutions d'intelligence artificielle et d'automatisation qui transforment vos processus métier. De la simple automatisation à l'IA générative avancée, nous optimisons votre productivité.",
      process: [
        { title: "Diagnostic Processus", description: "Identification des points d'optimisation" },
        { title: "Conception Solution", description: "Architecture technique de la solution" },
        { title: "Développement IA", description: "Intégration des modèles d'IA" },
        { title: "Automatisation", description: "Création des workflows automatisés" },
        { title: "Formation Équipe", description: "Accompagnement à l'adoption" },
        { title: "Optimisation Continue", description: "Amélioration basée sur les données" }
      ],
      technologies: ["Python", "TensorFlow", "OpenAI API", "RPA", "Power Automate", "Zapier", "Azure AI", "Custom APIs"],
      benefits: [
        "Réduction des coûts opérationnels",
        "Élimination des erreurs humaines",
        "Gains de productivité 24/7",
        "Décisions data-driven",
        "Scalabilité automatique",
        "Innovation continue"
      ],
      examples: [
        { title: "Chatbot Support", description: "Assistance client automatisée 24/7" },
        { title: "Automatisation RH", description: "Gestion des processus recrutement" },
        { title: "Dashboard IA", description: "Tableaux de bord prédictifs" }
      ]
    }
  ], []);

  useEffect(() => {
    const mm = gsap.matchMedia();
    let ctx: gsap.Context | null = null;

    // Animation d’entrée du header
    if (headerContentRef.current) {
      const headerAnimation = gsap.from(headerContentRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3
      });

      return () => {
        headerAnimation.kill();
      };
    }
  }, []);

  // Animation principale GSAP
  useEffect(() => {
    const mm = gsap.matchMedia();
    let ctx: gsap.Context | null = null;

    // Créer un contexte GSAP principal
    ctx = gsap.context(() => {
      /* ===============================
         DESKTOP ONLY
      ================================ */
      mm.add("(min-width: 1024px)", () => {
        // Vérifier que toutes les refs existent
        if (!sectionRef.current || !headerSectionRef.current || !cardsSectionRef.current) {
          console.warn("GSAP: Some refs are null, skipping desktop animation");
          return;
        }

        // Configurer les états initiaux
        gsap.set(headerSectionRef.current, {
          opacity: 1,
          x: 0,
          rotationY: 0,
          scale: 1,
          zIndex: 2
        });

        gsap.set(cardsSectionRef.current, {
          opacity: 0,
          scale: 1,
          zIndex: 1
        });

        // Appliquer le flou initial seulement si l'élément existe
        if (cardsSectionRef.current) {
          cardsSectionRef.current.style.filter = "blur(24px)";
        }

        // Créer la timeline avec ScrollTrigger
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=120%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });

        // Animation du header
        tl.to(headerSectionRef.current, {
          x: -window.innerWidth * 1.1,
          rotationY: -35,
          scale: 0.85,
          opacity: 0,
          ease: "power2.inOut",
          duration: 1
        });

        // Animation de la section des cartes
        tl.to(cardsSectionRef.current, {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        }, "<+=0.2");

        // Animation de révélation avec vérification de null
        tl.fromTo(
          cardsSectionRef.current,
          {
            "--reveal": "100%"
          },
          {
            "--reveal": "0%",
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: function() {
              // VÉRIFICATION CRITIQUE ICI - ligne ~331
              if (!cardsSectionRef.current) return;
              const p = this.progress();
              cardsSectionRef.current.style.filter = `blur(${24 - 24 * p}px)`;
            },
            onComplete: function() {
              // Optionnel: enlever le filtre à la fin
              if (cardsSectionRef.current) {
                cardsSectionRef.current.style.filter = "blur(0px)";
              }
            }
          },
          "<"
        );
      });

      /* ===============================
         MOBILE ONLY
      ================================ */
      mm.add("(max-width: 1023px)", () => {
        if (cardsSectionRef.current) {
          gsap.set(cardsSectionRef.current, {
            opacity: 1,
            clearProps: "all"
          });
        }
      });

      /* ===============================
         ANIMATION DES CARTES INDIVIDUELLES
      ================================ */
      if (cardsRef.current.length > 0 && cardsContainerRef.current) {
        cardsRef.current.forEach((card, index) => {
          if (!card) return;

          // Position initiale
          gsap.set(card, { 
            opacity: 0, 
            x: 60, 
            filter: 'blur(24px)' 
          });

          // Animation d'entrée
          gsap.to(card, {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              end: 'top 60%',
              toggleActions: 'play none none none',
              markers: false // Définir à true pour debug
            },
            delay: index * 0.1
          });
        });
      }

    }, sectionRef); // Scoper toutes les animations à la section principale

    return () => {
      // Cleanup complet
      if (ctx) {
        ctx.revert();
      }
      mm.revert();
      
      // Nettoyer les intervalles automatiques
      if (autoSpinIntervalRef.current) {
        clearInterval(autoSpinIntervalRef.current);
      }
    };
  }, []);

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  const handleOpenModal = (index: number) => {
    setSelectedService(index);
  };

  return (
    <>
      <style>{`
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .card-glow {
          position: absolute;
          inset: 0;
          border-radius: 1.5rem;
          background: radial-gradient(circle at center, rgba(249, 115, 22, 0.2), transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: -1;
        }
        .card-background {
          transition: transform 0.8s ease, opacity 0.5s ease;
        }
        .group:hover .card-background {
          transform: scale(1.05);
        }
        /* Animation de rotation des lettres */
        @keyframes spinLetter {
          0% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.2);
          }
          100% {
            transform: rotate(360deg) scale(1);
          }
        }
        .spin-letter {
          animation: spinLetter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        /* Style pour les lettres du sous-titre */
        .subtitle-letter {
          display: inline-block;
          transition: all 0.3s;
        }
        /* Style pour les lettres du titre */
        .title-letter {
          display: inline-block;
          transition: all 0.3s;
        }
        /* Optimisations de performance */
        .will-change-transform {
          will-change: transform;
        }
        /* Conteneur principal */
        .service-section-container {
          position: relative;
          overflow: hidden;
          height: 100vh;
        }
        /* Styles pour les sections */
        .sections-wrapper {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        /* SECTION HEADER */
        .header-section {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          z-index: 2;
        }

        /* SECTION CARDS */
        .cards-section {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 130vh;
          display: flex;
          align-items: center;
          opacity: 0;
          filter: blur(24px);
          z-index: 1;
        }
        
        .cards-section::after {
          content: "";
          position: absolute;
          inset: 0;
          background: inherit;
          backdrop-filter: blur(24px);
          mask-image: linear-gradient(to left, black 0%, black 50%, transparent 100%);
          -webkit-mask-image: linear-gradient(to left, black 0%, black 50%, transparent 100%);
          pointer-events: none;
        }

        /* Correction pour le footer */
        .cards-section {
          padding-bottom: 4rem;
        }
        
        /* Masquer la scrollbar horizontale */
        html, body {
          overflow-x: hidden;
        }
        
        /* ===============================
           VERSION MOBILE
        ================================ */
        @media (max-width: 1023px) {
          .service-section-container {
            height: auto;
            overflow: visible;
          }

          .header-section,
          .cards-section {
            position: relative !important;
            height: auto !important;
            inset: unset !important;
            opacity: 1 !important;
            filter: none !important;
            transform: none !important;
          }

          .cards-section {
            padding-top: 4rem;
          }
        }
        
        /* ===== HEADER PLUS BAS SUR MOBILE ===== */
        @media (max-width: 768px) {
          .header-section {
            align-items: flex-start;
            padding-top: 6rem;
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="services"
        className="service-section-container relative"
      >
        {/* Section 1: Header uniquement */}
        <div
          ref={headerSectionRef}
          className="header-section bg-gradient-to-br from-gray-900 via-gray-850 to-gray-950 relative overflow-hidden will-change-transform"
        >
          {/* Fond lumineux subtil */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 -right-32 w-96 h-96 bg-orange-500/10 rounded-full " />
            <div className="absolute bottom-0 left-0 w-[28rem] h-[28rem] bg-orange-400/10 rounded-full " />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-300/5 rounded-full " />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.07),transparent_70%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),_#0f172a)] mix-blend-soft-light opacity-50" />
          </div>

          {/* Lignes décoratives */}
          <div className="pointer-events-none absolute inset-x-0 top-40 bottom-24 flex items-center justify-center opacity-10">
            <div className="relative w-full max-w-6xl h-32">
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full">
                <div className="w-full h-full bg-[repeating-linear-gradient(90deg,_rgba(255,255,255,0.03)_0px,_rgba(255,255,255,0.03)_1px,_rgba(249,115,22,0.05)_1px,_rgba(249,115,22,0.05)_2px)] rounded-3xl" />
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div ref={headerContentRef} className="text-center max-w-4xl mx-auto">
              <span className="inline-flex items-center px-4 py-1 mb-6 rounded-full border border-orange-400/40 bg-orange-500/10 text-xs font-medium uppercase tracking-[0.2em] text-orange-200 animate-pulse">
                Nos Expertises
              </span>

              {/* Titre avec animation */}
              <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-orange-200 to-orange-400 mb-6 drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                <span className="letter-container inline-block">
                  {titleText.split('').map((letter, index) => (
                    <span
                      key={`title-${index}`}
                      className={`title-letter ${hoveredTitleLetters.has(index) ? 'spin-letter text-orange-300' : ''}`}
                      onMouseEnter={() => handleTitleLetterMouseEnter(index)}
                      style={{
                        display: letter === ' ' ? 'inline' : 'inline-block',
                        transformOrigin: 'center center',
                        cursor: letter === ' ' ? 'default' : 'default'
                      }}
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                    </span>
                  ))}
                </span>
              </h2>

              {/* Sous-titre avec animation */}
              <p className="text-lg md:text-xl text-gray-300/90 leading-relaxed bg-gray-800/50 backdrop-blur-md px-8 py-4 rounded-2xl border border-orange-400/20 shadow-lg">
                <span className="subtitle-letter-container inline-block">
                  {subtitleText.split('').map((letter, index) => (
                    <span
                      key={`subtitle-${index}`}
                      className={`subtitle-letter ${hoveredSubtitleLetters.has(index) ? 'spin-letter text-orange-300' : ''}`}
                      onMouseEnter={() => handleSubtitleLetterMouseEnter(index)}
                      style={{
                        display: letter === ' ' ? 'inline' : 'inline-block',
                        transformOrigin: 'center center',
                        cursor: letter === ' ' ? 'default' : 'default'
                      }}
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                    </span>
                  ))}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Cartes uniquement */}
        <div
          ref={cardsSectionRef}
          className="cards-section bg-gradient-to-br from-gray-900 via-gray-850 to-gray-950 relative overflow-hidden will-change-transform"
        >
          {/* Fond lumineux subtil */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 -right-32 w-96 h-96 bg-orange-500/10 rounded-full " />
            <div className="absolute bottom-0 left-0 w-[28rem] h-[28rem] bg-orange-400/10 rounded-full " />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-300/5 rounded-full " />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.07),transparent_70%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),_#0f172a)] mix-blend-soft-light opacity-50" />
          </div>

          <div ref={cardsContainerRef} className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {services.map((service, index) => (
                <div
                  key={index}
                  ref={el => cardsRef.current[index] = el}
                  className="group relative h-full"
                >
                  {/* Effet de glow */}
                  <div className="card-glow" />

                  {/* Effet de glow au hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/0 via-orange-400/20 to-orange-500/0 rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

                  {/* Image de fond */}
                  <div
                    className="absolute inset-0 rounded-3xl overflow-hidden opacity-50 group-hover:opacity-60 transition-opacity duration-500 card-background"
                    style={{
                      backgroundImage: `url(${serviceImages[index % serviceImages.length]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  >
                    {/* Overlay pour améliorer la lisibilité */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-transparent group-hover:from-black/30 group-hover:via-transparent group-hover:to-transparent transition-all duration-500" />
                  </div>

                  {/* Carte */}
                  <div className="relative h-full rounded-3xl bg-gradient-to-br from-gray-900/30 to-slate-900/20 border border-orange-400/30 hover:border-orange-300/50 transition-all duration-500 group-hover:shadow-[0_20px_60px_rgba(249,115,22,0.35)] shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
                    {/* Ligne décorative top */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />

                    {/* Contenu */}
                    <div className="p-6 lg:p-8 h-full flex flex-col relative z-10">
                      {/* Titre */}
                      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-orange-200 transition-colors duration-300 drop-shadow-lg">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-100 mb-6 flex-grow drop-shadow-md">
                        {service.description}
                      </p>

                      {/* Liste des features */}
                      <ul className="space-y-3 mb-8">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <div className="w-6 h-6 rounded-full bg-orange-500/40 border border-orange-400/50 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 shadow-md">
                              <span className="text-orange-200 text-sm">✓</span>
                            </div>
                            <span className="text-gray-100 text-sm leading-tight drop-shadow-md">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Bouton CTA */}
                      <div className="mt-auto pt-4">
                        <button
                          onClick={() => handleOpenModal(index)}
                          className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500/30 via-orange-500/40 to-orange-500/30 border border-orange-400/50 text-orange-100 font-medium hover:from-orange-500/40 hover:via-orange-500/50 hover:to-orange-500/40 hover:border-orange-300/70 hover:text-white transition-all duration-300 group/btn hover:shadow-[0_0_40px_rgba(249,115,22,0.5)] focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg"
                        >
                          <span className="relative">
                            {service.cta}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-300 to-orange-200 group-hover/btn:w-full transition-all duration-300" />
                          </span>
                          <svg className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Effet de coin */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-orange-400/80 rounded-full" />
                    <div className="absolute bottom-4 left-4 w-2 h-2 bg-orange-400/80 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal */}
        {selectedService !== null && (
          <ServiceModal
            service={services[selectedService]}
            isOpen={selectedService !== null}
            onClose={handleCloseModal}
          />
        )}
      </section>
    </>
  );
};

export default ServiceSection;