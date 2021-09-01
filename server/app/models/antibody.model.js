module.exports = (sequelize, Sequelize) => {
    const Antibody = sequelize.define("antibody", {
        antibody: {
            type: Sequelize.STRING,
            unique: true
        }
    });

    return Antibody;
}