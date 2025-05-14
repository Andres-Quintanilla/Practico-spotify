// src/views/CrudGeneros.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Modal, Table } from "react-bootstrap";

const API_URL = "http://localhost:3000";

function CrudGeneros() {
  const [generos, setGeneros] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", imagen: null });
  const [generoSeleccionado, setGeneroSeleccionado] = useState(null);

  const obtenerGeneros = async () => {
    const res = await axios.get(`${API_URL}/generos`);
    setGeneros(res.data);
  };

  useEffect(() => {
    obtenerGeneros();
  }, []);

  const handleFileChange = (e) => {
    setFormData({ ...formData, imagen: e.target.files[0] });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    if (modoEdicion) {
      await axios.put(`${API_URL}/generos/${generoSeleccionado.id}`, {
        nombre: formData.nombre,
        imagen: generoSeleccionado.imagen,
      });

      if (formData.imagen) {
        const data = new FormData();
        data.append("foto", formData.imagen);
        await axios.post(`${API_URL}/generos/${generoSeleccionado.id}/foto`, data);
      }
    } else {
      const res = await axios.post(`${API_URL}/generos`, {
        nombre: formData.nombre,
        imagen: "", 
      });

      if (formData.imagen) {
        const data = new FormData();
        data.append("foto", formData.imagen);
        await axios.post(`${API_URL}/generos/${res.data.id}/foto`, data);
      }
    }
    setModalShow(false);
    setFormData({ nombre: "", imagen: null });
    setGeneroSeleccionado(null);
    setModoEdicion(false);
    obtenerGeneros();
  };

  const handleEditar = (genero) => {
    setGeneroSeleccionado(genero);
    setFormData({ nombre: genero.nombre, imagen: null });
    setModoEdicion(true);
    setModalShow(true);
  };

  const handleEliminar = async (id) => {
    if (confirm("¿Estás seguro de eliminar este género?")) {
      await axios.delete(`${API_URL}/generos/${id}`);
      obtenerGeneros();
    }
  };

  const handleCancelar = () => {
    setModalShow(false);
    setFormData({ nombre: "", imagen: null });
    setModoEdicion(false);
    setGeneroSeleccionado(null);
  };

  return (
    <div>
      <Button variant="success" className="mb-3" onClick={() => setModalShow(true)}>
        Crear Género
      </Button>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {generos.map((genero) => (
            <tr key={genero.id}>
              <td>{genero.id}</td>
              <td>{genero.nombre}</td>
              <td>
                <img
                  src={`http://localhost:3000${genero.imagen}?t=${Date.now()}`}
                  alt={genero.nombre}
                  width={80}
                />
              </td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEditar(genero)}
                  className="me-2"
                >
                  Editar
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleEliminar(genero.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={modalShow} onHide={handleCancelar} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modoEdicion ? "Editar Género" : "Crear Género"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Imagen</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelar}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardar}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CrudGeneros;
