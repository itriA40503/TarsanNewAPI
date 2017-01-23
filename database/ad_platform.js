var Sequelize = require('sequelize'),
    http = require('http');
//#Connect database
var database = new Sequelize('ad_platform', 'postgres', '123456',{
        host:'52.193.77.171',
        dialect: 'postgres',
	logging: false,
	define:{
		timestamps: false
	}
	});

//#Testing connect database
database
  .authenticate()
  .then(function(err) {
    // connect_status = 'AD_platform - Connection has been established successfully.';
    // console.log('AD_platform - Connection has been established successfully.')
  })
  .catch(function (err) {
    // connect_status = 'AD_platform - Unable to connect to the database:'+err;
    console.log('AD_platform - Unable to connect to the database:', err);
  });

module.exports = database;
