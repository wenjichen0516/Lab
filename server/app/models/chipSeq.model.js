module.exports = (sequelize, Sequelize) => {
    const ChipSeq = sequelize.define("chiqSeq", {
        inventoryID: {
            type: Sequelize.INTEGER,
            references: {
                model: 'inventories',
                key: 'id'
            }
        },
        rawRead: {
            type: Sequelize.STRING
        },
        mappedValue: {
            type: Sequelize.STRING
        },
        mappedPercent: {
            type: Sequelize.STRING
        },
        uniqueMappedValue: {
            type: Sequelize.STRING
        },
        uniquePercent: {
            type: Sequelize.STRING
        },
        PBC: {
            type: Sequelize.STRING
        },
        NRF: {
            type: Sequelize.STRING
        },
        NSC: {
            type: Sequelize.STRING
        },
        RSC: {
            type: Sequelize.STRING
        },
        peaks: {
            type: Sequelize.STRING
        },
        frip: {
            type: Sequelize.STRING
        },
        techRep: {
            type: Sequelize.STRING
        },
        uniqueID: {
            type: Sequelize.STRING,
            unique: true
        }

    });

    return ChipSeq;
}