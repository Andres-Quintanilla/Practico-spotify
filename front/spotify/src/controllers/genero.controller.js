import axios from 'axios';
const API_URL = 'http://localhost:3000';

export const obtenerGeneros = async () => {
  const res = await axios.get(`${API_URL}/generos`);
  return res.data;
};
