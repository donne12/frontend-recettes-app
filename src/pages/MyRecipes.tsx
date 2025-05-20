import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader } from "../components/Loader";
import axios from "axios";

interface Recette {
  id: number;
  documentId: string;
  titre: string;
  description?: string;
  temps_preparation?: number;
  temps_cuisson?: number;
  image?: { url: string };
  category?: { id: number; documentId: string; nom: string };
}

export default function MyRecipes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      fetchUserRecipes();
    }
  }, [user, navigate]);

  const fetchUserRecipes = async () => {
    try {
      setLoading(true);
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:1337/api";

      // Filtrer les recettes de l'utilisateur connecté
      const response = await axios.get(`${API_URL}/recettes?populate=*`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.data && response.data.data) {
        const data = response.data.data.map((item: any) => ({
          id: item.id,
          documentId: item.documentId,
          titre: item.titre,
          description: item.description,
          temps_preparation: item.temps_preparation,
          temps_cuisson: item.temps_cuisson,
          image: item.image || undefined,
          category: item.category || undefined,
        }));
        setRecettes(data);
        setError(null);
      }
    } catch (err: any) {
      console.error("Erreur lors du chargement des recettes:", err);
      setError("Impossible de charger vos recettes");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (documentId: string) => {
    try {
      setLoading(true);
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:1337/api";

      await axios.delete(`${API_URL}/recettes/${documentId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      // Supprimer la recette de la liste
      const updatedRecettes = recettes.filter(
        (item) => item.documentId !== documentId
      );
      setRecettes(updatedRecettes);
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error("Erreur lors de la suppression de la recette:", err);
      setError("Impossible de supprimer la recette");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;
  if (loading && recettes.length === 0) return <Loader />;

  // Fonction pour obtenir une couleur en fonction du nom de la catégorie
  const getCategoryColor = (categoryName: string | undefined) => {
    if (!categoryName) return "bg-blue-100 text-blue-800";

    switch (categoryName.toLowerCase()) {
      case "entrée":
        return "bg-green-100 text-green-800";
      case "plat principal":
        return "bg-red-100 text-red-800";
      case "dessert":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Mes recettes</h1>
              <Link
                to="/create-recipe"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Créer une recette
              </Link>
            </div>

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

            {/* Liste des recettes */}
            {recettes.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-500 text-xl mb-4">
                  Vous n'avez pas encore créé de recettes
                </p>
                <Link
                  to="/create-recipe"
                  className="text-blue-500 hover:underline"
                >
                  Créer votre première recette
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recettes.map((recette) => (
                  <div
                    key={recette.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {recette.image?.url ? (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={`http://localhost:1337${recette.image.url}`}
                          alt={recette.titre}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gray-100 flex items-center justify-center">
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

                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                          {recette.titre}
                        </h2>
                        {recette.category && (
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(
                              recette.category.nom
                            )}`}
                          >
                            {recette.category.nom}
                          </span>
                        )}
                      </div>

                      {recette.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {recette.description}
                        </p>
                      )}

                      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                        <span className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Préparation: {recette.temps_preparation || 0} min
                        </span>
                        <span className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
                            />
                          </svg>
                          Cuisson: {recette.temps_cuisson || 0} min
                        </span>
                      </div>

                      <div className="flex justify-between border-t pt-4">
                        <Link
                          to={`/edit-recipe/${recette.documentId}`}
                          className="text-blue-500 hover:text-blue-700 flex items-center text-sm"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                          Modifier
                        </Link>

                        {deleteConfirm === recette.documentId ? (
                          <div className="flex space-x-2">
                            <button
                              className="text-red-600 hover:text-red-800 text-sm"
                              onClick={() =>
                                handleDeleteRecipe(recette.documentId)
                              }
                            >
                              Confirmer
                            </button>
                            <button
                              className="text-gray-500 hover:text-gray-700 text-sm"
                              onClick={() => setDeleteConfirm(null)}
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <button
                            className="text-red-500 hover:text-red-700 flex items-center text-sm"
                            onClick={() => setDeleteConfirm(recette.documentId)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Supprimer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
