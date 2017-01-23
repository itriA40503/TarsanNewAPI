/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('record', {
    barcode_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    users_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'users_id'
      }
    },
    record_date_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    coordinate_x: {
      type: DataTypes.STRING,
      allowNull: true
    },
    coordinate_y: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'record'
  });
};
