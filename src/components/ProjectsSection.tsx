import React, { useState, useEffect, useRef } from 'react';
import ProjectCard from "@/components/ProjectCard";
import { getClientProjects } from "@/services/projectsService";
import { Project } from "@/services/api";
import { useScrollAnimation, useStaggeredAnimation } from "@/hooks/useScrollAnimation";
import "@/styles/animations.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectsModal from "@/components/ProjectsModal";
import "@/styles/ProjectSection.css";

gsap.registerPlugin(ScrollTrigger);

interface PortfolioItem {
  image: string;
  title: string;
  description: string;
  objective: string;
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { elementRef, isVisible } = useScrollAnimation<HTMLDivElement>();
  const sectionRef = useRef<HTMLElement | null>(null);

  const portfolioItems: PortfolioItem[] = [
    {
      image: "/images/approche.avif",
      title: "Refonte du site d'une entreprise de services",
      description: "Site vitrine moderne, prise de contact simplifiée, blog intégré.",
      objective: "améliorer la crédibilité et générer plus de demandes de devis."
    },
    {
      image: "/images/qualite.jpg",
      title: "Création de l'identité visuelle d'une marque locale",
      description: "Logo, charte graphique, supports imprimés et visuels réseaux sociaux.",
      objective: "uniformiser la communication et monter en gamme."
    },
    {
      image: "/images/connect.png",
      title: "Plateforme interne + automatisations",
      description: "Outil web pour gérer les clients, les demandes et les documents.",
      objective: "réduire la charge manuelle et centraliser l'information."
    }
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".portfolio-item");

      // Position initiale
      gsap.set(cards, { y: 200, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 0.5%", // plus bas pour ne pas bloquer trop tôt
          end: "+=800",
          scrub: true,
          pin: true,
        },
      });

      cards.forEach((card, index) => {
        tl.to(
          card,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          index * 0.6
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        const clientProjects = await getClientProjects();
        if (clientProjects.length > 0) {
          setProjects(clientProjects);
        }
      } catch {
        console.error("Erreur lors du chargement des projets");
      } finally {
        setIsLoading(false);
      }
    };
    loadProjects();
  }, []);

  // Animation d'ouverture/fermeture de la modale
  useEffect(() => {
    if (!showModal) return;

    const tl = gsap.timeline();
    tl.fromTo("#projects-modal",
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
    );

    return () => {
      gsap.to("#projects-modal", {
        scale: 0.7,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      });
    };
  }, [showModal]);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <section
        ref={(el) => {
          sectionRef.current = el;
          if (typeof elementRef === "function") elementRef(el);
        }}
        id="realisations"
        className="relative overflow-hidden min-h-screen"
        style={{ 
          scrollMarginTop: "100px"
        }}
      >
        {/* Vidéo de fond fixe */}
        <div className="fixed inset-0 w-full h-full -z-10">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: -1,
              objectFit: 'cover'
            }}
          >
            <source src="/images/baobab.webm" type="video/webm" />
          </video>
          
          {/* Overlay blur + assombrissement */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur" />
        </div>

        {/* Contenu avec plus d'espace en haut */}
        <div className="container mx-auto px-6 max-w-6xl relative z-10 w-full pt-32 pb-20"> {/* Changé pt-40 au lieu de py-20 */}
          {/* TITRE PRINCIPAL */}
          <div className="text-center mb-16">
            <h2 className="section-title text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-200 via-orange-300 to-orange-600 bg-clip-text text-transparent mb-6">
              Nos réalisations
            </h2>
            <p className="section-subtitle text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Quelques projets que nous avons accompagnés, de la réflexion à la mise en ligne.
            </p>
          </div>

          {/* GRID 3 PROJETS */}
          <div className="portfolio-grid mb-16">
            {portfolioItems.map((item, index) => (
              <div key={`preview-${index}`} className="portfolio-item">
                <div className="portfolio-image">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="portfolio-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p><strong>Objectif :</strong> {item.objective}</p>
                </div>
              </div>
            ))}
          </div>

          {/* BOUTON MODALE */}
          <div className="text-center">
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary inline-flex items-center gap-2 px-8 py-4 hover:bg-white-300 text-orange-300 font-bold text-lg rounded-xl shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:-translate-y-1 border border-orange-400/50"
            >
              Voir toutes nos réalisations
            </button>
          </div>
        </div>
      </section>

      {/* NOUVELLE MODALE SÉPARÉE */}
      {showModal && (
        <ProjectsModal onClose={closeModal} />
      )}
    </>
  );
};

export default ProjectsSection;