/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('platform_group', {
    group_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    auth: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'platform_group'
  });
};
