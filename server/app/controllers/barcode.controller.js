const db = require("../models/sequelize.js");
const Barcode = db.barcode;
const Op = db.Sequelize.Op;

// Create and Save a new Barcode 
exports.create = (req, res) => {
    // Validate request
    if (!req.body.barcode) {
        res.status(400).send({
           message: "Content can not be empty!" 
        });
    }

    // create a Barcode 
    const barcode = {
        barcode: req.body.barcode,
        type: req.body.type
    }

    // Save it in the db
    Barcode.create(barcode)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Barcode ."
            });
        })
};

// Retrieve all Barcodes from the database
exports.findAll = (req, res) => {
    const barcode = req.body.barcode;
    var condition = barcode ? { barcode: { [Op.like]: `%${barcode}%`} } : null;
    
    Barcode.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Barcode ."
            });
        });
};

// Find a single Barcode with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Barcode.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Barcode with id=" + id
            });
        });
};

// Update a Barcode with the specified id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Barcode.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Barcode was updated successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot update Barcode with id=${id}.`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Barcode with id=" + id
            });
        });
};

// Delete a Barcode with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Barcode.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Barcode was deleted successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot delete Barcode with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error deleting Barcode with id=" + id
            });
        });
};

// Delete all Barcodes from the database
exports.deleteAll = (req, res) => {
    Barcode.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} barcode were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting all barcode."
            });
        });
};