var Sequelize = require("sequelize");

// Creates mySQL connection using Sequelize, the empty string in the third argument spot is our password.
var sequelize = new Sequelize("scheduler", "root", "password", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

module.exports = sequelize;

var mysqlconfig = {
	"connectionLimit": 10,
	"host": "localhost",
	"user": "root",
	"password": "password",
	"database": "scheduler"
};

module.exports = mysqlconfig;