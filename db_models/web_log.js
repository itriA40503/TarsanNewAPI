/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('web_log', {
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
    keyword: {
      type: DataTypes.STRING,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: true
    },
    referer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    show_ad: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    machine: {
      type: DataTypes.STRING,
      allowNull: true
    },
    session: {
      type: DataTypes.STRING,
      allowNull: true
    },
    create_datetime: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    tableName: 'web_log'
  });
};
