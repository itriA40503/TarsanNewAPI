var Sequelize = require('sequelize'),
    http = require('http');
var ad_platform = require('../database/ad_platform');

//#Define
var webPattern    = ad_platform.import("../db_models/web_pattern.js");
var available_js  = ad_platform.import("../db_models/available_js.js");
var pattern2js    = ad_platform.import("../db_models/pattern2js.js");

exports.getRegex = function(Urldomain){

  // pattern2js.belongsTo(webPattern, {foreignKey: 'pattern_id'});
  webPattern.hasMany(pattern2js, {as: 'pattern2js',foreignKey: 'pattern_id'});

  // pattern2js.belongsTo(available_js, {foreignKey: 'available_js_id'});
  // available_js.hasMany(pattern2js, {as: 'pattern2js',foreignKey: 'available_js_id'});

  // webPattern.belongsTo(pattern2js, {as: 'pattern2js',foreignKey: 'pattern_id'});
  // pattern2js.hasMany(webPattern, {as: 'webPattern',foreignKey: 'pattern_id'});
  
  available_js.belongsTo(pattern2js, {as: 'pattern2js',foreignKey: 'available_js_id'});
  pattern2js.hasMany(available_js, {as: 'available_js',foreignKey: 'available_js_id'});

  return webPattern
		  .findOne({
  			where: {
          $and:[
            { domain:{$eq: Urldomain} },
            { is_enable:{$eq: true} },
          ]
        },
        include:[
          {
            model: pattern2js,
            as: "pattern2js",
            attributes: ['available_js_id'],
            pattern_id: Sequelize.col('webPattern.pattern_id'),
            // include:[
            //   {
            //     model: available_js,
            //     as: "available_js",
            //     available_js_id: {$col: 'available_js_id'}//Sequelize.col('pattern2js.available_js_id')
            //   }
            // ]
          }
        ]
			})
};

exports.getAd_Js = function(id, type){
  if(type != null){
    return available_js
      .findOne({
        where: {$and:
          [
            {available_js_id: id},
            {type: type}
          ]
        }      
      });
  }else{
    return available_js
      .findOne({
        where: {available_js_id: id} 
      });
  }
  
};

exports.getKeyword = function(domain, url){
  let keyword;
  if(domain != null){
    let regexResult = url.match(domain.regex);
    // console.log(regexResult);
    if(regexResult!=null){
      let kw = regexResult[1].replace(/\+/g, " ");
      // console.log("keyword:"+keyword);
      keyword = kw;
    }         
  }else{
    // console.log("is NULL!!");
    keyword = null;
  }        
  return keyword
};

exports.getAdSort = function(ad){
  let ad_prob = {};
  ad_prob.no_limit = [];
  ad_prob.click = [];
  ad_prob.show = [];
  for (let i in ad) {
    // console.log(ad[i].ad_show[0].show_type);
    let tmp_ad = {};
    if((ad[i].ad_charge[0].showtimes_limit === 0) && (ad[i].ad_charge[0].clicktimes_limit === 0)){            
      // tmp_ad.ad_id = ad[i].ad_id;
      // tmp_ad.show_type = ad[i].ad_show[0].show_type;
      // ad_prob.no_limit.push(tmp_ad);
      ad_prob.no_limit.push(ad[i]);            
    }else if(ad[i].ad_charge[0].showtimes_limit != 0){
      // tmp_ad.ad_id = ad[i].ad_id;
      // tmp_ad.show_type = ad[i].ad_show[0].show_type;
      // tmp_ad.number = ad[i].showtimes;
      // tmp_ad.limit = ad[i].ad_charge[0].showtimes_limit;
      // ad_prob.show.push(tmp_ad);
      ad_prob.show.push(ad[i]);
    }else if(ad[i].ad_charge[0].clicktimes_limit != 0){
      // tmp_ad.ad_id = ad[i].ad_id;
      // tmp_ad.show_type = ad[i].ad_show[0].show_type;
      // tmp_ad.number = ad[i].clicktimes;
      // tmp_ad.limit = ad[i].ad_charge[0].clicktimes_limit;
      // ad_prob.click.push(tmp_ad);
      ad_prob.click.push(ad[i]);
    }
  }  
  return ad_prob;
};

exports.getAdBy_algorithm = function(ad_prob){
  //# ad weights
  let click_weight = 1;
  let show_weight = 0.001;
  let noLimit_weight = 1;

  // console.log(ad_prob.no_limit[0]);
  // console.log(ad_prob.click[0]);
  // console.log(ad_prob.show[0]);
  
  let ad = [];
  for (let tmp in ad_prob.click) {
    // let tmp_ad = {};
    // tmp_ad.ad_id = ad_prob.click[tmp].ad_id;
    // tmp_ad.show_type = ad_prob.click[tmp].show_type;
    // tmp_ad.prob = Math.ceil((ad_prob.click[tmp].limit - ad_prob.click[tmp].number)*click_weight);
    // ad.push(tmp_ad);
    let tmp_ad = ad_prob.click[tmp];
    tmp_ad.prob = Math.ceil(
      (ad_prob.click[tmp].ad_charge[0].clicktimes_limit - ad_prob.click[tmp].clicktimes)*click_weight);
    ad.push(tmp_ad);
    console.log("tmp_ad.click###"+tmp_ad.prob);
  };
  for (let tmp in ad_prob.show) {
    // let tmp_ad = {};
    // tmp_ad.ad_id = ad_prob.show[tmp].ad_id; 
    // tmp_ad.show_type = ad_prob.show[tmp].show_type;   
    // tmp_ad.prob = Math.ceil((ad_prob.show[tmp].limit - ad_prob.show[tmp].number)*show_weight);
    // ad.push(tmp_ad);
    let tmp_ad = ad_prob.show[tmp];
    tmp_ad.prob = Math.ceil(
      (ad_prob.show[tmp].ad_charge[0].showtimes_limit - ad_prob.show[tmp].showtimes)*show_weight);
    ad.push(tmp_ad);
    console.log("tmp_ad.show###"+tmp_ad.prob);
  };

  if(ad_prob.no_limit.length != 0 && ad.length != 0){
    let sum_weight=0;
    for (let tmp in ad) {
      sum_weight += ad[tmp].prob;
    }      
    let avg_weight = Math.ceil((sum_weight/ad.length)*noLimit_weight);
    for (let tmp in ad_prob.no_limit) {
      // let tmp_ad = {};
      // tmp_ad.ad_id = ad_prob.no_limit[tmp].ad_id;
      // tmp_ad.show_type = ad_prob.no_limit[tmp].show_type; 
      // tmp_ad.prob = avg_weight;
      // ad.push(tmp_ad);
      let tmp_ad = ad_prob.no_limit[tmp];
      tmp_ad.prob = avg_weight;
      ad.push(tmp_ad);
      
      console.log("tmp_ad.no_limit###"+tmp_ad.prob);
    };
  }else if(ad_prob.no_limit.length != 0 && ad.length == 0){
    for (let tmp in ad_prob.no_limit) {
      // let tmp_ad = {};
      // tmp_ad.ad_id = ad_prob.no_limit[tmp].ad_id;
      // tmp_ad.show_type = ad_prob.no_limit[tmp].show_type;
      // tmp_ad.prob = 1;
      // ad.push(tmp_ad);
      let tmp_ad = ad_prob.no_limit[tmp];
      tmp_ad.prob = 1;
      ad.push(tmp_ad);
      console.log("tmp_ad.no_limit###"+tmp_ad.prob);
    };
  }

  let items=[];
  let itemsWeight=[];
  for (let tmp in ad){
    items.push(ad[tmp].ad_id);
    itemsWeight.push(ad[tmp].prob);
  }
  console.log(items);
  console.log(itemsWeight);
  let result = weightedRandom(items, itemsWeight);
  for (let index in ad) {
    if(result === ad[index].ad_id){
      return ad[index];
    }
  };
  // return  result;
};

function weightedRandom(items, itemsWeight){
  let totalWeight=eval(itemsWeight.join("+"));
  console.log("totalWeight##"+totalWeight);
  let randomArray=[];
  let currentItem=0;
  for(let i=0; i<items.length; i++){
      for(let j=0; j<itemsWeight[i]; j++){
          randomArray.push(i);
      }
  }
  let randomNumber=Math.floor(Math.random()*totalWeight);
  return items[randomArray[randomNumber]];
}
