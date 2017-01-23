/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ad_show', {
    show_id: {
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
    show_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    show_class: {
      type: DataTypes.STRING,
      allowNull: true
    },
    show_sp: {
      type: DataTypes.STRING,
      allowNull: true
    },
    show_time: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    create_datetime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    update_datetime: {
      type: DataTypes.TIME,
      allowNull: true
    }
  }, {
    tableName: 'ad_show'
  });
};
