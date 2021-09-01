const db = require("../models/sequelize");
const common = require("../lib/common");
const config = require("../config/common.config");
const csvParser = require('csv-parse');
const fs = require('fs');
const Inventory = db.inventory;
const Sex = db.sex;
const Antibody = db.antibody;
const AssayType = db.assayType;
const Barcode = db.barcode;
const CellLine = db.cellLine;
const Lab = db.lab;
const Condition = db.condition;
const Factory = db.factory;
const Individual = db.individual;
const TissuePro = db.tissueProcessing;
const Tissue = db.tissue;
const Strain = db.strain;
const Species = db.species;
const ChipSeq = db.chipSeq;
const Op = db.Sequelize.Op;

// Create and Save a new ChipSeq data
exports.create = (req, res) => {
    // create a ChipSeq data
    const chipSeq = {
        inventoryID: req.body.labID,
        rawRead: req.body.sampleID,
        mappedValue: req.body.assayTypeID,
        mappedPercent: req.body.experiment,
        uniqueMappedValue: req.body.speciesID,
        uniquePercent: req.body.strainID,
        PBC: req.body.tissueID,
        NRF: req.body.cellLineID,
        NSC: req.body.tissueProID,
        RSC: req.body.individualID,
        peaks: req.body.sexID,
        frip: req.body.factoryID,
        techRep: req.body.antibodyID,
        uniqueID: req.body.conditionID
    }

    // Save it in the db
    ChipSeq.create(chipSeq)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the ChipSeq ."
            });
        })
};

// Retrieve all ChipSeq data from the database
exports.findAll = (req, res) => {
    ChipSeq.findAll({
        include: {
            model: Inventory,
            include: [Lab, Sex, AssayType, Species, Strain, Tissue, CellLine, TissuePro, Individual,
                Factory, Antibody, Condition, Barcode]
        },
        required: true
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the ChipSeq ."
            });
        });
};

// Retrieve all ChipSeq data with condition from the database
exports.findByCondition = (uniqueID) => {
    let condition = { uniqueID: { [Op.eq]: uniqueID } };

    ChipSeq.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Inventory ."
            });
        });
};

// Find a single ChipSeq data with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    ChipSeq.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving ChipSeq with id=" + id
            });
        });
};

// Update a ChipSeq data with the specified id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    ChipSeq.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "ChipSeq was updated successfully."
                });
            }
            else {
                res.send({
                    message: `Cannot update ChipSeq with id=${id}.`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating ChipSeq with id=" + id
            });
        });
};

// Delete a ChipSeq data with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    ChipSeq.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "ChipSeq was deleted successfully."
                });
            }
            else {
                res.send({
                    message: `Cannot delete ChipSeq with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error deleting ChipSeq with id=" + id
            });
        });
};

// Delete all ChipSeq data from the database
exports.deleteAll = (req, res) => {
    ChipSeq.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} chipSeq were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting all chipSeq."
            });
        });
};

exports.upload = (req, res) => {
    if (req.files && req.files.file) {
        let replaceIdList, replace = false;
        let filePath = req.files.file.path;
        console.log(`${new Date().toString().toString()} Upload - File: ${req.files.file.name}`);

        if (req.body.replaceId) {
            replaceIdList = req.body.replaceId.toString().split(",");
            console.log(`${new Date().toString().toString()} Upload - replaceId: ${replaceIdList}`)

            if (replaceIdList && replaceIdList.length > 0) {
                replace = true;
            }
        }
        handleParseCSV(filePath, res, replaceIdList, replace);
    }
    else {
        let msg = "No files exists.";
        console.log(`${new Date().toString().toString()} Upload - ${msg}`);
        res.status(500).send({
            message: msg
        });
    }

    function handleParseCSV(filePath, res, replaceIdList, replace) {
        if (filePath && filePath.length > 0) {
            fs.readFile(filePath, { encoding: 'utf-8' }, function (err, csvData) {
                if (err) {
                    let msg = `Read file failed: ${err}`;
                    console.log(`${new Date().toString().toString()} handleParseCSV - ${msg}`);
                    res.status(500).send({
                        message: msg
                    });
                }
                else {
                    csvParser(csvData, { delimiter: ',' }, async function (err, data) {
                        if (err) {
                            let msg = `Parse CSV failed: ${err}`;
                            console.log(`${new Date().toString().toString()} handleParseCSV - ${msg}`);
                            res.status(500).send({
                                message: msg
                            });
                        }
                        else {
                            console.log(`${new Date().toString().toString()} handleParseCSV - Paese CSV succeed.`);
                            console.log(data);
                            await ProcessCSV(data, replaceIdList, replace);
                        }
                    });
                }
            });
        }
        else {
            let msg = "File Path is invalid.";
            console.log(`${new Date().toString().toString()} handleParserCSV - ${msg}`);
            res.status(500).send({
                message: msg
            });
        }

        async function ProcessCSV(data, replaceIdList, replace) {
            if (data.length > 0) {
                let header = data.shift();
                let succeedId = "";
                let errorId = "";
                let existId = [];
                let msg = "";

                // Comparing csv header makes sure it's right csv file.
                if (common.equar(header, config.chipSeqHeader)) {
                    const promise = data.map(async (element) => {
                        let ID = element[0] + element[1] + element[2];

                        if (replace) {
                            if (replaceIdList.includes(ID)) {
                                console.log(`${new Date().toString().toString()} handleParserCSV - update Id : ${ID}`)
                                let res = await handleSingleData(element);
                                console.log(`${new Date().toString().toString()} handleParseCSV - result flag: ${res.flag}`);
                                return { res: res, ID: ID };
                            }
                        }
                        else {
                            let res = await handleSingleData(element);
                            console.log(`${new Date().toString().toString()} handleParseCSV - result flag: ${res.flag}`);
                            return { res: res, ID: ID };
                        }
                    });

                    const results = await Promise.all(promise);

                    console.log(`${new Date().toString().toString()} handleParseCSV - Processing CSV finished.`);

                    // group succeed and failed IDs
                    results.forEach( item => {
                        if (item && item.res) {
                            if (item.res.flag) {
                                succeedId += item.ID + ", ";
                            }
                            else {
                                if(item.res.exist) {
                                    existId.push(item.ID);
                                }
                                else {
                                    errorId += `ChipSeq unique ID: ${item.ID} - reason: ${item.res.msg}, `;
                                }     
                            }
                        }
                    })

                    if (succeedId.trim().length > 0) {
                        succeedId.slice(0, succeedId.length - 2);
                        msg += `Successful create or update id: ${succeedId}.`;
                    }
                    if (errorId.trim().length > 0) {
                        errorId.slice(0, errorId.length - 2);
                        msg += `Failed Ids with reason: ${errorId}`;
                    }
                    if (existId.length > 0) {
                        msg += `Existed Ids: ${existId.toString()}`;
                    }

                    console.log(`${new Date().toString().toString()} handleParseCSV - Proessed result: ${msg}`);
                    if (existId.length > 0) {
                        res.send({
                            message: msg,
                            existId: existId
                        });
                    }
                    else {
                        res.send({
                            message: msg
                        });
                    }
                }
                else {
                    let msg = "CSV header is wrong, please double check!";
                    console.log(`${new Date().toString().toString()} handlerParseCSV - ${msg}`);
                    res.status(500).send({
                        message: msg
                    });
                }
            }
            else {
                let msg = "File is empty";
                console.log(`${new Date().toString().toString()} handlerParseCSV - ${msg}`);
                res.status(500).send({
                    message: msg
                });
            }
        }

        async function handleSingleData(element) {
            let flag;
            let uniqueID_inventory = element[0] + element[1];
            let uniqueID_chipSeq = element[0] + element[1] + element[2];
            let condition = { uniqueID: { [Op.eq]: uniqueID_chipSeq } };

            console.log(`${new Date().toString().toString()} handleSingleData - Matching chipSeqData start.`);
            let chipSeqData;
            try {
                chipSeqData = await ChipSeq.findAll({ where: condition });
            }
            catch(ex) {
                return { flag: false, msg: ex.message.toString()}
            }
            console.log(`${new Date().toString().toString()} handleSingleData - Matching chipSeqData end.`);

            if (chipSeqData.length > 0) {
                // record already exists, update the existing one
                if (!replace) {
                    return { flag: false, exist: true}
                }
                else {
                    flag = await handleUpdateRecord();
                }
            }
            else {
                flag = await handleCreateRecord(uniqueID_chipSeq);
            }

            return flag;

            async function handleUpdateRecord() {
                let chipSeqItem = chipSeqData[0].dataValues;
                console.log(`${new Date().toString().toString()} handleUpdateRecord - chipSeqData matched - id: ${chipSeqItem.id}.`);
                console.log(chipSeqItem);

                let chipSeqID = chipSeqItem.id;
                chipSeqItem.techRep = element[2];
                chipSeqItem.rawRead = element[3];
                chipSeqItem.mappedValue = element[4];
                chipSeqItem.mappedPercent = element[5];
                chipSeqItem.uniqueMappedValue = element[6];
                chipSeqItem.uniquePercent = element[7];
                chipSeqItem.PBC = element[8];
                chipSeqItem.NRF = element[9];
                chipSeqItem.NSC = element[10];
                chipSeqItem.RSC = element[11];

                try {
                    await ChipSeq.update(chipSeqItem, { where: { id: chipSeqID } });
                }
                catch(ex) {
                    return { flag: false, msg: ex.message.toString()}
                }

                return { flag: true };
            }

            async function handleCreateRecord(uniqueID) {
                /* record doesn't exist, create the record
                    1. fetch the Lab with condition. 
                        1) if it exists, pass to step 2.
                        2) if it doesn't exist, return no lab exist error.
                    2. fetch the inventory with condition.
                        1) if it exist, link the inventory id and create a chipSeq data
                        2) if it doesn't exist, return no inventory exist error.
                */
                console.log(`${new Date().toString().toString()} handleCreateRecord - chipSeqData doesn't match, will create one.`);
                let condition = { code: { [Op.eq]: element[0] } };
                let labData;

                console.log(`${new Date().toString().toString()} handleCreateRecord - Matching lab data start.`);
                try {
                    labData = await Lab.findAll({ where: condition });
                }
                catch(ex) {
                    return { flag: false, msg: ex.message.toString()}
                }
                console.log(`${new Date().toString().toString()} handleCreateRecord - Matching lab data end.`);

                if (labData.length > 0) {
                    // lab exists
                    console.log(`${new Date().toString().toString()} handleCreateRecord - lab record matched`);
                    console.log(labData[0]);
                    let condition = { uniqueID: { [Op.eq]: uniqueID_inventory } };
                    let inventoryData;

                    console.log(`${new Date().toString().toString()} handleCreateRecord - Matching inventory data start.`);
                    try {
                        inventoryData = await Inventory.findAll({ where: condition });
                    }
                    catch(ex) {
                        return { flag: false, msg: ex.message.toString()}
                    }
                    console.log(`${new Date().toString().toString()} handleCreateRecord - Matching inventory data end.`);

                    if (inventoryData.length > 0) {
                        // inventory exists
                        let inventoryID = inventoryData[0].dataValues.id;
                        console.log(`${new Date().toString().toString()} handleCreateRecord - inventory record matched - id: ${inventoryID}.`);

                        let chipSeqItem = {
                            inventoryID: inventoryID,
                            techRep: element[2],
                            rawRead: element[3],
                            mappedValue: element[4],
                            mappedPercent: element[5],
                            uniqueMappedValue: element[6],
                            uniquePercent: element[7],
                            PBC: element[8],
                            NRF: element[9],
                            NSC: element[10],
                            RSC: element[11],
                            uniqueID: uniqueID
                        };

                        console.log(`${new Date().toString().toString()} handleCreateRecord - Creating chipSeq record into DB start.`);
                        try {
                            await ChipSeq.create(chipSeqItem);
                        }
                        catch(ex) {
                            return { flag: false, msg: ex.message.toString()}
                        }
                        console.log(`${new Date().toString().toString()} handleCreateRecord - Creating chipSeq record into DB end.`);
                        
                        return { flag: true};
                    }
                    else {
                        let msg = `Lab and SampleID doesn't match inventory table, please double check! Inventory ID: ${uniqueID_inventory}.`;
                        console.log(`${new Date().toString().toString()} handleCreateRecord - ${msg}`);
                        
                        return { flag: false, msg: msg};
                    }
                }
                else {
                    let msg = `Lab doesn't match, please double check. Lab Code: ${element[0]}`;
                    console.log(`${new Date().toString().toString()} handleCreateRecord - ${msg}`);
                    
                    return { flag: false, msg: msg};
                }
            }
        }
    }
};
