import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

function CrudAlbums() {
  const [albums, setAlbums] = useState([]);
  const [artistas, setArtistas] = useState([]);
  const [formulario, setFormulario] = useState({ nombre: "", artistaId: "" });
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    cargarAlbums();
    cargarArtistas();
  }, []);

  const cargarAlbums = async () => {
    const res = await axios.get(`${API_URL}/albums`);
    setAlbums(res.data);
  };

  const cargarArtistas = async () => {
    const res = await axios.get(`${API_URL}/artistas`);
    setArtistas(res.data);
  };

  const handleChange = e => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    let res;
    if (editando) {
      res = await axios.put(`${API_URL}/albums/${editando}`, formulario);
    } else {
      res = await axios.post(`${API_URL}/albums`, formulario);
    }

    if (formulario.imagen) {
      const formData = new FormData();
      formData.append("foto", formulario.imagen);
      await axios.post(`${API_URL}/albums/${res.data.id}/foto`, formData);
    }

    setFormulario({ nombre: "", artistaId: "", imagen: null });
    setEditando(null);
    cargarAlbums();
  };

  const handleEditar = album => {
    setFormulario({ nombre: album.nombre, artistaId: album.artistaId });
    setEditando(album.id);
  };

  const handleEliminar = async id => {
    await axios.delete(`${API_URL}/albums/${id}`);
    cargarAlbums();
  };

  return (
    <div className="text-white">
      <h4>Álbumes</h4>
      <form onSubmit={handleSubmit} className="mb-3">
        <input name="nombre" value={formulario.nombre} onChange={handleChange} className="form-control mb-2" placeholder="Nombre" required />
        <select name="artistaId" value={formulario.artistaId} onChange={handleChange} className="form-control mb-2" required>
          <option value="">Seleccionar Artista</option>
          {artistas.map(artista => (
            <option key={artista.id} value={artista.id}>{artista.nombre}</option>
          ))}
        </select>
        <input type="file" accept="image/*" onChange={e => setFormulario({ ...formulario, imagen: e.target.files[0] })} className="form-control mb-2" />
        <button type="submit" className="btn btn-success me-2">{editando ? "Actualizar" : "Crear"}</button>
        {editando && <button onClick={() => { setEditando(null); setFormulario({ nombre: "", artistaId: "", imagen: null }); }} className="btn btn-secondary">Cancelar</button>}
      </form>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Artista</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {albums.map(album => (
            <tr key={album.id}>
              <td>{album.nombre}</td>
              <td>{album.artista?.nombre}</td>
              <td>
                {album.imagen && (
                  <img
                    src={`http://localhost:3000${album.imagen}?t=${Date.now()}`}
                    alt={album.nombre}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                )}
              </td>
              <td>
                <button onClick={() => handleEditar(album)} className="btn btn-sm btn-warning me-2">Editar</button>
                <button onClick={() => handleEliminar(album.id)} className="btn btn-sm btn-danger">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CrudAlbums;