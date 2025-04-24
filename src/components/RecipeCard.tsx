import { Link } from 'react-router-dom';

type RecipeCardProps = {
  documentId: string;
  title: string;
  image?: string;
  category?: string;
};

export default function RecipeCard({ documentId, title, image, category }: RecipeCardProps) {
  return (
    <Link to={`/recette/${documentId}`} className="block bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300 h-full">
      <div className="relative">
        {image ? (
          <img src={image} alt={title} className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {category && (
          <span className="absolute top-2 right-2 bg-blue-500 text-white py-1 px-2 rounded-full text-xs font-medium">
            {category}
          </span>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">{title}</h2>
        <div className="mt-2 flex justify-end">
          <span className="text-blue-500 text-sm font-medium hover:underline">Voir la recette →</span>
        </div>
      </div>
    </Link>
  );
}