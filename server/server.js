const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("morgan");

const app = express();

// enable CORS
app.use(cors());

// set up logger
app.use(logger("dev"));

// parse requests of content type - application/json
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

const db = require("./app/models/sequelize.js");
db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to Lab application."});
});

// API
require("./app/routes/sex.routes.js")(app);
require("./app/routes/antibody.routes.js")(app);
require("./app/routes/assayType.routes.js")(app);
require("./app/routes/barcode.routes.js")(app);
require("./app/routes/cellLine.routes.js")(app);
require("./app/routes/lab.routes.js")(app);
require("./app/routes/condition.routes.js")(app);
require("./app/routes/factory.routes.js")(app);
require("./app/routes/individual.routes.js")(app);
require("./app/routes/tissueProcessing.routes.js")(app);
require("./app/routes/tissue.routes.js")(app);
require("./app/routes/strain.routes.js")(app);
require("./app/routes/species.routes.js")(app);
require("./app/routes/inventory.routes.js")(app);
require("./app/routes/chipSeq.routes.js")(app);

// set port, listen for reuqests
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})