/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    users_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    account: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deleted_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    tempkey: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_active_date_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    created_date_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'users'
  });
};
