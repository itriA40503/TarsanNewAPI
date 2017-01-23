/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('logad', {
    logad_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    postad_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'postad',
        key: 'postad_id'
      }
    },
    buyad_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      primaryKey: true
    },
    search_keyword: {
      type: DataTypes.STRING,
      allowNull: true
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: true
    },
    urlhost: {
      type: DataTypes.STRING,
      allowNull: true
    },
    urlreferer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    urlpath: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    show: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    click: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    createdate: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    tableName: 'logad'
  });
};
