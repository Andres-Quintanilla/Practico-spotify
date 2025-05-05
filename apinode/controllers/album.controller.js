const db = require("../models");

exports.getAlbumList = async (req, res) => {
    const albums = await db.album.findAll({ include: ["artista"] });
    res.send(albums);
};

exports.getAlbumById = async (req, res) => {
    const album = await db.album.findByPk(req.params.id, { include: ["artista"] });
    if (!album) return res.status(404).send({ message: "Álbum no encontrado" });
    res.send(album);
};

exports.postAlbumCreate = async (req, res) => {
    const { nombre, artistaId } = req.body;
    try {
        const nuevo = await db.album.create({ nombre, artistaId, imagen: "/public/imagenes/albums/default.jpg" });
        res.status(201).send(nuevo);
    } catch (err) {
        res.status(500).send({ message: "Error al crear el álbum", error: err });
    }
};


exports.uploadFoto = async (req, res) => {
    const { id } = req.params;
    const album = await db.album.findByPk(id);

    if (!album) return res.status(404).send({ message: "Álbum no encontrado" });

    if (!req.files || !req.files.foto) {
        return res.status(400).send({ message: "Debe subir un archivo con el campo 'foto'" });
    }

    const foto = req.files.foto;
    const extension = foto.name.split('.').pop();
    const fileName = `album_${id}.${extension}`;
    const path = `./public/imagenes/albums/${fileName}`;

    foto.mv(path, async (err) => {
        if (err) return res.status(500).send({ message: "Error al subir la imagen", error: err });

        album.imagen = `/public/imagenes/albums/${fileName}`;
        await album.save();
        res.send({ message: "Imagen subida con éxito", album });
    });
};



exports.putAlbumUpdate = async (req, res) => {
    const album = await db.album.findByPk(req.params.id);
    if (!album) return res.status(404).send({ message: "Álbum no encontrado" });

    const { nombre, artistaId } = req.body;
    album.nombre = nombre ?? album.nombre;
    album.artistaId = artistaId ?? album.artistaId;

    // No tocar imagen aquí, solo desde uploadFoto
    await album.save();
    res.send(album);
};


exports.patchAlbumUpdate = async (req, res) => {
    const album = await db.album.findByPk(req.params.id);
    if (!album) return res.status(404).send({ message: "Álbum no encontrado" });

    const { nombre, imagen, artistaId } = req.body;
    if (nombre !== undefined) album.nombre = nombre;
    if (imagen !== undefined) album.imagen = imagen;
    if (artistaId !== undefined) album.artistaId = artistaId;
    await album.save();
    res.send(album);
};

exports.deleteAlbum = async (req, res) => {
    const album = await db.album.findByPk(req.params.id);
    if (!album) return res.status(404).send({ message: "Álbum no encontrado" });
    await album.destroy();
    res.status(204).send();
};

exports.getCancionesPorAlbum = async (req, res) => {
    const album = await db.album.findByPk(req.params.id, {
      include: ["canciones"]
    });
  
    if (!album) return res.status(404).send({ message: "Álbum no encontrado" });
  
    res.send(album.canciones);
  };
  