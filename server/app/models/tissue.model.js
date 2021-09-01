module.exports = (sequelize, Sequelize) => {
    const Tissue = sequelize.define("tissue", {
        tissue: {
            type: Sequelize.STRING,
            unique: true
        }
    });

    return Tissue;
}