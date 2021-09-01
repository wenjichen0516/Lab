module.exports = (sequelize, Sequelize) => {
    const TissueProcessing = sequelize.define("tissueProcessing", {
        tissueProcessing: {
            type: Sequelize.STRING,
            unique: true
        }
    });

    return TissueProcessing;
}