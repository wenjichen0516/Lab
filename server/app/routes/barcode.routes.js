module.exports = app => {
    const barcode = require("../controllers/barcode.controller.js");

    var router = require("express").Router();

    // Create a new barcode
    router.post("/", barcode.create);

    // Retrive all barcode
    router.get("/", barcode.findAll);

    // Retrive a single barcode with id
    router.get("/:id", barcode.findOne);

    // Update a barcode with id
    router.put("/:id", barcode.update);

    // Delete a barcode with id
    router.delete("/:id", barcode.delete);

    // Delete all barcode
    router.delete("/", barcode.deleteAll);

    app.use('/api/barcode', router);
}