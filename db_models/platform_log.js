/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('platform_log', {
    log_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'platform_user',
        key: 'user_id'
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
    create_datetime: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    tableName: 'platform_log'
  });
};
