// components/AppLoader.tsx
import React, { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';
import { gsap } from 'gsap';

interface AppLoaderProps {
  children: React.ReactNode;
  minimumLoadingTime?: number;
  onLoadingComplete?: () => void;
}

const AppLoader: React.FC<AppLoaderProps> = ({ 
  children, 
  minimumLoadingTime = 3000,
  onLoadingComplete 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitionComplete, setIsTransitionComplete] = useState(false);
  const [loadingScreenKey, setLoadingScreenKey] = useState(0);

  // Gestion du chargement initial
  const handleInitialLoadComplete = () => {
    console.log('AppLoader: Transition du LoadingScreen terminée');
    
    // Désactiver le chargement
    setIsLoading(false);
    
    // Attendre un peu pour que l'animation de sortie soit complète
    setTimeout(() => {
      setIsTransitionComplete(true);
      
      // Appeler le callback de complétion
      if (onLoadingComplete) {
        onLoadingComplete();
      }
      
      console.log('AppLoader: Application complètement chargée');
      
      // Réinitialiser pour le prochain usage (si nécessaire)
      setLoadingScreenKey(prev => prev + 1);
    }, 300);
  };

  // Timer minimum pour le chargement
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoading) {
      console.log(`AppLoader: Démarrage (min ${minimumLoadingTime}ms)`);
      
      timer = setTimeout(() => {
        console.log('AppLoader: Temps minimum écoulé');
        // Le LoadingScreen gère sa propre sortie via handleInitialLoadComplete
      }, minimumLoadingTime);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, minimumLoadingTime]);

  // Animation d'entrée du contenu une fois la transition terminée
  useEffect(() => {
    if (isTransitionComplete && !isLoading) {
      console.log('AppLoader: Animation d\'entrée du contenu');
      
      // Animer l'entrée des éléments principaux
      gsap.fromTo(
        '.app-content',
        { 
          opacity: 0,
          y: 20,
          scale: 0.98
        },
        { 
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2
        }
      );
    }
  }, [isTransitionComplete, isLoading]);

  // Nettoyage
  useEffect(() => {
    return () => {
      // Nettoyer les animations GSAP résiduelles
      gsap.killTweensOf('.app-content');
    };
  }, []);

  return (
    <>
      {/* LoadingScreen initial */}
      {isLoading ? (
        <LoadingScreen
          key={`initial-${loadingScreenKey}`}
          onComplete={handleInitialLoadComplete}
          isLoading={true}
          isInitialLoad={true}
        >
          {/* Contenu de l'application qui sera révélé */}
          <div className="app-content opacity-0">
            {children}
          </div>
        </LoadingScreen>
      ) : (
        // Contenu normal quand le loading est terminé
        <div className="app-content opacity-100">
          {children}
        </div>
      )}
    </>
  );
};

// Fonction utilitaire pour précharger les ressources (optionnel)
const preloadResources = async (): Promise<void> => {
  const resources = [
    '/images/aria-logo.png',
    // Ajoutez d'autres ressources ici
  ];

  const promises = resources.map(resource => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = resource;
    });
  });

  await Promise.all(promises);
};

// Hook personnalisé pour les chargements d'API
export const useApiLoading = () => {
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [apiProgress, setApiProgress] = useState(0);
  const [apiMessage, setApiMessage] = useState('');
  const [apiLoadingKey, setApiLoadingKey] = useState(0);

  const startApiLoading = (message = 'Chargement des données...') => {
    setIsApiLoading(true);
    setApiProgress(0);
    setApiMessage(message);
    setApiLoadingKey(prev => prev + 1);
  };

  const updateApiProgress = (progress: number, message?: string) => {
    setApiProgress(progress);
    if (message) setApiMessage(message);
  };

  const completeApiLoading = () => {
    setApiProgress(100);
    
    // Petit délai avant de masquer pour voir "100%"
    setTimeout(() => {
      setIsApiLoading(false);
    }, 300);
  };

  const ApiLoadingOverlay = () => {
    if (!isApiLoading) return null;

    return (
      <div className="fixed inset-0 z-[9998]">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative z-10 h-full flex items-center justify-center">
          <LoadingScreen 
            key={`api-${apiLoadingKey}`}
            isLoading={isApiLoading}
            loadingProgress={apiProgress}
            loadingMessage={apiMessage}
            isInitialLoad={false}
            onComplete={completeApiLoading}
          />
        </div>
      </div>
    );
  };

  return {
    isApiLoading,
    apiProgress,
    apiMessage,
    startApiLoading,
    updateApiProgress,
    completeApiLoading,
    ApiLoadingOverlay
  };
};

export default AppLoader;