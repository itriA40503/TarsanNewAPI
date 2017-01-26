var express = require('express');
var router = express.Router();
var moment = require('moment');
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
//#Print log
var log= function(inst){
	console.dir(inst.get());
}


/*************************************************************
 * get MachineName By Mac_addr & login                       *
 *************************************************************/
router.get('/:mac',function(req,res){
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
    info.mac_addr = req.params.mac;  
    //# Check is mac address
    var re = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/;    
    if(!re.test(req.params.mac)){
      info.message = "This not MAC ADDRESS!";
      res.status(403).json(info);
    }else{
      info.mac_addr = info.mac_addr.replace(/:/g, "");;
      
      //#########
      //# find last id
      machine
      .findOne({
        attributes:['machine_id'],
        order: [['machine_id','DESC']]
      })
      .then(function(result){        
        machine
        .findOrCreate(
          { where:{mac_addr:info.mac_addr}, 
            defaults: {
              create_datetime: moment().format('YYYY-MM-DD hh:mm:ss'), 
              update_datetime:moment().format('YYYY-MM-DD hh:mm:ss'),
              name: 'tmp'+(parseInt(result.machine_id)+1)
            }
          }
        )
        .spread(function(machine, created){
          // console.log(machine.get({
          //     // plain: true
          //   }))
          info.machine_name = machine.name;
          if(created){
            info.message = "New Machine created!";
            console.log(info);
            res.json(info);
          }
            info.message = "Machine already have!";
            //# update machine update_datetime (login)
            machine
            .update(
            {
              update_datetime:moment().format('YYYY-MM-DD hh:mm:ss')
            },
            {
              where:{mac_addr:info.mac_addr},
              returning: true,
              plain: true              
            })
            console.log(info);
            res.json(info);
        })
      });
      
      
      //#########
    }    
  }else{
    console.log("Not Application/json");
    res.send('<img src="http://tarsanad.ddns.net:3000/images/calmingcatsmall.gif">');
  }
    
});

router.get('/',function(req,res){
  let info = {};
	console.log(req.headers.accept);
  console.log(req.accepts('*/*'));
  // msg.headers = req.headers;
  info.content_type = req.accepts('Application/json');
  if((req.accepts('*/*')== false)&&(req.accepts('Application/json')!=false)){  
    res.json({info});
  }else{
    res.send('<img src="http://tarsanad.ddns.net:3000/images/calmingcatsmall.gif">');
  }
  	
});




module.exports = router;
