module.exports = app => {
    const tissue = require("../controllers/tissue.controller.js");

    var router = require("express").Router();

    // Create a new tissue
    router.post("/", tissue.create);

    // Retrive all tissue
    router.get("/", tissue.findAll);

    // Retrive a single tissue with id
    router.get("/:id", tissue.findOne);

    // Update a tissue with id
    router.put("/:id", tissue.update);

    // Delete a tissue with id
    router.delete("/:id", tissue.delete);

    // Delete all tissue
    router.delete("/", tissue.deleteAll);

    app.use('/api/tissue', router);
}