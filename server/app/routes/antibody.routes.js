module.exports = app => {
    const antibody = require("../controllers/antibody.controller.js");

    var router = require("express").Router();

    // Create a new antibody
    router.post("/", antibody.create);

    // Retrive all antibody
    router.get("/", antibody.findAll);

    // Retrive a single antibody with id
    router.get("/:id", antibody.findOne);

    // Update a antibody with id
    router.put("/:id", antibody.update);

    // Delete a antibody with id
    router.delete("/:id", antibody.delete);

    // Delete all antibody
    router.delete("/", antibody.deleteAll);

    app.use('/api/antibody', router);
}