var Sequelize = require('sequelize');
var fs = require('fs');
var path = require('path');
var basename = path.basename(module.filename);

module.exports = function(sequelize, dir, options) {
  var db = {};
  var adir = path.resolve(dir);

  fs.readdirSync(adir).filter(function(file) {
    return (file.indexOf('.') !== 0) && (options.exclude||[]).indexOf(file) === -1;
  }).forEach(function(file) {
    if (file.slice(-3) !== '.js') return;
    var model = sequelize['import'](path.join(adir, file));
    db[model.name] = model;
  });

  Object.keys(db).forEach(function(modelName) {
    if ('associate' in db[modelName]) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
};
