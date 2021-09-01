module.exports = (sequelize, Sequelize) => {
    const Individual = sequelize.define("individual", {
        individual: {
            type: Sequelize.STRING,
            unique: true
        }
    });

    return Individual;
}