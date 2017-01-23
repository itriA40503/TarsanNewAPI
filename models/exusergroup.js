/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('exusergroup', {
    group_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'exusergroup'
  });
};
