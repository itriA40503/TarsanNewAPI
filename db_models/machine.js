/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('machine', {
    machine_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mac_addr: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    landing_page: {
      type: DataTypes.STRING,
      allowNull: true
    },
    session_time: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ad_prob: {
      type: "REAL",
      allowNull: true
    },
    temp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true
    },
    create_datetime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    update_datetime: {
      type: DataTypes.TIME,
      allowNull: true
    }
  }, {
    tableName: 'machine'
  });
};
