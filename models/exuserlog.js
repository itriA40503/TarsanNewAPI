/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('exuserlog', {
    log_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    exuser_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'exuser',
        key: 'exuser_id'
      }
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    activity: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdate: {
      type: DataTypes.TIME,
      allowNull: true
    }
  }, {
    tableName: 'exuserlog'
  });
};
