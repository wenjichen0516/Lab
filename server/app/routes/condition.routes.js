module.exports = app => {
    const condition = require("../controllers/condition.controller.js");

    var router = require("express").Router();

    // Create a new condition
    router.post("/", condition.create);

    // Retrive all condition
    router.get("/", condition.findAll);

    // Retrive a single condition with id
    router.get("/:id", condition.findOne);

    // Update a condition with id
    router.put("/:id", condition.update);

    // Delete a condition with id
    router.delete("/:id", condition.delete);

    // Delete all condition
    router.delete("/", condition.deleteAll);

    app.use('/api/condition', router);
}