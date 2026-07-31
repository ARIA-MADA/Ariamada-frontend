import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  const handleNavigation = (path: string) => {
    if (location.pathname === path) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer
      id="contact"
      className="relative bg-gradient-to-t from-black via-slate-950 to-slate-900 text-white overflow-hidden text-sm md:text-base"
    >
      {/* Fond baobab blur */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/cover.jpg')" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-black/70 backdrop-blur-lg" />

      {/* Halo de fond */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -bottom-20 left-10 w-64 h-64 bg-orange-500/30 blur-3xl rounded-full" />
        <div className="absolute -top-16 right-10 w-72 h-72 bg-orange-400/25 blur-3xl rounded-full" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
      </div>

      {/* Lignes fines décoratives */}
      <div className="pointer-events-none absolute inset-x-0 top-0 opacity-20">
        <div className="mx-auto max-w-6xl h-px bg-gradient-to-r from-transparent via-slate-500/60 to-transparent" />
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="border-t border-white/10 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4 md:grid-flow-col md:auto-cols-fr">
            {/* Company Info */}
            <div className="md:col-span-2 space-y-3 animate-fade-in-up">
              <div className="flex items-center space-x-2 mb-2">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-orange-500 to-orange-600 rounded-2xl blur opacity-60" />
                  <div className="relative bg-black/80 rounded-2xl p-1">
                    <img
                      src="/images/aria-logo.png"
                      alt="ARIA Logo"
                      className="h-18 w-20"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold tracking-tight">ARIA</h3>
                  <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-orange-300/80">
                    Agence digitale — Développement web, branding, marketing & solutions IA.
                  </p>
                </div>
              </div>

              <p className="text-white/70 mb-2 leading-relaxed text-sm md:text-base">
                Chaque projet est pour nous une aventure unique où créativité et technologie se rencontrent
                pour donner vie à votre vision. Nos réalisations témoignent de notre capacité à comprendre
                les enjeux spécifiques de différents secteurs.
              </p>

              <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-400/40 animate-fade-in-up delay-200">
                <span className="text-orange-400">★</span>
                <span className="text-orange-400">★</span>
                <span className="text-orange-400">★</span>
                <span className="text-orange-400">★</span>
                <span className="text-orange-400">★</span>
                <span className="ml-1 text-white/70 text-xs md:text-sm font-medium">
                  ÉQUIPE ARIA
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div className="animate-fade-in-up delay-150">
              <h4 className="text-base md:text-lg font-semibold mb-2 text-orange-400">Navigation</h4>
              <ul className="space-y-1 text-white/75 text-sm md:text-base">
                {[
                  { path: "/", label: "Accueil" },
                  { path: "/services", label: "Nos Services" },
                  { path: "/realisations", label: "Nos Réalisations" },
                  { path: "/about", label: "À Propos" },
                  { path: "/contact", label: "Nos Contacts" },
                ].map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className="flex items-center group"
                      onClick={() => handleNavigation(item.path)}
                    >
                      <span className="mr-1 text-orange-400 group-hover:translate-x-0.5 transition-transform">
                        •
                      </span>
                      <span className="group-hover:text-orange-200 transition-colors duration-200">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="animate-fade-in-up delay-100">
              <h4 className="text-base md:text-lg font-semibold mb-2 text-orange-400">Nos Services</h4>
              <ul className="space-y-1 text-white/75 text-sm md:text-base">
                {[
                  "Développement Web",
                  "Branding & Design",
                  "Marketing Digital",
                  "Solutions IA",
                ].map((item, i) => (
                  <li key={i} className="flex items-center group">
                    <Link 
                      to="/services" 
                      className="flex items-center group"
                      onClick={() => handleNavigation("/services")}
                    >
                      <span className="mr-1 text-orange-400 group-hover:translate-x-0.5 transition-transform">
                        •
                      </span>
                      <span className="group-hover:text-orange-200 transition-colors duration-200">
                        {item}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="animate-fade-in-up delay-200">
              <h4 className="text-base md:text-lg font-semibold mb-2 text-orange-400">Nos Contacts</h4>
              <div className="space-y-2 text-white/80 text-sm md:text-base">
                <div className="group">
                  <p className="font-medium text-white mb-0">Email</p>
                  <p className="inline-flex items-center cursor-pointer group-hover:text-orange-300 transition-colors">
                    <a href="mailto:aria.madacom@gmail.com">aria.madacom@gmail.com</a>
                  </p>
                </div>
                <div>
                  <p className="font-medium text-white mb-0">Téléphone</p>
                  <p className="text-white/80">+261 32 03 682 18</p>
                  <p className="text-white/80">+261 34 17 533 02</p>
                  <p className="text-white/80">+261 34 07 042 09</p>
                </div>
                <div>
                  <p className="font-medium text-white mb-0">Adresse</p>
                  <p className="text-white/70 text-sm md:text-base">
                    Madagascar
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bas de footer */}
          <div className="border-t border-white/10 mt-4 pt-3 text-center space-y-1 animate-fade-in-up delay-300">
            <p className="text-white/60 text-xs md:text-sm">
              © 2025 ARIA Communication. Tous droits réservés.
              <Link 
                to="/mentions-legales" 
                className="text-white/60 text-xs md:text-sm hover:text-orange-300 transition-colors"
                onClick={() => handleNavigation("/mentions-legales")}
              >
                {" "}
                | Mentions légales
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
