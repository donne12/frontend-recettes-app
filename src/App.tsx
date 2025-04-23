import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import RecipeDetail from './pages/RecipeDetail.tsx';
import Navbar from './components/Navbar.tsx';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recette/:id" element={<RecipeDetail />} />
      </Routes>
    </div>
  );
}