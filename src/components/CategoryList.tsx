import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Category {
  id: number;
  documentId: string;
  nom: string;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/api";
    
    setLoading(true);
    axios.get(`${API_URL}/categories`)
      .then(response => {
        if (response.data && response.data.data) {
          setCategories(response.data.data.map((item: any) => ({
            id: item.id,
            documentId: item.documentId,
            nom: item.nom
          })));
          setError(null);
        }
      })
      .catch(err => {
        console.error('Erreur lors du chargement des catégories:', err);
        setError('Impossible de charger les catégories');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="animate-pulse p-4 rounded-lg bg-gray-100">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-4 bg-gray-200 rounded w-1/2"></div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="p-4 rounded-lg bg-red-50 text-red-600">
      {error}
    </div>
  );

  // Fonction pour obtenir une icône en fonction du nom de la catégorie
  const getCategoryIcon = (categoryName: string) => {
    switch(categoryName.toLowerCase()) {
      case 'entrée':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'plat principal':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'dessert':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
    }
  };

  // Couleurs en fonction de la catégorie
  const getCategoryColorClasses = (categoryName: string) => {
    switch(categoryName.toLowerCase()) {
      case 'entrée':
        return 'bg-green-100 text-green-600 hover:bg-green-50 hover:text-green-700';
      case 'plat principal':
        return 'bg-red-100 text-red-600 hover:bg-red-50 hover:text-red-700';
      case 'dessert':
        return 'bg-purple-100 text-purple-600 hover:bg-purple-50 hover:text-purple-700';
      default:
        return 'bg-blue-100 text-blue-600 hover:bg-blue-50 hover:text-blue-700';
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Catégories</h2>
      <ul className="space-y-2">
        {categories.length === 0 ? (
          <li className="text-gray-500">Aucune catégorie disponible</li>
        ) : (
          categories.map(category => (
            <li key={category.id} className="transition-all">
              <Link 
                to={`/categories/${category.documentId}`} 
                className={`flex items-center text-gray-700 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-md transition-all`}
              >
                <span className={`w-6 h-6 flex items-center justify-center ${getCategoryColorClasses(category.nom)} rounded-full mr-2`}>
                  {getCategoryIcon(category.nom)}
                </span>
                {category.nom}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}