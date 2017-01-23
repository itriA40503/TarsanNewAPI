/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vacantad', {
    vacant_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    exuser_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'exuser',
        key: 'exuser_id'
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    size: {
      type: DataTypes.STRING,
      allowNull: true
    },
    position: {
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
    display: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    createdate: {
      type: DataTypes.TIME,
      allowNull: false
    },
    updatetime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    del: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    tableName: 'vacantad'
  });
};
