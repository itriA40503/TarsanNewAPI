/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('barcode', {
    barcode_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    shop: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'barcode'
  });
};
