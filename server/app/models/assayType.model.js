module.exports = (sequelize, Sequelize) => {
    const AssayType = sequelize.define("assayType", {
        assayType: {
            type: Sequelize.STRING,
            unique: true
        }
    });

    return AssayType;
}