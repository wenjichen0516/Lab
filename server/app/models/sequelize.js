const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sex = require("./sex.model.js")(sequelize, Sequelize);
db.antibody = require("./antibody.model.js")(sequelize, Sequelize);
db.assayType = require("./assayType.model.js")(sequelize, Sequelize);
db.barcode = require("./barcode.model.js")(sequelize, Sequelize);
db.cellLine = require("./cellLine.model.js")(sequelize, Sequelize);
db.lab = require("./lab.model.js")(sequelize, Sequelize);
db.condition = require("./condition.model.js")(sequelize, Sequelize);
db.factory = require("./factory.model.js")(sequelize, Sequelize);
db.individual = require("./individual.model.js")(sequelize, Sequelize);
db.tissueProcessing = require("./tissueProcessing.model.js")(sequelize, Sequelize);
db.tissue = require("./tissue.model.js")(sequelize, Sequelize);
db.strain = require("./strain.model.js")(sequelize, Sequelize);
db.species = require("./species.model.js")(sequelize, Sequelize);
db.inventory = require("./inventory.model.js")(sequelize, Sequelize);
db.chipSeq = require("./chipSeq.model.js")(sequelize, Sequelize);

// Comment it out when creating the tables at the first time. Otherwist throw a dupliction error
db.inventory.belongsTo(db.lab);
db.inventory.belongsTo(db.sex);
db.inventory.belongsTo(db.antibody);
db.inventory.belongsTo(db.assayType);
db.inventory.belongsTo(db.barcode);
db.inventory.belongsTo(db.cellLine);
db.inventory.belongsTo(db.condition);
db.inventory.belongsTo(db.factory);
db.inventory.belongsTo(db.individual);
db.inventory.belongsTo(db.tissueProcessing);
db.inventory.belongsTo(db.tissue);
db.inventory.belongsTo(db.strain);
db.inventory.belongsTo(db.species);
db.chipSeq.belongsTo(db.inventory);

module.exports = db;