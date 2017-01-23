/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ad_keyword', {
    keyword_id: {
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
    keyword: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'ad_keyword'
  });
};
