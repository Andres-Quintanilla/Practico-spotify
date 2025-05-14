const db = require("../models");

exports.getCancionList = async (req, res) => {
    try {
      const canciones = await db.cancion.findAll({
        include: [
          {
            model: db.album,
            as: "album",
            include: [
              {
                model: db.artista,
                as: "artista",
                include: ["genero"]
              }
            ]
          }
        ]
      });
      res.send(canciones);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Error al obtener canciones", error: err });
    }
  };
  

exports.getCancionById = async (req, res) => {
    const cancion = await db.cancion.findByPk(req.params.id, { include: ["album"] });
    if (!cancion) return res.status(404).send({ message: "Canción no encontrada" });
    res.send(cancion);
};

exports.postCancionCreate = async (req, res) => {
    try {
      const { nombre, albumId } = req.body;
      if (!nombre || !albumId) {
        return res.status(400).send({ message: "Faltan datos requeridos" });
      }
  
      const nueva = await db.cancion.create({
        nombre,
        archivo: "", 
        albumId
      });
  
      res.status(201).send(nueva);
    } catch (err) {
      res.status(500).send({ message: "Error al crear la canción", error: err.message });
    }
  };
  

exports.uploadAudio = async (req, res) => {
    const { id } = req.params;
    const cancion = await db.cancion.findByPk(id);

    if (!cancion) return res.status(404).send({ message: "Canción no encontrada" });

    if (!req.files || !req.files.audio) {
        return res.status(400).send({ message: "Debe subir un archivo con el campo 'audio'" });
    }

    const audio = req.files.audio;
    const extension = audio.name.split('.').pop().toLowerCase();

    if (extension !== 'mp3') {
        return res.status(400).send({ message: "Solo se permiten archivos MP3" });
    }

    const fileName = `cancion_${id}.mp3`;
    const path = `./public/audio/canciones/${fileName}`;

    audio.mv(path, async (err) => {
        if (err) return res.status(500).send({ message: "Error al subir el archivo", error: err });

        cancion.archivo = `/public/audio/canciones/${fileName}`;
        await cancion.save();
        res.send({ message: "Audio subido con éxito", cancion });
    });
};



exports.putCancionUpdate = async (req, res) => {
    const cancion = await db.cancion.findByPk(req.params.id);
    if (!cancion) return res.status(404).send({ message: "Canción no encontrada" });

    const { nombre, albumId } = req.body;

    
    cancion.nombre = nombre ?? cancion.nombre;
    cancion.albumId = albumId ?? cancion.albumId;

    await cancion.save();
    res.send(cancion);
};


exports.patchCancionUpdate = async (req, res) => {
    const cancion = await db.cancion.findByPk(req.params.id);
    if (!cancion) return res.status(404).send({ message: "Canción no encontrada" });

    const { nombre, archivo, albumId } = req.body;
    if (nombre !== undefined) cancion.nombre = nombre;
    if (archivo !== undefined) cancion.archivo = archivo;
    if (albumId !== undefined) cancion.albumId = albumId;
    await cancion.save();
    res.send(cancion);
};

exports.deleteCancion = async (req, res) => {
    const cancion = await db.cancion.findByPk(req.params.id);
    if (!cancion) return res.status(404).send({ message: "Canción no encontrada" });
    await cancion.destroy();
    res.status(204).send();
};

exports.getCancionesPorAlbum = async (req, res) => {
    const { albumId } = req.params;
    try {
      const canciones = await db.cancion.findAll({
        where: { albumId },
        include: ['album']
      });
      res.send(canciones);
    } catch (err) {
      res.status(500).send({ message: "Error al obtener canciones", error: err });
    }
  };
  
