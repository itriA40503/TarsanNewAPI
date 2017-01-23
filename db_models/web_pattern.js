/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('web_pattern', {
    pattern_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: true
    },
    regex: {
      type: DataTypes.STRING,
      allowNull: true
    },
    class: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_enable: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true
    },
    create_datetime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    update_datetime: {
      type: DataTypes.TIME,
      allowNull: true
    }
  }, {
    tableName: 'web_pattern'
  });
};
