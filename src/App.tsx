import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import RecipeDetail from './pages/RecipeDetail.tsx';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recette/:id" element={<RecipeDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}