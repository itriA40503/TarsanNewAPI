/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('class', {
    class_id: {
      type: DataTypes.CHAR,
      allowNull: false,
      primaryKey: true
    },
    class_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'class'
  });
};
