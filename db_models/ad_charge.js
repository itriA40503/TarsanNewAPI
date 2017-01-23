/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ad_charge', {
    ad_charge_id: {
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
    showtimes_limit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    clicktimes_limit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    charge_unit: {
      type: DataTypes.STRING,
      allowNull: true
    },
    charge_num: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'ad_charge'
  });
};
