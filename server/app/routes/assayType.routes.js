module.exports = app => {
    const assayType = require("../controllers/assayType.controller.js");

    var router = require("express").Router();

    // Create a new assayType
    router.post("/", assayType.create);

    // Retrive all assayType
    router.get("/", assayType.findAll);

    // Retrive a single assayType with id
    router.get("/:id", assayType.findOne);

    // Update a assayType with id
    router.put("/:id", assayType.update);

    // Delete a assayType with id
    router.delete("/:id", assayType.delete);

    // Delete all assayType
    router.delete("/", assayType.deleteAll);

    app.use('/api/assayType', router);
}