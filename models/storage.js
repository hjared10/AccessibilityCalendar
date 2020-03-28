module.exports = function(sequelize, DataTypes) {
    var event = sequelize.define("Storage", {
      id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      text:DataTypes.STRING,
      rec_type:DataTypes.STRING,
      event_pid: DataTypes.INTEGER,
      event_length: DataTypes.INTEGER,
    });
    return event;
  };