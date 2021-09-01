module.exports = (sequelize, Sequelize) => {
    const CellLine = sequelize.define("cellLine", {
        cellLine: {
            type: Sequelize.STRING,
            unique: true
        }
    });

    return CellLine;
}