const db = require("../models/sequelize.js");
const TissueProcessing = db.tissueProcessing;
const Op = db.Sequelize.Op;

// Create and Save a new TissueProcessing 
exports.create = (req, res) => {
    // Validate request
    if (!req.body.tissueProcessing) {
        res.status(400).send({
           message: "Content can not be empty!" 
        });
    }

    // create a TissueProcessing 
    const tissueProcessing = {
        tissueProcessing: req.body.tissueProcessing
    }

    // Save it in the db
    TissueProcessing.create(tissueProcessing)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the TissueProcessing ."
            });
        })
};

// Retrieve all TissueProcessings from the database
exports.findAll = (req, res) => {
    const tissueProcessing = req.body.tissueProcessing;
    var condition = tissueProcessing ? { tissueProcessing: { [Op.like]: `%${tissueProcessing}%`} } : null;
    
    TissueProcessing.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the TissueProcessing ."
            });
        });
};

// Find a single TissueProcessing with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    TissueProcessing.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving TissueProcessing with id=" + id
            });
        });
};

// Update a TissueProcessing with the specified id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    TissueProcessing.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "TissueProcessing was updated successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot update TissueProcessing with id=${id}.`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating TissueProcessing with id=" + id
            });
        });
};

// Delete a TissueProcessing with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    TissueProcessing.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "TissueProcessing was deleted successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot delete TissueProcessing with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error deleting TissueProcessing with id=" + id
            });
        });
};

// Delete all TissueProcessings from the database
exports.deleteAll = (req, res) => {
    TissueProcessing.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} tissueProcessing were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting all tissueProcessing."
            });
        });
};