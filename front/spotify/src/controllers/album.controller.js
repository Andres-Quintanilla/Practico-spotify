import axios from 'axios';
const API_URL = 'http://localhost:3000';

export const obtenerAlbumsPorArtista = async (artistaId) => {
  const res = await axios.get(`${API_URL}/artistas/${artistaId}/albums`);
  return res.data;
};
