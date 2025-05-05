import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerGeneros } from '../controllers/genero.controller';

function ListaGeneros() {
  const [generos, setGeneros] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerGeneros()
      .then(setGeneros)
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container py-4">
      <h2 className="text-white mb-4">Géneros Musicales</h2>
      <div className="row">
        {generos.map(genero => (
          <div className="col-6 col-md-4 col-lg-3 mb-4" key={genero.id}>
            <div
              className="bg-dark text-white p-3 rounded shadow-sm spotify-card"
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={() => navigate(`/generos/${genero.id}/artistas`)}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div
                style={{
                  height: '180px',
                  overflow: 'hidden',
                  borderRadius: '10px',
                  marginBottom: '1rem',
                }}
              >
                <img
                  src={`http://localhost:3000${genero.imagen}`}
                  alt={genero.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h5 className="text-center mb-0">{genero.nombre}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListaGeneros;
