// components/CTASection.tsx
import React, { useState } from "react";
import ContactModal from "./Contact/ContactModal";
import { CheckCircle, MessageCircle } from "lucide-react";

const CTASection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/15 via-emerald-600/10 to-emerald-500/15 p-8 rounded-3xl border border-emerald-400/50 text-center animate-scale-in mt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.5),transparent_60%)] opacity-40" />
        <div className="relative z-10 animate-bounce-in">
          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-pulse-custom" />
          <h3 className="text-2xl font-bold text-emerald-300 mb-2">
            Message envoyé !
          </h3>
          <p className="text-emerald-50/90 text-lg">
            Votre devis détaillé vous sera renvoyé dans moins d'une heure.
          </p>
        </div>
        <div
          className="absolute bottom-4 right-4 text-white/50 cursor-pointer hover:text-white transition"
          onClick={() => setIsSubmitted(false)}
        >
          <span className="underline">Fermer</span>
        </div>
      </div>
    );
  }

  return (
    <section
      className="cta-section relative bg-gradient-to-br from-gray/90 to-gray-900/70 text-white text-center py-20 px-4 pt-28"
      id="contact"
      style={{
        backgroundImage: "url('/images/baobab1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-black/60 backdrop-blur z-5" />

      <div className="container mx-auto max-w-4xl relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-orange-200 to-yellow-300 text-transparent bg-clip-text">
          Prêt à lancer votre projet ?
        </h1>

        <p className="text-xl opacity-90 mb-8">
          Parlez-nous de vos besoins et recevez une première proposition dans
          les 24 heures.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-yellow-300 text-black font-semibold px-7 py-3 rounded-full hover:from-yellow-400 hover:to-orange-500 hover:text-black transition transform hover:scale-[1.03] shadow-lg shadow-orange-500/20 text-lg"
          >
            Demander un devis
          </button>

          <a
            href="https://wa.me/+261341753302"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold px-7 py-3 rounded-full hover:from-[#22c55e] hover:to-[#0e7c6e] transition transform hover:scale-[1.03] shadow-lg shadow-[#25D366]/20 group text-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="w-5 h-5 group-hover:animate-bounce" />
            <span>Nous contacter sur WhatsApp</span>
          </a>
        </div>

        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Que vous ayez un projet précis ou juste une idée à clarifier, nous
          sommes là pour vous conseiller.
        </p>
      </div>

      {isModalOpen && (
        <ContactModal
          onClose={() => setIsModalOpen(false)}
          onSubmitSuccess={() => {
            setIsModalOpen(false);
            setIsSubmitted(true);
          }}
        />
      )}
    </section>
  );
};

export default CTASection;