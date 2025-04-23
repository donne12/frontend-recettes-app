import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow p-4 mb-6">
      <div className="container mx-auto">
        <Link to="/" className="text-xl font-bold text-gray-700">Recettes</Link>
      </div>
    </nav>
  );
}