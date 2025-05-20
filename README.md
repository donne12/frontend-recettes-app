# Délices Culinaires

Une application moderne et responsive de gestion de recettes de cuisine construite avec React, TypeScript et Tailwind CSS. Cette application frontend se connecte à une API backend Strapi pour offrir une interface élégante permettant de parcourir, créer et gérer des recettes de cuisine, avec un système d'authentification complet.

## 📋 Fonctionnalités

### Fonctionnalités publiques
- **Navigation des recettes** : Explorez une variété de recettes avec des cartes visuellement attrayantes
- **Filtrage par catégorie** : Filtrez les recettes par différentes catégories
- **Fonction de recherche** : Trouvez rapidement des recettes grâce à une recherche instantanée
- **Design responsive** : Optimisé pour tous les appareils - mobile, tablette et ordinateur
- **Pages détaillées de recettes** : Consultez des informations complètes incluant les étapes de préparation, temps de cuisson, et plus encore

### Fonctionnalités utilisateur authentifié
- **Authentification** : Créez un compte, connectez-vous et gérez votre profil
- **Gestion des recettes** : Créez, modifiez et supprimez vos propres recettes
- **Gestion des ingrédients** : Ajoutez, modifiez et supprimez des ingrédients que vous pouvez utiliser dans vos recettes
- **Gestion des catégories** : Créez et gérez les catégories pour organiser vos recettes
- **Upload d'images** : Ajoutez des photos à vos recettes pour les rendre plus attrayantes

## 🚀 Technologies

- **React 19** : Utilisation de la dernière version de React
- **TypeScript** : Pour un code typé et une meilleure expérience de développement
- **Tailwind CSS** : Pour un style basé sur des utilitaires
- **Vite** : Outil de build rapide et efficace
- **React Router** : Pour une navigation fluide
- **Axios** : Pour les requêtes API
- **Context API** : Pour la gestion de l'état global et l'authentification

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
├── components/              # Composants UI réutilisables
│   ├── CategoryList.tsx     # Composant de la barre latérale des catégories
│   ├── Footer.tsx           # Pied de page de l'application
│   ├── Loader.tsx           # Composant du spinner de chargement
│   ├── Navbar.tsx           # Composant de la barre de navigation
│   ├── ProtectedRoute.tsx   # Composant de protection des routes authentifiées
│   └── RecipeCard.tsx       # Composant de carte de recette
├── context/                 # Contextes React
│   └── AuthContext.tsx      # Contexte d'authentification
├── pages/                   # Pages de l'application
│   ├── CategoryPage.tsx     # Vue des catégories
│   ├── CreateRecipe.tsx     # Formulaire de création de recette
│   ├── EditRecipe.tsx       # Formulaire d'édition de recette
│   ├── Home.tsx             # Page d'accueil avec liste des recettes
│   ├── Login.tsx            # Page de connexion
│   ├── ManageCategories.tsx # Gestion des catégories
│   ├── ManageIngredients.tsx# Gestion des ingrédients
│   ├── MyRecipes.tsx        # Liste des recettes de l'utilisateur
│   ├── Profile.tsx          # Profil utilisateur
│   ├── RecipeDetail.tsx     # Vue détaillée des recettes
│   └── Register.tsx         # Page d'inscription
├── services/                # Services API
│   └── api.ts               # Client API et points d'accès
├── App.tsx                  # Composant principal de l'application
├── main.tsx                 # Point d'entrée de l'application
└── index.css                # Styles globaux
```

## 📱 Vues de l'Application

### Vues publiques
- **Accueil** : Affiche une grille de cartes de recettes avec une barre de recherche et un filtre par catégorie
- **Détail de la Recette** : Affiche des informations détaillées sur une recette spécifique
- **Page de Catégorie** : Affiche toutes les recettes d'une catégorie spécifique
- **Connexion** : Formulaire de connexion pour les utilisateurs existants
- **Inscription** : Formulaire d'inscription pour les nouveaux utilisateurs

### Vues authentifiées
- **Profil** : Informations sur l'utilisateur connecté et accès à ses fonctionnalités
- **Mes Recettes** : Liste des recettes créées par l'utilisateur avec options de gestion
- **Création de Recette** : Formulaire pour ajouter une nouvelle recette
- **Édition de Recette** : Formulaire pour modifier une recette existante
- **Gestion des Ingrédients** : Interface pour ajouter, modifier et supprimer des ingrédients
- **Gestion des Catégories** : Interface pour ajouter, modifier et supprimer des catégories

## 🌐 Intégration API

L'application se connecte à un backend CMS Strapi via les points d'accès suivants :

### Endpoints publics
- `GET /api/recettes?populate=*` : Récupérer toutes les recettes
- `GET /api/recettes/:id?populate=*` : Récupérer une recette spécifique
- `GET /api/categories` : Récupérer toutes les catégories
- `GET /api/categories/:id` : Récupérer une catégorie spécifique
- `GET /api/recettes?filters[category][documentId]=:categoryId&populate=*` : Récupérer les recettes par catégorie

### Endpoints d'authentification
- `POST /api/auth/local` : Connexion utilisateur
- `POST /api/auth/local/register` : Inscription utilisateur

### Endpoints authentifiés
- `GET /api/recettes?populate=*` : Récupérer les recettes de l'utilisateur
- `POST /api/recettes` : Créer une nouvelle recette
- `PUT /api/recettes/:id` : Mettre à jour une recette
- `DELETE /api/recettes/:id` : Supprimer une recette
- `POST /api/ingredients` : Créer un nouvel ingrédient
- `PUT /api/ingredients/:id` : Mettre à jour un ingrédient
- `DELETE /api/ingredients/:id` : Supprimer un ingrédient
- `POST /api/categories` : Créer une nouvelle catégorie
- `PUT /api/categories/:id` : Mettre à jour une catégorie
- `DELETE /api/categories/:id` : Supprimer une catégorie
- `POST /api/upload` : Télécharger des médias (images)
- `DELETE /api/upload/files/:id` : Supprimer un média

## 🔐 Authentification

Le système d'authentification est basé sur JSON Web Tokens (JWT) et permet :

- Inscription d'utilisateurs avec validation des formulaires
- Connexion avec email/nom d'utilisateur et mot de passe
- Persistance de session via localStorage
- Protection des routes pour les utilisateurs authentifiés
- Gestion des autorisations basée sur l'utilisateur (un utilisateur ne peut modifier que ses propres recettes)

## 🛠️ Développement

### Scripts disponibles

- `npm run dev` : Démarrer le serveur de développement
- `npm run build` : Compiler l'application pour la production

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

5. Configuration des permissions dans Strapi :
   - Accédez à `Settings` > `Roles` > `Authenticated`
   - Accordez les permissions CRUD pour les collections `recettes`, `categories` et `ingredients`
   - Assurez-vous que les actions d'authentification sont bien activées

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.