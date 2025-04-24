import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchRecetteById } from '../services/api';
import { Loader } from '../components/Loader';
import { Link } from 'react-router-dom';

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
  const { id } = useParams<{ id: string }>();
  const [recette, setRecette] = useState<RecetteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchRecetteById(id)
        .then(res => {
          const data = res.data.data;
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
          setError(null);
        })
        .catch(err => {
          console.error('Erreur lors du chargement de la recette:', err);
          setError('Impossible de charger cette recette');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!recette) return <div className="text-center mt-10">Recette introuvable</div>;

  const { titre, description, etapes, temps_preparation, temps_cuisson, image, category, ingredients } = recette;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link to="/" className="inline-flex items-center mb-6 text-blue-500 hover:text-blue-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour aux recettes
      </Link>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {image?.url && (
          <div className="relative h-64 w-full">
            <img 
              src={`http://localhost:1337${image.url}`} 
              alt={titre} 
              className="w-full h-full object-cover"
            />
            {category?.nom && (
              <span className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {category.nom}
              </span>
            )}
          </div>
        )}
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">{titre}</h1>
          
          <div className="flex items-center mb-6 text-gray-600">
            <span className="flex items-center mr-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Préparation: {temps_preparation} min
            </span>
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
              </svg>
              Cuisson: {temps_cuisson} min
            </span>
          </div>
          
          <p className="mb-6 text-gray-700">{description}</p>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Ingrédients</h2>
            <ul className="bg-gray-50 rounded-lg p-4">
              {ingredients.map((ing, i) => (
                <li key={i} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                  <span className="font-medium">{ing.nom}</span>
                  <span className="text-gray-600">{ing.quantite}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">Préparation</h2>
            <div className="prose max-w-none">
              {etapes.split('\n').map((etape, index) => (
                <div key={index} className="mb-4 flex">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    {index + 1}
                  </span>
                  <p>{etape.replace(/^\d+\.\s*/, '')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}