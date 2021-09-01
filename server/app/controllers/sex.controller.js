const db = require("../models/sequelize.js");
const Sex = db.sex;
const Op = db.Sequelize.Op;

// Create and Save a new Sex 
exports.create = (req, res) => {
    // Validate request
    if (!req.body.sex) {
        res.status(400).send({
           message: "Content can not be empty!" 
        });
    }

    // create a Sex 
    const sex = {
        sex: req.body.sex
    }

    // Save it in the db
    Sex.create(sex)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Sex ."
            });
        })
};

// Retrieve all Sexes from the database
exports.findAll = (req, res) => {
    const sex = req.body.sex;
    var condition = sex ? { sex: { [Op.like]: `%${sex}%`} } : null;
    
    Sex.findAll({ where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Sex ."
            });
        });
};

// Find a single Sex with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Sex.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Sex with id=" + id
            });
        });
};

// Update a Sex with the specified id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Sex.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Sex was updated successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot update Sex with id=${id}.`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Sex with id=" + id
            });
        });
};

// Delete a Sex with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Sex.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Sex was deleted successfully."
                });
            }
            else{
                res.send({
                    message: `Cannot delete Sex with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error deleting Sex with id=" + id
            });
        });
};

// Delete all Sexes from the database
exports.deleteAll = (req, res) => {
    Sex.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} sex were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting all sex."
            });
        });
};