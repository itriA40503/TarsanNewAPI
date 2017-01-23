/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('platform_profile', {
    profile_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.CHAR,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    create_datetime: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    tableName: 'platform_profile'
  });
};
