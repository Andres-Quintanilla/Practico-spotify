const db = require("../models");

exports.getArtistaList = async (req, res) => {
    const artistas = await db.artista.findAll({ include: ["genero"] });
    res.send(artistas);
};

exports.getArtistaById = async (req, res) => {
    const artista = await db.artista.findByPk(req.params.id, { include: ["genero"] });
    if (!artista) return res.status(404).send({ message: "Artista no encontrado" });
    res.send(artista);
};

exports.postArtistaCreate = async (req, res) => {
    const { nombre, foto, generoId } = req.body;
    try {
        const nuevo = await db.artista.create({ nombre, foto, generoId });
        res.status(201).send(nuevo);
    } catch (err) {
        res.status(500).send({ message: "Error al crear el artista", error: err });
    }
};

exports.uploadFoto = async (req, res) => {
    const { id } = req.params;
    const artista = await db.artista.findByPk(id);

    if (!artista) return res.status(404).send({ message: "Artista no encontrado" });

    if (!req.files || !req.files.foto) {
        return res.status(400).send({ message: "Debe subir un archivo con el campo 'foto'" });
    }

    const foto = req.files.foto;
    const extension = foto.name.split('.').pop();
    const fileName = `artista_${id}.${extension}`;
    const path = `./public/imagenes/artistas/${fileName}`;

    foto.mv(path, async (err) => {
        if (err) return res.status(500).send({ message: "Error al subir la imagen", error: err });

        artista.foto = `/public/imagenes/artistas/${fileName}`;
        await artista.save();
        res.send({ message: "Imagen subida con éxito", artista });
    });
};


exports.putArtistaUpdate = async (req, res) => {
    const artista = await db.artista.findByPk(req.params.id);
    if (!artista) return res.status(404).send({ message: "Artista no encontrado" });

    const { nombre, generoId } = req.body;
    artista.nombre = nombre ?? artista.nombre;
    artista.generoId = generoId ?? artista.generoId;

    // No modificar la foto aquí; se gestiona en uploadFoto
    await artista.save();
    res.send(artista);
};


exports.patchArtistaUpdate = async (req, res) => {
    const artista = await db.artista.findByPk(req.params.id);
    if (!artista) return res.status(404).send({ message: "Artista no encontrado" });

    const { nombre, foto, generoId } = req.body;
    if (nombre !== undefined) artista.nombre = nombre;
    if (foto !== undefined) artista.foto = foto;
    if (generoId !== undefined) artista.generoId = generoId;
    await artista.save();
    res.send(artista);
};

exports.deleteArtista = async (req, res) => {
    const artista = await db.artista.findByPk(req.params.id);
    if (!artista) return res.status(404).send({ message: "Artista no encontrado" });
    await artista.destroy();
    res.status(204).send();
};

exports.getArtistasPorGenero = async (req, res) => {
    const { generoId } = req.params;
    const artistas = await db.artista.findAll({
        where: { generoId },
        include: ["genero"]
    });
    res.send(artistas);
};

exports.getAlbumsPorArtista = async (req, res) => {
    const artista = await db.artista.findByPk(req.params.id, {
      include: ["albums"]
    });
  
    if (!artista) return res.status(404).send({ message: "Artista no encontrado" });
  
    res.send(artista.albums);
  };
  

