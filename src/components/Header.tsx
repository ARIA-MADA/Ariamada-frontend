import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  ChevronRight,
  Home,
  User,
  Image,
  Settings,
  Mail,
  ChevronDown,
  Globe,
  Smartphone,
  Palette,
  TrendingUp,
  Code,
} from "lucide-react";
import "@/styles/animations.css";
import "@/styles/Header.css";

// Type pour les données du service sélectionné
interface SelectedService {
  type: string;
  label: string;
}

interface HeaderProps {
  onServiceSelect?: (service: SelectedService) => void;
}

const Header: React.FC<HeaderProps> = ({ onServiceSelect }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activePage, setActivePage] = useState("accueil");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedService, setSelectedService] =
    useState<SelectedService | null>(null);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(false);

  // React Router hooks
  const location = useLocation();
  const navigate = useNavigate();

  // Gérer le clic en dehors du dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setServicesDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Gérer le scroll et déterminer la page active
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);

      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollPosition / scrollHeight) * 100, 100);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mettre à jour la page active en fonction de la route
  useEffect(() => {
    const path = location.pathname;
    
    // Déterminer la page active basée sur le chemin
    switch(path) {
      case "/":
        setActivePage("accueil");
        break;
      case "/about":
        setActivePage("about");
        break;
      case "/realisations":
        setActivePage("realisations");
        break;
      case "/services":
        setActivePage("services");
        break;
      case "/contact":
        setActivePage("contact");
        break;
      default:
        setActivePage("accueil");
    }
  }, [location.pathname]);

  // Fonction pour gérer la navigation intelligente
  const handleSmartNavigation = (path: string) => {
    // Si on clique sur le lien de la page actuelle, scroller vers le haut
    if (location.pathname === path) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Sinon, naviguer vers la nouvelle page
      navigate(path);
    }
  };

  const handleServiceClick = (service: string, label: string) => {
    // Créer l'objet service sélectionné
    const selectedServiceData = { type: service, label };
    setSelectedService(selectedServiceData);

    // Notifier le parent (App) du service sélectionné
    if (onServiceSelect) {
      onServiceSelect(selectedServiceData);
    }

    // Fermer le dropdown
    setServicesDropdownOpen(false);

    // Naviguer vers la page contact avec les données du service
    navigate("/contact", { 
      state: { selectedService: selectedServiceData } 
    });
  };

  // Fonction pour gérer le CTA "Commencer maintenant"
  const handleCTAClick = () => {
    navigate("/contact");
    setMobileMenuOpen(false);
  };

  // Fonction pour naviguer et fermer le menu mobile
  const handleNavigation = (path: string) => {
    handleSmartNavigation(path);
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    handleSmartNavigation("/");
  };

  // Gestion du hover pour le dropdown
  const handleMouseEnter = () => {
    setServicesDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      if (!isHoveringDropdown) {
        setServicesDropdownOpen(false);
      }
    }, 200);
  };

  const handleDropdownMouseEnter = () => {
    setIsHoveringDropdown(true);
  };

  const handleDropdownMouseLeave = () => {
    setIsHoveringDropdown(false);
    setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 150);
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-700 header-always-blur ${
          scrolled
            ? "header-backdrop shadow-2xl shadow-orange-500/35"
            : "bg-slate-900/92 backdrop-blur-[45px] border-b border-orange-500/45"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center space-x-3 group cursor-pointer"
              onClick={handleLogoClick}
            >
              <div
                className={`logo-glow relative transition-all duration-700 ease-out transform group-hover:scale-110 ${
                  scrolled ? "h-12 w-12" : "h-16 w-16"
                }`}
              >
                <img
                  src="/images/aria-logo.png"
                  alt="ARIA Logo"
                  className="w-full h-full object-contain transition-all duration-500 group-hover:rotate-12 filter drop-shadow-lg"
                  style={{
                    filter: scrolled
                      ? "drop-shadow(0 0 18px rgba(249, 115, 22, 0.85))"
                      : "drop-shadow(0 0 10px rgba(249, 115, 22, 0.6))",
                  }}
                />
              </div>
            </div>

            {/* Navigation Desktop - Utilisation de buttons pour gérer le clic */}
            <nav className="hidden lg:flex items-center space-x-6">
              {[
                { path: "/", label: "Accueil", icon: "" },
                { path: "/about", label: "À Propos", icon: "" },
                { path: "/realisations", label: "Nos Réalisations", icon: "" },
                { path: "/services", label: "Nos Services", icon: "" },
              ].map((item, index) => (
                <button
                  key={item.path}
                  onClick={() => handleSmartNavigation(item.path)}
                  className={`nav-item relative px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium group ${
                    activePage === item.path.substring(1) || (item.path === "/" && activePage === "accueil")
                      ? "text-orange-400 active"
                      : scrolled
                      ? "text-gray-200 hover:text-orange-400"
                      : "text-white/95 hover:text-orange-400"
                  }`}
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="flex items-center space-x-2 relative z-10">
                    <span className="text-xs group-hover:animate-bounce">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </span>
                  {hoveredItem === item.path && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/25 to-orange-600/25 rounded-xl backdrop-blur-md" />
                  )}
                </button>
              ))}

              {/* Contact */}
              <button
                onClick={() => handleSmartNavigation("/contact")}
                className={`nav-item relative px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium group ${
                  activePage === "contact"
                    ? "text-orange-400 active"
                    : scrolled
                    ? "text-gray-200 hover:text-orange-400"
                    : "text-white/95 hover:text-orange-400"
                }`}
                onMouseEnter={() => setHoveredItem("/contact")}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ animationDelay: "400ms" }}
              >
                <span className="flex items-center space-x-2 relative z-10">
                  <span className="text-xs group-hover:animate-bounce"></span>
                  <span>Nos Contacts</span>
                </span>
                {hoveredItem === "/contact" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/25 to-orange-600/25 rounded-xl backdrop-blur-md" />
                )}
              </button>
            </nav>

            {/* 🚀 BOUTON CTA + NEIGE ULTRA DENSE + DÉPÔT DE NEIGE - DESKTOP */}
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 w-[240px] h-[100px]">
                {/* ❄️ 20 FLAKES ULTRA DENSE */}
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
                <div className="snowflake"></div>
              </div>

              <button
                className="cta-premium group relative"
                onClick={handleCTAClick}
              >
                <span className="relative z-10 flex items-center space-x-3 font-bold tracking-wide">
                  <span className="group-hover:translate-x-1 transition-transform duration-500">
                    Commencer maintenant
                  </span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                </span>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>

            {/* Icône mobile - SEULE L'ICÔNE ACTIVE EST VISIBLE */}
            <div className="lg:hidden flex items-center space-x-14">
              <button
                className="relative w-14 h-14 flex flex-col justify-center items-center rounded-2xl transition-all duration-300 hover:bg-orange-500/40 p-3 ml-4 border-2 border-orange-500/50 backdrop-blur-sm shadow-xl"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X
                    className={`w-8 h-8 transition-colors ${
                      scrolled ? "text-orange-400" : "text-white"
                    }`}
                  />
                ) : (
                  <Menu
                    className={`w-8 h-8 transition-colors ${
                      scrolled ? "text-orange-400" : "text-white"
                    }`}
                  />
                )}
              </button>
            </div>
          </div>

          {/* ✅ MENU MOBILE - BLUR RENFORCÉ + CONTRASTE AMÉLIORÉ */}
          <div
            className={`lg:hidden fixed inset-x-0 top-[70px] mobile-menu ${
              mobileMenuOpen ? "open" : ""
            }`}
          >
            <div className="container mx-auto px-6">
              <div className="bg-slate-900/85 backdrop-blur-[60px] rounded-2xl shadow-2xl shadow-orange-500/30 border border-orange-500/25 p-6">
                <nav className="flex flex-col space-y-4">
                  {[
                    { path: "/", label: "Accueil" },
                    { path: "/about", label: "À Propos" },
                    { path: "/realisations", label: "Nos Réalisations" },
                    { path: "/services", label: "Nos Services" },
                    { path: "/contact", label: "Nos Contacts" },
                  ].map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`mobile-menu-item px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                        activePage === item.path.substring(1) || (item.path === "/" && activePage === "accueil")
                          ? "text-orange-400 bg-orange-500/20"
                          : "text-gray-300 hover:text-orange-400 hover:bg-orange-500/15"
                      }`}
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}

                  <div className="relative">
                    <div className="absolute inset-0 w-full h-[120px]">
                      {/* ❄️ 20 FLAKES NEIGE MOBILE ULTRA DENSE */}
                      {Array.from({ length: 20 }, (_, i) => (
                        <div
                          key={i}
                          className="snowflake"
                          style={{
                            left: `${2 + i * 5}%`,
                            animationDelay: `${(i * 0.15).toFixed(1)}s`,
                            animationDuration: `${3 + i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                    <button
                      className="mobile-menu-button w-full mt-6 cta-premium text-lg py-4 px-8 !rounded-2xl shadow-2xl relative z-10"
                      onClick={handleCTAClick}
                    >
                      <span className="flex items-center justify-center space-x-3">
                        <span>🚀 Commencer projet</span>
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
                      </span>
                    </button>
                  </div>
                </nav>
              </div>
            </div>
          </div>

          {/* Barre de progression (uniquement pour la page d'accueil) */}
          {location.pathname === "/" && (
            <div className="pointer-events-none select-none">
              <div
                className="relative mx-auto w-full max-w-5xl"
                style={{ height: "0px" }}
              >
                <div
                  className="absolute -bottom-[18px] left-1/2 -translate-x-1/2 h-[6px] rounded-full overflow-hidden"
                  style={{ width: `${Math.max(scrollProgress, 5)}%` }}
                >
                  <div className="h-full w-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 shadow-[0_0_18px_rgba(249,115,22,0.8)]">
                    <div
                      className="w-full h-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)]"
                      style={{ animation: "progressShine 2s infinite" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;