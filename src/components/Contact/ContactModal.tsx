import React, { useState, useEffect, useRef } from "react";
import { Mail, Send, Phone, Globe2, CheckCircle, Loader2 } from "lucide-react";
import { addMessage } from "@/services/messagesService";

export interface ContactMessage {
  secteur: string;
  nom: string;
  email: string;
  telephone: string;
  pays: string;
  enLigne: string;
  projet: string;
}

interface Props {
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const ContactModal: React.FC<Props> = ({ onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState<ContactMessage>({
    secteur: "",
    nom: "",
    email: "",
    telephone: "",
    pays: "",
    enLigne: "",
    projet: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLFormElement>(null);

  // Calcul automatique de la progression
  useEffect(() => {
    const total = Object.keys(formData).length;
    const filled = Object.values(formData).filter((v) => v.trim() !== "").length;
    setProgress((filled / total) * 100);
  }, [formData]);

  // Gestion des champs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Au clic sur "Envoyer"
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirming(true);
  };

  // Confirmation finale après validation
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(false);

    try {
      await addMessage(formData);
      setIsSubmitted(true);
      setTimeout(() => onSubmitSuccess(), 2000);
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
      setIsConfirming(false);
    }
  };

  // Étape de confirmation avant envoi
  if (isConfirming) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 px-4 animate-fade-in">
        <div className="bg-slate-900 p-8 rounded-2xl max-w-md w-full border border-orange-400/40 text-center">
          <h3 className="text-xl font-semibold text-orange-300 mb-4">
            Confirmez votre demande
          </h3>
          <p className="text-white/80 mb-6 text-sm">
            Vérifiez vos informations avant l’envoi. Une fois validé, nous traiterons votre demande.
          </p>

          <ul className="text-left text-white/70 text-sm mb-6 space-y-2">
            <li><strong>Secteur :</strong> {formData.secteur}</li>
            <li><strong>Nom :</strong> {formData.nom}</li>
            <li><strong>Email :</strong> {formData.email}</li>
            <li><strong>Téléphone :</strong> {formData.telephone}</li>
            <li><strong>Pays :</strong> {formData.pays}</li>
            <li><strong>En ligne :</strong> {formData.enLigne}</li>
            <li><strong>Projet :</strong> {formData.projet}</li>
          </ul>

          {submitError && (
            <p className="text-red-400 text-sm mb-3">❌ Erreur de réseau. Réessayez.</p>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setIsConfirming(false)}
              className="px-5 py-2 text-sm border border-gray-500 rounded-lg text-gray-300 hover:bg-gray-700 transition"
            >
              Modifier
            </button>
            <button
              onClick={handleConfirmSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 text-sm bg-gradient-to-r from-orange-500 to-yellow-400 rounded-lg text-black font-semibold hover:scale-105 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Confirmer l’envoi
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Étape finale : message envoyé
  if (isSubmitted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 px-4 animate-fade-in">
        <div className="bg-gradient-to-b from-emerald-900/40 to-slate-900 p-10 rounded-2xl shadow-2xl text-center max-w-md w-full border border-emerald-400/40">
          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4 animate-pulse" />
          <h3 className="text-2xl font-bold text-emerald-300 mb-2">Message envoyé !</h3>
          <p className="text-emerald-100/90">
            Votre devis détaillé vous sera renvoyé dans moins d’une heure.
          </p>
          <button
            onClick={onClose}
            className="mt-6 px-5 py-2 text-sm border border-emerald-400/50 rounded-lg text-emerald-100 hover:bg-emerald-500/10 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  // Formulaire principal
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-slate-950/90 text-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full relative flex flex-col max-h-[90vh] border border-orange-500/30 animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition text-xl"
        >
          ✕
        </button>

        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-orange-300 mb-2">Demande de devis</h2>
          <p className="text-sm text-white/70">
            Remplissez les informations ci-dessous, nous reviendrons vers vous sous 1 heure.
          </p>
        </div>

        <div className="w-full bg-slate-800 h-2 rounded-full mb-6 overflow-hidden">
          <div
            className="h-2 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="overflow-y-auto pr-2 space-y-8 custom-scrollbar">
          <form onSubmit={handleSubmit} ref={containerRef} className="space-y-8 pb-6">
            <FormSection title="1. Informations générales" color="orange-400">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Secteur d’activité" name="secteur" type="text" value={formData.secteur} onChange={handleInputChange} required focusedField={focusedField} setFocusedField={setFocusedField} />
                <InputField label="Nom" name="nom" type="text" value={formData.nom} onChange={handleInputChange} required focusedField={focusedField} setFocusedField={setFocusedField} />
                <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} icon={<Mail className="w-4 h-4 mr-2" />} required focusedField={focusedField} setFocusedField={setFocusedField} />
                <InputField label="Téléphone" name="telephone" type="tel" value={formData.telephone} onChange={handleInputChange} icon={<Phone className="w-4 h-4 mr-2" />} required focusedField={focusedField} setFocusedField={setFocusedField} />
                <InputField label="Pays" name="pays" type="text" value={formData.pays} onChange={handleInputChange} icon={<Globe2 className="w-4 h-4 mr-2" />} required focusedField={focusedField} setFocusedField={setFocusedField} />
              </div>
            </FormSection>

            <FormSection title="2. Objectifs du site" color="orange-400">
              <label className="block text-orange-200 text-sm mb-2">Déjà présent en ligne ?</label>
              <select
                name="enLigne"
                value={formData.enLigne}
                onChange={handleInputChange}
                className="w-full p-3 bg-black/60 border border-slate-700 rounded-xl focus:ring focus:ring-orange-500 text-white text-sm"
              >
                <option value="">Sélectionnez une réponse</option>
                <option value="Oui">Oui</option>
                <option value="Non">Non</option>
              </select>
            </FormSection>

            <FormSection title="3. Contexte du projet" color="orange-400">
              <label className="block text-orange-200 text-sm mb-2">
                Type de projet
              </label>
              <textarea
                name="projet"
                value={formData.projet}
                onChange={handleInputChange}
                rows={6}
                maxLength={2000}
                required
                className="w-full p-3 bg-black/60 border border-slate-700 rounded-xl text-white text-sm focus:ring focus:ring-orange-500 resize-none"
                placeholder="Décrivez le type de site ou d’application voulu, vos besoins, votre vision..."
              />
            </FormSection>

            {submitError && (
              <p className="text-red-400 text-center text-sm animate-fade-in">
                ❌ Erreur de réseau. Veuillez réessayer plus tard.
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 py-3 rounded-xl text-black font-semibold hover:scale-[1.03] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" /> Envoyer la demande
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// SECTION WRAPPER
const FormSection: React.FC<{ title: string; color?: string }> = ({ title, children, color }) => (
  <div className="animate-fade-in-up">
    <h3 className={`text-lg font-semibold text-${color} mb-3`}>{title}</h3>
    {children}
  </div>
);

// INPUT FIELD
interface InputProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  icon?: React.ReactNode;
  focusedField: string | null;
  setFocusedField: React.Dispatch<React.SetStateAction<string | null>>;
}

const InputField: React.FC<InputProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  required,
  icon,
  focusedField,
  setFocusedField,
}) => (
  <div>
    <label className="block text-orange-200 text-sm mb-2 flex items-center">
      {icon}
      <span>{label}</span>
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      onFocus={() => setFocusedField(name)}
      onBlur={() => setFocusedField(null)}
      placeholder={`Votre ${label.toLowerCase()}`}
      required={required}
      className={`w-full p-3 bg-black/60 border border-slate-700 rounded-xl text-white placeholder-gray-500 text-sm focus:ring focus:ring-orange-500 transition duration-200 ${
        focusedField === name ? "ring-2 ring-orange-500 shadow-lg shadow-orange-500/20" : ""
      }`}
    />
  </div>
);

export default ContactModal;
