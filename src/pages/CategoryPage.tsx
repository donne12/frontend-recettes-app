import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchRecettesByCategory, fetchCategoryById } from "../services/api";
import RecipeCard from "../components/RecipeCard";
import { Loader } from "../components/Loader";

interface Recette {
  id: number;
  documentId: string;
  titre: string;
  description?: string;
  temps_preparation?: number;
  temps_cuisson?: number;
  image?: { url: string };
  category?: { nom: string };
}

interface Category {
  id: number;
  documentId: string;
  nom: string;
}

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    // Récupérer d'abord les informations sur la catégorie
    fetchCategoryById(id)
      .then((categoryResponse) => {
        if (categoryResponse.data && categoryResponse.data.data) {
          const categoryData = categoryResponse.data.data;
          setCategory({
            id: categoryData.id,
            documentId: categoryData.documentId,
            nom: categoryData.nom,
          });

          // Ensuite récupérer les recettes de cette catégorie
          return fetchRecettesByCategory(id);
        } else {
          throw new Error("Catégorie introuvable");
        }
      })
      .then((recettesResponse) => {
        if (recettesResponse.data && recettesResponse.data.data) {
          const data = recettesResponse.data.data.map((item: any) => ({
            id: item.id,
            documentId: item.documentId,
            titre: item.titre,
            description: item.description,
            temps_preparation: item.temps_preparation,
            temps_cuisson: item.temps_cuisson,
            image: item.image ? { url: item.image.url } : undefined,
            category: item.category ? { nom: item.category.nom } : undefined,
          }));
          setRecettes(data);
        } else {
          setRecettes([]);
        }
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des recettes:", error);
        setError(error.message || "Une erreur est survenue");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Fonction pour obtenir une couleur d'arrière-plan en fonction du nom de la catégorie
  const getCategoryColor = (categoryName: string | undefined) => {
    if (!categoryName) return "from-blue-500 to-indigo-600";

    switch (categoryName.toLowerCase()) {
      case "entrée":
        return "from-green-500 to-green-600";
      case "plat principal":
        return "from-red-500 to-red-600";
      case "dessert":
        return "from-purple-500 to-purple-600";
      default:
        return "from-blue-500 to-indigo-600";
    }
  };

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
          <p>{error}</p>
          <Link
            to="/"
            className="inline-block mt-4 text-blue-500 hover:underline"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <section
        className={`mb-12 bg-gradient-to-r ${getCategoryColor(
          category?.nom
        )} rounded-lg p-8 shadow-md text-white`}
      >
        <Link
          to="/"
          className="inline-flex items-center mb-4 text-white hover:text-white/80 transition-colors"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Retour aux recettes
        </Link>

        <h1 className="text-4xl font-bold mb-4 text-center">
          {category ? category.nom : "Catégorie"}
        </h1>
        <p className="text-xl text-center mb-0 opacity-90">
          {recettes.length}{" "}
          {recettes.length > 1 ? "recettes disponibles" : "recette disponible"}
        </p>
      </section>

      {recettes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
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
          <p className="text-gray-500 text-xl">
            Aucune recette disponible dans cette catégorie.
          </p>
          <Link
            to="/"
            className="inline-block mt-4 text-blue-500 hover:underline"
          >
            Voir toutes les recettes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recettes.map((recette) => (
            <RecipeCard
              key={recette.id}
              documentId={recette.documentId}
              title={recette.titre}
              image={
                recette.image
                  ? `http://localhost:1337${recette.image.url}`
                  : undefined
              }
              category={recette.category?.nom}
            />
          ))}
        </div>
      )}
    </div>
  );
}
