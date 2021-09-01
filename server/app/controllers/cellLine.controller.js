const db = require("../models/sequelize.js");
const CellLine = db.cellLine;
const Op = db.Sequelize.Op;

// Create and Save a new CellLine 
exports.create = (req, res) => {
    // Validate request
    if (!req.body.cellLine) {
        res.status(400).send({
           message: "Content can not be empty!" 
        });
    }

    // create a CellLine 
    const cellLine = {
        cellLine: req.body.cellLine
    }

    // Save it in the db
    CellLine.create(cellLine)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the CellLine ."
            });
        })
};

// Retrieve all CellLines from the database
exports.findAll = (req, res) => {
    const cellLine = req.body.cellLine;
    var condition = cellLine ? { cellLine: { [Op.like]: `%${cellLine}%`} } : null;
    
    CellLine.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the CellLine ."
            });
        });
};

// Find a single CellLine with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    CellLine.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving CellLine with id=" + id
            });
        });
};

// Update a CellLine with the specified id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    CellLine.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "CellLine was updated successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot update CellLine with id=${id}.`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating CellLine with id=" + id
            });
        });
};

// Delete a CellLine with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    CellLine.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "CellLine was deleted successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot delete CellLine with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error deleting CellLine with id=" + id
            });
        });
};

// Delete all CellLines from the database
exports.deleteAll = (req, res) => {
    CellLine.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} cellLine were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting all cellLine."
            });
        });
};