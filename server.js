const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const routes = require("./routes/html-routes.js");
const mysqlconfig = require("./config/connection.js");

const util = require("util");
const mysql = require('mysql');

const helmet = require("helmet");
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));

// you'll need these headers if your API is deployed on a different domain than a public page
// in production system you could set Access-Control-Allow-Origin to your domains
// or drop this expression - by default CORS security is turned on in browsers
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "*");
	next();
});

// return static pages from "./public" directory
app.use(express.static(__dirname + "/public"));



// open connection to mysql
const connectionPool = mysql.createPool(mysqlconfig);
connectionPool.query = util.promisify(connectionPool.query);

// add listeners to basic CRUD requests
const Storage = require("./models/storage.js");
const eventsStorage = new Storage(connectionPool);
routes.setRoutes(app, "/events", eventsStorage);

// add listeners to basic CRUD with recurring events support
const RecurringStorage = require("./models/storage_recurring");
const recurringEventsStorage = new RecurringStorage(connectionPool);
routes.setRoutes(app, "/recurring_events", recurringEventsStorage)

// start server
app.listen(port, () => {
	console.log("Server is running on port " + port + "...");
});