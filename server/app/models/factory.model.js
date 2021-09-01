module.exports = (sequelize, Sequelize) => {
    const Factory = sequelize.define("factory", {
        factory: {
            type: Sequelize.STRING,
            unique: true
        },
        color: {
            type: Sequelize.STRING
        }
    });

    return Factory;
}