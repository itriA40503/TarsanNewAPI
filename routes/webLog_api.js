var express = require('express');
var router = express.Router();
var moment = require('moment');
var Sequelize = require('sequelize'),
    http = require('http');
var ad_platform = require('../database/ad_platform');

//#Define model
var webLog = ad_platform.import("../db_models/web_log.js");

var patternUtil = require('./patternUtil');

/**
 * @api {post} /webLog/ Post web browsing data
 * @apiVersion 0.1.0
 * @apiName webLog
 * @apiGroup WebLog
 *
 * @apiParam {String} ip Ip address.
 * @apiParam {String} url Browsing Url.
 * @apiParam {String} domain Domain of url.
 * @apiParam {String} referer Referer of url.
 * @apiParam {String} machine Name of using machine.
 * @apiParam {boolean} is_showAd Is showing ad.
 *
 * @apiSuccess {String} CreateDateTime The create datetime of log.
 *  
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 * 	"CreateDateTime":"2017-01-25 01:59:58 pm"
 * }
 * 
 */

router.post('/',function(req,res){
  let info = {};
  //# for test
  // info.url = "http://www.ebay.com/sch/i.html?_odkw=stroke&_osacat=0&_from=R40&_trksid=p2045573.m570.l1313.TR0.TRC0.H0.Xthe+strokes.TRS0&_nkw=the+strokes&_sacat=0"
  // info.domain = "www.ebay.com";
  // ######
  info.ip = req.body.ip;
  // info.keyword = req.body.keyword;
  info.url = req.body.url;  
  info.domain = req.body.domain;  
  info.referer = req.body.referer;  
  info.is_showAd =  req.body.is_showAd;
  info.machine = req.body.machine;

  patternUtil.getRegex(info.domain)
			.then(function(re){
				// console.log("domain: "+re.domain+" regex: "+re.regex);
				let weburl = info.url;
				if(re != null){
					let regexResult = weburl.match(re.regex);
					// console.log(regexResult);
					if(regexResult!=null){
						let keyword = regexResult[1].replace(/\+/g, " ");
						// console.log("keyword:"+keyword);
						info.keyword = keyword;
					}					
				}else{
					// console.log("is NULL!!");
					info.keyword = null;
				}

				webLog.create({
					keyword 		: info.keyword,
					ip 				: info.ip,
					url 			: info.url,
					domain			: info.domain,
					referer			: info.referer,
					show_ad			: info.show_ad,
					machine			: info.machine,
					create_datetime	: moment().format('YYYY-MM-DD hh:mm:ss a')
				});
				console.log(moment().format('YYYY-MM-DD hh:mm:ss a'));
				console.log(info);
				res.json({CreateDateTime:moment().format('YYYY-MM-DD hh:mm:ss a')});				
			});
  
  // res.send('<img src="http://tarsanad.ddns.net:3000/images/calmingcatsmall.gif">');  	
});

module.exports = router;