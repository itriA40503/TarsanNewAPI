/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('patterm2js', {
    pattern2js_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    pattern_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'web_pattern',
        key: 'pattern_id'
      }
    },
    available_js_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'available_js',
        key: 'available_js_id'
      }
    },
    create_datetime: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    tableName: 'patterm2js'
  });
};
