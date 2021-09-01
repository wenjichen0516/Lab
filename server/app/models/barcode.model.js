module.exports = (sequelize, Sequelize) => {
    const Barcode = sequelize.define("barcode", {
        barcode: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING,
            unique: true
        }
    });

    return Barcode;
}