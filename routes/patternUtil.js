var Sequelize = require('sequelize')
var ad_platform = require('../database/ad_platform')
var CryptoJS = require('crypto-js')
var console = process.console
// # Define models
var webPattern = ad_platform.import('../db_models/web_pattern.js')
var available_js = ad_platform.import('../db_models/available_js.js')
var pattern2js = ad_platform.import('../db_models/pattern2js.js')
// # Secert key for ad Encrypt & decrypt
var secertkey = 'lifeOnMars'

exports.AdEncrypt = function (obj) {
  // # Encrypt
  let ciphertext = CryptoJS.AES.encrypt(JSON.stringify(obj), secertkey)
  // var ciphertext = CryptoJS.TripleDES.encrypt(req.params.str, 'secret key 123');
  let Encrypt_Result = ciphertext.toString().replace(/\//g, '_')
  // console.log("AdEncrypt:"+Encrypt_Result);
  return Encrypt_Result
}

exports.AdDecrypt = function (input) {
  // # Decrypt
  // console.log("###"+input);
  let input_ = input.replace(/_/g, '/')
  // console.log("#######"+input_);
  let bytes = CryptoJS.AES.decrypt(input_, secertkey)
  try {
    let Decrypt_obj = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
    // console.log("AdDecrypt:"+Decrypt_obj);
    console.tag({msg: 'AdDecrypt', colors: ['yellow']}).time().file().log(Decrypt_obj)
    return Decrypt_obj
  } catch (err) {
    return null
  }
}

exports.getRegex = function (Urldomain) {
  // # Table Association
  webPattern.hasMany(pattern2js, {as: 'pattern2js', foreignKey: 'pattern_id'})
  available_js.belongsTo(pattern2js, {as: 'pattern2js', foreignKey: 'available_js_id'})
  pattern2js.hasMany(available_js, {as: 'available_js', foreignKey: 'available_js_id'})

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
          }
        ]
			})
}

exports.getAd_JsShowType = function (avail_js_id) {
  if (avail_js_id != null) {
    return available_js
      .findAll({
        where: {
          available_js_id : avail_js_id
        },
        attributes: ['type']
      }
      ).then(function (resultTypes) {
        let reAry = []
        for (let i = 0; i < resultTypes.length; i++) {
          reAry.push(resultTypes[i].type)
        };
        return reAry
      })
  }
}

exports.getAd_Js = function (id, type) {
  let jsId
  if (type != null && type !== '') {
    jsId = id
    return available_js
      .findOne({
        where: {
          $and: [{available_js_id: jsId}, {type: type}]
        }
      })
  } else {
    if (Array.isArray(id)) {
      let index = Math.floor(Math.random() * id.length)
      jsId = id[index]
    }
    return available_js
      .findOne({
        where: {available_js_id: jsId}
      })
  }
}

exports.getKeyword = function (domain, url) {
  let keyword
  if (domain != null) {
    let regexResult = url.match(domain.regex)
    // console.log(regexResult);
    let i = 1
    if (Array.isArray(regexResult)) {
      for (i; i < regexResult.length; i++) {
        // console.log(i+":"+regexResult[i]);
        if (regexResult[i] != null && regexResult[i] !== 'undefined') {
          break
        }
      };
    }
    if (regexResult !== null) {
      let kw = regexResult[i].replace(/\+/g, ' ')
      keyword = decodeURI(kw)
      console.tag({msg: 'getKeyword', colors: ['yellow']}).time().file().log(keyword)
      // console.log("getKeyword##keyword:"+keyword);
    }
  } else {
    console.tag({msg: 'getKeyword', colors: ['yellow']}).time().file().log('Is NULL')
    // console.log("getKeyword##is NULL!!");
    keyword = null
  }
  return keyword
}

exports.getAdSort = function (ad) {
  let ad_prob = {}
  ad_prob.no_limit = []
  ad_prob.click = []
  ad_prob.show = []
  for (let i in ad) {
    // console.log(ad[i].ad_show[0].show_type);
    // let tmp_ad = {};
    if ((ad[i].ad_charge[0].showtimes_limit === 0) && (ad[i].ad_charge[0].clicktimes_limit === 0)) {
      ad_prob.no_limit.push(ad[i])
    } else if (ad[i].ad_charge[0].showtimes_limit !== 0) {
      ad_prob.show.push(ad[i])
    } else if (ad[i].ad_charge[0].clicktimes_limit !== 0) {
      ad_prob.click.push(ad[i])
    }
  }
  return ad_prob
}

exports.getAdBy_algorithm = function (ad_prob) {
  // # ad weights
  let click_weight = 1
  let show_weight = 0.001
  let noLimit_weight = 1

  // console.log(ad_prob.no_limit[0]);
  // console.log(ad_prob.click[0]);
  // console.log(ad_prob.show[0]);
  let ad = []
  for (let tmp in ad_prob.click) {
    let tmp_ad = ad_prob.click[tmp]
    tmp_ad.prob = Math.ceil(
      (ad_prob.click[tmp].ad_charge[0].clicktimes_limit - ad_prob.click[tmp].clicktimes) * click_weight)
    ad.push(tmp_ad)
    // console.tag({msg : "getAdBy_algorithm", colors : ['yellow']},"ad","click").time().file().log(tmp_ad.prob);
    // console.log("tmp_ad.click###"+tmp_ad.prob);
  };
  for (let tmp in ad_prob.show) {
    let tmp_ad = ad_prob.show[tmp]
    tmp_ad.prob = Math.ceil(
      (ad_prob.show[tmp].ad_charge[0].showtimes_limit - ad_prob.show[tmp].showtimes) * show_weight)
    ad.push(tmp_ad)
    // console.log("tmp_ad.show###"+tmp_ad.prob);
  };

  if (ad_prob.no_limit.length !== 0 && ad.length !== 0) {
    let sum_weight = 0
    for (let tmp in ad) {
      sum_weight += ad[tmp].prob
    }
    let avg_weight = Math.ceil((sum_weight / ad.length) * noLimit_weight)
    for (let tmp in ad_prob.no_limit) {
      let tmp_ad = ad_prob.no_limit[tmp]
      tmp_ad.prob = avg_weight
      ad.push(tmp_ad)  
      // console.log("tmp_ad.no_limit###"+tmp_ad.prob);
    };
  } else if (ad_prob.no_limit.length !== 0 && ad.length === 0) {
    for (let tmp in ad_prob.no_limit) {
      let tmp_ad = ad_prob.no_limit[tmp]
      tmp_ad.prob = 1
      ad.push(tmp_ad)
      // console.log("tmp_ad.no_limit###"+tmp_ad.prob);
    };
  }

  let items = []
  let itemsWeight = []
  for (let tmp in ad) {
    items.push(ad[tmp].ad_id)
    itemsWeight.push(ad[tmp].prob)
  }
  console.tag({msg: 'getAdBy_algorithm', colors: ['yellow']}, 'ad', 'id').time().file().log(items)
  console.tag({msg: 'getAdBy_algorithm', colors: ['yellow']}, 'ad', 'weight').time().file().log(itemsWeight)
  // console.log(items);
  // console.log(itemsWeight);
  let result = weightedRandom(items, itemsWeight)
  for (let index in ad) {
    if (result === ad[index].ad_id) {
      return ad[index]
    }
  };
  // return  result;
}

function weightedRandom (items, itemsWeight) {
  let totalWeight = eval(itemsWeight.join('+'))
  // console.log("totalWeight##"+totalWeight);
  let randomArray = []
  let currentItem = 0
  for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < itemsWeight[i]; j++) {
          randomArray.push(i)
      }
  }
  let randomNumber = Math.floor(Math.random() * totalWeight)
  return items[randomArray[randomNumber]]
}
