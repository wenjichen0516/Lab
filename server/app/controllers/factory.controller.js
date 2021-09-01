const db = require("../models/sequelize.js");
const Factory = db.factory;
const Op = db.Sequelize.Op;

// Create and Save a new Factory 
exports.create = (req, res) => {
    // Validate request
    if (!req.body.factory) {
        res.status(400).send({
           message: "Content can not be empty!" 
        });
    }

    // create a Factory 
    const factory = {
        factory: req.body.factory,
        color: req.body.color
    }

    // Save it in the db
    Factory.create(factory)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Factory ."
            });
        })
};

// Retrieve all Factories from the database
exports.findAll = (req, res) => {
    const factory = req.body.factory;
    var condition = factory ? { factory: { [Op.like]: `%${factory}%`} } : null;
    
    Factory.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Factory ."
            });
        });
};

// Find a single Factory with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Factory.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Factory with id=" + id
            });
        });
};

// Update a Factory with the specified id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Factory.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Factory was updated successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot update Factory with id=${id}.`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Factory with id=" + id
            });
        });
};

// Delete a Factory with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Factory.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Factory was deleted successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot delete Factory with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error deleting Factory with id=" + id
            });
        });
};

// Delete all Factories from the database
exports.deleteAll = (req, res) => {
    Factory.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} factory were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting all factory."
            });
        });
};