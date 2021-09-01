const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

module.exports = app => {
    const inventory = require("../controllers/inventory.controller.js");

    var router = require("express").Router();

    // Create a new inventory
    router.post("/", inventory.create);

    // Retrive all inventory
    router.get("/", inventory.findAll);

    // Retrive a single inventory with id
    router.get("/:id", inventory.findOne);

    // Update a inventory with id
    router.put("/:id", inventory.update);

    // Delete a inventory with id
    router.delete("/:id", inventory.delete);

    // Delete all inventory
    //router.delete("/", inventory.deleteAll);

    // upload csv
    router.post("/upload", multipartMiddleware, inventory.upload);

    app.use('/api/inventory', router);
}