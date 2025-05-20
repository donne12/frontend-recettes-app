import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import RecipeDetail from './pages/RecipeDetail.tsx';
import CategoryPage from './pages/CategoryPage.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Profile from './pages/Profile.tsx';
import MyRecipes from './pages/MyRecipes.tsx';
import CreateRecipe from './pages/CreateRecipe.tsx';
import EditRecipe from './pages/EditRecipe.tsx';
import ManageIngredients from './pages/ManageIngredients.tsx';
import ManageCategories from './pages/ManageCategories.tsx';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import { AuthProvider } from './context/AuthContext.tsx';

export default function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recette/:id" element={<RecipeDetail />} />
            <Route path="/categories/:id" element={<CategoryPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-recipes" element={<MyRecipes />} />
            <Route path="/create-recipe" element={<CreateRecipe />} />
            <Route path="/edit-recipe/:id" element={<EditRecipe />} />
            <Route path="/manage-ingredients" element={<ManageIngredients />} />
            <Route path="/manage-categories" element={<ManageCategories />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}