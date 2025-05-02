import axios from "axios";

// Récupération de l'URL de l'API depuis les variables d'environnement ou utilisation d'une valeur par défaut
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/api";

// Création d'une instance axios avec la configuration de base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour gérer les erreurs de manière globale
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log des erreurs pour le débogage
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

// Fonction pour récupérer toutes les recettes
export const fetchRecettes = () => apiClient.get("/recettes?populate=*");

// Fonction pour récupérer une recette par son documentId
export const fetchRecetteById = (documentId: string) =>
  apiClient.get(`/recettes/${documentId}?populate=*`);

// Fonction pour récupérer les recettes par catégorie
export const fetchRecettesByCategory = (categoryDocumentId: string) =>
  apiClient.get(
    `/recettes?filters[category][documentId]=${categoryDocumentId}&populate=*`
  );

// Fonction pour récupérer toutes les catégories
export const fetchCategories = () => apiClient.get("/categories");

// Fonction pour récupérer une catégorie par son documentId
export const fetchCategoryById = (documentId: string) =>
  apiClient.get(`/categories/${documentId}`);

// Fonction pour l'authentification (connexion)
export const login = (identifier: string, password: string) =>
  apiClient.post("/auth/local", {
    identifier,
    password,
  });

// Fonction pour l'inscription
export const register = (username: string, email: string, password: string) =>
  apiClient.post("/auth/local/register", {
    username,
    email,
    password,
  });

// Fonction pour créer une nouvelle recette (nécessite l'authentification)
export const createRecette = (recetteData: any, token: string) =>
  apiClient.post("/recettes", recetteData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Fonction pour mettre à jour une recette existante
export const updateRecette = (id: string, recetteData: any, token: string) =>
  apiClient.put(`/recettes/${id}`, recetteData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Fonction pour supprimer une recette
export const deleteRecette = (id: string, token: string) =>
  apiClient.delete(`/recettes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Exporter le client pour des utilisations personnalisées
export default apiClient;
