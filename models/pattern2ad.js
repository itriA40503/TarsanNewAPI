/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pattern2ad', {
    pattern2ad_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    pattern_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'pattern',
        key: 'pattern_id'
      }
    },
    ad_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'ad',
        key: 'ad_id'
      }
    }
  }, {
    tableName: 'pattern2ad'
  });
};
