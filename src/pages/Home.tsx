import { useEffect, useState } from 'react';
import { fetchRecettes } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { Loader } from '../components/Loader.tsx';

interface Recette {
  id: number;
  documentId: string;
  titre: string;
  image?: { url: string };
  category?: { nom: string };
}

export default function Home() {
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchRecettes()
      .then(res => {
        const data = res.data.data.map((item: any) => ({
          id: item.id,
          documentId: item.documentId,
          titre: item.titre,
          image: item.image ? { url: item.image.url } : undefined,
          category: item.category ? { nom: item.category.nom } : undefined,
        }));
        setRecettes(data);
      })
      .catch(error => console.error('Erreur lors du chargement des recettes:', error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Nos délicieuses recettes</h1>
      {recettes.length === 0 ? (
        <p className="text-center text-gray-500">Aucune recette disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {recettes.map(recette => (
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
  );
}