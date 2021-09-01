module.exports = (sequelize, Sequelize) => {
    const Species = sequelize.define("species", {
        code: {
            type: Sequelize.STRING,
            unique: true
        },
        name: {
            type: Sequelize.STRING
        }
    });

    return Species;
}