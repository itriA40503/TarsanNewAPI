/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('runad', {
    runad_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    postad_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    buyad_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    keywords: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true
    },
    size: {
      type: DataTypes.STRING,
      allowNull: true
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    startdate: {
      type: DataTypes.TIME,
      allowNull: true
    },
    enddate: {
      type: DataTypes.TIME,
      allowNull: true
    },
    intervaltime: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdate: {
      type: DataTypes.TIME,
      allowNull: true
    },
    updatetime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    close: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    tableName: 'runad'
  });
};
