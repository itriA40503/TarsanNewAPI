var express = require('express');
var router = express.Router();
var moment = require('moment');
var Sequelize = require('sequelize'),
    http = require('http');
var ad_platform = require('../database/ad_platform');
//# serverlog setting
var console = process.console;

//#Define
var machine = ad_platform.import("../db_models/machine.js");
//#Print log
var log= function(inst){
	console.dir(inst.get());
}
/**
 * @api {get} /machine/:mac Get MachineName By Mac Address
 * @apiVersion 0.1.0
 * @apiName GetMachineNameByMac
 * @apiGroup Machine
 *
 * @apiParam {String} mac Input Mac Address (00:00:00:00:00:00).
 *
 * @apiSuccess {String} ip IP of the client.
 * @apiSuccess {String} mac_addr  Mac Address of the client input.
 * @apiSuccess {String} machine_name  Machine name of the Mac Addrees.
 * @apiSuccess {String} message  Message. 
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "ip":"127.0.0.1",
 *   "mac_addr":"000000000000",
 *   "machine_name":"tmp00",
 *   "message":"New Machine created!"
 *  }
 * 
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 403 Forbidden 
 * {
 *   "ip":"127.0.0.1",
 *   "mac_addr":"0000000000000",
 *   "message":"This not MAC ADDRESS!"
 *  }
 */

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
  // console.log(req.get('Content-Type'));
  let content_type = req.get('Content-Type');
  if(content_type === "application/json"){  
    info.mac_addr = req.params.mac;  
    //# Check is mac address
    var re = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/;    
    if(!re.test(req.params.mac)){
      info.message = "This not MAC ADDRESS!";
      res.status(403).json(info);
    }else{
      info.mac_addr = info.mac_addr.replace(/:/g, "");;
      // console.log(moment().format('YYYY-MM-DD hh:mm:ss a'));
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
              create_datetime: moment().format('YYYY-MM-DD hh:mm:ss a'), 
              update_datetime:moment().format('YYYY-MM-DD hh:mm:ss a'),
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
            console.tag({msg : "Machine", colors : ['yellow']}, {msg : "create", colors : ['red']}).time().file().log(info);
            // console.log(info);
            res.json(info);
          }
            info.message = "Machine already have!";
            //# update machine update_datetime (login)
            machine
            .update(
            {
              update_datetime:moment().format('YYYY-MM-DD hh:mm:ss a')
            },
            {
              where:{mac_addr:info.mac_addr},
              returning: true,
              plain: true              
            })
            console.tag({msg : "Machine", colors : ['yellow']}, "log").time().file().log(info);
            // console.log(info);
            res.json(info);
        }).catch((err) => {
          console.error(err);
        });
      }).catch((err) => {
        console.error(err);
      });
      
      
      //#########
    }    
  }else{
    // console.log("Not Application/json");
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
