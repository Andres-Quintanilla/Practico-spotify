import axios from 'axios';
const API_URL = 'http://localhost:3000';

export const obtenerCancionesPorAlbum = async (albumId) => {
  const res = await axios.get(`${API_URL}/canciones/album/${albumId}`);
  return res.data;
};
