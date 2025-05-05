module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/genero.controller.js");

    router.get("/", controller.getGeneroList);
    router.get("/:id", controller.getGeneroById);
    router.post("/", controller.postGeneroCreate);
    router.post("/:id/foto", controller.uploadFoto);
    router.put("/:id", controller.putGeneroUpdate);
    router.patch("/:id", controller.patchGeneroUpdate);
    router.delete("/:id", controller.deleteGenero);

    app.use('/generos', router);
};
