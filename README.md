# ARIA — Refonte du site officiel (aria-mg.com)

Monorepo : **frontend React + TypeScript + Vite** · **API Express déployée en fonction serverless Vercel** · **PostgreSQL (Neon)**.

## Stack

| Partie | Technologie |
| --- | --- |
| Front | React 18, TypeScript, Vite 6, Tailwind CSS v4, React Router 6, lucide-react |
| API | Express 4, Prisma 6, Zod, JWT (cookie httpOnly), bcryptjs, Helmet, express-rate-limit — fonction Vercel `/api/*` |
| Base | PostgreSQL (Neon) |
| Images | Vercel Blob en production ; stockage local en développement |
| IA | Groq (clé **côté serveur uniquement**) — proxy `/api/chat` |
| i18n | FR source / EN généré automatiquement et mis en cache |

## Démarrage

```bash
npm install                 # installe frontend + backend (workspaces)

# 1. Configuration
cp backend/.env.example backend/.env
$EDITOR backend/.env        # DATABASE_URL Neon, JWT_SECRET et secrets locaux

# 2. Base de données
npm run db:migrate          # crée le schéma
npm run db:seed             # admin + FAQ + base de connaissances + projets de démarrage

# 3. Développement
npm run dev                 # API :4000 + Vite :5173 (proxy /api)
```

- Site : http://localhost:5173
- API locale : http://localhost:4000/api/health
- Admin : http://localhost:5173/admin/login (`ADMIN_EMAIL` / `ADMIN_PASSWORD`)

### Scripts utiles

| Commande | Rôle |
| --- | --- |
| `npm run dev` | frontend + backend en parallèle |
| `npm run build` | build production des deux |
| `npm run lint` | vérification TypeScript |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed` | seed (idempotent) |
| `npm run db:seed:showcase` | publie ou met à jour les six réalisations du portfolio |
| `npm run db:studio` | Prisma Studio |

Le seed du portfolio est indépendant de l'initialisation de l'admin. Il ne modifie que
les six projets définis dans `backend/prisma/seed-showcase.ts` et peut être relancé sans
créer de doublons. Exécutez `npm run db:seed:showcase` après avoir configuré
`DATABASE_URL` pour les publier dans la base ciblée.

## Routes API

| Méthode | Route | Accès |
| --- | --- | --- |
| POST | `/api/auth/login` · `/api/auth/logout` · `/api/auth/change-password` | public / admin |
| GET | `/api/auth/me` | public (renvoie `null` si non connecté) |
| GET/POST/PUT/DELETE | `/api/projects` (`?all=true` = admin pour la liste) | public / admin |
| GET | `/api/projects/:slug` | public (publié uniquement) |
| POST/GET/PATCH/DELETE | `/api/contact` | public (POST) / admin |
| POST/GET/PATCH/DELETE | `/api/quotes` | public (POST) / admin |
| GET/POST/PUT/DELETE | `/api/faq` (`?all=true`) | public (GET publié) / admin |
| GET/POST/PUT/DELETE | `/api/case-studies` | public / admin |
| GET/POST/PUT/DELETE | `/api/knowledge` | **admin** (base du chatbot) |
| POST | `/api/chat` | public — proxy Groq, rate-limit strict |
| POST | `/api/translations` | public — traduction automatique vers l’anglais, mise en cache, rate-limit dédié |
| GET | `/api/dashboard/stats` | admin |

## Sécurité

- Clé Groq **jamais** dans le bundle : elle est définie dans les variables d'environnement serveur.
- La traduction automatique des contenus publics réutilise `GROQ_API_KEY`. Les traductions générées sont mises en cache côté serveur et navigateur ; les textes juridiques doivent être relus avant publication.
- Auth par **cookie httpOnly** (`aria_token`) + JWT signé, mots de passe bcrypt (12 rounds).
- Rate limiting : global 600/15 min, formulaires & chat 20/15 min, login 10/15 min.
- Sur Vercel, ces compteurs mémoire sont propres à chaque instance serverless ; configurez un store distribué ou le pare-feu Vercel pour une limite partagée entre instances.
- Validation Zod sur toutes les entrées, Helmet, CORS restreint à `FRONTEND_URL`.
- `/admin` est exclu de `robots.txt`.

## Déploiement Vercel + Neon

Le frontend et l’API sont déployés depuis le même dépôt Vercel. Il n’y a pas de serveur Express séparé à lancer ou héberger : le frontend appelle `/api/*`, traité par `api/[...path].ts`. L’API s’exécute côté serveur Vercel afin de garder privés les identifiants Neon, le secret JWT et la clé Groq.

1. Importer le dépôt dans Vercel avec la racine du projet à la racine du dépôt. `vercel.json` configure la commande de build, `frontend/dist` et la fonction API.
2. Créer/configurer un projet PostgreSQL sur Neon et renseigner dans Vercel `DATABASE_URL` (URL de connexion Neon avec SSL).
3. Renseigner également `JWT_SECRET` (au moins 32 caractères aléatoires), `ADMIN_EMAIL` et `ADMIN_PASSWORD`. Ajouter `GROQ_API_KEY` et éventuellement `GROQ_MODEL` pour activer le chatbot et la traduction automatique.
4. Créer un store Vercel Blob et l’associer au projet pour fournir `BLOB_READ_WRITE_TOKEN`. Les fichiers sont stockés dans Blob, pas sur le disque éphémère des fonctions.
5. Déployer, puis appliquer le schéma Prisma avec `npm run db:deploy -w backend` en utilisant la même `DATABASE_URL`. Pour initialiser les données et le compte admin, exécuter `npm run db:seed -w backend` avec les variables de production fournies de façon sécurisée.

Les variables de production doivent être configurées dans **Vercel → Project Settings → Environment Variables** ; ne jamais les préfixer avec `VITE_`. Les anciennes images enregistrées sous forme d’URL locale `/api/files/...` doivent être migrées vers Blob pour être disponibles après déploiement.

## Consentement cookies et mesure d’audience

Le bandeau de consentement est présent sur les pages publiques. Il mémorise le choix du visiteur (`accepted` ou `rejected`) dans `localStorage` sous la clé `aria-cookie-consent`. Le lien **Paramètres des cookies** du pied de page permet de rouvrir le bandeau. Google Analytics 4 est prêt à être activé par la variable `VITE_GA_MEASUREMENT_ID` : aucun script de mesure ni cookie Analytics n’est chargé avant l’acceptation.

Pour activer Google Analytics 4 lorsque l’identifiant sera disponible :

1. Dans Google Analytics, créer une propriété GA4, puis un flux de données Web pour le domaine du site. Récupérer son identifiant de mesure au format `G-XXXXXXXXXX` dans les détails du flux.
2. Ajouter dans **Vercel → Project Settings → Environment Variables** la variable `VITE_GA_MEASUREMENT_ID` avec cet identifiant, pour les environnements souhaités. Cet identifiant est public et peut être exposé au frontend ; ne pas y mettre de secret.
3. Redéployer le site. Le frontend chargera le script uniquement si le visiteur a choisi **Accepter** ; il suivra également les changements de page côté React.
4. Le choix **Refuser** empêche le chargement et le suivi. Si le visiteur retire son accord dans **Paramètres des cookies**, le suivi est désactivé et les cookies GA4 accessibles au navigateur sont supprimés.

Sans identifiant, le bandeau fonctionne normalement et aucun suivi Analytics n’est envoyé. L’identifiant `G-…` est public et peut être exposé au frontend ; ne pas y mettre de secret.

## Contenu éditable depuis le back-office

`/admin/dashboard` (7 onglets) : statistiques, projets/réalisations, messages de contact,
demandes de devis, FAQ, études de cas, **base de connaissances du chatbot**
(catégorie + question + réponse → injectée dans le prompt système, sans redéploiement).

## Assets à fournir

- `frontend/public/hero/hero-back.mp4` + `hero-back-poster.jpg` — vidéo **paysage** du hero (desktop)
- `frontend/public/hero/hero.mp4` + `hero-poster.jpg` — vidéo **verticale 9:16** (720×1280 compressée
  ≈ 2,6 Mo) utilisée en arrière-plan sur **mobile** ; l'original non compressé est conservé hors du
  bundle dans `videos-source/hero-original-1080x1920.mp4`
- Chemins définis dans `VIDEO_DESKTOP` / `VIDEO_MOBILE` / `POSTER_*` dans
  `frontend/src/components/home/Hero.tsx`
- Si ni la vidéo ni l'image ne se chargent, le hero affiche un **état par défaut** (dégradé de marque) :
  cf. `DEFAULT_BACKGROUND` dans le même fichier
- **Thème par défaut : mode clair** (`frontend/src/lib/theme.tsx` + script inline de `index.html`) ;
  un choix explicite « dark » mémorisé reste respecté
- Photos réelles : équipe (`About`), visuels de projets (champ `image`)

## Palette (conservée de l'ARIA actuelle)

Fond `#110f0d` · orange `#f97316` · bleu `#3b82f6` · jaune `#fbbf24` · cartes `#1a1715`
Typo : **Plus Jakarta Sans** (titres) · **Inter** (texte) · **JetBrains Mono** (labels)
