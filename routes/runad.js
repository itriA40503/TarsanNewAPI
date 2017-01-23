var express = require('express');
var router = express.Router();

var Sequelize = require('sequelize'),
    http = require('http');


//Connect database
var database = new Sequelize('tarsan_exchange2', 'postgres', '123456',{
        host:'localhost',
        dialect: 'postgres',
	logging: false,
	define:{
		timestamps: false
	}
	});
//Testing connect database
database
  .authenticate()
  .then(function(err) {
    // console.log('tarsan_exchange2 - Connection has been established successfully.');
  })
  .catch(function (err) {
    // console.log('Unable to connect to the database:', err);
  });
//Define
var model_runad = database.import("../models/runad.js");
// Print log
var log= function(inst){
	console.dir(inst.get());
}

model_runad.findAll({
	where:{
		
	}
}).then(function(re){
	//re.forEach(log);
});

var all = model_runad.findAll({
	where:{		
	}
});
//console.log(all.toJSON());

router.get('/',function(req,res){
	//console.log(all);
	res.json({message:"this is api"});
});

router.get('/get/:type/:close',function(req, res){
	model_runad.findAll({
		//attributes: {['keywords']},
		where:{
			type: req.params.type,
			close: req.params.close, 
		}
	}).then(function(re){
		let re_ibj={};
		// for (var i = 0; i < re.length; i++) {
		// 	re_ibj.push(re[i]);
		// };
		re_ibj.ad = re;
		res.json(re_ibj);
	});
});
router.get('',function(req, res){
	model_runad.findAll({
		//attributes: {['keywords']},
		where:{
			type: req.query.type,
			close: req.query.close
		}
	}).then(function(re){
		console.log(req.query.type);
    	console.log(req.query.close);
		res.json(re[0]);
	});
});
router.get('/get/:id',function(req, res){
	model_runad.findAll({
		//attributes: {['keywords']},
		where:{
			runad_id: req.params.id,
		}
	}).then(function(re){
		res.json(re[0]);
	});
});

module.exports = router;
