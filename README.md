# Délices Culinaires

Une application moderne et responsive de gestion de recettes de cuisine construite avec React, TypeScript et Tailwind CSS. Cette application frontend se connecte à une API backend Strapi pour offrir une interface élégante permettant de parcourir des recettes de cuisine.

## 📋 Fonctionnalités

- **Navigation des recettes** : Explorez une variété de recettes avec des cartes visuellement attrayantes
- **Filtrage par catégorie** : Filtrez les recettes par différentes catégories
- **Fonction de recherche** : Trouvez rapidement des recettes grâce à une recherche instantanée
- **Design responsive** : Optimisé pour tous les appareils - mobile, tablette et ordinateur
- **Pages détaillées de recettes** : Consultez des informations complètes incluant les étapes de préparation, temps de cuisson, et plus encore

## 🚀 Technologies

- **React 19** : Utilisation de la dernière version de React
- **TypeScript** : Pour un code typé et une meilleure expérience de développement
- **Tailwind CSS** : Pour un style basé sur des utilitaires
- **Vite** : Outil de build rapide et efficace
- **React Router** : Pour une navigation fluide
- **Axios** : Pour les requêtes API


## 📦 Installation

### Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn
- Backend Strapi en fonctionnement (voir les instructions de configuration du backend ci-dessous)

### Instructions d'installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/donne12/frontend-recettes-app.git
   cd frontend-recettes-app
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Créez un fichier `.env` dans le répertoire racine avec :
   ```
   VITE_API_URL=http://localhost:1337/api
   ```

4. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```

5. Ouvrez votre navigateur et accédez à :
   ```
   http://localhost:5173
   ```

## 🏗️ Structure du Projet

```
src/
├── components/          # Composants UI réutilisables
│   ├── CategoryList.tsx # Composant de la barre latérale des catégories
│   ├── Footer.tsx       # Pied de page de l'application
│   ├── Loader.tsx       # Composant du spinner de chargement
│   ├── Navbar.tsx       # Composant de la barre de navigation
│   └── RecipeCard.tsx   # Composant de carte de recette
├── pages/               # Pages de l'application
│   ├── CategoryPage.tsx # Vue des catégories
│   ├── Home.tsx         # Page d'accueil avec liste des recettes
│   └── RecipeDetail.tsx # Vue détaillée des recettes
├── services/            # Services API
│   └── api.ts           # Client API et points d'accès
├── App.tsx              # Composant principal de l'application
├── main.tsx             # Point d'entrée de l'application
└── index.css            # Styles globaux
```

## 📱 Vues de l'Application

- **Accueil** : Affiche une grille de cartes de recettes avec une barre de recherche et un filtre par catégorie
- **Détail de la Recette** : Affiche des informations détaillées sur une recette spécifique
- **Page de Catégorie** : Affiche toutes les recettes d'une catégorie spécifique

## 🌐 Intégration API

L'application se connecte à un backend CMS Strapi via les points d'accès suivants :

- `GET /api/recettes?populate=*` : Récupérer toutes les recettes
- `GET /api/recettes/:id?populate=*` : Récupérer une recette spécifique
- `GET /api/categories` : Récupérer toutes les catégories
- `GET /api/categories/:id` : Récupérer une catégorie spécifique
- `GET /api/recettes?filters[category][documentId]=:categoryId&populate=*` : Récupérer les recettes par catégorie

## 🛠️ Développement

### Scripts disponibles

- `npm run dev` : Démarrer le serveur de développement
- `npm run build` : Compiler l'application pour la production
- `npm run lint` : Exécuter ESLint pour vérifier la qualité du code
- `npm run preview` : Prévisualiser la version de production en local

## 🧩 Configuration du Backend (Référence rapide)

Cette application nécessite un backend Strapi. Pour configurer le backend :

1. Clonez le dépôt backend :
   ```bash
   git clone https://github.com/donne12/backend-recettes-app.git
   cd backend-recettes-app
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Démarrez le serveur de développement :
   ```bash
   npm run develop
   ```

4. Accédez au panneau d'administration Strapi à `http://localhost:1337/admin`

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.
