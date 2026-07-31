// NotFound.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { Home, AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import CodeRain from "@/components/CodeRain"; // Même composant que loading

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  // Logo flottement subtil
  useEffect(() => {
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        y: -8,
        rotation: 1,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }
    
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1.05,
        duration: 2.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });
    }
  }, []);

  // Log de l'erreur 404
  useEffect(() => {
    console.error("404 Error:", location.pathname);
    if (window._paq) {
      window._paq.push(['trackEvent', 'Error', '404', location.pathname]);
    }
  }, [location.pathname]);

  // Compte à rebours
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate("/");
    }
  }, [countdown, navigate]);

  const handleGoHome = () => navigate("/");
  const handleGoBack = () => navigate(-1);
  const handleReload = () => window.location.reload();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background cover + overlay (comme LoadingScreen) */}
      <div className="absolute inset-0 bg-center bg-cover blur-xl scale-110 animate-[bgPulse_8s_ease-in-out_infinite]"
           style={{ backgroundImage: "url('/images/cover.jpg')" }} />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/95" />

      {/* CodeRain en arrière-plan */}
      <CodeRain />

      {/* Particules légères */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-1/4 top-1/3 h-1 w-1 rounded-full bg-aria-gold animate-[sparkle_4s_ease-in-out_infinite_1s]" />
        <div className="absolute left-3/4 top-1/4 h-1.5 w-1.5 rounded-full bg-aria-sunset animate-[sparkle_5s_ease-in-out_infinite_2s]" />
        <div className="absolute left-2/3 bottom-1/3 h-1 w-1 rounded-full bg-aria-teal animate-[sparkle_6s_ease-in-out_infinite_3s]" />
      </div>

      {/* Contenu centré */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-2xl w-full">
          {/* Icône d'alerte avec animation */}
          <div ref={iconRef} className="flex justify-center mb-8 p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 drop-shadow-2xl mx-auto w-fit">
            <AlertTriangle className="w-20 h-20 text-red-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
          </div>

          {/* Code d'erreur avec flottement GSAP */}
          <h1 
            ref={titleRef}
            className="text-8xl md:text-9xl font-black bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-6 tracking-[-0.05em] drop-shadow-2xl"
          >
            404
          </h1>
          
          {/* Titre principal */}
          <h2 className="text-3xl md:text-4xl font-bold text-white/95 mb-4 drop-shadow-xl">
            Page non trouvée
          </h2>
          
          {/* Message d'explication */}
          <p className="text-xl text-aria-cream/90 mb-8 max-w-lg mx-auto leading-relaxed drop-shadow-lg">
            La page <code className="bg-black/40 px-3 py-1 rounded-lg text-sm font-mono border border-white/20 backdrop-blur-sm">"{location.pathname}"</code> 
            n'existe pas ou a été déplacée.
          </p>

          {/* Suggestions avec glass effect */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-10 drop-shadow-2xl">
            <h3 className="font-bold text-white mb-4 flex items-center justify-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5" />
              Suggestions
            </h3>
            <ul className="text-aria-cream/90 space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-aria-gold rounded-full mt-2 flex-shrink-0" />
                Vérifiez l'URL pour d'éventuelles erreurs de frappe
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-aria-sunset rounded-full mt-2 flex-shrink-0" />
                La page a peut-être été supprimée ou renommée
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-aria-teal rounded-full mt-2 flex-shrink-0" />
                Contactez-nous si vous pensez qu'il s'agit d'une erreur
              </li>
            </ul>
          </div>

          {/* Boutons d'action glassmorphism */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button
              onClick={handleGoBack}
              className="group flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-xl hover:border-white/40 transition-all duration-300 font-semibold shadow-2xl hover:shadow-3xl hover:scale-[1.02] min-w-[140px]"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Retour
            </button>
            
            <button
              onClick={handleGoHome}
              className="group flex items-center justify-center gap-2 bg-gradient-to-r from-aria-gold via-white/90 to-aria-sunset text-black px-8 py-4 rounded-xl hover:from-aria-gold/90 font-semibold shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 min-w-[180px]"
            >
              <Home className="w-5 h-5" />
              Accueil
            </button>
            
            <button
              onClick={handleReload}
              className="group flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-xl hover:border-white/40 transition-all duration-300 font-semibold shadow-2xl hover:shadow-3xl hover:scale-[1.02] min-w-[140px]"
            >
              <RefreshCw className="w-5 h-5 animate-spin group-hover:animate-none" />
              Recharger
            </button>
          </div>

          {/* Compte à rebours */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 mb-8">
            <p className="text-aria-cream/90">
              Redirection automatique vers l'accueil dans{" "}
              <span className="text-2xl font-black bg-gradient-to-r from-aria-gold to-aria-sunset bg-clip-text text-transparent">
                {countdown}
              </span>{" "}
              secondes...
            </p>
          </div>

          {/* Lien de contact */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <p className="text-aria-cream/80">
              Besoin d'aide ?{" "}
              <button 
                onClick={() => alert("Contactez-nous aux +261 32 03 682 18 ou +261 34 17 533 02 ou +261 34 07 042 09 ou par email à")}
                className="text-aria-gold hover:text-aria-gold/80 font-semibold underline decoration-aria-gold transition-colors"
              >
                Contactez notre support
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
