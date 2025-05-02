import { useEffect, useState } from 'react';
import { fetchRecettes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { Loader } from '../components/Loader';
import CategoryList from '../components/CategoryList';

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

export default function Home() {
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchRecettes()
      .then(res => {
        if (res.data && res.data.data) {
          const data = res.data.data.map((item: any) => ({
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
          setError(null);
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement des recettes:', error);
        setError('Impossible de charger les recettes. Veuillez réessayer plus tard.');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredRecettes = recettes.filter(recette => 
    recette.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 shadow-sm">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-800">Délices culinaires</h1>
        <p className="text-xl text-center text-gray-600 mb-8">Découvrez nos recettes savoureuses et faciles à réaliser</p>
        
        <div className="max-w-xl mx-auto relative">
          <input
            type="text"
            placeholder="Rechercher une recette..."
            className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </section>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">
          {error}
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <CategoryList />
            </div>
          </div>
          <div className="lg:col-span-3">
            {filteredRecettes.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-16 w-16 mx-auto text-gray-400 mb-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 text-xl">
                  {searchTerm ? 'Aucune recette ne correspond à votre recherche.' : 'Aucune recette disponible pour le moment.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecettes.map(recette => (
                  <RecipeCard
                    key={recette.id}
                    documentId={recette.documentId}
                    title={recette.titre}
                    image={recette.image ? `http://localhost:1337${recette.image.url}` : undefined}
                    category={recette.category?.nom}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}