/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('location', {
    loc_id: {
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
    house: {
      type: DataTypes.STRING,
      allowNull: true
    },
    floor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    zone: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'location'
  });
};
