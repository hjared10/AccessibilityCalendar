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
	"host": "j1r4n2ztuwm0bhh5.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
	"user": "	p8xo2kpzw1t8y5tb",
	"password": "eb6iqsopc43lzi4m",
	"database": "fp0ek73mpnh14exz"
};

module.exports = mysqlconfig;