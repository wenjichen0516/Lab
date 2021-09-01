module.exports = app => {
    const individual = require("../controllers/individual.controller.js");

    var router = require("express").Router();

    // Create a new individual
    router.post("/", individual.create);

    // Retrive all individual
    router.get("/", individual.findAll);

    // Retrive a single individual with id
    router.get("/:id", individual.findOne);

    // Update a individual with id
    router.put("/:id", individual.update);

    // Delete a individual with id
    router.delete("/:id", individual.delete);

    // Delete all individual
    router.delete("/", individual.deleteAll);

    app.use('/api/individual', router);
}