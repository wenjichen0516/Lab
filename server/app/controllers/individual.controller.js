const db = require("../models/sequelize.js");
const Individual = db.individual;
const Op = db.Sequelize.Op;

// Create and Save a new Individual 
exports.create = (req, res) => {
    // Validate request
    if (!req.body.individual) {
        res.status(400).send({
           message: "Content can not be empty!" 
        });
    }

    // create a Individual 
    const individual = {
        individual: req.body.individual
    }

    // Save it in the db
    Individual.create(individual)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Individual ."
            });
        })
};

// Retrieve all Individuals from the database
exports.findAll = (req, res) => {
    const individual = req.body.individual;
    var condition = individual ? { individual: { [Op.like]: `%${individual}%`} } : null;
    
    Individual.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Individual ."
            });
        });
};

// Find a single Individual with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Individual.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Individual with id=" + id
            });
        });
};

// Update a Individual with the specified id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Individual.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Individual was updated successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot update Individual with id=${id}.`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Individual with id=" + id
            });
        });
};

// Delete a Individual with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Individual.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Individual was deleted successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot delete Individual with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error deleting Individual with id=" + id
            });
        });
};

// Delete all Individuals from the database
exports.deleteAll = (req, res) => {
    Individual.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} individual were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting all individual."
            });
        });
};