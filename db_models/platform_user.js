/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('platform_user', {
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    profile_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'platform_profile',
        key: 'profile_id'
      }
    },
    group_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'platform_group',
        key: 'group_id'
      }
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    account: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    create_datetime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    delete_datetime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    lastlogin_datetime: {
      type: DataTypes.TIME,
      allowNull: true
    }
  }, {
    tableName: 'platform_user'
  });
};
