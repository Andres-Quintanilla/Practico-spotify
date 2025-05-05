const db = require("../models");

exports.getGeneroList = async (req, res) => {
    const generos = await db.genero.findAll();
    res.send(generos);
};

exports.getGeneroById = async (req, res) => {
    const genero = await db.genero.findByPk(req.params.id);
    if (!genero) return res.status(404).send({ message: "Género no encontrado" });
    res.send(genero);
};

exports.postGeneroCreate = async (req, res) => {
    const { nombre, imagen } = req.body;
    try {
        const nuevoGenero = await db.genero.create({ nombre, imagen });
        res.status(201).send(nuevoGenero);
    } catch (err) {
        res.status(500).send({ message: "Error al crear el género", error: err });
    }
};

exports.uploadFoto = async (req, res) => {
    const { id } = req.params;
    const genero = await db.genero.findByPk(id);

    if (!genero) return res.status(404).send({ message: "Género no encontrado" });

    if (!req.files || !req.files.foto) {
        return res.status(400).send({ message: "Debe subir un archivo con el campo 'foto'" });
    }

    const foto = req.files.foto;
    const extension = foto.name.split('.').pop();
    const fileName = `genero_${id}.${extension}`;
    const path = `./public/imagenes/generos/${fileName}`;

    foto.mv(path, async (err) => {
        if (err) return res.status(500).send({ message: "Error al subir la imagen", error: err });

        genero.imagen = `/public/imagenes/generos/${fileName}`;
        await genero.save();
        res.send({ message: "Imagen subida con éxito", genero });
    });
};



exports.putGeneroUpdate = async (req, res) => {
    const genero = await db.genero.findByPk(req.params.id);
    if (!genero) return res.status(404).send({ message: "Género no encontrado" });

    const { nombre } = req.body;
    // Si no se envió nombre, usamos el anterior
    genero.nombre = nombre ?? genero.nombre;

    // No actualizar imagen aquí, se hace en uploadFoto
    await genero.save();
    res.send(genero);
};



exports.patchGeneroUpdate = async (req, res) => {
    const { id } = req.params;
    const genero = await db.genero.findByPk(id);

    if (!genero) {
        return res.status(404).send({ message: "Género no encontrado" });
    }

    const { nombre, imagen } = req.body;

    // Solo actualiza los campos que llegan en el body
    if (nombre !== undefined) genero.nombre = nombre;
    if (imagen !== undefined) genero.imagen = imagen;

    await genero.save();
    res.send(genero);
};


exports.deleteGenero = async (req, res) => {
    const genero = await db.genero.findByPk(req.params.id);
    if (!genero) return res.status(404).send({ message: "Género no encontrado" });
    await genero.destroy();
    res.status(204).send();
};
