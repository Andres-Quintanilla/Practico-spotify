// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListaGeneros from './views/ListaGeneros';
import ListaArtistas from './views/ListaArtistas';
import ListaAlbums from './views/ListaAlbum';
import ListaCanciones from './views/ListaCanciones';
import AdminDashboard from './views/AdminDashboard'; 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListaGeneros />} />
        <Route path="/generos/:id/artistas" element={<ListaArtistas />} />
        <Route path="/artistas/:id/albums" element={<ListaAlbums />} />
        <Route path="/albums/:id/canciones" element={<ListaCanciones />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
