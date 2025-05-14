import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ListaCanciones() {
  const { id } = useParams(); 
  const [canciones, setCanciones] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/albums/${id}/canciones`)
      .then(res => setCanciones(res.data))
      .catch(err => console.error(err));
  }, [id]);

  return (
    <div className="container py-4">
      <h2 className="text-white mb-4">Canciones</h2>
      <ul className="list-group">
        {canciones.map(c => (
          <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center">
            {c.nombre}
            <audio controls src={`http://localhost:3000${c.archivo}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaCanciones;
