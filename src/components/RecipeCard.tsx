import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

type RecipeCardProps = {
  documentId: string;
  title: string;
  image?: string;
  category?: string;
};

export default function RecipeCard({ documentId, title, image, category }: RecipeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Animation au chargement
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Fonction pour obtenir une couleur en fonction du nom de la catégorie
  const getCategoryColor = (categoryName: string | undefined) => {
    if (!categoryName) return 'bg-blue-500';
    
    switch(categoryName.toLowerCase()) {
      case 'entrée':
        return 'bg-green-500';
      case 'plat principal':
        return 'bg-red-500';
      case 'dessert':
        return 'bg-purple-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Fonction pour obtenir une couleur de bordure hover en fonction de la catégorie
  const getCategoryBorderColor = (categoryName: string | undefined) => {
    if (!categoryName) return 'border-blue-400';
    
    switch(categoryName.toLowerCase()) {
      case 'entrée':
        return 'border-green-400';
      case 'plat principal':
        return 'border-red-400';
      case 'dessert':
        return 'border-purple-400';
      default:
        return 'border-blue-400';
    }
  };

  // Fonction pour obtenir une icône pour la catégorie
  const getCategoryIcon = (categoryName: string | undefined) => {
    if (!categoryName) return null;
    
    switch(categoryName.toLowerCase()) {
      case 'entrée':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'plat principal':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'dessert':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
    }
  };

  return (
    <Link 
      to={`/recette/${documentId}`} 
      className={`group block bg-white border-2 border-transparent ${isHovered ? getCategoryBorderColor(category) : ''} rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-full transform ${isHovered ? 'translate-y-[-8px]' : ''} ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transitionDelay: '0.1s' }}
    >
      <div className="relative">
        {image ? (
          <div className="h-56 overflow-hidden">
            <img 
              src={image} 
              alt={title} 
              className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110 brightness-110' : 'scale-100'}`}
            />
            <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-50 transition-opacity duration-300 ${isHovered ? 'opacity-80' : ''}`}></div>
          </div>
        ) : (
          <div className={`w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center transition-all duration-300 ${isHovered ? 'from-gray-200 to-gray-300' : ''}`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-20 w-20 text-gray-400 transition-all duration-300 ${isHovered ? 'text-gray-600 scale-110' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Badge flottant avec la catégorie */}
        {category && (
          <div 
            className={`absolute top-4 right-4 ${getCategoryColor(category)} text-white py-1.5 px-3 rounded-full text-xs font-medium shadow-lg transform transition-all duration-300 ${isHovered ? 'scale-110 -rotate-3' : ''}`}
          >
            <div className="flex items-center">
              {getCategoryIcon(category)}
              {category}
            </div>
          </div>
        )}
        
        {/* Overlay du titre qui apparaît au survol sur l'image */}
        <div 
          className={`absolute bottom-0 left-0 right-0 p-4 text-white transition-all duration-300 opacity-100`}
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)' }}
        >
          <h2 className="text-lg font-medium line-clamp-1">{title}</h2>
        </div>
      </div>
      
       
      
      {/* Effet de surbrillance au survol */}
      <div 
        className={`absolute inset-0 pointer-events-none bg-gradient-to-tr ${getCategoryColor(category).replace('bg-', 'from-').replace('500', '50')} to-transparent opacity-0 transition-opacity duration-500 ${isHovered ? 'opacity-10' : ''}`}
      ></div>
    </Link>
  );
}