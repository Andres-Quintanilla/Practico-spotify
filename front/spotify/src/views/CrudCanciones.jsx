import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Modal, Table, Image } from "react-bootstrap";

const API_URL = "http://localhost:3000";

function CrudCanciones() {
  const [canciones, setCanciones] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [artistas, setArtistas] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cancionActual, setCancionActual] = useState({ nombre: "", albumId: "" });
  const [audio, setAudio] = useState(null);
  const [generoSeleccionado, setGeneroSeleccionado] = useState("");
  const [artistaSeleccionado, setArtistaSeleccionado] = useState("");

  const cargarCanciones = async () => {
    const res = await axios.get(`${API_URL}/canciones`);
    setCanciones(res.data);
  };

  const cargarGeneros = async () => {
    const res = await axios.get(`${API_URL}/generos`);
    setGeneros(res.data);
  };

  const cargarArtistas = async (generoId) => {
    const res = await axios.get(`${API_URL}/artistas/genero/${generoId}`);
    setArtistas(res.data);
  };

  const cargarAlbums = async (artistaId) => {
    const res = await axios.get(`${API_URL}/artistas/${artistaId}/albums`);
    setAlbums(res.data);
  };

  useEffect(() => {
    cargarCanciones();
    cargarGeneros();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setModoEdicion(false);
    setCancionActual({ nombre: "", albumId: "" });
    setGeneroSeleccionado("");
    setArtistaSeleccionado("");
    setAudio(null);
  };

  const handleShow = () => setShowModal(true);

  const handleChange = (e) => {
    setCancionActual({ ...cancionActual, [e.target.name]: e.target.value });
  };

  const handleGeneroChange = async (e) => {
    const id = e.target.value;
    setGeneroSeleccionado(id);
    setArtistas([]);
    setAlbums([]);
    setArtistaSeleccionado("");
    setCancionActual({ ...cancionActual, albumId: "" });
    if (id) await cargarArtistas(id);
  };

  const handleArtistaChange = async (e) => {
    const id = e.target.value;
    setArtistaSeleccionado(id);
    setAlbums([]);
    setCancionActual({ ...cancionActual, albumId: "" });
    if (id) await cargarAlbums(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (modoEdicion) {
        await axios.put(`${API_URL}/canciones/${cancionActual.id}`, cancionActual);
        if (audio) await subirAudio(cancionActual.id);
      } else {
        res = await axios.post(`${API_URL}/canciones`, cancionActual);
        if (audio) await subirAudio(res.data.id);
      }
      handleClose();
      cargarCanciones();
    } catch (err) {
      console.error("Error al guardar la canción", err);
    }
  };

  const subirAudio = async (id) => {
    const formData = new FormData();
    formData.append("audio", audio);
    await axios.post(`${API_URL}/canciones/${id}/audio`, formData);
  };

  const handleEditar = (cancion) => {
    setModoEdicion(true);
    setCancionActual({ ...cancion });
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Estás seguro de eliminar esta canción?")) return;
    await axios.delete(`${API_URL}/canciones/${id}`);
    cargarCanciones();
  };

  return (
    <div>
      <Button variant="success" className="mb-3" onClick={handleShow}>
        Crear Canción
      </Button>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Álbum</th>
            <th>Artista</th>
            <th>Género</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
  {canciones.map((cancion) => (
    <tr key={cancion.id}>
      <td>{cancion.id}</td>
      <td>{cancion.nombre}</td>
      <td>{cancion.album?.nombre}</td>
      <td>{cancion.album?.artista?.nombre}</td>
      <td>{cancion.album?.artista?.genero?.nombre}</td>
      <td>
        <Button variant="primary" size="sm" onClick={() => handleEditar(cancion)}>
          Editar
        </Button>{" "}
        <Button variant="danger" size="sm" onClick={() => handleEliminar(cancion.id)}>
          Eliminar
        </Button>
      </td>
    </tr>
  ))}
</tbody>

      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modoEdicion ? "Editar" : "Crear"} Canción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={cancionActual.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Género</Form.Label>
              <Form.Select value={generoSeleccionado} onChange={handleGeneroChange} required>
                <option value="">Seleccione...</option>
                {generos.map((g) => (
                  <option key={g.id} value={g.id}>{g.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Artista</Form.Label>
              <Form.Select value={artistaSeleccionado} onChange={handleArtistaChange} required>
                <option value="">Seleccione...</option>
                {artistas.map((a) => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Álbum</Form.Label>
              <Form.Select name="albumId" value={cancionActual.albumId} onChange={handleChange} required>
                <option value="">Seleccione...</option>
                {albums.map((al) => (
                  <option key={al.id} value={al.id}>{al.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Audio MP3</Form.Label>
              <Form.Control
                type="file"
                accept="audio/mp3"
                onChange={(e) => setAudio(e.target.files[0])}
              />
            </Form.Group>
            <div className="text-end">
              <Button variant="secondary" onClick={handleClose} className="me-2">Cancelar</Button>
              <Button type="submit" variant="primary">Guardar</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CrudCanciones;
