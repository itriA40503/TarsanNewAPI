/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pattern_type', {
    pattern_type_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'pattern_type'
  });
};
