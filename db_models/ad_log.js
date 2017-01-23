/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ad_log', {
    lod_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ad_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'ad',
        key: 'ad_id'
      }
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    keyword: {
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
    ip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_show: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    is_click: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    hashkey: {
      type: DataTypes.STRING,
      allowNull: true
    },
    machine_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    create_datetime: {
      type: DataTypes.TIME,
      allowNull: true
    }
  }, {
    tableName: 'ad_log'
  });
};
