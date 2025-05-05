module.exports = app => {
    const router = require("express").Router();
    const controller = require("../controllers/cancion.controller");

    router.get("/", controller.getCancionList);
    router.get("/:id", controller.getCancionById);
    router.post("/", controller.postCancionCreate);
    router.post("/:id/audio", controller.uploadAudio);
    router.put("/:id", controller.putCancionUpdate);
    router.patch("/:id", controller.patchCancionUpdate);
    router.delete("/:id", controller.deleteCancion);
    router.get("/album/:albumId", controller.getCancionesPorAlbum);


    app.use("/canciones", router);
};
