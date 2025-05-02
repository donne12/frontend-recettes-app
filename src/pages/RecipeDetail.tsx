import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchRecetteById } from '../services/api';
import { Loader } from '../components/Loader';

interface RecetteDetail {
  id: number;
  documentId: string;
  titre: string;
  description: string;
  etapes: string;
  temps_preparation: number;
  temps_cuisson: number;
  image?: { url: string };
  category?: { nom: string };
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
          if (res.data && res.data.data) {
            const data = res.data.data;
            const recetteData: RecetteDetail = {
              id: data.id,
              documentId: data.documentId,
              titre: data.titre,
              description: data.description,
              etapes: data.etapes,
              temps_preparation: data.temps_preparation,
              temps_cuisson: data.temps_cuisson,
              // Ces champs peuvent être undefined
              image: data.image || undefined,
              category: data.category || undefined
            };
            setRecette(recetteData);
            setError(null);
          } else {
            throw new Error("Format de données inattendu");
          }
        })
        .catch(err => {
          console.error('Erreur lors du chargement de la recette:', err);
          setError('Impossible de charger cette recette');
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="text-center mt-10 text-red-500 p-4 bg-red-50 rounded-lg max-w-3xl mx-auto">{error}</div>;
  if (!recette) return <div className="text-center mt-10 p-6 bg-gray-50 rounded-lg max-w-3xl mx-auto">Recette introuvable</div>;

  const { titre, description, etapes, temps_preparation, temps_cuisson, image, category } = recette;

  // Fonction pour convertir les étapes en tableau
  const getEtapesArray = () => {
    if (!etapes) return [];
    return etapes.split('\n').filter(etape => etape.trim() !== '');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/" className="inline-flex items-center mb-6 text-blue-500 hover:text-blue-700 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour aux recettes
      </Link>
      
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        {image?.url && (
          <div className="relative h-80 w-full bg-gray-100">
            <img 
              src={`http://localhost:1337${image.url}`} 
              alt={titre} 
              className="w-full h-full object-cover"
            />
            {category?.nom && (
              <span className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                {category.nom}
              </span>
            )}
          </div>
        )}
        
        <div className="p-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-800">{titre}</h1>
          
          <div className="flex flex-wrap items-center mb-6 text-gray-600">
            <span className="flex items-center mr-6 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Préparation:</span> {temps_preparation} min
            </span>
            <span className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">Cuisson:</span> {temps_cuisson} min
            </span>
            <span className="flex items-center ml-auto mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Temps total:</span> {temps_preparation + temps_cuisson} min
            </span>
          </div>
          
          <div className="mb-8 bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Description</h2>
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 pb-2 border-b border-gray-200">Préparation</h2>
            {getEtapesArray().length === 0 ? (
              <p className="text-gray-500 italic">Aucune étape spécifiée</p>
            ) : (
              <ol className="space-y-6">
                {getEtapesArray().map((etape, index) => (
                  <li key={index} className="flex">
                    <span className="bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                      {index + 1}
                    </span>
                    <p className="text-gray-700">{etape.replace(/^\d+\.\s*/, '')}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button className="inline-flex items-center text-gray-600 hover:text-blue-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Sauvegarder
              </button>
              <button className="inline-flex items-center text-gray-600 hover:text-blue-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Partager
              </button>
              <button className="inline-flex items-center text-gray-600 hover:text-blue-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}