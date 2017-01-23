/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('budgetlog', {
    budgetlog_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    budget_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'budgetpool',
        key: 'budget_id'
      }
    },
    budget_total: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    counting: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdate: {
      type: DataTypes.TIME,
      allowNull: true
    }
  }, {
    tableName: 'budgetlog'
  });
};
