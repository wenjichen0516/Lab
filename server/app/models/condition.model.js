module.exports = (sequelize, Sequelize) => {
    const Condition = sequelize.define("condition", {
        conditionName: {
            type: Sequelize.STRING,
            unique: true
        }
    });

    return Condition;
}