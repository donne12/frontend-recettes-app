import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Category {
  id: number;
  documentId: string;
  nom: string;
}

export default function Navbar() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/api";
    
    axios.get(`${API_URL}/categories`)
      .then(response => {
        if (response.data && response.data.data) {
          setCategories(response.data.data.map((item: any) => ({
            id: item.id,
            documentId: item.documentId,
            nom: item.nom
          })));
        }
      })
      .catch(err => {
        console.error('Erreur lors du chargement des catégories:', err);
      });
  }, []);

  // Fermer le menu des catégories quand on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [categoryMenuRef]);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-blue-500 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span className="text-2xl font-bold text-gray-800">Délices culinaires</span>
          </Link>
          
          {/* Menu pour mobile */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Menu pour desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-500 transition duration-300">
              Accueil
            </Link>
            
            {/* Menu déroulant des catégories */}
            <div className="relative" ref={categoryMenuRef}>
              <button 
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="flex items-center text-gray-700 hover:text-blue-500 transition duration-300 focus:outline-none"
              >
                Catégories
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 ml-1 transform transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Contenu du menu déroulant */}
              {isCategoryMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  {categories.length === 0 ? (
                    <p className="px-4 py-2 text-sm text-gray-500">Aucune catégorie</p>
                  ) : (
                    categories.map(category => (
                      <Link
                        key={category.id}
                        to={`/categories/${category.documentId}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-500"
                        onClick={() => setIsCategoryMenuOpen(false)}
                      >
                        {category.nom}
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
            
            <a href="#" className="text-gray-700 hover:text-blue-500 transition duration-300">
              À propos
            </a>
            
            <a href="#" className="text-gray-700 hover:text-blue-500 transition duration-300">
              Contact
            </a>
          </div>
        </div>
        
        {/* Menu mobile - visible uniquement sur les petits écrans */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="block text-gray-700 hover:text-blue-500 transition duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accueil
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  className="flex items-center w-full text-left text-gray-700 hover:text-blue-500 transition duration-300 focus:outline-none"
                >
                  Catégories
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 ml-1 transform transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isCategoryMenuOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    {categories.length === 0 ? (
                      <p className="text-sm text-gray-500">Aucune catégorie</p>
                    ) : (
                      categories.map(category => (
                        <Link
                          key={category.id}
                          to={`/categories/${category.documentId}`}
                          className="block text-gray-600 hover:text-blue-500 transition duration-300"
                          onClick={() => {
                            setIsCategoryMenuOpen(false);
                            setIsMenuOpen(false);
                          }}
                        >
                          {category.nom}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </li>
              <li>
                <a 
                  href="#" 
                  className="block text-gray-700 hover:text-blue-500 transition duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  À propos
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="block text-gray-700 hover:text-blue-500 transition duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}