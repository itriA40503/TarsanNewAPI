/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('connect_log', {
    log_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    machine_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'machine',
        key: 'machine_id'
      }
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    device_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    os: {
      type: DataTypes.STRING,
      allowNull: true
    },
    browser: {
      type: DataTypes.STRING,
      allowNull: true
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mac_addr: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ssid: {
      type: DataTypes.STRING,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    create_datetime: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    tableName: 'connect_log'
  });
};
