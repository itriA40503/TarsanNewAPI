var Sequelize = require('sequelize'),
    http = require('http');
var ad_platform = require('../database/ad_platform');

//#Define
var webPattern = ad_platform.import("../db_models/web_pattern.js");
exports.getRegex = function(Urldomain){
   return webPattern
		  .findOne({
			 where: {domain: Urldomain},
			})
};
