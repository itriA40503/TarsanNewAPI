/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('denykeyword', {
    dk_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    d_keyword: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'denykeyword'
  });
};
