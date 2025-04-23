import { Link } from 'react-router-dom';

type RecipeCardProps = {
  id: number;
  title: string;
  image?: string;
  category?: string;
};

export default function RecipeCard({ id, title, image, category }: RecipeCardProps) {
  return (
    <Link to={`/recette/${id}`} className="block bg-white shadow rounded-lg p-4 hover:shadow-md transition">
      {image && <img src={image} alt={title} className="w-full h-48 object-cover rounded-md mb-4" />}
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      {category && <p className="text-sm text-gray-500 mt-1">{category}</p>}
    </Link>
  );
}