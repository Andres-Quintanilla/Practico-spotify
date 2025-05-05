module.exports = app => {
    const router = require("express").Router();
    const controller = require("../controllers/album.controller");

    router.get("/", controller.getAlbumList);
    router.get("/:id", controller.getAlbumById);
    router.post("/", controller.postAlbumCreate);
    router.post("/:id/foto", controller.uploadFoto);
    router.put("/:id", controller.putAlbumUpdate);
    router.patch("/:id", controller.patchAlbumUpdate);
    router.delete("/:id", controller.deleteAlbum);
    router.get("/:id/canciones", controller.getCancionesPorAlbum);


    app.use("/albums", router);
};
