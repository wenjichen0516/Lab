module.exports = app => {
    const tissueProcessing = require("../controllers/tissueProcessing.controller.js");

    var router = require("express").Router();

    // Create a new tissueProcessing
    router.post("/", tissueProcessing.create);

    // Retrive all tissueProcessing
    router.get("/", tissueProcessing.findAll);

    // Retrive a single tissueProcessing with id
    router.get("/:id", tissueProcessing.findOne);

    // Update a tissueProcessing with id
    router.put("/:id", tissueProcessing.update);

    // Delete a tissueProcessing with id
    router.delete("/:id", tissueProcessing.delete);

    // Delete all tissueProcessing
    router.delete("/", tissueProcessing.deleteAll);

    app.use('/api/tissueProcessing', router);
}