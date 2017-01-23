/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('postad', {
    postad_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    buyad_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'buyad',
        key: 'buyad_id'
      }
    },
    showtimes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    clicktimes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    close: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    createdate: {
      type: DataTypes.TIME,
      allowNull: false
    },
    updatetime: {
      type: DataTypes.TIME,
      allowNull: true
    }
  }, {
    tableName: 'postad'
  });
};
