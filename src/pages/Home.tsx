import { useEffect, useState } from 'react';
import { fetchRecettes } from '../services/api';
import RecipeCard from '../components/RecipeCard';

interface Recette {
  id: number;
  titre: string;
  image?: { url: string };
  category?: { nom: string };
}

export default function Home() {
  const [recettes, setRecettes] = useState<Recette[]>([]);

  useEffect(() => {
    fetchRecettes().then(res => {
      const data = res.data.data.map((item: any) => ({
        id: item.id,
        titre: item.titre,
        image: item.image ? { url: item.image.url } : undefined,
        category: item.category ? { nom: item.category.nom } : undefined,
      }));
      setRecettes(data);
    });
  }, []);

  return (
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {recettes.map(recette => (
        <RecipeCard
          key={recette.id}
          id={recette.id}
          title={recette.titre}
          image={recette.image ? `http://localhost:1337${recette.image.url}` : undefined}
          category={recette.category?.nom}
        />
      ))}
    </div>
  );
}