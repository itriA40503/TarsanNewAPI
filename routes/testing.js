var express = require('express');
var router = express.Router();
var moment = require('moment');
var Sequelize = require('sequelize'),
    http = require('http');
var ad_platform = require('../database/ad_platform');

//#Connect database
var database = new Sequelize('ad_platform', 'postgres', '123456',{
        host:'52.193.77.171',
        dialect: 'postgres',
	logging: false,
	define:{
		timestamps: false
	}
	});
var connect_status;
//#Testing connect database
database
  .authenticate()
  .then(function(err) {
    connect_status = 'AD_platform - Connection has been established successfully.';
    // console.log('AD_platform - Connection has been established successfully.')
  })
  .catch(function (err) {
    connect_status = 'AD_platform - Unable to connect to the database:'+err;
    // console.log('Unable to connect to the database:', err);
  });

//#Define
var machine = database.import("../db_models/machine.js");
var webLog = database.import("../db_models/web_log.js");
var ad_keyword = ad_platform.import("../db_models/ad_keyword.js");
//#Print log
var log= function(inst){
	console.dir(inst.get());
}


router.get('/:kw',function(req,res){
  let info = {};
  //# get client ip address
  var ip = (req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress).split(",")[0];
  ip = ip.replace(/::ffff:/g, "");
  info.ip =  ip;
  // console.log(req.headers.accept);
  // console.log(req.accepts('*/*'));
  // msg.headers = req.headers;
  // msg.content_type = req.accepts('Application/json');
  //# check "Application/json"
  if((req.accepts('*/*')== false)&&(req.accepts('Application/json')!=false)){  
    info.kw = req.params.kw;
    console.log(info.kw);
    ad_keyword.findAll({
      where:{      
            keyword : info.kw
          }
    }).then(function(re){
      res.json(re);
    });
       
  }else{
    console.log("Not Application/json");
    res.send('<img src="http://tarsanad.ddns.net:9527/images/calmingcatsmall.gif">');
  }
    
});

router.get('/',function(req,res){
  let info = {};
	console.log(req.headers.accept);
  console.log(req.accepts('*/*'));
  console.log(moment("2017-02-05").day());
  // msg.headers = req.headers;
  info.content_type = req.accepts('Application/json');
  if((req.accepts('*/*')== false)&&(req.accepts('Application/json')!=false)){  
    res.json({info});
  }else{
    res.send('<img src="http://tarsanad.ddns.net:9527/images/calmingcatsmall.gif">');
  }
  	
});




module.exports = router;
