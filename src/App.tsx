// App.tsx
import React, { Suspense, useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/components/AuthContext";
import AppRoutes from "@/Routes/AppRoutes";
import LoadingScreen from "@/components/LoadingScreen";
import { useApiLoading } from "@/components/AppLoader";

// Création du client Query avec configuration optimisée
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Composant de fallback pour Suspense (pendant que les routes chargent)
const LoadingFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] z-40">
    <div className="text-center">
      <div className="relative inline-block">
        <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full animate-pulse" />
        </div>
      </div>
      <p className="mt-6 text-sm text-amber-100/70 font-light tracking-wide">
        Chargement des modules...
      </p>
    </div>
  </div>
);

// Composant pour gérer les chargements globaux d'API
const GlobalApiLoadingHandler = () => {
  const { ApiLoadingOverlay } = useApiLoading();
  return <ApiLoadingOverlay />;
};

const App = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);
  const [appContent, setAppContent] = useState<React.ReactNode>(null);

  // Précharger les ressources critiques
  useEffect(() => {
    const preloadCriticalResources = async () => {
      try {
        console.log('App: Préchargement des ressources critiques...');
        
        const criticalImages = [
          '/images/aria-logo.png',
          // Ajoutez ici d'autres images critiques
        ];

        await Promise.all(
          criticalImages.map(src => {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = resolve;
              img.onerror = reject;
              img.src = src;
            });
          })
        );

        console.log('App: Ressources critiques préchargées');
        setIsAppReady(true);
      } catch (error) {
        console.warn('App: Erreur lors du préchargement:', error);
        setIsAppReady(true); // Continuer quand même
      }
    };

    preloadCriticalResources();
  }, []);

  // Précharger le contenu de l'application
  useEffect(() => {
    if (isAppReady) {
      console.log('App: Préparation du contenu...');
      
      // Précharger le contenu de l'application
      const appContent = (
        <Suspense fallback={<LoadingFallback />}>
          <AppRoutes />
        </Suspense>
      );
      
      setAppContent(appContent);
      
      // Minuterie pour le chargement initial (simulation)
      const timer = setTimeout(() => {
        console.log('App: Temps minimum écoulé, prêt pour la transition');
        // La transition sera déclenchée par le LoadingScreen
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isAppReady]);

  // Gérer la fin du chargement initial
  const handleInitialLoadComplete = () => {
    console.log('App: Transition du LoadingScreen terminée');
    setIsInitialLoading(false);
    
    // Vous pourriez ajouter des analytics ici
    // trackAppLoaded();
    
    console.log('App: Application complètement chargée et visible !');
  };

  // Gérer les erreurs de chargement
  useEffect(() => {
    const handleLoadingError = (error: ErrorEvent) => {
      console.warn('App: Erreur de chargement détectée:', error);
      // Vous pourriez ajouter une logique de retry ici
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.warn('App: Promesse non gérée:', event.reason);
    };

    window.addEventListener('error', handleLoadingError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleLoadingError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Si l'application n'est pas encore prête, afficher un simple loader
  if (!isAppReady) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-2 border-orange-500/50 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* LoadingScreen initial avec transition intégrée */}
            {isInitialLoading ? (
              <LoadingScreen
                onComplete={handleInitialLoadComplete}
                isLoading={true}
                isInitialLoad={true}
              >
                {/* Le contenu de l'app est passé comme children */}
                {appContent}
              </LoadingScreen>
            ) : (
              // Contenu normal quand le loading est terminé
              <div className="app-content transition-all duration-500 ease-out">
                {appContent}
              </div>
            )}
            
            {/* Handler pour les chargements d'API futurs */}
            <GlobalApiLoadingHandler />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;