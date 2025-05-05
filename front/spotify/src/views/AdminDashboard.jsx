// src/views/AdminDashboard.jsx
import { useState } from "react";
import CrudGeneros from "../views/CrudGeneros";
import CrudArtistas from "../views/CrudArtistas";
import CrudAlbums from "../views/CrudAlbums";
import CrudCanciones from "../views/CrudCanciones";

function AdminDashboard() {
  const [vista, setVista] = useState("generos");

  return (
    <div className="container py-4 text-white">
      <h2 className="mb-4">Panel de Administración</h2>
      <div className="btn-group mb-4" role="group">
        <button className={`btn btn-${vista === "generos" ? "primary" : "secondary"}`} onClick={() => setVista("generos")}>Géneros</button>
        <button className={`btn btn-${vista === "artistas" ? "primary" : "secondary"}`} onClick={() => setVista("artistas")}>Artistas</button>
        <button className={`btn btn-${vista === "albums" ? "primary" : "secondary"}`} onClick={() => setVista("albums")}>Álbumes</button>
        <button className={`btn btn-${vista === "canciones" ? "primary" : "secondary"}`} onClick={() => setVista("canciones")}>Canciones</button>
      </div>

      {vista === "generos" && <CrudGeneros />}
      {vista === "artistas" && <CrudArtistas />}
      {vista === "albums" && <CrudAlbums />}
      {vista === "canciones" && <CrudCanciones />}
    </div>
  );
}

export default AdminDashboard;
