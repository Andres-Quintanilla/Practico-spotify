import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerArtistasPorGenero } from '../controllers/artista.controller';

function ListaArtistas() {
  const [artistas, setArtistas] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    obtenerArtistasPorGenero(id)
      .then(setArtistas)
      .catch(err => console.error(err));
  }, [id]);

  return (
    <div className="container py-4">
      <h2 className="text-white mb-4">Artistas</h2>
      <div className="row">
        {artistas.map(artista => (
          <div className="col-6 col-md-4 col-lg-3 mb-4" key={artista.id}>
            <div
              className="bg-dark text-white p-3 rounded shadow-sm spotify-card"
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={() => navigate(`/artistas/${artista.id}/albums`)}
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
                  src={`http://localhost:3000${artista.foto}`}
                  alt={artista.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h5 className="text-center mb-0">{artista.nombre}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListaArtistas;
