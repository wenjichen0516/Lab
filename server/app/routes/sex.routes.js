module.exports = app => {
    const sex = require("../controllers/sex.controller.js");

    var router = require("express").Router();

    // Create a new sex
    router.post("/", sex.create);

    // Retrive all sex
    router.get("/", sex.findAll);

    // Retrive a single sex with id
    router.get("/:id", sex.findOne);

    // Update a sex with id
    router.put("/:id", sex.update);

    // Delete a sex with id
    router.delete("/:id", sex.delete);

    // Delete all sex
    router.delete("/", sex.deleteAll);

    app.use('/api/sex', router);
}