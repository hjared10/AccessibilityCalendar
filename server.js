// Setup Express App dependencies
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Require models for syncing
var db = require("./models")

// Setup Express to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// return static pages from "./public" directory
app.use(express.static(__dirname + "/public"));

// Routes
const routes = require("./routes/api-routes.js");
app.use(routes)

// Sync sequelize models and start Express server
db.sequelize.sync({ force: true }).then(() => { // sync({ force: true}) clears all data
	app.listen(PORT, () => {
		console.log(`Server is running on ${PORT}...`)
	});
});