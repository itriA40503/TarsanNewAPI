/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pattern', {
    pattern_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    url_host: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    signature: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pattern_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: "1"
    },
    web_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: "99"
    },
    created_date_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    last_access: {
      type: DataTypes.TIME,
      allowNull: true
    },
    expired_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    deleted_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    confirmed_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    tableName: 'pattern'
  });
};
