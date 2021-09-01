module.exports = app => {
    const lab = require("../controllers/lab.controller.js");

    var router = require("express").Router();

    // Create a new lab
    router.post("/", lab.create);

    // Retrive all lab
    router.get("/", lab.findAll);

    // Retrive a single lab with id
    router.get("/:id", lab.findOne);

    // Update a lab with id
    router.put("/:id", lab.update);

    // Delete a lab with id
    router.delete("/:id", lab.delete);

    // Delete all lab
    router.delete("/", lab.deleteAll);

    app.use('/api/lab', router);
}