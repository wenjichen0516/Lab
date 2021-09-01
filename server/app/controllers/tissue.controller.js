const db = require("../models/sequelize.js");
const Tissue = db.tissue;
const Op = db.Sequelize.Op;

// Create and Save a new Tissue 
exports.create = (req, res) => {
    // Validate request
    if (!req.body.tissue) {
        res.status(400).send({
           message: "Content can not be empty!" 
        });
    }

    // create a Tissue 
    const tissue = {
        tissue: req.body.tissue
    }

    // Save it in the db
    Tissue.create(tissue)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tissue ."
            });
        })
};

// Retrieve all Tissues from the database
exports.findAll = (req, res) => {
    const tissue = req.body.tissue;
    var condition = tissue ? { tissue: { [Op.like]: `%${tissue}%`} } : null;
    
    Tissue.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tissue ."
            });
        });
};

// Find a single Tissue with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Tissue.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Tissue with id=" + id
            });
        });
};

// Update a Tissue with the specified id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Tissue.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Tissue was updated successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot update Tissue with id=${id}.`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Tissue with id=" + id
            });
        });
};

// Delete a Tissue with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Tissue.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Tissue was deleted successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot delete Tissue with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error deleting Tissue with id=" + id
            });
        });
};

// Delete all Tissues from the database
exports.deleteAll = (req, res) => {
    Tissue.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} tissue were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting all tissue."
            });
        });
};