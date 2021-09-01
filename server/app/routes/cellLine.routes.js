module.exports = app => {
    const cellLine = require("../controllers/cellLine.controller.js");

    var router = require("express").Router();

    // Create a new cellLine
    router.post("/", cellLine.create);

    // Retrive all cellLine
    router.get("/", cellLine.findAll);

    // Retrive a single cellLine with id
    router.get("/:id", cellLine.findOne);

    // Update a cellLine with id
    router.put("/:id", cellLine.update);

    // Delete a cellLine with id
    router.delete("/:id", cellLine.delete);

    // Delete all cellLine
    router.delete("/", cellLine.deleteAll);

    app.use('/api/cellLine', router);
}