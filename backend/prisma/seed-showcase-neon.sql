-- À coller dans le Neon SQL Editor après application des migrations Prisma.
-- Ajoute uniquement les projets du showcase absents par slug. Aucun projet existant
-- n'est modifié ou supprimé. Les IDs sont des identifiants texte générés ici.
INSERT INTO "projects" (
  "id",
  "slug",
  "title",
  "description",
  "fullDescription",
  "objective",
  "client",
  "duration",
  "status",
  "url",
  "technologies",
  "goals",
  "solutions",
  "caseStudyExcerpt",
  "caseStudyChallenge",
  "caseStudyApproach",
  "caseStudyResults",
  "caseStudyServices",
  "image",
  "published",
  "order",
  "createdAt",
  "updatedAt"
)
VALUES
(
  'showcase-soiree-pizza-noizay',
  'soiree-pizza-noizay',
  'Soirée Pizza — Noizay',
  'Application web de réservation pour une soirée pizza solidaire organisée au profit des projets de l''école de Noizay.',
  'Conception d''une application simple permettant aux familles de découvrir le menu, de réserver leurs pizzas en ligne et de choisir un créneau de retrait. Le site présente aussi les modalités de paiement, les informations pratiques et les moments de la soirée.',
  'Faciliter les réservations et l''organisation d''une soirée pizza solidaire pour l''école de Noizay.',
  'École de Noizay',
  NULL,
  'COMPLETED',
  'https://pizza-de-noizay.vercel.app/',
  ARRAY['Application web', 'Réservation en ligne']::TEXT[],
  ARRAY[
    'Permettre aux familles de réserver leurs pizzas en ligne',
    'Centraliser les informations pratiques de la soirée',
    'Simplifier l''organisation des commandes et du retrait'
  ]::TEXT[],
  ARRAY[
    'Création d''une page présentant l''événement et le menu',
    'Mise en place d''un parcours de réservation',
    'Ajout des choix de pizzas, de créneaux de retrait et d''informations de contact'
  ]::TEXT[],
  'Une application de réservation dédiée à une soirée pizza solidaire, pensée pour être rapide à utiliser sur mobile.',
  'Donner aux organisateurs un outil clair pour collecter les réservations tout en offrant aux familles un parcours simple, accessible et adapté aux inscriptions de dernière minute.',
  'Le site associe une présentation chaleureuse de l''événement à un formulaire guidé avec coordonnées, sélection des pizzas et créneau de retrait.',
  ARRAY[
    'Réservation possible directement depuis le site',
    'Commande limitée et structurée selon le menu disponible',
    'Informations pratiques visibles avant et pendant la réservation'
  ]::TEXT[],
  ARRAY['Application web', 'Conception UX', 'Réservation en ligne']::TEXT[],
  'https://pizza-de-noizay.vercel.app/assets/pizzamiel-KTSR5phY.png',
  TRUE,
  9,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'showcase-aria-mg',
  'aria-mg',
  'ARIA — Accompagnement Digital',
  'Site officiel d''ARIA présentant l''agence digitale malgache et ses expertises en développement, branding, marketing digital et solutions IA.',
  'Conception et refonte du site institutionnel d''ARIA autour d''une expérience claire, rapide et responsive. Le site présente les services de l''agence, son approche de travail, ses réalisations, ses partenaires et ses coordonnées. Il comprend également des formulaires de contact et de demande de devis, un chatbot renseigné sur les offres d''ARIA et un espace d''administration pour gérer les contenus.',
  'Renforcer la présence numérique d''ARIA, présenter son expertise et faciliter les prises de contact et les demandes de devis.',
  'ARIA',
  NULL,
  'COMPLETED',
  'https://www.aria-mg.com/',
  ARRAY[
    'React', 'TypeScript', 'Vite', 'Tailwind CSS', 'React Router',
    'Express', 'Prisma', 'PostgreSQL', 'Vercel'
  ]::TEXT[],
  ARRAY[
    'Présenter clairement les expertises de l''agence',
    'Valoriser les réalisations et les partenaires',
    'Faciliter les demandes de contact et de devis'
  ]::TEXT[],
  ARRAY[
    'Refonte de l''identité numérique et des parcours de navigation',
    'Présentation des services en développement, branding, marketing et IA',
    'Développement du portfolio, des formulaires et du chatbot',
    'Création d''un back-office pour administrer les projets et les contenus'
  ]::TEXT[],
  'Une plateforme institutionnelle complète pour présenter l''agence ARIA et transformer les visiteurs en prospects qualifiés.',
  'Présenter quatre domaines d''expertise dans une interface cohérente, tout en facilitant la découverte des services et la prise de contact depuis tous les appareils.',
  'Le site a été structuré autour d''un parcours commercial direct : valorisation de l''offre, preuve sociale, réalisations, services détaillés et appels à l''action vers le devis ou le contact.',
  ARRAY[
    'Une présentation unifiée des services et des expertises d''ARIA',
    'Un portfolio administrable depuis le back-office',
    'Des parcours dédiés aux prises de contact et aux demandes de devis',
    'Une expérience responsive disponible en français et en anglais'
  ]::TEXT[],
  ARRAY['Refonte web', 'Développement full-stack', 'UX/UI', 'Chatbot', 'Back-office']::TEXT[],
  '/og-aria.jpg',
  TRUE,
  10,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'showcase-securitec-poste-de-garde-numerique',
  'securitec-poste-de-garde-numerique',
  'SECURITEC — Poste de garde numérique',
  'Application web de gestion des agents de sécurité et des opérations de poste de garde pour des sites industriels et des agences.',
  'SECURITEC numérise les opérations quotidiennes du poste de garde : prise et passation de service, pointage des agents, contrôle des accès, rondes, consignes, main courante, registres de site et logistique. L''application centralise les informations par site, organise les accès selon les rôles et permet de poursuivre certaines saisies hors ligne avec synchronisation ultérieure.',
  'Remplacer les registres papier et centraliser le suivi des équipes, des accès et des opérations sur les sites surveillés.',
  'SECURITEC',
  NULL,
  'COMPLETED',
  NULL,
  ARRAY[
    'React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui',
    'React Router', 'Node.js', 'PostgreSQL', 'Prisma', 'IndexedDB', 'Service Worker'
  ]::TEXT[],
  ARRAY[
    'Numériser les prises de poste, passations et pointages des agents',
    'Tracer les visiteurs, véhicules, rondes, consignes et événements de site',
    'Centraliser les registres et la logistique dans un outil partagé',
    'Maintenir les opérations essentielles lorsque la connexion est indisponible',
    'Cloisonner les données selon les sites et les rôles des utilisateurs'
  ]::TEXT[],
  ARRAY[
    'Développement d''une application métier organisée autour des postes de garde et des cahiers de site',
    'Gestion des rôles et du contexte multi-sites',
    'Mise en place d''un cache et d''une file d''attente IndexedDB pour les saisies hors ligne',
    'Synchronisation des saisies en attente au retour de la connexion',
    'Prise en charge de l''impression et de l''export des données opérationnelles'
  ]::TEXT[],
  'Un poste de garde numérique pour suivre les équipes, les accès et les opérations quotidiennes des sites depuis une application centralisée.',
  'Remplacer des registres papier dispersés par un outil adapté aux opérations de terrain, aux droits d''accès par rôle et aux sites où la connexion peut être instable.',
  'L''application regroupe les principaux flux du poste de garde dans des modules dédiés et rattache les opérations à leur site. Une file locale permet de conserver certaines saisies hors ligne avant leur synchronisation.',
  ARRAY[
    'Suivi numérique des prises de poste, passations et présences',
    'Regroupement des contrôles d''accès, rondes, consignes et registres',
    'Accès aux données organisé par site et par rôle',
    'Continuité de certaines saisies sans connexion, avec synchronisation ultérieure'
  ]::TEXT[],
  ARRAY[
    'Application métier sur mesure',
    'Développement full-stack',
    'Gestion des opérations de sécurité',
    'Application web hors ligne'
  ]::TEXT[],
  NULL,
  TRUE,
  11,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'showcase-royal-palace-gestion-hoteliere',
  'royal-palace-gestion-hoteliere',
  'Royal Palace — Gestion hôtelière',
  'Plateforme interne de gestion des opérations de l''hôtel Royal Palace à Antsirabe, réunissant l''hôtellerie, la restauration, le bar, le spa, les finances et la gestion du personnel.',
  'Développement d''une application métier sécurisée pour centraliser les opérations quotidiennes du Royal Palace. La plateforme propose des espaces dédiés à la gestion des chambres et réservations, des clients, du restaurant et du bar, du spa, des finances ainsi qu''aux utilisateurs, aux ressources humaines et au planning du personnel. Les accès aux modules sont contrôlés selon les rôles.',
  'Rassembler les outils de gestion des différents services de l''hôtel dans une plateforme unique avec des accès adaptés aux équipes.',
  'Royal Palace Antsirabe',
  NULL,
  'COMPLETED',
  NULL,
  ARRAY[
    'React', 'TypeScript', 'Vite', 'Tailwind CSS', 'React Router',
    'Node.js', 'Express', 'MySQL', 'JWT'
  ]::TEXT[],
  ARRAY[
    'Centraliser le suivi des réservations et des opérations hôtelières',
    'Faciliter la gestion des activités restaurant, bar et spa',
    'Donner une visibilité sur les revenus et les finances',
    'Organiser la gestion des utilisateurs, des rôles et du personnel'
  ]::TEXT[],
  ARRAY[
    'Développement d''une application de gestion accessible après authentification',
    'Création de modules dédiés à l''hôtel, au restaurant, au bar, au spa et aux finances',
    'Mise en place de permissions par rôle et par module',
    'Ajout d''espaces pour la gestion des clients, des ressources humaines et du planning'
  ]::TEXT[],
  'Une plateforme de gestion interne conçue pour réunir les principaux services et opérations du Royal Palace.',
  'Réunir dans un même outil les besoins opérationnels de plusieurs services hôteliers tout en adaptant les accès aux responsabilités de chaque utilisateur.',
  'L''application structure les fonctions par module métier et protège les espaces selon l''authentification, les rôles et les permissions attribuées.',
  ARRAY[
    'Accès centralisé aux outils de gestion des différents services',
    'Gestion des réservations, clients, restaurant, bar et spa',
    'Suivi financier et gestion du personnel dans la même plateforme',
    'Droits d''accès adaptés aux rôles des équipes'
  ]::TEXT[],
  ARRAY[
    'Application métier sur mesure',
    'Développement full-stack',
    'Gestion hôtelière',
    'Gestion des accès par rôle'
  ]::TEXT[],
  NULL,
  TRUE,
  12,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'showcase-ampela-vagno',
  'ampela-vagno',
  'Ampela Vagno',
  'Site web de l''association humanitaire Ampela Vagno, engagée pour l''autonomisation des femmes du Grand Sud de Madagascar et contre les mariages précoces et forcés.',
  'Réalisation du site de l''association afin de présenter sa mission, ses actions et son impact auprès des communautés du district d''Ampanihy Ouest. Le site met en avant les initiatives menées autour des droits des femmes, de la transmission de savoir-faire, de l''autonomie économique et de l''éducation numérique, et invite les visiteurs à soutenir l''association ou à devenir bénévoles.',
  'Faire connaître la mission et les actions d''Ampela Vagno, sensibiliser le public et faciliter le soutien à ses initiatives dans le Grand Sud de Madagascar.',
  'Association Ampela Vagno',
  NULL,
  'COMPLETED',
  'https://www.ampelavagno.org/',
  ARRAY[]::TEXT[],
  ARRAY[
    'Présenter la mission et les valeurs de l''association',
    'Faire découvrir ses projets et ses axes d''intervention sur le terrain',
    'Sensibiliser aux droits et à l''autonomisation des femmes',
    'Encourager les dons, les partenariats et le bénévolat'
  ]::TEXT[],
  ARRAY[
    'Création d''un site de présentation de l''association et de sa mission',
    'Mise en valeur des actions locales et des initiatives d''autonomisation',
    'Présentation des informations d''impact et de la zone d''intervention',
    'Intégration d''appels à l''action pour soutenir l''association et la contacter'
  ]::TEXT[],
  'Un site de présentation pour faire connaître les actions d''Ampela Vagno en faveur des femmes et des communautés du Grand Sud malgache.',
  'Présenter les enjeux sociaux et les projets de terrain de l''association tout en offrant aux visiteurs des moyens simples de s''informer et de s''engager.',
  'Le contenu organise la présentation autour de la mission, des actions menées à Ejeda, de la zone d''intervention et des témoignages, avec des invitations à faire un don ou à devenir bénévole.',
  ARRAY[
    'Présentation en ligne de la mission et des actions de l''association',
    'Mise en avant des projets menés dans la région d''Ampanihy Ouest',
    'Parcours permettant de découvrir comment soutenir l''association'
  ]::TEXT[],
  ARRAY['Site vitrine', 'Présence digitale']::TEXT[],
  '/images/realisations/AmpelaVagno.png',
  TRUE,
  13,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'showcase-hda-plateforme-gestion-integree',
  'hda-plateforme-gestion-integree',
  'HDA — Plateforme de gestion intégrée',
  'Application métier qui centralise la gestion d''un établissement réunissant hôtel, restaurant, bar & lounge et casino.',
  'Développement d''une plateforme de gestion intégrée pour réunir les opérations des différents départements dans un outil unique. Elle couvre notamment les réservations et séjours hôteliers, les clients et dossiers KYC, les commandes et caisses du restaurant et du bar, les opérations du casino, les stocks, les finances, les ressources humaines et le planning du personnel. Les accès sont adaptés aux rôles et les opérations sensibles sont conçues pour être traçables.',
  'Centraliser les opérations de l''établissement, améliorer le suivi des encaissements et des stocks, et fournir aux équipes des outils adaptés à leurs responsabilités.',
  'HDA',
  NULL,
  'COMPLETED',
  NULL,
  ARRAY[
    'React', 'TypeScript', 'Vite', 'React Router', 'Node.js',
    'Express', 'MySQL / MariaDB', 'JWT', 'bcrypt'
  ]::TEXT[],
  ARRAY[
    'Réunir les opérations de l''hôtel, du restaurant, du bar et du casino',
    'Améliorer la traçabilité des encaissements, des stocks et des opérations métier',
    'Centraliser les informations clients et le suivi KYC',
    'Faciliter le pilotage des activités et l''organisation des équipes',
    'Adapter les fonctionnalités accessibles aux rôles des utilisateurs'
  ]::TEXT[],
  ARRAY[
    'Développement de modules métier pour l''hébergement, la restauration, le bar et le casino',
    'Centralisation des stocks, des achats et des opérations financières',
    'Ajout d''outils de gestion des clients, des ressources humaines et du planning',
    'Mise en place d''une authentification et de permissions selon les rôles',
    'Prise en charge des rapports, des impressions et des signatures électroniques'
  ]::TEXT[],
  'Une plateforme de gestion intégrée qui rassemble les principaux services et fonctions de pilotage d''un établissement hôtelier et de loisirs.',
  'Unifier des activités aux besoins différents — hébergement, restauration, bar, casino, finances et RH — tout en gardant des opérations traçables et des accès adaptés à chaque métier.',
  'La plateforme organise les fonctionnalités par département et rôle, avec une API centralisée et des flux métier dédiés aux réservations, commandes, caisses, stocks, clients et équipes.',
  ARRAY[
    'Outils de gestion regroupés pour l''hôtel, le restaurant, le bar et le casino',
    'Suivi centralisé des clients, des stocks et des opérations financières',
    'Fonctionnalités adaptées aux différents profils et métiers',
    'Rapports et supports d''impression pour les opérations quotidiennes'
  ]::TEXT[],
  ARRAY[
    'Application métier sur mesure',
    'Développement full-stack',
    'Gestion hôtelière et restauration',
    'Gestion de caisse et de stock'
  ]::TEXT[],
  NULL,
  TRUE,
  14,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'showcase-agrisat-cartographie-agricole-madagascar',
  'agrisat-cartographie-agricole-madagascar',
  'AGRISAT — Cartographie et suivi des parcelles d''orge par satellite',
  'Plateforme web de cartographie agricole pour la filière orge à Madagascar : détection automatique des parcelles, suivi par imagerie satellite et analyse de cultures en temps réel.',
  'AGRISAT centralise la cartographie des parcelles d''orge de la filière MALTO à Madagascar. Sur une carte satellite, les équipes délimitent une zone puis laissent le système détecter et tracer automatiquement les parcelles par segmentation d''image (YOLO11-seg), sans dupliquer celles déjà en base. Chaque parcelle est ensuite enrichie par imagerie Sentinel-2 et imagerie haute résolution complémentaire : indices spectraux (NDVI, NDRE, EVI, SAVI, NDWI), séries temporelles, classification de la culture et estimation du rendement. Un tableau de bord suit la santé des cultures et les zones à risque, tandis que les fiches parcelles, les analyses et le module de modèles restent accessibles aux agronomes. Les résultats s''exportent en GeoJSON, CSV et PDF pour les rapports de zonage.',
  'Donner aux agronomes et aux équipes terrain une vision fiable, actualisée et partagée des parcelles d''orge, afin de réduire les vérifications manuelles sur le terrain et de prioriser les actions là où les cultures sont à risque.',
  'MALTO (filière orge — Madagascar)',
  NULL,
  'COMPLETED',
  'https://aria-mg.vercel.app/',
  ARRAY[
    'React 18', 'TypeScript', 'Vite', 'Zustand', 'React Router',
    'Google Maps JavaScript API', 'Leaflet', 'Recharts', 'Tailwind CSS',
    'Python 3.11', 'FastAPI', 'SQLAlchemy (async)', 'PostgreSQL / Neon',
    'Alembic', 'Google Earth Engine', 'Sentinel-2', 'YOLO11-seg', 'Random Forest'
  ]::TEXT[],
  ARRAY[
    'Cartographier les parcelles d''orge sans relevé GPS exhaustif sur le terrain.',
    'Suivre l''état des cultures et détecter les parcelles à risque au fil de la saison.',
    'Rendre les données partageables avec les équipes terrain et les partenaires.'
  ]::TEXT[],
  ARRAY[
    'Détection automatique des parcelles par segmentation d''image sur capture satellite, avec déduplication avec la base existante.',
    'Calcul des indices spectraux et des séries temporelles via Google Earth Engine, à partir de Sentinel-2 et d''imagerie haute résolution.',
    'Tableau de bord et fiches parcelles (santé, confiance, verdict, recommandations) alimentés par une API FastAPI asynchrone.',
    'Exports GeoJSON, CSV et PDF pour les rapports et le partage des zonages.'
  ]::TEXT[],
  'Une plateforme de cartographie agricole qui automatise la détection des parcelles d''orge et le suivi satellite des cultures à Madagascar.',
  NULL,
  NULL,
  ARRAY[]::TEXT[],
  ARRAY[
    'Développement full-stack (React / FastAPI)',
    'Intégration d''imagerie satellite et de modèles IA',
    'Cartographie SIG et visualisation de données'
  ]::TEXT[],
  '/images/realisations/MaltoStar.jpeg',
  TRUE,
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;
