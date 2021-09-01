const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

module.exports = app => {
    const chipSeq = require("../controllers/chipSeq.controller.js");

    var router = require("express").Router();

    // Create a new chipSeq
    router.post("/", chipSeq.create);

    // Retrive all chipSeq
    router.get("/", chipSeq.findAll);

    // Retrive a single chipSeq with id
    router.get("/:id", chipSeq.findOne);

    // Update a chipSeq with id
    router.put("/:id", chipSeq.update);

    // Delete a chipSeq with id
    router.delete("/:id", chipSeq.delete);

    // Delete all chipSeq
    //router.delete("/", chipSeq.deleteAll);

    // upload csv
    router.post("/upload", multipartMiddleware, chipSeq.upload);

    app.use('/api/chipSeq', router);
}