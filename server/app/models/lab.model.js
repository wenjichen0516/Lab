module.exports = (sequelize, Sequelize) => {
    const Lab = sequelize.define("lab", {
        code: {
            type: Sequelize.STRING,
            unique: true
        },
        piName: {
            type: Sequelize.STRING
        }
    });

    return Lab;
}