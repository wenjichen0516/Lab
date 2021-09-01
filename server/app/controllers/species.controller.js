const db = require("../models/sequelize.js");
const Species = db.species;
const Op = db.Sequelize.Op;

// Create and Save a new Species 
exports.create = (req, res) => {
    // Validate request
    if (!req.body.code) {
        res.status(400).send({
           message: "Content can not be empty!" 
        });
    }

    // create a Species 
    const species = {
        code: req.body.code,
        name: req.body.name
    }

    // Save it in the db
    Species.create(species)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Species ."
            });
        })
};

// Retrieve all Species from the database
exports.findAll = (req, res) => {
    const code = req.body.code;
    var condition = code ? { code: { [Op.like]: `%${code}%`} } : null;

    Species.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Species ."
            });
        });
};

// Find a single Species with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Species.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Species with id=" + id
            });
        });
};

// Update a Species with the specified id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Species.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Species was updated successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot update Species with id=${id}.`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Species with id=" + id
            });
        });
};

// Delete a Species with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Species.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Species was deleted successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot delete Species with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error deleting Species with id=" + id
            });
        });
};

// Delete all Species from the database
exports.deleteAll = (req, res) => {
    Species.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} species were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting all species."
            });
        });
};