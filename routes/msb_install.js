var express = require('express')
var router = express.Router()

// #Serverlog setting
var console = process.console

router.get('/install', function (req, res) {
  let MobileDetect = require('./node_modules/mobile-detect')
  let md = new MobileDetect(req.headers['user-agent'])
  console.tag({msg: 'MSB', colors: ['yellow']}, 'user-agent').time().file().log(req.headers['user-agent'])
  console.tag({msg: 'MSB', colors: ['yellow']}, 'os').time().file().log(md.os())
  if (md.os() === 'iOS') {
    res.redirect('http://appspx.itri.org.tw/ourapps/MySpendingBook/MySpendingBook_a.aspx')
  } else if (md.os() === 'AndroidOS') {
    res.redirect('https://play.google.com/apps/testing/tw.org.itri.ccma.msb')
  } else {
    res.redirect('http://tarsanad.ddns.net/msbInstall/')
  }
})

module.exports = router
