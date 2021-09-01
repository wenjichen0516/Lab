const db = require("../models/sequelize.js");
const Antibody = db.antibody;
const Op = db.Sequelize.Op;

// Create and Save a new Antibody 
exports.create = (req, res) => {
    // Validate request
    if (!req.body.antibody) {
        res.status(400).send({
           message: "Content can not be empty!" 
        });
    }

    // create a Antibody 
    const antibody = {
        antibody: req.body.antibody
    }

    // Save it in the db
    Antibody.create(antibody)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Antibody ."
            });
        })
};

// Retrieve all antibodies from the database
exports.findAll = (req, res) => {
    const antibody = req.body.antibody;
    var condition = antibody ? { antibody: { [Op.like]: `%${antibody}%`} } : null;
    
    Antibody.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Antibody ."
            });
        });
};

// Find a single Antibody with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Antibody.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Antibody with id=" + id
            });
        });
};

// Update a Antibody with the specified id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Antibody.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Antibody was updated successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot update Antibody with id=${id}.`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Antibody with id=" + id
            });
        });
};

// Delete a Antibody with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Antibody.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Antibody was deleted successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot delete Antibody with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error deleting Antibody with id=" + id
            });
        });
};

// Delete all Antibodies from the database
exports.deleteAll = (req, res) => {
    Antibody.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} antibody were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting all antibody."
            });
        });
};