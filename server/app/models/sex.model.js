module.exports = (sequelize, Sequelize) => {
    const Sex = sequelize.define("sex", {
        sex: {
            type: Sequelize.STRING,
            unique: true
        }
    });

    return Sex;
}