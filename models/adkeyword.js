/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('adkeyword', {
    adk_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    buyad_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'buyad',
        key: 'buyad_id'
      }
    },
    ad_keyword: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'adkeyword'
  });
};
