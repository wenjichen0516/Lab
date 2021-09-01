const db = require("../models/sequelize.js");
const Strain = db.strain;
const Op = db.Sequelize.Op;

// Create and Save a new Strain 
exports.create = (req, res) => {
    // Validate request
    if (!req.body.strain) {
        res.status(400).send({
           message: "Content can not be empty!" 
        });
    }

    // create a Strain 
    const strain = {
        strain: req.body.strain
    }

    // Save it in the db
    Strain.create(strain)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Strain ."
            });
        })
};

// Retrieve all Strains from the database
exports.findAll = (req, res) => {
    const strain = req.body.strain;
    var condition = strain ? { strain: { [Op.like]: `%${strain}%`} } : null;
    
    Strain.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Strain ."
            });
        });
};

// Find a single Strain with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Strain.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Strain with id=" + id
            });
        });
};

// Update a Strain with the specified id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Strain.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Strain was updated successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot update Strain with id=${id}.`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Strain with id=" + id
            });
        });
};

// Delete a Strain with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Strain.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Strain was deleted successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot delete Strain with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error deleting Strain with id=" + id
            });
        });
};

// Delete all Strains from the database
exports.deleteAll = (req, res) => {
    Strain.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} strain were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting all strain."
            });
        });
};