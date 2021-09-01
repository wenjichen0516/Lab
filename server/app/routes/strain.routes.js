module.exports = app => {
    const strain = require("../controllers/strain.controller.js");

    var router = require("express").Router();

    // Create a new strain
    router.post("/", strain.create);

    // Retrive all strain
    router.get("/", strain.findAll);

    // Retrive a single strain with id
    router.get("/:id", strain.findOne);

    // Update a strain with id
    router.put("/:id", strain.update);

    // Delete a strain with id
    router.delete("/:id", strain.delete);

    // Delete all strain
    router.delete("/", strain.deleteAll);

    app.use('/api/strain', router);
}