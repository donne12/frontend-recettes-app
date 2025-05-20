import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader } from "../components/Loader";
import axios from "axios";

interface Ingredient {
  id: number;
  documentId: string;
  nom: string;
  quantite: string;
}

interface Category {
  id: number;
  documentId: string;
  nom: string;
}

export default function CreateRecipe() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [recette, setRecette] = useState({
    titre: "",
    description: "",
    temps_preparation: 0,
    temps_cuisson: 0,
    etapes: "",
    categoryId: "",
    selectedIngredients: [] as { id: string; quantite: string }[],
  });

  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      fetchCategories();
      fetchIngredients();
    }
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:1337/api";
      const response = await axios.get(`${API_URL}/categories`);

      if (response.data && response.data.data) {
        const data = response.data.data.map((item: any) => ({
          id: item.id,
          documentId: item.documentId,
          nom: item.nom,
        }));
        setCategories(data);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des catégories:", err);
      setError("Impossible de charger les catégories");
    } finally {
      setLoadingData(false);
    }
  };

  const fetchIngredients = async () => {
    try {
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:1337/api";
      const response = await axios.get(`${API_URL}/ingredients`);

      if (response.data && response.data.data) {
        const data = response.data.data.map((item: any) => ({
          id: item.id,
          documentId: item.documentId,
          nom: item.nom,
          quantite: item.quantite,
        }));
        setIngredients(data);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des ingrédients:", err);
      setError("Impossible de charger les ingrédients");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setRecette({
      ...recette,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);

      // Créer une prévisualisation de l'image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const handleIngredientSelection = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const ingredientId = e.target.value;
    if (
      ingredientId &&
      !recette.selectedIngredients.some((item) => item.id === ingredientId)
    ) {
      setRecette({
        ...recette,
        selectedIngredients: [
          ...recette.selectedIngredients,
          { id: ingredientId, quantite: "" },
        ],
      });
    }
  };

  const handleIngredientQuantity = (id: string, quantite: string) => {
    setRecette({
      ...recette,
      selectedIngredients: recette.selectedIngredients.map((item) =>
        item.id === id ? { ...item, quantite } : item
      ),
    });
  };

  const removeIngredient = (id: string) => {
    setRecette({
      ...recette,
      selectedIngredients: recette.selectedIngredients.filter(
        (item) => item.id !== id
      ),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recette.titre.trim()) {
      setError("Le titre est obligatoire");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:1337/api";

      // Préparer les données de la recette
      const recetteData = {
        titre: recette.titre,
        description: recette.description,
        temps_preparation: recette.temps_preparation,
        temps_cuisson: recette.temps_cuisson,
        etapes: recette.etapes,
        category: recette.categoryId || null,
        ingredients: recette.selectedIngredients.map((item) => item.id),
      };

      console.log("Données de la recette:", recetteData);

      // Créer d'abord la recette
      const recetteResponse = await axios.post(
        `${API_URL}/recettes`,
        { data: recetteData },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Réponse de la création de la recette:", recetteResponse);

      if (
        recetteResponse.data &&
        recetteResponse.data.data &&
        recetteResponse.data.data.id
      ) {
        const recetteId = recetteResponse.data.data.id;

        // Si une image a été sélectionnée, l'uploader
        if (image) {
          const formData = new FormData();
          formData.append("files", image);
          formData.append("ref", "api::recette.recette");
          formData.append("refId", recetteId);
          formData.append("field", "image");

          await axios.post(`${API_URL}/upload`, formData, {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "multipart/form-data",
            },
          });
        }

        setSuccess("Recette créée avec succès!");

        // Rediriger vers la page de la recette après 2 secondes
        setTimeout(() => {
          navigate("/my-recipes");
        }, 2000);
      }
    } catch (err: any) {
      console.error("Erreur lors de la création de la recette:", err);
      setError(
        "Impossible de créer la recette: " +
          (err.response?.data?.error?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;
  if (loadingData) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Créer une nouvelle recette
            </h1>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                {error}
                <button
                  onClick={() => setError(null)}
                  className="ml-2 text-sm underline"
                >
                  Fermer
                </button>
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Titre */}
                <div className="col-span-2">
                  <label
                    htmlFor="titre"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Titre de la recette *
                  </label>
                  <input
                    type="text"
                    id="titre"
                    name="titre"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Tarte aux pommes"
                    value={recette.titre}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Image */}
                <div className="col-span-2 mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Image de la recette
                  </label>

                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {previewUrl ? (
                        <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex-grow">
                      <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          />
                        </svg>
                        Télécharger une image
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="text-sm text-gray-500 mt-1">
                        JPG, PNG ou GIF, taille maximale de 5 MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* Catégorie */}
                <div>
                  <label
                    htmlFor="categoryId"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Catégorie
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={recette.categoryId}
                    onChange={handleInputChange}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((category) => (
                      <option
                        key={category.documentId}
                        value={category.documentId}
                      >
                        {category.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Temps de préparation et cuisson */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="temps_preparation"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Temps de préparation (min)
                    </label>
                    <input
                      type="number"
                      id="temps_preparation"
                      name="temps_preparation"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={recette.temps_preparation}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="temps_cuisson"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Temps de cuisson (min)
                    </label>
                    <input
                      type="number"
                      id="temps_cuisson"
                      name="temps_cuisson"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={recette.temps_cuisson}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Décrivez votre recette en quelques mots..."
                    value={recette.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                {/* Ingrédients */}
                <div className="col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Ingrédients
                  </label>

                  <div className="flex mb-2">
                    <select
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={handleIngredientSelection}
                      value=""
                    >
                      <option value="">Ajouter un ingrédient</option>
                      {ingredients.map((ingredient) => (
                        <option
                          key={ingredient.documentId}
                          value={ingredient.documentId}
                        >
                          {ingredient.nom}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
                      onClick={() => navigate("/manage-ingredients")}
                    >
                      Gérer
                    </button>
                  </div>

                  {recette.selectedIngredients.length === 0 ? (
                    <p className="text-gray-500 text-sm italic mb-2">
                      Aucun ingrédient sélectionné
                    </p>
                  ) : (
                    <ul className="space-y-2 mb-4">
                      {recette.selectedIngredients.map((item) => {
                        const ingredient = ingredients.find(
                          (ing) => ing.documentId === item.id
                        );
                        return (
                          <li
                            key={item.id}
                            className="flex items-center bg-gray-50 p-2 rounded-lg"
                          >
                            <span className="flex-grow font-medium text-gray-700">
                              {ingredient?.nom}
                            </span>
                            <input
                              type="text"
                              className="w-32 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 mr-2"
                              placeholder="Quantité"
                              value={item.quantite}
                              onChange={(e) =>
                                handleIngredientQuantity(
                                  item.id,
                                  e.target.value
                                )
                              }
                            />
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => removeIngredient(item.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Étapes */}
                <div className="col-span-2">
                  <label
                    htmlFor="etapes"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Étapes de préparation
                  </label>
                  <textarea
                    id="etapes"
                    name="etapes"
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Décrivez les étapes de préparation (une étape par ligne)"
                    value={recette.etapes}
                    onChange={handleInputChange}
                  ></textarea>
                  <p className="text-gray-500 text-sm mt-1">
                    Écrivez chaque étape sur une nouvelle ligne. Ex: "1.
                    Préchauffer le four à 180°C"
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={() => navigate("/my-recipes")}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Création en cours...
                    </span>
                  ) : (
                    "Créer la recette"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
