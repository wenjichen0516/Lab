const db = require("../models/sequelize.js");
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
const Op = db.Sequelize.Op;

// Create and Save a new Inventory data
exports.create = (req, res) => {
    // create a Inventory data
    const inventory = {
        labID: req.body.labID,
        sampleID: req.body.sampleID,
        uniqueID: req.body.lab + req.body.sampleID,
        assayTypeID: req.body.assayTypeID,
        experiment: req.body.experiment,
        speciesID: req.body.speciesID,
        strainID: req.body.strainID,
        tissueID: req.body.tissueID,
        cellLineID: req.body.cellLineID,
        tissueProcessingID: req.body.tissueProID,
        individualID: req.body.individualID,
        sexID: req.body.sexID,
        factoryID: req.body.factoryID,
        antibodyID: req.body.antibodyID,
        conditionID: req.body.conditionID,
        barcodeID: req.body.barcodeID
    }

    // Save it in the db
    Inventory.create(inventory)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Inventory ."
            });
        })
};

// Retrieve all inventory data from the database
exports.findAll = (req, res) => {
    Inventory.findAll({
        include: [Lab, Sex, AssayType, Species, Strain, Tissue, CellLine, TissuePro, Individual,
            Factory, Antibody, Condition, Barcode],
        required: true
    })
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

// Retrieve all inventory data with condition from the database
exports.findByCondition = (uniqueID) => {
    let condition = { uniqueID: { [Op.eq]: uniqueID } };

    Inventory.findAll({ where: condition })
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

// Find a single Inventory data with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Inventory.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Inventory with id=" + id
            });
        });
};

// Update an Inventory data with the specified id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Inventory.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Inventory was updated successfully."
                });
            }
            else {
                res.send({
                    message: `Cannot update Inventory with id=${id}.`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Inventory with id=" + id
            });
        });
};

// Delete an Inventory data with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Inventory.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Inventory was deleted successfully."
                });
            }
            else {
                res.send({
                    message: `Cannot delete Inventory with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error deleting Inventory with id=" + id
            });
        });
};

// Delete all inventory data from the database
exports.deleteAll = (req, res) => {
    Inventory.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({
                message: `${nums} inventory were deleted successfully!`
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting all inventory."
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
        handlerParseCSV(filePath, res, replaceIdList, replace);
    }
    else {
        let msg = "No files exists.";
        console.log("Upload - " + msg);
        res.status(500).send({
            message: msg
        });
    }

    function handlerParseCSV(filePath, res, replaceIdList, replace) {
        if (filePath && filePath.length > 0) {
            fs.readFile(filePath, { encoding: 'utf-8' }, function (err, csvData) {
                if (err) {
                    let msg = `Read file failed: ${err}`;
                    console.log(`${new Date().toString().toString()} handlerParseCSV - ${msg}`);
                    res.status(500).send({
                        message: msg
                    });
                }
                else {
                    csvParser(csvData, { delimiter: ',' }, async function (err, data) {
                        if (err) {
                            let msg = `Parse CSV failed: ${err}`;
                            console.log(`${new Date().toString().toString()} handlerParseCSV - ${msg}`);
                            res.status(500).send({
                                message: msg
                            });
                        }
                        else {
                            console.log(`${new Date().toString().toString()} handlerParseCSV - Paese CSV succeed.`);
                            console.log(data);
                            await ProcessCSV(data, replaceIdList, replace);
                        }
                    });
                }
            });
        }
        else {
            let msg = "File Path is invalid.";
            console.log(msg);
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
                if (common.equar(header, config.inventoryHeader)) {
                    const promise = data.map(async (element) => {
                        let ID = element[0] + element[1];

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
                    results.forEach(item => {
                        console.log(`${new Date().toString().toString()} handleParseCSV - Group item: ${item}`);
                        if (item && item.res) {
                            if (item.res.flag) {
                                succeedId += item.ID + ", ";
                            }
                            else {
                                if(item.res.exist) {
                                    existId.push(item.ID);
                                }
                                else {
                                    errorId += `Inventory unique ID: ${item.ID} - reason: ${item.res.msg}, `;
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
            let flag, update = false,
                uniqueID_inventory = element[0] + element[1],
                condition = { uniqueID: { [Op.eq]: uniqueID_inventory } };

            console.log(`${new Date().toString().toString()} handleSingleData - Matching inventoryData start.`);
            let inventoryData = await Inventory.findAll({ where: condition });
            console.log(`${new Date().toString().toString()} handleSingleData - Matching inventoryData end.`);

            if (inventoryData.length > 0) {
                // record already exists and need overwrite, update the existing one
                // else return recore exist
                update = true;

                if (!replace) {
                    return { flag: false, exist: true }
                }
            }

            flag = await handleCreateOrUpdateRecord(update);

            return flag;

            async function handleCreateOrUpdateRecord(update = false) {
                /* Matching all info of Inventory data
                    If all matched, update it, else return failed and reason
                */
                let inventoryID,labID, assayTypeID, speciesID, strainID, tissueID, cellLineID, 
                    tissueProID,individualID, sexID, factoryID, antibodyID, conditionID, barcodeID,
                    inventoryItem;

                if (update) {
                    inventoryItem = inventoryData[0].dataValues;
                    inventoryID = inventoryItem.id;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - inventoryData matched - id: ${inventoryID}.`);
                    console.log(inventoryItem);
                }

                //#region check lab
                let labCondition = { code: { [Op.eq]: element[0] } };
                let labData;
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching lab data start.`);
                try {
                    labData = await Lab.findAll({ where: labCondition });
                }
                catch(ex) {
                    return { flag: false, msg: ex.message.toString()}
                }
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching lab data end.`);

                if (labData.length > 0) {
                    // lab exists
                    labID = labData[0].id;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - lab record existed, Id: ${labID}`);
                }
                else {
                    let msg = `Lab doesn't match, please double check. Lab Code: ${element[0]}.`;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - ${msg}`);

                    return { flag: false, msg: msg };
                }
                //#endregion

                //#region check assayType
                let assayTypeCondition = { assayType: { [Op.eq]: element[2] } };
                let assayTypeData;
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Assay Type data start.`);
                try {
                    assayTypeData = await AssayType.findAll({ where: assayTypeCondition });
                }
                catch(ex) {
                    return { flag: false, msg: ex.message.toString()}
                }
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Assay Type data end.`);

                if (assayTypeData.length > 0) {
                    // assayType exists
                    assayTypeID = assayTypeData[0].id;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Assay Type record existed, Id: ${assayTypeID}`);
                }
                else {
                    let msg = `Assay Type doesn't match, please double check. Assay Type: ${element[2]}.`;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - ${msg}`);

                    return { flag: false, msg: msg };
                }
                //#endregion

                //#region check species
                let speciesCondition = { name: { [Op.eq]: element[4] } };
                let speciesData;
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Species data start.`);
                try {
                    speciesData = await Species.findAll({ where: speciesCondition });
                }
                catch(ex) {
                    return { flag: false, msg: ex.message.toString()}
                }
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Species data end.`);

                if (speciesData.length > 0) {
                    // species exists
                    speciesID = speciesData[0].id;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Species record existed, Id: ${speciesID}.`);
                }
                else {
                    let msg = `Species doesn't match, please double check. Species: ${element[4]}`;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - ${msg}`);

                    return { flag: false, msg: msg };
                }
                //#endregion

                //#region check strain
                let strainCondition = { strain: { [Op.eq]: element[5] } };
                let strainData;
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Strain data start.`);
                try {
                    strainData = await Strain.findAll({ where: strainCondition });
                }
                catch(ex) {
                    return { flag: false, msg: ex.message.toString()}
                }
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Strain data end.`);

                if (strainData.length > 0) {
                    // Strain exists
                    strainID = strainData[0].id;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Strain record existed, Id: ${strainID}.`);
                }
                else {
                    let msg = `Strain doesn't match, please double check. Strain: ${element[5]}`;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - ${msg}`);

                    return { flag: false, msg: msg };
                }
                //#endregion

                //#region check tissue
                let tissueCondition = { tissue: { [Op.eq]: element[6] } };
                let tissueData
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Tissue data start.`);
                try {
                tissueData = await Tissue.findAll({ where: tissueCondition });
                }
                catch(ex) {
                    return { flag: false, msg: ex.message.toString()}
                }
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Tissue data end.`);

                if (tissueData.length > 0) {
                    // Tissue exists
                    tissueID = tissueData[0].id;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Tissue record existed, Id: ${tissueID}`);
                }
                else {
                    let msg = `Tissue doesn't match, please double check. Tissue: ${element[6]}.`;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - ${msg}`);

                    return { flag: false, msg: msg };
                }
                //#endregion

                //#region check cell line
                let cellLineCondition = { cellLine: { [Op.eq]: element[7] } };
                let cellLineData;
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching CellLine data start.`);
                try {
                cellLineData = await CellLine.findAll({ where: cellLineCondition });
                }
                catch(ex) {
                    return { flag: false, msg: ex.message.toString()}
                }
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching CellLine data end.`);

                if (cellLineData.length > 0) {
                    // CellLine exists
                    cellLineID = cellLineData[0].id;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - CellLine record existed, ID: ${cellLineID}`);
                }
                else {
                    let msg = `CellLine doesn't match, please double check. CellLine: ${element[7]}.`;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - ${msg}`);

                    return { flag: false, msg: msg };
                }
                //#endregion

                //#region check tissue processing
                let tissueProCondition = { tissueProcessing: { [Op.eq]: element[8] } };
                let tissueProcessingData;
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Tissue Processing data start.`);
                try {
                    tissueProcessingData = await TissuePro.findAll({ where: tissueProCondition });
                }
                catch(ex) {
                    return { flag: false, msg: ex.message.toString()}
                }
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Tissue Processing data end.`);

                if (tissueProcessingData.length > 0) {
                    // tissueProcessing exists
                    tissueProID = tissueProcessingData[0].id;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Tissue Processing record existed, Id: ${tissueProID}`);
                }
                else {
                    let msg = `Tissue Processing doesn't match, please double check. Tissue Processing: ${element[8]}.`;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - ${msg}`);

                    return { flag: false, msg: msg };
                }
                //#endregion

                //#region check individual
                let individualCondition = { individual: { [Op.eq]: element[9] } };
                let individualData;
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Individual data start.`);
                try {
                    individualData = await Individual.findAll({ where: individualCondition });
                }
                catch(ex) {
                    return { flag: false, msg: ex.message.toString()}
                }
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Individual data end.`);

                if (individualData.length > 0) {
                    // individual exists
                    individualID = individualData[0].id;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Individual record existed, Id: ${individualID}`);
                }
                else {
                    let msg = `Individual doesn't match, please double check. Individual: ${element[9]}.`;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - ${msg}`);

                    return { flag: false, msg: msg };
                }
                //#endregion

                //#region check sex
                let sexCondition = { sex: { [Op.eq]: element[10] } };
                let sexData;
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Sex data start.`);
                try {
                sexData = await Sex.findAll({ where: sexCondition });
                }
                catch(ex) {
                    return { flag: false, msg: ex.message.toString()}
                }
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Sex data end.`);

                if (sexData.length > 0) {
                    // sex exists
                    sexID = sexData[0].id;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Sex record existed, Id: ${sexID}`);
                }
                else {
                    let msg = `Sex doesn't match, please double check. Sex: ${element[10]}`;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - ${msg}`);

                    return { flag: false, msg: msg };
                }
                //#endregion

                //#region check factory
                let factoryCondition = { factory: { [Op.eq]: element[11] } };
                let factoryData;
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Factory data start.`);
                try {
                    factoryData = await Factory.findAll({ where: factoryCondition });
                }
                catch(ex) {
                    return { flag: false, msg: ex.message.toString()}
                }
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Factorydata end.`);

                if (factoryData.length > 0) {
                    // Factory exists
                    factoryID = factoryData[0].id;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Factory record existed, Id: ${factoryID}`);
                }
                else {
                    let msg = `Factory doesn't match, please double check. Factory: ${element[11]}.`;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - ${msg}`);

                    return { flag: false, msg: msg };
                }
                //#endregion

                //#region check antibody
                let antibodyCondition = { antibody: { [Op.eq]: element[12] } };
                let antibodyData;
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Antibody data start.`);
                try {
                    antibodyData = await Antibody.findAll({ where: antibodyCondition });
                }
                catch(ex) {
                    return { flag: false, msg: ex.message.toString()}
                }
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Antibody data end.`);

                if (antibodyData.length > 0) {
                    // Antibody exists
                    antibodyID = antibodyData[0].id;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Antibody record existed, Id: ${antibodyID}`);
                }
                else {
                    let msg = `Antibody doesn't match, please double check. Antibody: ${element[12]}.`;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - ${msg}`);

                    return { flag: false, msg: msg };
                }
                //#endregion

                //#region check condition
                let conditionCondition = { conditionName: { [Op.eq]: element[13] } };
                let conditionData;
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Condition data start.`);
                try {
                conditionData = await Condition.findAll({ where: conditionCondition });
                }
                catch(ex) {
                    return { flag: false, msg: ex.message.toString()}
                }
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Condition data end.`);

                if (conditionData.length > 0) {
                    // Condition exists
                    conditionID = conditionData[0].id;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Condition record existed, Id: ${conditionID}`);
                }
                else {
                    let msg = `Condition doesn't match, please double check. Condition Name: ${element[13]}.`;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - ${msg}`);

                    return { flag: false, msg: msg };
                }
                //#endregion

                //#region check barcode
                let barcodeCondition = { type: { [Op.eq]: element[14] } };
                let barcodeData;
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Barcode data start.`);
                try {
                    barcodeData = await Barcode.findAll({ where: barcodeCondition });
                }
                catch(ex) {
                    return { flag: false, msg: ex.message.toString()}
                }
                console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Matching Barcode data end.`);

                if (barcodeData.length > 0) {
                    // Barcode exists
                    barcodeID = barcodeData[0].id;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Barcode record existed, Id: ${barcodeID}`);
                }
                else {
                    let msg = `Barcode doesn't match, please double check. Barcode: ${element[14]}.`;
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - ${msg}`);

                    return { flag: false, msg: msg };
                }
                //#endregion

                if (update) {
                    inventoryItem.labID = labID;
                    inventoryItem.sampleID = element[1];
                    inventoryItem.uniqueID = element[0] + element[1];
                    inventoryItem.assayTypeID = assayTypeID;
                    inventoryItem.experiment = element[3];
                    inventoryItem.speciesID = speciesID;
                    inventoryItem.strainID = strainID;
                    inventoryItem.tissueID = tissueID;
                    inventoryItem.cellLineID = cellLineID;
                    inventoryItem.tissueProcessingID = tissueProID;
                    inventoryItem.individualID = individualID;
                    inventoryItem.sexID = sexID;
                    inventoryItem.factoryID = factoryID;
                    inventoryItem.antibodyID = antibodyID;
                    inventoryItem.conditionID = conditionID;
                    inventoryItem.barcodeID = barcodeID;

                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Updating Inventory data start.`);
                    try {
                        await Inventory.update(inventoryItem, { where: { id: inventoryID } });
                    }
                    catch(ex) {
                        return { flag: false, msg: ex.message.toString()}
                    }
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Updating Inventory data end.`);
                }
                else {
                    const inventory = {
                        labID: labID,
                        sampleID: element[1],
                        uniqueID: element[0] + element[1],
                        assayTypeID: assayTypeID,
                        experiment: element[3],
                        speciesID: speciesID,
                        strainID: strainID,
                        tissueID: tissueID,
                        cellLineID: cellLineID,
                        tissueProcessingID: tissueProID,
                        individualID: individualID,
                        sexID: sexID,
                        factoryID: factoryID,
                        antibodyID: antibodyID,
                        conditionID: conditionID,
                        barcodeID: barcodeID
                    }

                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Creating Inventory data start.`);
                    try {
                        await Inventory.create(inventory);
                    }
                    catch (ex) {
                        return { flag: false, msg: ex.message.toString()}
                    }
                    console.log(`${new Date().toString().toString()} handleCreateOrUpdateRecord - Creating Inventory data start.`);
                }

                return { flag: true };
            }
        }
    }
};
