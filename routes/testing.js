var express = require('express');
var router = express.Router();
var moment = require('moment');
var Sequelize = require('sequelize'),
    http = require('http');
var ad_platform = require('../database/ad_platform');
var patternUtil = require('./patternUtil');

var console = process.console;

//#Connect database
var database = new Sequelize('ad_platform', 'postgres', '123456',{
  host:'52.193.77.171',
  dialect: 'postgres',
	logging: false,
	define:{
		timestamps: false
	}
	});

var database2 = new Sequelize('tarsan_test2', 'postgres', 'itria40503', {
  host: '52.69.25.119',
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: false
  }
})

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
var ad            = ad_platform.import("../db_models/ad.js");
var ad_charge     = ad_platform.import("../db_models/ad_charge.js");
var ad_keyword    = ad_platform.import("../db_models/ad_keyword.js");
var ad_show       = ad_platform.import("../db_models/ad_show.js");
var ad_log        = ad_platform.import("../db_models/ad_log.js");
var schedule      = ad_platform.import("../db_models/schedule.js");
//#Print log
var log= function(inst){
	console.dir(inst.get());
}

router.post('/kwTesing',function(req,res){
  let domain = req.body.domain;  
  let url = req.body.url;
  console.log(domain+" - "+url);
  // let domain = "m.ebay.com";
  // let url = "http://m.ebay.com/sch/i.html?_nkw=blink182&isNewKw=1&isRefine=true&mfs=GOCLK&acimp=0&_trksid=p2056088.m2428.l1313.TR0.TRC0.Xg&sqp=g"
  // let url = "http://m.ebay.com/sch/i.html?_nkw=sum41";
  patternUtil.getRegex(domain).then(function(pattern){
    let kw = patternUtil.getKeyword(pattern, url);
    console.log(kw);
    console.tag("Demo").time().file().log("Hello world");
    res.send("<b>"+kw+"</b>");
  }).catch((err) => {
    console.log(err);
  });
});

router.post('/showTesing',function(req,res){
  let domain = req.body.domain;  
  let url = req.body.url;
  console.log(domain+" - "+url);
  let info = {};
  info.url = req.body.url;  
  info.domain = req.body.domain;
  info.ip = req.body.ip;
  info.referer = req.body.referer;
  info.machine = req.body.machine;
  info.weekday = moment().day();
  info.date = moment().format('YYYY-MM-DD');
  info.time = moment().format('HH:mm:ss'); //# 24 hour time
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
  // const p1 = new Promise((resolve, reject) => {
  //   resolve(1)
  // });
  // const p2 = p1.then((value) => {
  //     console.log(value)
  //     return value+1
  // })
  // const p3 = p2.then((value) => {
  //     console.log(value)
  //     return value+2
  // })
  // p3.then((value) => {
  //     console.log(value)
  //     return value+3
  // })
  // let domain = "m.ebay.com";
  // let url = "http://m.ebay.com/sch/i.html?_nkw=blink182&isNewKw=1&isRefine=true&mfs=GOCLK&acimp=0&_trksid=p2056088.m2428.l1313.TR0.TRC0.Xg&sqp=g"
  // let url = "http://m.ebay.com/sch/i.html?_nkw=sum41";
  patternUtil.getRegex(domain).then(function(pattern){
    let kw = patternUtil.getKeyword(pattern, url);
    console.log(pattern.pattern2js.length);
    let avail_js_id = [];
    for (let i = 0; i < pattern.pattern2js.length; i++) {
      avail_js_id.push(pattern.pattern2js[i].available_js_id);
    };
    // const findShowType = patternUtil.getAd_JsShowType([1,2]);
    patternUtil.getAd_JsShowType(avail_js_id).then((showTypes)=>{
      console.log("findShowType:"+showTypes);      
      Sequelize.Promise.join(
        //# find ad of keyword not enable
        ad.findAll({
          where:{      
            end_datetime: {
              $gt: info.date
            },
            is_closed: false,
            is_keyword_enable: false
          },
          include:[        
            {
              model: ad_charge,
              as: "ad_charge",
              ad_id : Sequelize.col('ad.ad_id'),
              where:{
                $or:[
                  {$and:[
                    {showtimes_limit: {
                      $eq: 0
                    }},
                    {clicktimes_limit: {
                      $eq: 0
                    }},
                  ]},
                  {showtimes_limit: {
                    $gt:  Sequelize.col('ad.showtimes')
                  }},
                  {clicktimes_limit: {
                    $gt:  Sequelize.col('ad.clicktimes')
                  }},            
                ]          
              }       
            },
            {
              model: schedule,
              as: "schedule",
              ad_id : Sequelize.col('ad.ad_id'),
              where:{
                $and: [
                 {start_time: {$lt:info.time}},
                 {end_time: {$gt:info.time}},
                 {weekday: String(info.weekday)}
                ]
              }
            },
            {
              model: ad_show,
              as: "ad_show",
              ad_id : Sequelize.col('ad.ad_id'),
              where:{
                $and: [
                  {
                    $or: [
                     {show_class: null},
                     {show_class: pattern.class}
                    ]
                  }
                 ,
                 {
                  $or: [
                     {show_type: null},
                     {show_type: showTypes}
                    ]                  
                 }
                ]
              },
            }
          ]
        }),
        //# find ad of keyword enable
        ad.findAll({
          where:{      
            end_datetime: {
              $gt: info.date
            },
            is_closed: false,
            is_keyword_enable: true
          },
          include:[
            {
              model: ad_keyword,
              as: "ad_keyword",
              where:{keyword:kw}
            },
            {
              model: ad_charge,
              as: "ad_charge",
              ad_id : Sequelize.col('ad.ad_id'),
              where:{
                $or:[
                  {$and:[
                    {showtimes_limit: {
                      $eq: 0
                    }},
                    {clicktimes_limit: {
                      $eq: 0
                    }},
                  ]},
                  {showtimes_limit: {
                    $gt:  Sequelize.col('ad.showtimes')
                  }},
                  {clicktimes_limit: {
                    $gt:  Sequelize.col('ad.clicktimes')
                  }},            
                ]          
              }       
            },
            {
              model: schedule,
              as: "schedule",
              ad_id : Sequelize.col('ad.ad_id'),
              where:{
                $and: [
                 {start_time: {$lt:info.time}},
                 {end_time: {$gt:info.time}},
                 {weekday: String(info.weekday)}
                ]
              }
            },
            {
              model: ad_show,
              as: "ad_show",
              ad_id : Sequelize.col('ad.ad_id'),
              where:{
                $and: [
                  {
                    $or: [
                     {show_class: null},
                     {show_class: pattern.class}
                    ]
                  }
                 ,
                 {
                  $or: [
                     {show_type: null},
                     {show_type: showTypes}
                    ]                  
                 }
                ]
              }
            }
          ]
        })   
      ).spread(function(ad_no_kw, ad_with_kw){
        console.log("ad_no_kw###"+ad_no_kw.length);
        console.log("ad_with_kw###"+ad_with_kw.length);
        
        //##############################################
        //# Not have "ad_with_kw" then run "ad_no_kw"
        //# Have "ad_with_kw" then run "ad_with_kw" (not consider "ad_no_kw")
        //##############################################
        if(ad_with_kw.length === 0){
          let ad = patternUtil.getAdSort(ad_no_kw);
          return patternUtil.getAdBy_algorithm(ad);
          // res.send(ad);       
        }else{
          let ad = patternUtil.getAdSort(ad_with_kw);
          return patternUtil.getAdBy_algorithm(ad);
          // res.send(ad);
        }

        // res.send(tmp);
      }).then(function(ad){
        console.log("##ad##"+ad.url);
        // res.send(pattern);
        let avail_js = [];
        for(let index in pattern.pattern2js) {
          avail_js.push(pattern.pattern2js[index].available_js_id);
          // console.log(pattern.pattern2js[index].available_js_id)
        };
        // res.send(avail_js);
        console.log("avail_js:"+avail_js);
        console.log("ad.ad_show[0].show_type:"+ad.ad_show[0].show_type);
        //# get js of ad.
        patternUtil.getAd_Js(avail_js,ad.ad_show[0].show_type).then(function(re){
          
          let runAd = {}; //# The return object
          runAd.keyword = decodeURIComponent(kw);
          runAd.ad_id = ad.ad_id;          

          // console.log("getAd_Js:"+re);
          if(re != null){            
            runAd.url = ad.url;
            runAd.js_content = re.js_content;
            console.log(runAd);
            //# the api return
            res.send(runAd);
          }else{
            runAd.url = "";
            runAd.js_content = ad.content;
            console.log("runAd###:"+ad.content)
            res.send(runAd);
            // res.send("Didn't have suitable AD script to show!");
          }
          
        })
      })
    });
    
  });
});

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

router.get('/detect/device',function(req,res){
  let MobileDetect = require('mobile-detect');
  let md = new MobileDetect(req.headers['user-agent']);
  console.log(req.headers['user-agent']);
  // console.tag("mobile").log( md.mobile() );
  // console.tag("phone").log( md.phone() );
  // console.tag("tablet").log( md.tablet() );
  console.tag("os").log( md.os() );
  if(md.os() === "iOS"){    
    res.redirect("http://appspx.itri.org.tw/ourapps/MySpendingBook/MySpendingBook_a.aspx");    
  }else if(md.os() === "AndroidOS"){
    res.redirect("https://play.google.com/apps/testing/tw.org.itri.ccma.msb");
  }else{
    res.send("No phone?");
  }
  
});

router.get('/',function(req,res){
  let info = {};
  // var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  // var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0,-1);
  // console.log(tzoffset);
  // console.log(localISOTime);
  console.time().log("time");
  // let nowTime = moment().format();
  // console.log(zone.name);
  // console.log(moment().format('YYYY-MM-DD hh:mm:ss a'));
  // console.log(moment().tz("Asia/Taipei").format().toISOString());
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