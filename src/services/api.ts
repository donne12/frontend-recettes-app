import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337/api";

export const fetchRecettes = () => axios.get(`${API_URL}/recettes?populate=*`);
export const fetchRecetteById = (documentId: string) =>
  axios
    .get(`${API_URL}/recettes?filters[documentId]=${documentId}&populate=*`)
    .then((response) => {
      const items = response.data.data;
      if (items && items.length > 0) {
        return { data: items[0] };
      }
      throw new Error("Recette non trouvée");
    });
