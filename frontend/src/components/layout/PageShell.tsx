import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

/** Remet le scroll en haut à chaque changement de route */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

/** Met à jour document.title selon la route (SEO de base) */
export function PageTitle({ children }: { children: string }) {
  useEffect(() => {
    document.title = children;
  }, [children]);
  return null;
}

export function PageShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={`min-h-screen ${className}`}>
      {children}
    </main>
  );
}
