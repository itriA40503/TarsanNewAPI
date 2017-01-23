/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('buyad', {
    buyad_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    vacant_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'vacantad',
        key: 'vacant_id'
      }
    },
    exuser_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'exuser',
        key: 'exuser_id'
      }
    },
    postad_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    content: {
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
    price: {
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
    posted: {
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
    tableName: 'buyad'
  });
};
