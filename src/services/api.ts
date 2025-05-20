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

// ----- AUTHENTIFICATION -----

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

// ----- RECETTES -----

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

// Fonction pour récupérer les recettes d'un utilisateur spécifique
export const fetchRecettesByUser = (userId: number, token: string) =>
  apiClient.get(`/recettes?filters[users_permissions_user][id]=${userId}&populate=*`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Fonction pour créer une nouvelle recette
export const createRecette = (recetteData: any, token: string) =>
  apiClient.post("/recettes", { data: recetteData }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Fonction pour mettre à jour une recette existante
export const updateRecette = (documentId: string, recetteData: any, token: string) =>
  apiClient.put(`/recettes/${documentId}`, { data: recetteData }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Fonction pour supprimer une recette
export const deleteRecette = (documentId: string, token: string) =>
  apiClient.delete(`/recettes/${documentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// ----- CATÉGORIES -----

// Fonction pour récupérer toutes les catégories
export const fetchCategories = () => apiClient.get("/categories");

// Fonction pour récupérer une catégorie par son documentId
export const fetchCategoryById = (documentId: string) =>
  apiClient.get(`/categories/${documentId}`);

// Fonction pour créer une nouvelle catégorie
export const createCategory = (categoryData: any, token: string) =>
  apiClient.post("/categories", { data: categoryData }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Fonction pour mettre à jour une catégorie existante
export const updateCategory = (documentId: string, categoryData: any, token: string) =>
  apiClient.put(`/categories/${documentId}`, { data: categoryData }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Fonction pour supprimer une catégorie
export const deleteCategory = (documentId: string, token: string) =>
  apiClient.delete(`/categories/${documentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// ----- INGRÉDIENTS -----

// Fonction pour récupérer tous les ingrédients
export const fetchIngredients = () => apiClient.get("/ingredients");

// Fonction pour récupérer un ingrédient par son documentId
export const fetchIngredientById = (documentId: string) =>
  apiClient.get(`/ingredients/${documentId}`);

// Fonction pour créer un nouvel ingrédient
export const createIngredient = (ingredientData: any, token: string) =>
  apiClient.post("/ingredients", { data: ingredientData }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Fonction pour mettre à jour un ingrédient existant
export const updateIngredient = (documentId: string, ingredientData: any, token: string) =>
  apiClient.put(`/ingredients/${documentId}`, { data: ingredientData }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Fonction pour supprimer un ingrédient
export const deleteIngredient = (documentId: string, token: string) =>
  apiClient.delete(`/ingredients/${documentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// ----- MEDIAS -----

// Fonction pour uploader une image
export const uploadMedia = (file: File, ref: string, refId: string, field: string, token: string) => {
  const formData = new FormData();
  formData.append('files', file);
  formData.append('ref', ref);
  formData.append('refId', refId);
  formData.append('field', field);
  
  return axios.post(`${API_URL}/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Fonction pour supprimer un media
export const deleteMedia = (mediaId: number, token: string) =>
  apiClient.delete(`/upload/files/${mediaId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Exporter le client pour des utilisations personnalisées
export default apiClient;