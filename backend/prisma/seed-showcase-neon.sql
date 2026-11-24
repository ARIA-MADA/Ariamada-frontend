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
  'showcase-sophie-jacquet-audebert-psychologue',
  'sophie-jacquet-audebert-psychologue',
  'Sophie Jacquet-Audebert — Psychologue',
  'Site professionnel de Sophie Jacquet-Audebert, psychologue clinicienne à Paris 10e, présentant son parcours, ses pratiques et les modalités de consultation.',
  'Le site présente l''approche intégrative de la psychologue, son parcours et ses outils d''accompagnement : psychologie clinique, approche transgénérationnelle, mémoire cellulaire et art-thérapie. Les patients peuvent s''informer sur les consultations individuelles au cabinet, rue du Faubourg Saint-Denis à Paris, ou à distance en visioconférence.',
  'Présenter le parcours et les pratiques de la psychologue, et aider les patients à découvrir les modalités de consultation et à prendre contact.',
  'Sophie Jacquet-Audebert',
  NULL,
  'COMPLETED',
  'https://sophie-jacquet-audebert.vercel.app/',
  ARRAY[]::TEXT[],
  ARRAY[
    'Présenter la psychologue et son approche clinique',
    'Expliquer les différentes pratiques proposées',
    'Informer sur les consultations au cabinet et à distance',
    'Faciliter la prise de contact et les demandes de rendez-vous'
  ]::TEXT[],
  ARRAY[
    'Création d''un site professionnel organisé autour de l''accueil, des pratiques, du parcours et du contact',
    'Présentation détaillée de la psychologie clinique, du transgénérationnel, de la mémoire cellulaire et de l''art-thérapie',
    'Mise en évidence des modalités de consultation à Paris et en visioconférence'
  ]::TEXT[],
  'Un site professionnel pour découvrir l''approche, le parcours et les modalités de consultation de Sophie Jacquet-Audebert.',
  'Rendre accessibles des pratiques thérapeutiques complémentaires et permettre aux patients de comprendre les possibilités de consultation avant de prendre contact.',
  'Le parcours du site articule une présentation de la psychologue, des pages consacrées à ses outils d''accompagnement, des informations pratiques et des moyens de contact.',
  ARRAY[
    'Présentation claire du parcours et de l''approche de la psychologue',
    'Informations sur quatre pratiques d''accompagnement',
    'Présentation des consultations au cabinet et en visioconférence'
  ]::TEXT[],
  ARRAY['Site vitrine', 'Présence digitale']::TEXT[],
  NULL,
  TRUE,
  15,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'showcase-allie-jc-multiservices-habitat',
  'allie-jc-multiservices-habitat',
  'L''Allié JC — Multiservices Habitat',
  'Site professionnel de L''Allié JC, entreprise de multiservices proposant l''entretien des espaces verts, le nettoyage et les petits travaux dans le Doubs et le Jura.',
  'Le site présente les services de Jean Charles Biernat, entrepreneur individuel basé à La Rivière-Drugeon : entretien de jardins et terrasses, nettoyage haute pression, nettoyage de vitres et d''intérieurs, remises en état de fin de bail ou de chantier, nettoyage de locaux et petits bricolages. Il s''adresse aux particuliers, copropriétés et professionnels, et propose une demande de devis avec estimation en ligne.',
  'Présenter les prestations de l''entreprise et permettre aux particuliers et professionnels de demander facilement un devis dans sa zone d''intervention.',
  'L''Allié JC',
  NULL,
  'COMPLETED',
  'https://alli-jc-eta.vercel.app/',
  ARRAY[]::TEXT[],
  ARRAY[
    'Présenter les services d''entretien, de nettoyage et de petit bricolage',
    'Informer sur les prestations pour particuliers, copropriétés et professionnels',
    'Faciliter les demandes de devis et la prise de contact',
    'Préciser la zone d''intervention dans le Doubs et le Jura'
  ]::TEXT[],
  ARRAY[
    'Création d''un site vitrine organisé par catégories de services',
    'Présentation des prestations d''espaces verts, de nettoyage et de remise en état',
    'Ajout d''un simulateur de devis et d''un formulaire de demande',
    'Mise en avant des coordonnées et de la zone géographique desservie'
  ]::TEXT[],
  'Un site de présentation et de demande de devis pour une entreprise locale de multiservices habitat dans le Haut-Doubs et le Jura.',
  'Présenter une offre de services variée pour plusieurs types de clients tout en facilitant l''estimation des besoins et la prise de contact.',
  'Le site regroupe les prestations par domaine, détaille la zone desservie et propose un simulateur ainsi qu''un formulaire pour qualifier les demandes de devis.',
  ARRAY[
    'Présentation des services pour particuliers, copropriétés et professionnels',
    'Parcours de demande de devis avec simulateur en ligne',
    'Informations de contact et zone d''intervention facilement accessibles'
  ]::TEXT[],
  ARRAY['Site vitrine', 'Simulateur de devis', 'Présence digitale']::TEXT[],
  NULL,
  TRUE,
  16,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'showcase-ifaty-beach-club',
  'ifaty-beach-club',
  'Ifaty Beach Club',
  'Site de présentation et de réservation de l''Ifaty Beach Club, hôtel trois étoiles en bord de lagon à Mangily, dans le sud-ouest de Madagascar.',
  'Le site présente l''hôtel, ses chambres et bungalows, ses équipements et les activités accessibles depuis Ifaty. Les visiteurs peuvent découvrir les hébergements, les deux piscines, le jacuzzi, le restaurant et le bar, ainsi que les activités nautiques et de découverte de la région. Un parcours de demande de disponibilité permet de préparer une réservation, tandis que le site met en avant une démarche de préservation de l''écosystème local.',
  'Présenter l''hôtel et ses prestations, inspirer les voyageurs et faciliter les demandes de réservation et d''informations.',
  'Ifaty Beach Club',
  NULL,
  'COMPLETED',
  'https://ifaty-beach-club-frontend.vercel.app/',
  ARRAY[]::TEXT[],
  ARRAY[
    'Présenter les chambres et bungalows selon les besoins des voyageurs',
    'Mettre en valeur les équipements et services de l''hôtel',
    'Faire découvrir les activités nautiques et les sites à proximité',
    'Faciliter les demandes de disponibilité et la prise de contact'
  ]::TEXT[],
  ARRAY[
    'Création d''un site vitrine organisé autour des hébergements, services, activités et informations pratiques',
    'Présentation des chambres doubles, twin et familiales',
    'Mise en valeur des piscines, du jacuzzi, du restaurant, du bar et de l''accès à la plage',
    'Ajout d''un parcours de demande de réservation et d''informations'
  ]::TEXT[],
  'Un site hôtelier pour découvrir les hébergements, les services et les activités de l''Ifaty Beach Club face au lagon.',
  'Présenter une expérience de séjour complète à Ifaty et aider les visiteurs à choisir un hébergement et à organiser leur réservation.',
  'Le site associe une présentation de l''hôtel à des sections dédiées aux chambres, aux équipements, aux activités et aux excursions, avec des appels à l''action vers la demande de disponibilité.',
  ARRAY[
    'Présentation détaillée des catégories de chambres et bungalows',
    'Informations réunies sur les services, activités et lieux à découvrir',
    'Parcours de demande de réservation accessible depuis le site'
  ]::TEXT[],
  ARRAY['Site hôtelier', 'Présentation des hébergements', 'Réservation en ligne']::TEXT[],
  NULL,
  TRUE,
  17,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'showcase-kolo-tv-fm',
  'kolo-tv-fm',
  'KOLO TV/FM',
  'Plateforme média de KOLO TV/FM, réunissant télévision en direct, radio et contenus d''information, de culture et de divertissement malgaches.',
  'Le site rassemble les deux antennes KOLO TV et KOLO FM dans une expérience numérique commune. Les visiteurs peuvent regarder la chaîne en direct, écouter la radio, retrouver les journaux Ny Vaovao, consulter les replays et découvrir des émissions consacrées à la culture, au sport, à l''actualité, à l''économie et à la musique malgache.',
  'Rendre les programmes de KOLO TV et KOLO FM accessibles en ligne et valoriser les contenus d''information et de culture malgaches.',
  'KOLO TV/FM',
  NULL,
  'COMPLETED',
  'https://kolo-tv-frontend.vercel.app/',
  ARRAY[]::TEXT[],
  ARRAY[
    'Réunir les expériences de télévision et de radio en ligne',
    'Faciliter l''accès aux directs et aux émissions',
    'Mettre en avant les journaux et les programmes malgaches',
    'Présenter une programmation variée entre actualité, culture, sport et musique'
  ]::TEXT[],
  ARRAY[
    'Création d''un portail média réunissant les univers KOLO TV et KOLO FM',
    'Mise en place de points d''accès aux directs TV et radio',
    'Présentation des journaux, replays et émissions à la une',
    'Organisation des programmes par antenne et par type de contenu'
  ]::TEXT[],
  'Une plateforme de diffusion en ligne qui réunit la télévision et la radio KOLO autour des programmes malgaches.',
  'Rendre complémentaires et faciles à parcourir les contenus de deux antennes — télévision et radio — tout en donnant de la visibilité aux journaux, magazines et programmes culturels.',
  'L''interface permet de choisir entre les univers TV et FM, d''accéder au direct et de parcourir les programmes et replays mis en avant.',
  ARRAY[
    'Accès regroupé aux directs de KOLO TV et KOLO FM',
    'Mise en avant des éditions du journal Ny Vaovao et des replays',
    'Navigation par antenne et découverte de contenus d''actualité, de culture, de sport et de musique'
  ]::TEXT[],
  ARRAY[
    'Plateforme média',
    'Diffusion TV et radio en ligne',
    'Présence digitale'
  ]::TEXT[],
  NULL,
  TRUE,
  18,
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
),
(
  'showcase-heroescrm',
  'heroescrm',
  'HeroesCRM',
  'Application CRM web pour centraliser la gestion de projets et le suivi des prospects associés.',
  'HeroesCRM est une application de gestion de la relation client qui organise les prospects par projet. Elle permet de consulter et gérer les prospects, de suivre leur historique et de centraliser les opérations liées aux projets dans une interface web.',
  'Centraliser le suivi des prospects et des projets dans un outil accessible aux équipes.',
  'HeroesCRM',
  NULL,
  'COMPLETED',
  'https://heroescrm.io/',
  ARRAY[]::TEXT[],
  ARRAY[
    'Regrouper les prospects au sein des projets concernés',
    'Faciliter le suivi et la consultation de l''historique des prospects',
    'Centraliser la gestion de la relation client dans une interface web'
  ]::TEXT[],
  ARRAY[
    'Développement d''une application CRM accessible depuis le navigateur',
    'Organisation des prospects par projet',
    'Mise à disposition d''un historique de suivi pour chaque prospect'
  ]::TEXT[],
  'Une application CRM web pour organiser les prospects par projet et suivre leur historique.',
  NULL,
  NULL,
  ARRAY[]::TEXT[],
  ARRAY['Application web', 'CRM', 'Gestion des prospects']::TEXT[],
  NULL,
  TRUE,
  19,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;
