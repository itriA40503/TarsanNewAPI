/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('price', {
    price_id: {
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
    price_num: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price_unit: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price_total: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'price'
  });
};
