/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('web_type', {
    web_type_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    remarks: {
      type: DataTypes.CHAR,
      allowNull: true
    }
  }, {
    tableName: 'web_type'
  });
};
