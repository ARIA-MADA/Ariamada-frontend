import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

interface HeroContentProps {
  onScrollTo: (id: string) => void;
}

const HeroContent = React.memo(({ onScrollTo }: HeroContentProps) => {
  const navigate = useNavigate();

  const handleRealisationsClick = () => {
    navigate("/realisations");
  };

  return (
    <div className="w-full flex items-center justify-center min-h-[60vh] py-8 md:py-12">
      <div className="text-center flex flex-col items-center justify-center space-y-10 px-4 sm:px-8 w-full max-w-6xl">
        {/* Logo ARIA - MONTE UN PEU EN HAUT */}
        <div className="space-y-1 w-full">
          {" "}
          {/* espace minimal */}
          <div className="flex justify-center">
            <img
              src="/images/aria-logo.png"
              alt="Logo ARIA"
              className="w-[150px] sm:w-[200px] md:w-[250px] lg:w-[300px] h-auto object-contain drop-shadow-[0_10px_30px_rgba(251,191,36,0.3)] hover:scale-105 transition-transform duration-500 -translate-y-2" /* -translate-y-2 pour monter légèrement */
            />
          </div>
          <div className="relative">
            <h2 className="hero-slogan text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold italic bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent pb-3 px-4">
              « Là où les idées prennent vie »
            </h2>
          </div>
        </div>

        {/* Description avec icônes décoratives */}
        <div className="relative w-full max-w-4xl mx-auto mt-2">
          <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 hidden lg:block">
            <Zap className="w-8 h-8 text-amber-400/30 animate-pulse" />
          </div>

          <p className="hero-subtitle-main text-xl sm:text-2xl md:text-3xl text-slate-200 leading-relaxed px-4 font-medium">
            Nous créons des{" "}
            <span className="text-amber-300 font-semibold">sites web</span>, des{" "}
            <span className="text-amber-300 font-semibold">applications</span>,
            des{" "}
            <span className="text-amber-300 font-semibold">
              identités visuelles
            </span>{" "}
            et des{" "}
            <span className="text-amber-300 font-semibold">solutions IA</span>{" "}
            qui transforment votre vision en résultats concrets.
          </p>

          <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 hidden lg:block">
            <Target className="w-8 h-8 text-amber-400/30 animate-pulse" />
          </div>
        </div>

        {/* CTA - ESPACEMENT RÉDUIT AU-DESSUS DES BOUTONS */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 pt-6 w-full max-w-2xl">
          <Button
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white hero-cta-button text-xl px-12 py-8 rounded-2xl font-bold transition-all duration-300 shadow-2xl hover:shadow-orange-500/40 hover:scale-105 min-w-[280px] sm:min-w-[300px] group"
            onClick={() => onScrollTo("contact")}
          >
            <span className="flex items-center justify-center gap-4">
              <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-lg sm:text-xl">Obtenir un devis</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </span>
          </Button>

          <Button
            className="bg-white/10 backdrop-blur-lg text-white border-2 border-white/20 hover:bg-white/20 hover:border-amber-400/60 hero-cta-button text-xl px-12 py-8 rounded-2xl font-bold transition-all duration-300 hover:scale-105 min-w-[280px] sm:min-w-[300px] group"
            onClick={handleRealisationsClick}
          >
            <span className="flex items-center justify-center gap-4">
              <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span className="text-lg sm:text-xl">Voir nos réalisations</span>
              <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
});

HeroContent.displayName = "HeroContent";
export default HeroContent;
