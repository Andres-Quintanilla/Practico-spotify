module.exports = app => {
    const router = require("express").Router();
    const controller = require("../controllers/artista.controller");

    router.get("/", controller.getArtistaList);
    router.get("/:id", controller.getArtistaById);
    router.post("/", controller.postArtistaCreate);
    router.post("/:id/foto", controller.uploadFoto);
    router.put("/:id", controller.putArtistaUpdate);
    router.patch("/:id", controller.patchArtistaUpdate);
    router.delete("/:id", controller.deleteArtista);   
    router.get("/genero/:generoId", controller.getArtistasPorGenero);
    router.get("/:id/albums", controller.getAlbumsPorArtista);


    app.use("/artistas", router);
};
