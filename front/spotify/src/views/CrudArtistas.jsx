import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Modal, Table, Image } from "react-bootstrap";

const API_URL = "http://localhost:3000";

function CrudArtistas() {
  const [artistas, setArtistas] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [artistaActual, setArtistaActual] = useState({ nombre: "", generoId: "" });
  const [foto, setFoto] = useState(null);

  const cargarArtistas = async () => {
    const res = await axios.get(`${API_URL}/artistas`);
    setArtistas(res.data);
  };

  const cargarGeneros = async () => {
    const res = await axios.get(`${API_URL}/generos`);
    setGeneros(res.data);
  };

  useEffect(() => {
    cargarArtistas();
    cargarGeneros();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setModoEdicion(false);
    setArtistaActual({ nombre: "", generoId: "" });
    setFoto(null);
  };

  const handleShow = () => setShowModal(true);

  const handleChange = (e) => {
    setArtistaActual({ ...artistaActual, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (modoEdicion) {
        await axios.put(`${API_URL}/artistas/${artistaActual.id}`, {
          nombre: artistaActual.nombre,
          generoId: artistaActual.generoId
        });
        if (foto) await subirFoto(artistaActual.id);
      } else {
        res = await axios.post(`${API_URL}/artistas`, {
          nombre: artistaActual.nombre,
          generoId: artistaActual.generoId
        });
        if (foto) await subirFoto(res.data.id);
      }
      handleClose();
      cargarArtistas();
    } catch (err) {
      console.error("Error al guardar el artista", err);
    }
  };

  const subirFoto = async (id) => {
    const formData = new FormData();
    formData.append("foto", foto);
    await axios.post(`${API_URL}/artistas/${id}/foto`, formData);
  };

  const handleEditar = (artista) => {
    setModoEdicion(true);
    setArtistaActual({ ...artista });
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este artista?")) return;
    await axios.delete(`${API_URL}/artistas/${id}`);
    cargarArtistas();
  };

  return (
    <div>
      <Button variant="success" className="mb-3" onClick={handleShow}>
        Crear Artista
      </Button>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Foto</th>
            <th>Género</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {artistas.map((artista) => (
            <tr key={artista.id}>
              <td>{artista.id}</td>
              <td>{artista.nombre}</td>
              <td>
                <Image
                  src={`http://localhost:3000${artista.foto}?t=${Date.now()}`}
                  width={60}
                  rounded
                />
              </td>
              <td>{artista.genero?.nombre}</td>
              <td>
                <Button variant="primary" size="sm" onClick={() => handleEditar(artista)}>
                  Editar
                </Button>{" "}
                <Button variant="danger" size="sm" onClick={() => handleEliminar(artista.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modoEdicion ? "Editar" : "Crear"} Artista</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={artistaActual.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Género</Form.Label>
              <Form.Select
                name="generoId"
                value={artistaActual.generoId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione...</option>
                {generos.map(g => (
                  <option key={g.id} value={g.id}>{g.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Foto</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setFoto(e.target.files[0])}
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

export default CrudArtistas;
