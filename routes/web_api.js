var express = require('express')
var router = express.Router()
var moment = require('moment')
var CryptoJS = require("crypto-js")
require('pg').defaults.parseInt8 = true // string to integer (postgres problem)
var Sequelize = require('sequelize'),
    http = require('http');
var ad_platform = require('../database/ad_platform')
var cors = require('cors')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var patternUtil = require('./patternUtil')
//# serverlog setting
var console = process.console
//#Define model
var ad            = ad_platform.import("../db_models/ad.js")
var ad_charge     = ad_platform.import("../db_models/ad_charge.js")
var ad_keyword    = ad_platform.import("../db_models/ad_keyword.js")
var ad_show       = ad_platform.import("../db_models/ad_show.js")
var ad_log        = ad_platform.import("../db_models/ad_log.js")
var schedule      = ad_platform.import("../db_models/schedule.js")
var web_pattern   = ad_platform.import("../db_models/web_pattern.js")
var available_js  = ad_platform.import("../db_models/available_js.js")
var pattern2js    = ad_platform.import("../db_models/pattern2js.js")
var platform_user = ad_platform.import("../db_models/platform_user.js")


var whitelist = ['http://tarsanad.ddns.net:3000', 'http://tarsanad.ddns.net']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  exposedHeaders: ['content-range', 'X-Content-Range', 'X-Total-Count']
}
// var corsOptions = {
//   origin: 'http://tarsanad.ddns.net:3000',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

router.post('/getad', cors(corsOptions), passport.authenticate('local', { session: false }), function(req,res){
	// ?_sort=id&_order=DESC&_start=0&_end=10
	//# associations
	schedule.belongsTo(ad, {foreignKey: 'ad_id'});
	ad.hasMany(schedule, {as: 'schedule',foreignKey: 'ad_id'});
	 
	ad_keyword.belongsTo(ad, {foreignKey: 'ad_id'});
	ad.hasMany(ad_keyword, {as: 'ad_keyword',foreignKey: 'ad_id'});

	ad_charge.belongsTo(ad, {foreignKey: 'ad_id'});
	ad.hasMany(ad_charge, {as: 'ad_charge',foreignKey: 'ad_id'});

	ad_show.belongsTo(ad, {foreignKey: 'ad_id'});
	ad.hasMany(ad_show, {as: 'ad_show',foreignKey: 'ad_id'});
	//#### 
	
	patternUtil.loggingPlatformActivty(req.body.username, req, 'getad') 
    
    Sequelize.Promise.join(
          //# find ad of keyword not enable
          ad.findAll({
            where:{      
              end_datetime: {
                $gt: moment().format('YYYY-MM-DD')
              },
              is_closed: false,
              is_keyword_enable: false
            },
            include:[        
              {
                model: ad_charge,
                as: "ad_charge",
                ad_id : Sequelize.col('ad.ad_id'),
              },
              {
                model: schedule,
                as: "schedule",
                ad_id : Sequelize.col('ad.ad_id'),                
              },
              {
                model: ad_show,
                as: "ad_show",
                ad_id : Sequelize.col('ad.ad_id'),                
              }
            ]
          }),
          //# find ad of keyword enable
          ad.findAll({
            where:{      
              end_datetime: {
                $gt: moment().format('YYYY-MM-DD')
              },
              is_closed: false,
              is_keyword_enable: true
            },
            include:[
              {
                model: ad_keyword,
                as: "ad_keyword",
                ad_id : Sequelize.col('ad.ad_id')
              },
              {
                model: ad_charge,
                as: "ad_charge",
                ad_id : Sequelize.col('ad.ad_id'),                     
              },
              {
                model: schedule,
                as: "schedule",
                ad_id : Sequelize.col('ad.ad_id'),                
              },
              {
                model: ad_show,
                as: "ad_show",
                ad_id : Sequelize.col('ad.ad_id'),               
              }
            ]
          })   
        ).spread(function(ad_no_kw, ad_with_kw){
        	console.log(ad_no_kw.concat(ad_with_kw).length)
        	res.json(ad_no_kw.concat(ad_with_kw))
        })

    ad.findAll({
    }).then((result)=>{
    	// for (let i = 0; i < result.length; i++) {
    	// 	result[i].id = parseInt(result[i].ad_id)
    	// 	console.log(result[i].id)
    	// }
    	// res.set('X-Total-Count', result.length)
    	// res.set('Access-Control-Allow-Credentials', true)
    	// res.set('X-Content-Type-Options', 'nosniff')
    	// res.set('Pragma', 'no-chache')
    	// res.set('Cache-Control', 'no-chache');
    	// res.set('Access-Control-Expose-Headers', 'content-range')
    	// res.set('Access-Control-Expose-Headers', 'X-Total-Count')
    	// res.set('content-range', 'getad 0-3/4')
      // res.json(result)
    })
})
passport.use(new LocalStrategy(
	    function(username, password, done) {
	        platform_user.findOne({ 
				where:{ $and: [
		           {account: {$eq:username}},
		           {password: {$eq:password}},
		        ]}
			}).then((result)=>{
		    	return  done(null, result)
		    }).catch((err)=>{ return done(err)})
	    }
	))

router.post('/signin', cors(corsOptions), passport.authenticate('local', { session: false }), function(req,res){
	// ?_sort=id&_order=DESC&_start=0&_end=10     

    patternUtil.loggingPlatformActivty(req.body.username, req, 'login')

	res.send("pass")
})

router.options('/*', function(req,res){
	// ?_sort=id&_order=DESC&_start=0&_end=10
	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,  X-Total-Count'); 
	res.sendStatus(200)
	// next()
})

module.exports = router;