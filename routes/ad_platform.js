var express = require('express');
var router = express.Router();

var Sequelize = require('sequelize'),
    http = require('http');


//Connect database
var database = new Sequelize('ad_platform', 'postgres', '123456',{
        host:'52.193.77.171',
        dialect: 'postgres',
	logging: false,
	define:{
		//timestamps: false
	}
	});
//Testing connect database
database
  .authenticate()
  .then(function(err) {
    // console.log('AD_platform - Connection has been established successfully.')
  })
  .catch(function (err) {
    // console.log('Unable to connect to the database:', err);
  });
//#Define
// var model_runad = database.import("../models/runad.js");
// var log= function(inst){
// 	console.dir(inst.get());
// }

// model_runad.findAll({
// 	where:{
		
// 	}
// }).then(function(re){
// 	//re.forEach(log);
// });

// var all = model_runad.findAll({
// 	where:{		
// 	}
// });
// console.log(all.toJSON());

router.get('/',function(req,res){
	//console.log(all);
	res.json({message:"this is api"});
});

// router.get('/get/:type/:close',function(req, res){
// 	model_runad.findAll({
// 		//attributes: {['keywords']},
// 		where:{
// 			type: req.params.type,
// 			close: req.params.close, 
// 		}
// 	}).then(function(re){
// 		let re_ibj;
// 		for (var i = 0; i < re.length; i++) {
// 			re_ibj.push(re[i])
// 		};
// 		res.json(re_ibj);
// 	});
// });
// router.get('/get/:id',function(req, res){
// 	model_runad.findAll({
// 		//attributes: {['keywords']},
// 		where:{
// 			runad_id: req.params.id,
// 		}
// 	}).then(function(re){
// 		res.json(re[0]);
// 	});
// });

module.exports = router;
