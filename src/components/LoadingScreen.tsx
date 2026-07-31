// src/components/LoadingScreen.tsx
import React, { FC, useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import CodeRain from "./CodeRain";

gsap.registerPlugin(CustomEase);
CustomEase.create("smoothBounce", "M0,0 C0.23,1.21,0.32,1,1,1");

interface LoadingScreenProps {
  onComplete?: () => void;
  isLoading?: boolean;
  loadingProgress?: number;
  loadingMessage?: string;
  isInitialLoad?: boolean;
  children?: React.ReactNode; // Ajout pour gérer le contenu à révéler
}

const LoadingScreen: FC<LoadingScreenProps> = ({ 
  onComplete, 
  isLoading = true,
  loadingProgress = 0,
  loadingMessage,
  isInitialLoad = true,
  children
}) => {
  const logoRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentContainerRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const [showCodeRain, setShowCodeRain] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showElements, setShowElements] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [revealContent, setRevealContent] = useState(false);
  
  // Messages de progression
  const initialLoadMessages = [
    "Initialisation du système...",
    "Chargement des ressources...",
    "Optimisation des performances...",
    "Préparation de l'expérience...",
    "Prêt à démarrer..."
  ];

  const apiLoadMessages = [
    "Chargement des données...",
    "Connexion aux services...",
    "Récupération du contenu...",
    "Mise à jour en temps réel...",
    "Synchronisation..."
  ];
  
  // Animation d'entrée séquentielle
  useEffect(() => {
    if (!logoRef.current || !containerRef.current) return;

    const tl = gsap.timeline();
    
    // Fade-in global
    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { 
        opacity: 1, 
        duration: 1.2, 
        ease: "power2.out"
      }
    );

    // Animation du logo
    tl.fromTo(
      logoRef.current,
      { scale: 0.7, opacity: 0, y: 40, rotate: -10 },
      { 
        scale: 1, 
        opacity: 1, 
        y: 0, 
        rotate: 0,
        duration: 1.4, 
        ease: "back.out(1.8)" 
      },
      0.5
    );

    setTimeout(() => setShowElements(true), 800);

    // Logo idle motion
    const idleTl = gsap.timeline({ repeat: -1, yoyo: true });
    idleTl.to(logoRef.current, {
      y: -12,
      rotation: 1.5,
      duration: 2.5,
      ease: "sine.inOut",
    });

    setShowCodeRain(true);
    
    return () => {
      tl.kill();
      idleTl.kill();
    };
  }, []);

  // Gestion de la progression
  useEffect(() => {
    if (!isLoading || isExiting) return;

    if (isInitialLoad) {
      let currentStep = 0;
      const messages = initialLoadMessages;
      
      setCurrentMessage(messages[0]);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          const increment = Math.random() * 15 + 10;
          const newProgress = Math.min(prev + increment, 95);
          
          if (newProgress >= 25 && currentStep < 1) {
            currentStep = 1;
            setCurrentMessage(messages[1]);
          } else if (newProgress >= 50 && currentStep < 2) {
            currentStep = 2;
            setCurrentMessage(messages[2]);
          } else if (newProgress >= 75 && currentStep < 3) {
            currentStep = 3;
            setCurrentMessage(messages[3]);
          } else if (newProgress >= 90 && currentStep < 4) {
            currentStep = 4;
            setCurrentMessage(messages[4]);
          }
          
          if (newProgress >= 95) {
            clearInterval(interval);
            // Déclencher la transition
            setTimeout(() => {
              if (!isExiting) {
                setProgress(100);
                setTimeout(() => handleExit(), 200);
              }
            }, 300);
          }
          
          return newProgress;
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setProgress(loadingProgress);
      
      if (loadingMessage) {
        setCurrentMessage(loadingMessage);
      } else {
        const apiIndex = Math.min(
          Math.floor(loadingProgress / 25),
          apiLoadMessages.length - 1
        );
        setCurrentMessage(apiLoadMessages[apiIndex]);
      }
      
      if (loadingProgress >= 100 && !isExiting) {
        setTimeout(() => handleExit(), 200);
      }
    }
  }, [isLoading, isExiting, isInitialLoad, loadingProgress, loadingMessage]);

  // Animation de sortie avec révélation du contenu
  const handleExit = useCallback(() => {
    if (!containerRef.current || !logoRef.current || isExiting) return;
    
    setIsExiting(true);
    setProgress(100);
    setCurrentMessage(isInitialLoad ? "Bienvenue !" : "Terminé !");

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        // Révéler le contenu
        setRevealContent(true);
        
        // Animer l'entrée du contenu
        if (contentContainerRef.current) {
          gsap.fromTo(contentContainerRef.current.children,
            {
              opacity: 0,
              y: 30,
              scale: 0.95
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.08,
              ease: "back.out(1.2)",
              onComplete: () => {
                // Appeler le callback après que le contenu soit visible
                setTimeout(() => {
                  onComplete?.();
                }, 300);
              }
            }
          );
        } else {
          // Fallback si pas de contenu
          setTimeout(() => onComplete?.(), 500);
        }
      }
    });

    // 1. Rétrécir le logo vers le centre
    tl.to(logoRef.current, {
      scale: 0.3,
      y: -20,
      duration: 0.8,
      ease: "power2.in"
    }, 0);

    // 2. Créer un effet de "trou" qui s'agrandit
    tl.to(containerRef.current, {
      clipPath: isInitialLoad ? "circle(0% at 50% 50%)" : "inset(100% 100% 100% 100%)",
      duration: 1.2,
      ease: "power4.inOut"
    }, 0.3);

    // 3. Faire disparaître les éléments
    tl.to([".progress-bar-container", ".loading-message", ".code-rain"], {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: "power2.in"
    }, 0.2);

    // 4. Faire disparaître le fond
    tl.to(containerRef.current, {
      backgroundColor: "rgba(0,0,0,0)",
      backdropFilter: "blur(0px)",
      duration: 1,
      ease: "power3.out"
    }, 0.4);

  }, [onComplete, isExiting, isInitialLoad]);

  // Déclenchement automatique
  useEffect(() => {
    if (isInitialLoad && progress >= 95 && !isExiting) {
      const timeout = setTimeout(() => {
        if (!isExiting) handleExit();
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [progress, handleExit, isExiting, isInitialLoad]);

  return (
    <>
      {/* Loading Screen */}
      <div
        ref={containerRef}
        className={`fixed inset-0 flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a0a00] via-[#3a1a00] to-[#0a0a0a] z-50 ${
          isExiting ? 'pointer-events-none' : ''
        }`}
        style={{
          background: "linear-gradient(135deg, #1a0a00 0%, #3a1a00 50%, #0a0a0a 100%)",
          backgroundSize: "400% 400%",
          animation: isInitialLoad ? "gradientFlow 12s ease infinite" : "none",
          clipPath: isExiting ? (isInitialLoad ? "circle(100% at 50% 50%)" : "inset(0 0 0 0)") : "circle(100% at 50% 50%)",
          transition: isExiting ? "clip-path 1.2s ease-in-out" : "none"
        }}
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: isInitialLoad ? 25 : 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-orange-500/20 to-amber-600/10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                animation: `particleFloat ${Math.random() * 5 + 3}s infinite ease-in-out ${i * 0.2}s`,
                filter: "blur(1px)"
              }}
            />
          ))}
        </div>

        {/* CodeRain */}
        {showCodeRain && isInitialLoad && (
          <div className="absolute inset-0 code-rain">
            <CodeRain />
            <div className="absolute inset-0 bg-gradient-to-b from-orange-900/10 via-transparent to-amber-950/5" />
          </div>
        )}

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Logo */}
          <div className="relative mb-10">
            <div className="absolute -inset-12 blur-[100px] bg-gradient-to-r from-orange-600/30 via-amber-500/25 to-orange-700/20 animate-[haloPulse_3s_ease-in-out_infinite]" />
            <div className="relative">
              <img
                ref={logoRef}
                src="/images/aria-logo.png"
                alt="ARIA logo"
                className="relative w-56 sm:w-64 h-auto drop-shadow-[0_0_40px_rgba(255,107,0,0.8)]"
              />
            </div>
          </div>

          {/* Motto */}
          {showElements && isInitialLoad && (
            <div className="overflow-hidden mb-8">
              <div className="relative">
                <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-[underlineExpand_2s_ease-out]" />
                <p className="text-sm sm:text-base tracking-[0.4em] uppercase text-amber-100/90 text-center font-light animate-[textReveal_1.2s_ease-out]">
                  L'agence digitale qui transforme vos idées en résultats
                </p>
              </div>
            </div>
          )}

          {/* Progress bar */}
          {showElements && (
            <div className="mt-6 w-72 sm:w-80 progress-bar-container">
              <div className="relative p-1 rounded-2xl bg-gradient-to-r from-orange-900/30 via-amber-800/20 to-orange-900/30 backdrop-blur-sm border border-orange-800/30">
                <div className="relative h-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-black/40 via-gray-900/30 to-black/40">
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-900/15 via-amber-800/10 to-orange-900/15 animate-[energyFlow_3s_ease-in-out_infinite]" />
                  </div>
                  <div 
                    ref={progressBarRef}
                    className="relative h-full rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 shadow-[0_0_25px_rgba(255,140,0,0.7)]"
                    style={{ 
                      transform: `scaleX(${progress / 100})`,
                      transformOrigin: 'left center',
                      transition: isInitialLoad 
                        ? 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                        : 'transform 0.3s ease-out'
                    }}
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-200/30 via-transparent to-amber-200/30 animate-[progressPulse_2s_ease-in-out_infinite]" />
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white/50 via-amber-100/20 to-transparent -skew-x-45 animate-[progressShine_1.8s_linear_infinite]" />
                  </div>
                </div>
              </div>
              
              {/* Loading message */}
              <div className="mt-4 text-center loading-message">
                {currentMessage && (
                  <div className="mt-2 text-xs text-amber-300/70 font-light">
                    <div className="flex items-center justify-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 ${
                        isExiting ? '' : 'animate-[statusPulse_1.4s_ease-in-out_infinite]'
                      }`} />
                      <span>{currentMessage}</span>
                    </div>
                  </div>
                )}
                
                {!isInitialLoad && !isExiting && (
                  <div className="mt-1 text-xs text-amber-400/60 font-mono">
                    {Math.round(progress)}%
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Badge */}
        {!isInitialLoad && (
          <div className="absolute bottom-6 right-6">
            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-900/40 to-amber-900/30 border border-orange-800/30 backdrop-blur-sm">
              <span className="text-xs text-amber-300/80 font-medium">
                {loadingMessage ? 'Mise à jour' : 'Chargement'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Contenu à révéler */}
      <div 
        ref={contentContainerRef}
        className={`w-full ${revealContent ? 'block' : 'hidden'}`}
      >
        {children}
      </div>
    </>
  );
};

export default LoadingScreen;