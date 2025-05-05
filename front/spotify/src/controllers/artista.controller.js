import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const obtenerArtistasPorGenero = async (generoId) => {
  const res = await axios.get(`http://localhost:3000/artistas/genero/${generoId}`);
  return res.data;
};
