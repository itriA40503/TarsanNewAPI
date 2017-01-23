/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userevent', {
    userevent_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    search_keyword: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_date_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    url_host: {
      type: DataTypes.STRING,
      allowNull: true
    },
    url_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    session_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    product_search_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    url_referer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    users_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'users_id'
      }
    },
    pattern_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'pattern',
        key: 'pattern_id'
      }
    },
    parent_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    root_id: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    tableName: 'userevent'
  });
};
