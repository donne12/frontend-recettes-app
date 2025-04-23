import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchRecetteById } from '../services/api';

interface Ingredient {
  nom: string;
  quantite: string;
}

interface RecetteDetail {
  id: number;
  titre: string;
  description: string;
  etapes: string;
  temps_preparation: number;
  temps_cuisson: number;
  image?: { url: string };
  category?: { nom: string };
  ingredients: Ingredient[];
}

export default function RecipeDetail() {
  const { id } = useParams();
  const [recette, setRecette] = useState<RecetteDetail | null>(null);

  useEffect(() => {
    if (id) {
      fetchRecetteById(id).then(res => {
        const data = res.data;
        const recetteData: RecetteDetail = {
          id: data.id,
          titre: data.titre,
          description: data.description,
          etapes: data.etapes,
          temps_preparation: data.temps_preparation,
          temps_cuisson: data.temps_cuisson,
          image: data.image ? { url: data.image.url } : undefined,
          category: data.category ? { nom: data.category.nom } : undefined,
          ingredients: data.ingredients.map((ing: any) => ({
            nom: ing.nom,
            quantite: ing.quantite,
          }))
        };
        setRecette(recetteData);
      });
    }
  }, [id]);

  if (!recette) return <p className="text-center mt-10">Chargement...</p>;

  const { titre, description, etapes, temps_preparation, temps_cuisson, image, category, ingredients } = recette;

  return (
    <div className="container mx-auto px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">{titre}</h1>
      {category?.nom && (
        <p className="text-gray-500 mb-4">Catégorie : {category.nom}</p>
      )}
      {image?.url && (
        <img src={`http://localhost:1337${image.url}`} alt={titre} className="mb-6 rounded" />
      )}
      <p className="mb-4">{description}</p>
      <h2 className="text-xl font-semibold">Ingrédients :</h2>
      <ul className="list-disc list-inside mb-4">
        {ingredients.map((ing, i) => (
          <li key={i}>{ing.nom} — {ing.quantite}</li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold">Étapes :</h2>
      <div className="prose whitespace-pre-line">{etapes}</div>
      <p className="mt-6">⏱️ Préparation : {temps_preparation} min — Cuisson : {temps_cuisson} min</p>
    </div>
  );
}