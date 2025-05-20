import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader } from "../components/Loader";
import axios from "axios";

interface Category {
  id: number;
  documentId: string;
  nom: string;
}

export default function ManageCategories() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ nom: "" });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      fetchCategories();
    }
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:1337/api";
      const response = await axios.get(`${API_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.data && response.data.data) {
        const data = response.data.data.map((item: any) => ({
          id: item.id,
          documentId: item.documentId,
          nom: item.nom,
        }));
        setCategories(data);
        setError(null);
      }
    } catch (err: any) {
      console.error("Erreur lors du chargement des catégories:", err);
      setError("Impossible de charger les catégories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.nom.trim()) return;

    try {
      setLoading(true);
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:1337/api";

      const response = await axios.post(
        `${API_URL}/categories`,
        { data: newCategory },
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
        };
        setCategories([...categories, newItem]);
        setNewCategory({ nom: "" });
        setShowAddForm(false);
      }
    } catch (err: any) {
      console.error("Erreur lors de l'ajout d'une catégorie:", err);
      setError("Impossible d'ajouter la catégorie");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.nom.trim() || !editingCategory?.documentId) return;

    try {
      setLoading(true);
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:1337/api";

      const response = await axios.put(
        `${API_URL}/categories/${editingCategory.documentId}`,
        {
          data: {
            nom: editingCategory.nom,
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
        // Mettre à jour la catégorie dans la liste
        const updatedCategories = categories.map((item) =>
          item.documentId === editingCategory.documentId
            ? {
                ...item,
                nom: editingCategory.nom,
              }
            : item
        );
        setCategories(updatedCategories);
        setEditingCategory(null);
      }
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour de la catégorie:", err);
      setError("Impossible de mettre à jour la catégorie");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (documentId: string) => {
    try {
      setLoading(true);
      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:1337/api";

      await axios.delete(`${API_URL}/categories/${documentId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      // Supprimer la catégorie de la liste
      const updatedCategories = categories.filter(
        (item) => item.documentId !== documentId
      );
      setCategories(updatedCategories);
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error("Erreur lors de la suppression de la catégorie:", err);
      setError(
        "Impossible de supprimer la catégorie. Elle est peut-être utilisée par des recettes."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;
  if (loading && categories.length === 0) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Gestion des catégories
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
                {showAddForm ? "Annuler" : "Ajouter une catégorie"}
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
                  Ajouter une nouvelle catégorie
                </h2>
                <form onSubmit={handleAddCategory}>
                  <div className="mb-4">
                    <label
                      htmlFor="nom"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Nom de la catégorie
                    </label>
                    <input
                      type="text"
                      id="nom"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Dessert"
                      value={newCategory.nom}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, nom: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 text-gray-700 hover:text-gray-900 mr-2"
                      onClick={() => {
                        setShowAddForm(false);
                        setNewCategory({ nom: "" });
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
            {editingCategory && (
              <div className="bg-yellow-50 p-6 rounded-lg mb-8 border-l-4 border-yellow-500">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Modifier la catégorie
                </h2>
                <form onSubmit={handleUpdateCategory}>
                  <div className="mb-4">
                    <label
                      htmlFor="editNom"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Nom de la catégorie
                    </label>
                    <input
                      type="text"
                      id="editNom"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editingCategory.nom}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          nom: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 text-gray-700 hover:text-gray-900 mr-2"
                      onClick={() => setEditingCategory(null)}
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

            {/* Liste des catégories */}
            {categories.length === 0 ? (
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
                  Aucune catégorie disponible
                </p>
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => setShowAddForm(true)}
                >
                  Ajouter votre première catégorie
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
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                          {category.nom}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          {deleteConfirm === category.documentId ? (
                            <div className="flex justify-end space-x-2">
                              <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() =>
                                  handleDeleteCategory(category.documentId)
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
                                  setEditingCategory(category);
                                  setShowAddForm(false);
                                }}
                              >
                                Éditer
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() =>
                                  setDeleteConfirm(category.documentId)
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
