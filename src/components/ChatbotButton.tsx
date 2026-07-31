// src/components/ChatbotButton.tsx
import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  MessageCircle,
  X,
  Sparkles,
  Send,
  Loader2,
} from "lucide-react";
import CodeRain from "@/components/CodeRain";
import Groq from "groq-sdk";

// Données des services Aria
const ARIA_SERVICES = {
  agency: {
    name: "Aria",
    description: "Une agence digitale qui transforme vos idées en résultats",
    email: "aria.madacom@gmail.com",
    phones: [
      "+261 32 03 682 18",
      "+261 34 17 533 02",
      "+261 34 07 042 09"
    ]
  },
  services: [
    {
      category: "Développement Web & Mobile",
      description: "Des sites et applications modernes, rapides et pensées pour convertir.",
      features: [
        "Site vitrine professionnel",
        "Site e-commerce",
        "Application web sur-mesure",
        "Imagination de vos outils métier"
      ]
    },
    {
      category: "Branding & Design Graphique",
      description: "Une identité visuelle forte pour une marque mémorable.",
      features: [
        "Création ou refonte de logo",
        "Charte graphique complète",
        "Cartes de visite, plaquettes, affiches",
        "Visuels pour réseaux sociaux"
      ]
    },
    {
      category: "Marketing Digital & Réseaux Sociaux",
      description: "Plus de visibilité, plus de clients, moins de perte de temps.",
      features: [
        "Gestion de réseaux sociaux",
        "Création de contenu",
        "Campagnes publicitaires",
        "Stratégie digitale sur mesure"
      ]
    },
    {
      category: "Solutions Entreprises (IA & Automatisation)",
      description: "Gagnez en efficacité grâce à des outils intelligents.",
      features: [
        "Chatbots et call centers IA",
        "Automatisation des processus",
        "Outils internes & dashboards",
        "Intégration d'API et systèmes"
      ]
    }
  ],
  projects: [
    {
      title: "Refonte du site d'une entreprise de services",
      description: "Site vitrine moderne, prise de contact simplifiée, blog intégré.",
      objective: "Améliorer la crédibilité et générer plus de demandes de devis."
    },
    {
      title: "Création de l'identité visuelle d'une marque locale",
      description: "Logo, charte graphique, supports imprimés et visuels réseaux sociaux.",
      objective: "Uniformiser la communication et monter en gamme."
    },
    {
      title: "Plateforme interne + automatisations",
      description: "Outil web pour gérer les clients, les demandes et les documents.",
      objective: "Réduire la charge manuelle et centraliser l'information."
    }
  ],
  process: [
    {
      step: "1",
      title: "Analyse et stratégie",
      description: "Nous prenons le temps de comprendre vos enjeux pour bâtir une stratégie sur-mesure adaptée à vos objectifs."
    },
    {
      step: "2",
      title: "Conception & maquette",
      description: "Nous créons des maquettes interactives qui préfigurent le résultat final avant tout développement."
    },
    {
      step: "3",
      title: "Développement & intégration",
      description: "Nous développons des solutions robustes, performantes et sécurisées avec les technologies les plus récentes."
    },
    {
      step: "4",
      title: "Lancement & suivi",
      description: "Nous assurons le déploiement et un accompagnement continu pour optimiser vos performances."
    }
  ]
};

// Prompts système détaillés
const SYSTEM_PROMPTS = {
  main: `Tu es l'assistant virtuel de l'agence digitale Aria. 
  Tu dois uniquement parler des services et informations suivants concernant Aria.
  Si on te pose des questions hors de ces sujets, répond poliment que tu ne peux parler que des services d'Aria.

  À PROPOS D'ARIA:
  - Nom: ${ARIA_SERVICES.agency.name}
  - Description: ${ARIA_SERVICES.agency.description}
  - Email: ${ARIA_SERVICES.agency.email}
  - Téléphones: ${ARIA_SERVICES.agency.phones.join(', ')}

  SERVICES D'ARIA:
  ${ARIA_SERVICES.services.map(s => `
  • ${s.category}
    ${s.description}
    ✓ ${s.features.join('\n    ✓ ')}
  `).join('\n')}

  EXEMPLES DE PROJETS RÉALISÉS:
  ${ARIA_SERVICES.projects.map(p => `
  • ${p.title}
    ${p.description}
    Objectif: ${p.objective}
  `).join('\n')}

  PROCESSUS DE TRAVAIL:
  ${ARIA_SERVICES.process.map(p => `
  ${p.step}. ${p.title}
      ${p.description}
  `).join('\n')}

  RÈGLES STRICTES:
  1. Ne parle QUE des informations ci-dessus
  2. Redirige toujours vers les contacts Aria pour des demandes spécifiques
  3. Ne donne pas de conseils généraux en marketing/developpement
  4. Ne crée pas de contenu original en dehors de la description des services
  5. Pour les demandes de devis, invite à contacter l'agence directement

  TON RÔLE: Accueillir, présenter les services, répondre aux questions SUR CES SERVICES uniquement.`,

  greeting: `Bonjour ! Je suis l'assistant virtuel de ${ARIA_SERVICES.agency.name}, ${ARIA_SERVICES.agency.description}

Je peux vous renseigner sur :
• Nos services digitaux
• Nos projets récents
• Notre méthodologie de travail
• Nos coordonnées

Comment puis-je vous aider aujourd'hui ?`
};

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
  time: string;
}

interface ChatbotButtonProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

const ChatbotButton: React.FC<ChatbotButtonProps> = ({
  position = "bottom-right",
}) => {
  const groqClient = useRef(
    new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true,
    })
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: SYSTEM_PROMPTS.greeting,
      sender: "bot",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messageIdRef = useRef(Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs pour la détection de clic extérieur
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const positionClasses: Record<string, string> = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };

  const scrollingText = "Aria • Agence Digitale • Développement • Design • Marketing • IA";

  // Gestion du clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isOpen) return;

      // Vérifier si le clic est à l'extérieur de la fenêtre de chat ET du bouton
      const isOutsideChat = chatWindowRef.current && 
        !chatWindowRef.current.contains(event.target as Node);
      const isOutsideButton = buttonRef.current && 
        !buttonRef.current.contains(event.target as Node);

      if (isOutsideChat && isOutsideButton) {
        setIsOpen(false);
      }
    };

    // Ajouter l'écouteur d'événements
    document.addEventListener('mousedown', handleClickOutside);
    
    // Nettoyer l'écouteur
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Fonction pour détecter les questions hors sujet
  const isOffTopic = (query: string): boolean => {
    const offTopicKeywords = [
      // Autres sujets
      'politique', 'sport', 'divertissement', 'cinéma', 'musique', 'jeux vidéo',
      'santé', 'médecine', 'juridique', 'finance personnelle', 'conseil vie',
      'recette', 'cuisine', 'voyage', 'météo', 'actualités',
      'autres entreprises', 'concurrents', 'autres agences',
      'aide personnelle', 'conseil personnel', 'avis personnel',
      'programmation générale', 'tutoriels', 'apprendre à coder',
      'design général', 'graphisme général'
    ];

    const ariaKeywords = [
      'aria', 'agence', 'digital', 'service', 'site web', 'développement',
      'design', 'marketing', 'logo', 'e-commerce', 'application', 'web',
      'mobile', 'réseaux sociaux', 'publicité', 'stratégie', 'ia',
      'automatisation', 'chatbot', 'dashboard', 'api', 'refonte',
      'identité visuelle', 'charte graphique', 'devis', 'contact',
      'projet', 'portfolio', 'réalisation', 'client', 'processus',
      'analyse', 'conception', 'maquette', 'lancement', 'suivi'
    ];

    const queryLower = query.toLowerCase();
    
    // Vérifie si la contient des mots-clés Aria
    const hasAriaKeywords = ariaKeywords.some(keyword => 
      queryLower.includes(keyword)
    );
    
    // Vérifie si c'est une salutation générale
    const isGreeting = ['bonjour', 'salut', 'hello', 'coucou', 'hey']
      .some(g => queryLower.startsWith(g));
    
    return !hasAriaKeywords && !isGreeting;
  };

  // Réponse pour les questions hors sujet
  const getOffTopicResponse = (): string => {
    const responses = [
      `Je suis spécialisé dans les services de l'agence Aria uniquement. Je peux vous parler de notre développement web, design, marketing digital ou solutions IA. Quelle est votre question concernant Aria ?`,
      `En tant qu'assistant d'Aria, je me concentre sur nos services digitaux. Souhaitez-vous connaître nos offres en développement, design ou marketing ?`,
      `Pour vous aider au mieux, je reste focalisé sur les services d'Aria. Puis-je vous présenter nos compétences en création de sites web, identité visuelle ou automatisation ?`,
      `Mes réponses sont limitées aux activités d'Aria. Je serais ravi de vous parler de nos réalisations ou de notre processus de travail !`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Réponses pré-définies pour les questions fréquentes
  const getPredefinedResponse = (query: string): string | null => {
    const queryLower = query.toLowerCase().trim();
    
    // Contacts
    if (queryLower.includes('contact') || queryLower.includes('email') || queryLower.includes('téléphone') || queryLower.includes('tél') || queryLower.includes('phone')) {
      return `Voici les coordonnées d'Aria :\n\n📧 Email : ${ARIA_SERVICES.agency.email}\n📞 Téléphones :\n${ARIA_SERVICES.agency.phones.map(p => `  • ${p}`).join('\n')}\n\nN'hésitez pas à nous contacter pour discuter de votre projet !`;
    }
    
    // Services
    if (queryLower.includes('service') || queryLower.includes('offre') || queryLower.includes('propose')) {
      return `Aria propose 4 grandes catégories de services :\n\n${ARIA_SERVICES.services.map(s => 
        `🔹 ${s.category}\n   ${s.description}\n   ${s.features.map(f => `   ✓ ${f}`).join('\n')}`
      ).join('\n\n')}\n\nLequel de ces services vous intéresse particulièrement ?`;
    }
    
    // Prix/devis
    if (queryLower.includes('prix') || queryLower.includes('tarif') || queryLower.includes('devis') || queryLower.includes('combien coûte')) {
      return `Les tarifs dépendent de la complexité et de la durée de votre projet. Pour un devis personnalisé, je vous invite à contacter directement l'équipe Aria à ${ARIA_SERVICES.agency.email} ou par téléphone.\n\nIls pourront analyser vos besoins et vous proposer une solution adaptée à votre budget.`;
    }
    
    // Processus
    if (queryLower.includes('processus') || queryLower.includes('méthode') || queryLower.includes('démarche') || queryLower.includes('fonctionne')) {
      return `Notre processus de travail en 4 étapes :\n\n${ARIA_SERVICES.process.map(p => 
        `${p.step}. **${p.title}**\n   ${p.description}`
      ).join('\n\n')}\n\nCette méthode nous permet de garantir qualité et satisfaction !`;
    }
    
    // Projets/exemples
    if (queryLower.includes('exemple') || queryLower.includes('projet') || queryLower.includes('réalisation') || queryLower.includes('portfolio')) {
      return `Voici quelques exemples de projets réalisés :\n\n${ARIA_SERVICES.projects.map(p => 
        `🎯 **${p.title}**\n   ${p.description}\n   Objectif : ${p.objective}`
      ).join('\n\n')}\n\nCes projets illustrent notre expertise et notre approche sur-mesure.`;
    }
    
    // Salutations
    if (['bonjour', 'salut', 'hello', 'coucou', 'hey', 'bonsoir'].some(g => queryLower.startsWith(g))) {
      return SYSTEM_PROMPTS.greeting;
    }
    
    return null;
  };

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;

    // Vérification API key
    if (!import.meta.env.VITE_GROQ_API_KEY) {
      const errorMessage: Message = {
        id: messageIdRef.current++,
        text: "⚠️ L'API n'est pas configurée. Contactez-nous directement à aria.madacom@gmail.com",
        sender: "bot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setError("API_KEY_MISSING");
      return;
    }

    // Ajout du message utilisateur
    const userMessage: Message = {
      id: messageIdRef.current++,
      text: inputValue,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    setError(null);

    try {
      // Vérification hors sujet
      if (isOffTopic(inputValue)) {
        setTimeout(() => {
          const botMessage: Message = {
            id: messageIdRef.current++,
            text: getOffTopicResponse(),
            sender: "bot",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false);
        }, 800);
        return;
      }

      // Vérification réponse pré-définie
      const predefinedResponse = getPredefinedResponse(inputValue);
      if (predefinedResponse) {
        setTimeout(() => {
          const botMessage: Message = {
            id: messageIdRef.current++,
            text: predefinedResponse,
            sender: "bot",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setMessages((prev) => [...prev, botMessage]);
          setIsTyping(false);
        }, 800);
        return;
      }

      // Appel API Groq avec contexte strict
      const chatCompletion = await groqClient.current.chat.completions.create({
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPTS.main,
          },
          {
            role: "user",
            content: inputValue,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3, // Plus bas pour moins de créativité
        max_tokens: 300,
        stream: false,
      });

      const botResponse = chatCompletion.choices[0]?.message?.content || 
        "Je peux vous renseigner sur les services d'Aria. Avez-vous une question spécifique sur notre développement web, design ou marketing ?";
      
      const botMessage: Message = {
        id: messageIdRef.current++,
        text: botResponse,
        sender: "bot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMessage]);
      
    } catch (error) {
      console.error("Groq API Error:", error);
      
      let errorText = "Désolé, je rencontre une difficulté technique. Vous pouvez nous contacter directement à aria.madacom@gmail.com";
      
      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          errorText = "Configuration API manquante. Contactez-nous par email ou téléphone.";
          setError("API_KEY_ERROR");
        } else if (error.message.includes("rate limit")) {
          errorText = "Service momentanément occupé. Réessayez dans quelques instants ou contactez-nous directement.";
        }
      }
      
      const errorMessage: Message = {
        id: messageIdRef.current++,
        text: errorText,
        sender: "bot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isTyping) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Suggestions de questions
  const suggestedQuestions = [
    "Quels services proposez-vous ?",
    "Pouvez-vous me donner un exemple de projet ?",
    "Comment vous contacter ?",
    "Quel est votre processus de travail ?"
  ];

  const handleSuggestionClick = (question: string) => {
    setInputValue(question);
  };

  return (
    <>
      {/* Bouton flottant */}
      <div
        className={`fixed ${positionClasses[position]} z-50 flex items-center gap-2`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Scrolling tag */}
        <div
          className={`
            flex items-center gap-2 bg-black/70 backdrop-blur-xl rounded-full px-4 py-2
            border border-white/20 shadow-xl transition-all duration-300 overflow-hidden
            ${isHovering ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"}
          `}
        >
          <Sparkles className="w-4 h-4 text-orange-400 drop-shadow-sm animate-pulse" />
          <div className="relative w-48 overflow-hidden">
            <div
              className={`whitespace-nowrap text-white/90 text-sm font-medium tracking-wide ${
                isHovering ? "animate-marquee" : ""
              }`}
            >
              <span className="inline-block">{scrollingText}</span>
              <span className="inline-block ml-8">{scrollingText}</span>
            </div>
          </div>
        </div>

        {/* Bouton principal */}
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center justify-center w-14 h-14 rounded-full relative overflow-hidden
            bg-gradient-to-br from-orange-500/90 via-orange-400/90 to-orange-600/90
            backdrop-blur-md text-white shadow-2xl
            hover:scale-110 hover:rotate-3 transition-all duration-300
            border-2 border-white/20
            ${isHovering ? "shadow-orange-500/40 ring ring-orange-400/50" : ""}
          `}
          aria-label="Ouvrir le chat"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6 animate-bounce" />
          )}
        </button>
      </div>

      {/* Fenêtre de chat */}
      {isOpen && (
        <div
          ref={chatWindowRef}
          className={`
            fixed ${positionClasses[position]} z-50 mb-24 mr-2 w-150 h-[500px] 
            bg-gradient-to-b from-slate-900/95 via-slate-800/90 to-black/85 
            backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 
            overflow-hidden animate-[fadeInUp_0.4s_ease-out]
          `}
        >
          {/* CodeRain en arrière-plan */}
          <div className="absolute inset-0 opacity-60">
            <CodeRain />
          </div>

          {/* Contenu du chat au-dessus */}
          <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className="bg-black/70 p-4 text-white border-b border-white/10 flex items-center justify-between h-20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{ARIA_SERVICES.agency.name}</h3>
                  <p className="text-xs opacity-90 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    Assistant Aria
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600/70 hover:scrollbar-thumb-orange-400/60">
              <div className="space-y-4 pb-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    } items-end gap-2 transition-all`}
                  >
                    {message.sender === "bot" && (
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white/90 shadow-md">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-md whitespace-pre-line ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-orange-500/90 to-orange-400/90 text-white rounded-br-none"
                          : "bg-black/40 backdrop-blur-sm text-white/95 rounded-bl-none border border-white/10"
                      } animate-[fadeIn_0.3s_ease-out]`}
                    >
                      {message.text}
                      <span className="block text-xs opacity-75 mt-1">
                        {message.time}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-3 animate-pulse">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {messages.length <= 3 && !isTyping && (
                  <div className="pt-4 mt-4 border-t border-white/10">
                    <p className="text-xs text-white/70 mb-2">Questions fréquentes :</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(question)}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-white/90 transition-all border border-white/20 hover:border-orange-400/50"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {error === "API_KEY_MISSING" && (
                  <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <p className="text-xs text-red-300">
                      💡 <strong>Configuration requise :</strong> Ajoutez VITE_GROQ_API_KEY dans votre fichier .env pour activer l'IA.
                      <br />
                      <span className="text-white/70">En attendant, le chatbot propose des réponses basiques sur Aria.</span>
                    </p>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Zone d'entrée */}
            <div className="p-4 bg-black/75 border-t border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Posez une question sur les services Aria..."
                  className="flex-1 px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-orange-400 outline-none text-sm"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className={`p-2.5 rounded-xl shadow-md transition-all flex items-center justify-center ${
                    inputValue.trim() && !isTyping
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-105 text-white"
                      : "bg-white/10 text-white/30 cursor-not-allowed"
                  }`}
                >
                  {isTyping ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-white/50 text-center">
                Je parle uniquement des services d'Aria • Pas de conversations générales
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotButton;