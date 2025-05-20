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

export default function ManageIngredients() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIngredient, setNewIngredient] = useState({ nom: "", quantite: "" });
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
    null
  );
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      fetchIngredients();
    }
  }, [user, navigate]);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:1337/api";
      const response = await axios.get(`${API_URL}/ingredients`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.data && response.data.data) {
        const data = response.data.data.map((item: any) => ({
          id: item.id,
          documentId: item.documentId,
          nom: item.nom,
          quantite: item.quantite,
        }));
        setIngredients(data);
        setError(null);
      }
    } catch (err: any) {
      console.error("Erreur lors du chargement des ingrédients:", err);
      setError("Impossible de charger les ingrédients");
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredient.nom.trim()) return;

    try {
      setLoading(true);
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:1337/api";

      const response = await axios.post(
        `${API_URL}/ingredients`,
        { data: newIngredient },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.data) {
        const newItem = {
          id: response.data.data.id,
          documentId: response.data.data.documentId,
          nom: response.data.data.nom,
          quantite: response.data.data.quantite,
        };
        setIngredients([...ingredients, newItem]);
        setNewIngredient({ nom: "", quantite: "" });
        setShowAddForm(false);
      }
    } catch (err: any) {
      console.error("Erreur lors de l'ajout d'un ingrédient:", err);
      setError("Impossible d'ajouter l'ingrédient");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIngredient?.nom.trim() || !editingIngredient?.documentId)
      return;

    try {
      setLoading(true);
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:1337/api";

      const response = await axios.put(
        `${API_URL}/ingredients/${editingIngredient.documentId}`,
        {
          data: {
            nom: editingIngredient.nom,
            quantite: editingIngredient.quantite,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.data) {
        // Mettre à jour l'ingrédient dans la liste
        const updatedIngredients = ingredients.map((item) =>
          item.documentId === editingIngredient.documentId
            ? {
                ...item,
                nom: editingIngredient.nom,
                quantite: editingIngredient.quantite,
              }
            : item
        );
        setIngredients(updatedIngredients);
        setEditingIngredient(null);
      }
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour de l'ingrédient:", err);
      setError("Impossible de mettre à jour l'ingrédient");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIngredient = async (documentId: string) => {
    try {
      setLoading(true);
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:1337/api";

      await axios.delete(`${API_URL}/ingredients/${documentId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      // Supprimer l'ingrédient de la liste
      const updatedIngredients = ingredients.filter(
        (item) => item.documentId !== documentId
      );
      setIngredients(updatedIngredients);
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error("Erreur lors de la suppression de l'ingrédient:", err);
      setError("Impossible de supprimer l'ingrédient");
    } finally {
      setLoading(false);
    }
  };

  if (loading && ingredients.length === 0) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Gestion des ingrédients
              </h1>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                onClick={() => setShowAddForm(!showAddForm)}
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
                {showAddForm ? "Annuler" : "Ajouter un ingrédient"}
              </button>
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

            {/* Formulaire d'ajout */}
            {showAddForm && (
              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Ajouter un nouvel ingrédient
                </h2>
                <form onSubmit={handleAddIngredient}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="nom"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Nom de l'ingrédient
                      </label>
                      <input
                        type="text"
                        id="nom"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Farine"
                        value={newIngredient.nom}
                        onChange={(e) =>
                          setNewIngredient({
                            ...newIngredient,
                            nom: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="quantite"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Quantité (optionnel)
                      </label>
                      <input
                        type="text"
                        id="quantite"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: 100g"
                        value={newIngredient.quantite}
                        onChange={(e) =>
                          setNewIngredient({
                            ...newIngredient,
                            quantite: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 text-gray-700 hover:text-gray-900 mr-2"
                      onClick={() => {
                        setShowAddForm(false);
                        setNewIngredient({ nom: "", quantite: "" });
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Ajouter
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Formulaire de modification */}
            {editingIngredient && (
              <div className="bg-yellow-50 p-6 rounded-lg mb-8 border-l-4 border-yellow-500">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Modifier l'ingrédient
                </h2>
                <form onSubmit={handleUpdateIngredient}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label
                        htmlFor="editNom"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Nom de l'ingrédient
                      </label>
                      <input
                        type="text"
                        id="editNom"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editingIngredient.nom}
                        onChange={(e) =>
                          setEditingIngredient({
                            ...editingIngredient,
                            nom: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="editQuantite"
                        className="block text-gray-700 font-medium mb-2"
                      >
                        Quantité (optionnel)
                      </label>
                      <input
                        type="text"
                        id="editQuantite"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={editingIngredient.quantite}
                        onChange={(e) =>
                          setEditingIngredient({
                            ...editingIngredient,
                            quantite: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 text-gray-700 hover:text-gray-900 mr-2"
                      onClick={() => setEditingIngredient(null)}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      Mettre à jour
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Liste des ingrédients */}
            {ingredients.length === 0 ? (
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
                  Aucun ingrédient disponible
                </p>
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => setShowAddForm(true)}
                >
                  Ajouter votre premier ingrédient
                </button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Nom
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Quantité
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ingredients.map((ingredient) => (
                      <tr key={ingredient.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                          {ingredient.nom}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ingredient.quantite || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          {deleteConfirm === ingredient.documentId ? (
                            <div className="flex justify-end space-x-2">
                              <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() =>
                                  handleDeleteIngredient(ingredient.documentId)
                                }
                              >
                                Confirmer
                              </button>
                              <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setDeleteConfirm(null)}
                              >
                                Annuler
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end space-x-3">
                              <button
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => {
                                  setEditingIngredient(ingredient);
                                  setShowAddForm(false);
                                }}
                              >
                                Éditer
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() =>
                                  setDeleteConfirm(ingredient.documentId)
                                }
                              >
                                Supprimer
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
