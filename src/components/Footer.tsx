export default function Footer() {
    return (
      <footer className="bg-white shadow-inner pt-8 pb-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/3 text-center md:text-left">
              <h5 className="uppercase mb-4 font-bold text-gray-700">À propos</h5>
              <p className="text-gray-600">
                Délices Culinaires est votre source d'inspiration pour des recettes délicieuses et faciles à réaliser.
              </p>
            </div>
            <div className="w-full md:w-1/3 text-center">
              <h5 className="uppercase mb-4 font-bold text-gray-700">Liens</h5>
              <ul className="mb-4">
                <li className="mt-2">
                  <a href="#" className="text-blue-500 hover:text-blue-700 transition duration-300">
                    Toutes les recettes
                  </a>
                </li>
                <li className="mt-2">
                  <a href="#" className="text-blue-500 hover:text-blue-700 transition duration-300">
                    Catégories
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/3 text-center md:text-right">
              <h5 className="uppercase mb-4 font-bold text-gray-700">Contact</h5>
              <p className="text-gray-600">
                contact@delices-culinaires.fr
              </p>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-500 text-sm">
            © {new Date().getFullYear()} Délices Culinaires. Tous droits réservés.
          </div>
        </div>
      </footer>
    );
  }