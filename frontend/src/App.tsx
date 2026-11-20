import { Suspense, lazy, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/PageShell";
import Home from "@/pages/Home";
import Chatbot from "@/components/chat/Chatbot";
import CookieConsent from "@/components/layout/CookieConsent";
import { useI18n } from "@/i18n";
import { trackPageView } from "@/lib/analytics";

/* Pages publiques (lazy pour alléger le bundle initial) */
const Solutions = lazy(() => import("@/pages/Solutions"));
const Realisations = lazy(() => import("@/pages/Realisations"));
const RealisationDetail = lazy(() => import("@/pages/RealisationDetail"));
const About = lazy(() => import("@/pages/About"));
const Faq = lazy(() => import("@/pages/Faq"));
const Contact = lazy(() => import("@/pages/Contact"));
const Devis = lazy(() => import("@/pages/Devis"));
const Legal = lazy(() => import("@/pages/Legal"));
const NotFound = lazy(() => import("@/pages/NotFound"));

/* Admin */
const AdminLogin = lazy(() => import("@/pages/admin/Login"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));

function Loading() {
  const { t } = useI18n();
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex flex-col items-center gap-3">
        <span className="size-8 animate-spin rounded-full border-2 border-line border-t-blue" />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {t("common.loading")}
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    if (!isAdmin) trackPageView();
  }, [isAdmin, pathname]);

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Header />}
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* --- Public --- */}
          <Route path="/" element={<Home />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/realisations" element={<Realisations />} />
          <Route path="/realisations/:slug" element={<RealisationDetail />} />
          <Route path="/etudes-de-cas" element={<Navigate to="/realisations" replace />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/devis" element={<Devis />} />

          {/* Légal */}
          <Route path="/mentions-legales" element={<Legal page="mentions" />} />
          <Route path="/confidentialite" element={<Legal page="privacy" />} />
          <Route path="/cgu" element={<Legal page="terms" />} />

          {/* --- Admin --- */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* Anciens liens de détail : retour à la rubrique dans l'espace admin. */}
          <Route path="/admin/projects/:id" element={<Navigate to="/admin/dashboard?section=projects" replace />} />
          <Route path="/admin/quotes/:id" element={<Navigate to="/admin/dashboard?section=quotes" replace />} />
          <Route path="/admin/messages/:id" element={<Navigate to="/admin/dashboard?section=messages" replace />} />
          <Route path="/admin/faq/:id" element={<Navigate to="/admin/dashboard?section=faq" replace />} />
          <Route path="/admin/knowledge/:id" element={<Navigate to="/admin/dashboard?section=knowledge" replace />} />

          {/* --- 404 --- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {!isAdmin && <Footer />}
      {!isAdmin && <Chatbot />}
      {!isAdmin && <CookieConsent />}
    </>
  );
}
