module.exports = (sequelize, Sequelize) => {
    const Inventory = sequelize.define("inventory", {
        labID: {
            type: Sequelize.INTEGER,
            references: {
                model: 'labs',
                key: 'id'
            }
        },
        sampleID: {
            type: Sequelize.INTEGER
        },
        experiment: {
            type: Sequelize.STRING
        },
        uniqueID: {
            type: Sequelize.STRING,
            unique: true
        },
        assayTypeID: {
            type: Sequelize.INTEGER,
            references: {
                model: 'assayTypes',
                key: 'id'
            }
        },
        speciesID: {
            type: Sequelize.INTEGER,
            references: {
                model: 'species',
                key: 'id'
            }
        },
        strainID: {
            type: Sequelize.INTEGER,
            references: {
                model: 'strains',
                key: 'id'
            }
        },
        tissueID: {
            type: Sequelize.INTEGER,
            references: {
                model: 'tissues',
                key: 'id'
            }
        },
        cellLineID: {
            type: Sequelize.INTEGER,
            references: {
                model: 'cellLines',
                key: 'id'
            }
        },
        tissueProcessingID: {
            type: Sequelize.INTEGER,
            references: {
                model: 'tissueProcessings',
                key: 'id'
            }
        },
        individualID: {
            type: Sequelize.INTEGER,
            references: {
                model: 'individuals',
                key: 'id'
            }
        },
        sexID: {
            type: Sequelize.INTEGER,
            references: {
                model: 'sexes',
                key: 'id'
            }
        },
        factoryID: {
            type: Sequelize.INTEGER,
            references: {
                model: 'factories',
                key: 'id'
            }
        },
        antibodyID: {
            type: Sequelize.INTEGER,
            references: {
                model: 'antibodies',
                key: 'id'
            }
        },
        conditionID: {
            type: Sequelize.INTEGER,
            references: {
                model: 'conditions',
                key: 'id'
            }
        },
        barcodeID: {
            type: Sequelize.INTEGER,
            references: {
                model: 'barcodes',
                key: 'id'
            }
        }
    });

    return Inventory;
}