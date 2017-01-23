/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('buyad2loc', {
    ad2loc_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    buyad_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'buyad',
        key: 'buyad_id'
      }
    },
    loc_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'location',
        key: 'loc_id'
      }
    }
  }, {
    tableName: 'buyad2loc'
  });
};
