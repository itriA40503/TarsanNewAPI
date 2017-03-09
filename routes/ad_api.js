var express = require('express');
var router = express.Router();
var moment = require('moment');
var CryptoJS = require("crypto-js");
var Sequelize = require('sequelize'),
    http = require('http');
var ad_platform = require('../database/ad_platform');
var patternUtil = require('./patternUtil');
//# serverlog setting
var console = process.console;

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

/**
 * @api {post} /Ad/run Post data then get Ad to publish.
 * @apiVersion 0.1.0
 * @apiName run
 * @apiGroup Ad
 * 
 * @apiDescription 
 * <p><b>This api is core of system.</b></p>
 * #1 Find :
 * <ul>
 * <li>keyword</li>
 * <li>class of domain</li>
 * <li>schudel</li>
 * </ul>
 * #2 Matching :
 * <ul>
 * <li>keyword</li>
 * <li>class of domain</li>
 * <li>schudel</li>
 * <li>charge limit</li>
 * <li>available js script (showing type)</li>
 * </ul>
 * #3 Algorithm of choosing publish ad
 * 
 * 
 *
 * @apiParam {String} ip Ip address.
 * @apiParam {String} url Browsing Url.
 * @apiParam {String} domain Domain of url.
 * @apiParam {String} referer Referer of url.
 * @apiParam {String} machine Name of using machine.
 *
 * @apiSuccess {String} keyword The keyword from url.
 * @apiSuccess {String} ad_id The id of publish Ad.
 * @apiSuccess {String} url The url of publish Ad.
 * @apiSuccess {String} js_content The js code for publish Ad. * 
 *  
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "keyword": "keyword",
 *  "ad_id": "1",
 *  "url": "http://nOOnECaRe.eNGinEeR.jpg",
 *  "js_content": "<script></script>"
 * }
 * 
 */
router.post('/run',function(req,res){
  let info = {};
  //# for test
  // info.url = "http://mweb.gomaji.com/search.php?keyword=%E9%A4%85&ch=7&city=Taipei&page=3";
  // info.url = "http://mweb.gomaji.com/search.php?keyword=itri&ch=7&city=Taipei&page=3";
  // info.domain = "mweb.gomaji.com";
  // ###### 
  
  // console.dir(req.body);

  info.url = req.body.url;  
  info.domain = req.body.domain;
  info.ip = req.body.ip;
  info.referer = req.body.referer;
  info.machine = req.body.machine;
  info.weekday = moment().day();
  info.date = moment().format('YYYY-MM-DD');
  info.time = moment().format('HH:mm:ss'); //# 24 hour time
  // console.log(info.weekday+" | "+info.date+" | "+info.time);
  console.tag({msg : "runAd", colors : ['yellow']}, "input").time().file().log(info);

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
      // console.dir("pattern.pattern2js.length:"+pattern.pattern2js.length);
      let avail_js_id = []; //# get avail_js_id for find show type
      for (let i = 0; i < pattern.pattern2js.length; i++) {
        avail_js_id.push(pattern.pattern2js[i].available_js_id);
      };
      //# find aviailable js type
      patternUtil.getAd_JsShowType(avail_js_id).then((showTypes)=>{
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
                       {show_type: ""},
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
                       {show_type: ""},
                       {show_type: showTypes}
                      ]                  
                   }
                  ]
                }
              }
            ]
          })   
        ).spread(function(ad_no_kw, ad_with_kw){
          console.tag({msg : "runAd", colors : ['yellow']},"ad","ad_no_kw").time().file().log(ad_no_kw.length);
          console.tag({msg : "runAd", colors : ['yellow']},"ad","ad_with_kw").time().file().log(ad_with_kw.length);
          // console.log("ad_no_kw###"+ad_no_kw.length);
          // console.log("ad_with_kw###"+ad_with_kw.length);
          
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
          // console.log("##ad##"+ad.url);
          // res.send(pattern);
          let avail_js = [];
          for(let index in pattern.pattern2js) {
            avail_js.push(pattern.pattern2js[index].available_js_id);
            // console.log(pattern.pattern2js[index].available_js_id)
          };
          // res.send(avail_js);
          console.tag({msg : "runAd", colors : ['yellow']},"ad","avail_js").time().file().log(avail_js);
          console.tag({msg : "runAd", colors : ['yellow']},"ad","show_type").time().file().log(ad.ad_show[0].show_type);
          // console.log("avail_js:"+avail_js);
          // console.log("ad.ad_show[0].show_type:"+ad.ad_show[0].show_type);
          //# get js of ad.
          patternUtil.getAd_Js(avail_js,ad.ad_show[0].show_type).then(function(re){
            
            let runAd = {}; //# The return object
            runAd.keyword = decodeURIComponent(kw);
            runAd.ad_id = ad.ad_id;          

            // console.log("getAd_Js:"+re);
            if(re != null){            
              runAd.url = ad.url;
              runAd.js_content = re.js_content;
              // console.log(runAd);
              console.tag({msg : "runAd", colors : ['yellow']},{msg : "output", colors : ['red']}).time().file().log(runAd);
              //# the api return
              res.send(runAd);
            }else{
              runAd.url = "";
              runAd.js_content = ad.content;
              // console.log("runAd###:"+ad.content)
              console.tag({msg : "runAd", colors : ['yellow']},{msg : "output", colors : ['red']}).time().file().log(runAd);
              res.send(runAd);
              // res.send("Didn't have suitable AD script to show!");
            }
          }).catch((err) => {
            console.error(err);
          });
        }).catch((err) => {
          console.error(err);
        });  
      }).catch((err) => {
        console.error(err);
      });;
      
    }else{
      res.send("Didn't have identifiable domain !");
      // console.tag("runAd","output").time().file().log("Didn't have identifiable domain !");
      // console.info("runAd Didn't have identifiable domain !");
    }
    console.info("runAd");
  }).catch((err) => {
    console.error(err);
  });;
});

/**
 * @api {post} /Ad/log Logging showing ad
 * @apiVersion 0.1.0
 * @apiName log show
 * @apiGroup Ad
 * 
 * @apiDescription 
 * <b>Will give a hashkey for logging clicked ad.<b>
 * The hashkey decrypt will be a object.
 * 
 * @apiParam {String} ad_id The id of ad.
 * @apiParam {String} ip Ip address.
 * @apiParam {String} url Browsing Url.
 * @apiParam {String} domain Domain of url.
 * @apiParam {String} referer Referer of url.
 * @apiParam {String} machine Name of using machine.
 *
 *  
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * 
 * U2FsdGVkX1+gTxS2xIa2pJWaMlIkRBtH6iFnsFAQS7XgF_+On99afJVh341CjNZUF2j9S7Gaarg_sxncN1Hp7htX1jFeSebvioG2a61btt6e9lx8MkYybHK6sVBji6igeXappGKAAO3D2mShxK9OR9OksEFy3v2c1uamQP6BMHXVjg+lzRfuuupZFTtFHKNEhHjTwTiozZhTqgxFc3biatK9osIb8p_NNqVOuHq2HHiDH__TxdLnOIxzZsb_O2EAH0Vtd62H2V+eaXhPLcdOkir5Fckla2ShnUPmYunPJAMCLDS4e_rOEmV1KcycosdeIa2095bmkvJCl1Im4CKhZgvxIT5UiHyoeoM8D_48DSZGo5TQ5UfaicjfqjG4AAAG
 * 
 */
router.post('/log',function(req,res){
  let info = {};
  info.ad_id    = req.body.ad_id;
  info.url      = req.body.url;  
  info.domain   = req.body.domain;
  info.ip       = req.body.ip;
  info.referer  = req.body.referer;
  info.keyword  = req.body.keyword;
  info.machine  = req.body.machine;
  info.datetime = moment().format('YYYY-MM-DD hh:mm:ss a');
  console.tag({msg : "LogAd", colors : ['yellow']},{msg : "show", colors : ['yellow']},"input").time().file().log(info);
  let hashkey = patternUtil.AdEncrypt(info);
  
  //# associations
  ad_charge.belongsTo(ad, {foreignKey: 'ad_id'});
  ad.hasMany(ad_charge, {as: 'ad_charge',foreignKey: 'ad_id'});
  
  if(req.body.ad_id!=null || req.body.ad_id != "undefined"){
    ad.update({
        showtimes : ad.sequelize.literal('showtimes+1')
    },{
      where:{
        ad_id : info.ad_id
      }
    }).then(function(re){
      // console.log("ad_log_kw:"+info.keyword)
      // console.tag("LogAd","keyword").time().file().log(info);
      if(re[0] !=0){
        //# create ad_log (show)
        ad_log.create({
          ad_id           : info.ad_id,
          keyword         : info.keyword,
          ip              : info.ip,
          url             : info.url,
          domain          : info.domain,
          referer         : info.referer,
          is_show         : true,
          is_click        : false,
          hashkey         : hashkey,
          machine_name    : info.machine,
          create_datetime : info.datetime
        });
        //# close ad check (show)
        ad.findOne(          
          {
            where:{
              ad_id : info.ad_id,
              is_closed : false
            },
            include:{
              model: ad_charge,
              as: "ad_charge",
              ad_id : Sequelize.col('ad.ad_id'),
              where:{
                showtimes_limit: {
                  $eq: Sequelize.col('ad.showtimes')
                }        
              }       
            }            
          }
        ).then(function(re){
          if(re!= null){
            //# closing ad
            ad.update({
                is_closed : true
            },{
              where:{
                ad_id : re.ad_id
              }
            })
            console.tag({msg : "LogAd", colors : ['yellow']},{msg : "show", colors : ['yellow']},"close").time().file().log(re.ad_id);
            // console.log("######close Ad : "+re.ad_id);          
          }
        })
        console.tag({msg : "LogAd", colors : ['yellow']},{msg : "show", colors : ['yellow']},{msg : "output", colors : ['red']}).time().file().log(hashkey);
        res.send(hashkey);
      }else{
        console.tag({msg : "LogAd", colors : ['yellow']},{msg : "show", colors : ['yellow']}).info("ad_id Not exists.");
        res.send("ad_id Not exists.");
      }
    }).catch((err) => {
      console.error(err);
    });
    
  }else{    
    res.send("No data.");
  }
  console.tag({msg : "LogAd", colors : ['yellow']},{msg : "show", colors : ['yellow']}).info("LogAd");    
});

/**
 * @api {get} /Ad/log/:ad_id/:hashkey Logging clicked ad
 * @apiVersion 0.1.0
 * @apiName log click
 * @apiGroup Ad
 * 
 * @apiDescription 
 * <b>Will redirect page and logging clicked ad.<b> 
 * 
 * @apiParam {String} ad_id The id of ad.
 * @apiParam {String} hashkey The hashkey is encrypt by AES.
 *
 */
router.get('/log/:ad_id/:hashkey',function(req,res){
  console.tag({msg : "LogAd", colors : ['yellow']},{msg : "click", colors : ['yellow']},"input","ad_id").time().file().log(req.params.ad_id);
  console.tag({msg : "LogAd", colors : ['yellow']},{msg : "click", colors : ['yellow']},"input","hashkey").time().file().log(req.params.hashkey);
  let info = patternUtil.AdDecrypt(req.params.hashkey);
  
  Sequelize.Promise.join(
    //# check ad_log have same hash key
    ad_log.findAll({
      where:{
          hashkey : req.params.hashkey
        }
    }),
    ad.findOne({
      where:{
          ad_id : req.params.ad_id
      }
    })
  ).spread(function(matchHashkey, findAdHref){
    if(findAdHref == null){
      console.tag({msg : "LogAd", colors : ['yellow']},{msg : "click", colors : ['yellow']}).warning("ad_id ERROR");
      res.send("ad_id ERROR");
    }
    console.tag({msg : "LogAd", colors : ['yellow']},{msg : "click", colors : ['yellow']},"matchHashkey","length").time().file().log(matchHashkey.length);
    // console.log("matchHashkey.length:"+matchHashkey.length);
    if(matchHashkey !=null && matchHashkey.length === 1){
      if(info != null){
        //# create ad_log(click)
        ad_log.create({
          ad_id           : info.ad_id,
          keyword         : info.keyword,
          ip              : info.ip,
          url             : info.url,
          domain          : info.domain,
          referer         : info.referer,
          is_show         : false,
          is_click        : true,
          hashkey         : req.params.hashkey,
          machine_name    : info.machine,
          create_datetime : moment().format('YYYY-MM-DD hh:mm:ss a')
        }).catch((err) => {
          console.error(err);
        });
        //# updating ad clicktimes
        ad.update({
          clicktimes : ad.sequelize.literal('clicktimes+1')
        },
        {      
          where:{
              ad_id : req.params.ad_id
          }
        }).then(function(result){
          //# close ad check (click)
          // console.log("Check Ad:"+info.ad_id)
          ad.findOne(          
            {
              where:{
                ad_id : info.ad_id
              },
              include:{
                model: ad_charge,
                as: "ad_charge",
                ad_id : Sequelize.col('ad.ad_id'),
                where:{
                  clicktimes_limit: {
                    $eq: Sequelize.col('ad.clicktimes')
                  }        
                }       
              }            
            }
          ).then(function(re){            
            if(re!= null){
              //# closing ad
              ad.update({
                  is_closed : true
              },{
                where:{
                  ad_id : re.ad_id
                }
              })
              console.tag({msg : "LogAd", colors : ['yellow']},{msg : "click", colors : ['yellow']},"close").time().file().log(re.ad_id);
              // console.log("######close Ad : "+re.ad_id);          
            }          
          })
        }).catch((err) => {
          console.error(err);
        });
        console.tag({msg : "LogAd", colors : ['yellow']},{msg : "click", colors : ['yellow']},{msg : "redirect", colors : ['red']}).time().file().log(findAdHref.url_href);
        //# redirect page
        res.redirect(findAdHref.url_href);
        console.tag({msg : "LogAd", colors : ['yellow']},{msg : "click", colors : ['yellow']}).info("LogAd - redirect");
      }else{
        console.tag({msg : "LogAd", colors : ['yellow']},{msg : "click", colors : ['yellow']}).warning("Hashkey error");
        // console.log("Hashkey error");
        console.tag({msg : "LogAd", colors : ['yellow']},{msg : "click", colors : ['yellow']},{msg : "redirect", colors : ['red']}).time().file().log(findAdHref.url_href);
        //# redirect page
        res.redirect(findAdHref.url_href);
      }
    }else{
      console.tag({msg : "LogAd", colors : ['yellow']},{msg : "click", colors : ['yellow']}).info("Already have been log");
      //# redirect page
      res.redirect(findAdHref.url_href);
      console.tag({msg : "LogAd", colors : ['yellow']},{msg : "click", colors : ['yellow']},{msg : "redirect", colors : ['red']}).time().file().log(findAdHref.url_href);
    }
  }).catch((err) => {
    console.error(err);
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
    res.send('<img src="http://tarsanad.ddns.net:9527/images/calmingcatsmall.gif">');
  }
});

module.exports = router;