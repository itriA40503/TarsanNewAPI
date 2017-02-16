var express = require('express');
var router = express.Router();
var moment = require('moment');
var Sequelize = require('sequelize'),
    http = require('http');
var ad_platform = require('../database/ad_platform');
var patternUtil = require('./patternUtil');

//#Define model
var ad            = ad_platform.import("../db_models/ad.js");
var ad_charge     = ad_platform.import("../db_models/ad_charge.js");
var ad_keyword    = ad_platform.import("../db_models/ad_keyword.js");
var ad_show       = ad_platform.import("../db_models/ad_show.js");
var ad_log        = ad_platform.import("../db_models/ad_log.js");
var schedule      = ad_platform.import("../db_models/schedule.js");
var web_pattern   = ad_platform.import("../db_models/web_pattern.js");
var available_js  = ad_platform.import("../db_models/available_js.js");
var pattern2js    = ad_platform.import("../db_models/pattern2js.js");


router.post('/run',function(req,res){
  let info = {};
  //# for test
  // info.url = "http://mweb.gomaji.com/search.php?keyword=%E9%A4%85&ch=7&city=Taipei&page=3";
  // info.url = "http://mweb.gomaji.com/search.php?keyword=itri&ch=7&city=Taipei&page=3";
  // info.domain = "mweb.gomaji.com";
  // ######  
  info.url = req.body.url;  
  info.domain = req.body.domain;
  info.ip = req.body.ip;
  info.referer = req.body.referer;
  info.machine = req.body.machine;
  info.weekday = moment().day();
  info.date = moment().format('YYYY-MM-DD');
  info.time = moment().format('HH:mm:ss'); //# 24 hour time
  // console.log(info.weekday+" | "+info.date+" | "+info.time);
  console.log(info);

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
  
  patternUtil.getRegex(info.domain)
  .then(function(pattern){
    // console.log("getRegex:"+pattern.domain);
    
    if(pattern != null){
      let kw = patternUtil.getKeyword(pattern, info.url);
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
                $or: [
                 {show_class: null},
                 {show_class: pattern.class}
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
                $or: [
                 {show_class: null},
                 {show_class: pattern.class}
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
        patternUtil.getAd_Js(avail_js,ad.ad_show[0].show_type).then(function(re){
          console.log("getAd_Js:"+re);
          if(re != null){
            let runAd = {};
            runAd.keyword = decodeURIComponent(kw);
            runAd.ad_id = ad.ad_id;
            runAd.url_href = ad.url_href;
            runAd.url = ad.url;
            runAd.js_content = re.js_content;
            console.log(runAd);
            //# the api return
            res.send(runAd);
          }else{
            res.send("Didn't have suitable AD script to show!");
          }
          
        })
      })
    }else{
      res.send("Didn't have identifiable domain !");
    }    
  });
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
