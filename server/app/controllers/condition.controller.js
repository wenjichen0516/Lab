const db = require("../models/sequelize.js");
const Condition = db.condition;
const Op = db.Sequelize.Op;

// Create and Save a new Condition 
exports.create = (req, res) => {
    // Validate request
    if (!req.body.conditionName) {
        res.status(400).send({
           message: "Content can not be empty!" 
        });
    }

    // create a Condition 
    const condition = {
        conditionName: req.body.conditionName
    }

    // Save it in the db
    Condition.create(condition)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Condition ."
            });
        })
};

// Retrieve all Conditions from the database
exports.findAll = (req, res) => {
    const conditionName = req.body.conditionName;
    var condition = conditionName ? { conditionName: { [Op.like]: `%${conditionName}%`} } : null;
    
    Condition.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Condition ."
            });
        });
};

// Find a single Condition with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Condition.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Condition with id=" + id
            });
        });
};

// Update a Condition with the specified id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Condition.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Condition was updated successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot update Condition with id=${id}.`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Condition with id=" + id
            });
        });
};

// Delete a Condition with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Condition.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Condition was deleted successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot delete Condition with id: ${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Error deleting Condition with id: ${id}.`
            });
        });
};

// Delete all Conditions from the database
exports.deleteAll = (req, res) => {
    Condition.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} condition were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting all condition."
            });
        });
};