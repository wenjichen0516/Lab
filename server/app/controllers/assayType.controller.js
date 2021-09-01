const db = require("../models/sequelize.js");
const AssayType = db.assayType;
const Op = db.Sequelize.Op;

// Create and Save a new AssayType 
exports.create = (req, res) => {
    // Validate request
    if (!req.body.assayType) {
        res.status(400).send({
           message: "Content can not be empty!" 
        });
    }

    // create an AssayType 
    const assayType = {
        assayType: req.body.assayType
    }

    // Save it in the db
    AssayType.create(assayType)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the AssayType ."
            });
        })
};

// Retrieve all AssayTypes from the database
exports.findAll = (req, res) => {
    const assayType = req.body.assayType;
    var condition = assayType ? { assayType: { [Op.like]: `%${assayType}%`} } : null;
    
    AssayType.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the AssayType ."
            });
        });
};

// Find a single AssayType with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    AssayType.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving AssayType with id=" + id
            });
        });
};

// Update an AssayType with the specified id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    AssayType.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "AssayType was updated successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot update AssayType with id=${id}.`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating AssayType with id=" + id
            });
        });
};

// Delete an AssayType with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    AssayType.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "AssayType was deleted successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot delete AssayType with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error deleting AssayType with id=" + id
            });
        });
};

// Delete all AssayTypes from the database
exports.deleteAll = (req, res) => {
    AssayType.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} assayType were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting all assayType."
            });
        });
};