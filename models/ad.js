/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ad', {
    ad_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ad_group: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    keywords: {
      type: DataTypes.STRING,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shown_times: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: "0"
    },
    clicked_times: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: "0"
    },
    closed_times: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    weight: {
      type: "REAL",
      allowNull: false
    },
    expire_date_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    created_date_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    expired_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    deleted_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    tableName: 'ad'
  });
};
