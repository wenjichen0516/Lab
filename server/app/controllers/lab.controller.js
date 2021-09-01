const db = require("../models/sequelize.js");
const Lab = db.lab;
const Op = db.Sequelize.Op;

// Create and Save a new Lab 
exports.create = (req, res) => {
    // Validate request
    if (!req.body.code) {
        res.status(400).send({
           message: "Content can not be empty!" 
        });
    }

    // create a Lab 
    const lab = {
        code: req.body.code,
        piName: req.body.piName
    }

    // Save it in the db
    Lab.create(lab)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Lab ."
            });
        })
};

// Retrieve all Labs from the database
exports.findAll = (req, res) => {
    const code = req.body.code;
    var condition = code ? { code: { [Op.like]: `%${code}%`} } : null;
    
    Lab.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Lab ."
            });
        });
};

// Find a single Lab with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Lab.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Lab with id=" + id
            });
        });
};

// Update a Lab with the specified id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Lab.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Lab was updated successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot update Lab with id=${id}.`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Lab with id=" + id
            });
        });
};

// Delete a Lab with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Lab.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Lab was deleted successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot delete Lab with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error deleting Lab with id=" + id
            });
        });
};

// Delete all Labs from the database
exports.deleteAll = (req, res) => {
    Lab.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} lab were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting all lab."
            });
        });
};