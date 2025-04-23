import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337/api';

export const fetchRecettes = () => axios.get(`${API_URL}/recettes?populate=*`);
export const fetchRecetteById = (id: string) => axios.get(`${API_URL}/recettes/${id}?populate=*`);