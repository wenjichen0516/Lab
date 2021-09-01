module.exports = (sequelize, Sequelize) => {
    const Strain = sequelize.define("strain", {
        strain: {
            type: Sequelize.STRING,
            unique: true
        }
    });

    return Strain;
}