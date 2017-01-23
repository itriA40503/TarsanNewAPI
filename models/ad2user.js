/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ad2user', {
    ad2user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ad_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'ad',
        key: 'ad_id'
      }
    },
    users_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'users_id'
      }
    },
    clicked_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    closed_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: true
    },
    created_date_time: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    tableName: 'ad2user'
  });
};
