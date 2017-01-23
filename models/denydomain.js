/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('denydomain', {
    dd_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    d_domain: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'denydomain'
  });
};
