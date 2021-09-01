module.exports = app => {
    const factory = require("../controllers/factory.controller.js");

    var router = require("express").Router();

    // Create a new factory
    router.post("/", factory.create);

    // Retrive all factory
    router.get("/", factory.findAll);

    // Retrive a single factory with id
    router.get("/:id", factory.findOne);

    // Update a factory with id
    router.put("/:id", factory.update);

    // Delete a factory with id
    router.delete("/:id", factory.delete);

    // Delete all factory
    router.delete("/", factory.deleteAll);

    app.use('/api/factory', router);
}