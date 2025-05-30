import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerAlbumsPorArtista } from '../controllers/album.controller';

function ListaAlbums() {
  const [albums, setAlbums] = useState([]);
  const { id } = useParams(); // id del artista
  const navigate = useNavigate();

  useEffect(() => {
    obtenerAlbumsPorArtista(id)
      .then(setAlbums)
      .catch(err => console.error(err));
  }, [id]);

  return (
    <div className="container py-4">
      <h2 className="text-white mb-4">Álbumes</h2>
      <div className="row">
        {albums.map(album => (
          <div className="col-6 col-md-4 col-lg-3 mb-4" key={album.id}>
            <div
              className="bg-dark text-white p-3 rounded shadow-sm spotify-card"
              style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
              onClick={() => navigate(`/albums/${album.id}/canciones`)}
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
                  src={`http://localhost:3000${album.imagen}`}
                  alt={album.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <h5 className="text-center mb-0">{album.nombre}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListaAlbums;
