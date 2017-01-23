/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('available_js', {
    available_js_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    js_content: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pic_avbl: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    code_avbl: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    url_avbl: {
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
    tableName: 'available_js'
  });
};
