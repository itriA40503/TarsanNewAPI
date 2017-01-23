/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('budgetpool', {
    budget_id: {
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
    budget_num: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    budget_unit: {
      type: DataTypes.STRING,
      allowNull: true
    },
    budget_count: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    budget_total: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    createdate: {
      type: DataTypes.TIME,
      allowNull: true
    },
    updatetime: {
      type: DataTypes.TIME,
      allowNull: true
    }
  }, {
    tableName: 'budgetpool'
  });
};
