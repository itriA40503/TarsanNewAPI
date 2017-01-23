/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ad', {
    ad_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'platform_user',
        key: 'user_id'
      }
    },
    owner_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'ad_owner',
        key: 'owner_id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    class: {
      type: DataTypes.STRING,
      allowNull: true
    },
    size: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_keyword_enable: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    url_href: {
      type: DataTypes.STRING,
      allowNull: true
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true
    },
    device: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    showtimes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    clicktimes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_closed: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    create_datetime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    start_datetime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_datetime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    lastupdateuser: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    update_datetime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'ad'
  });
};
