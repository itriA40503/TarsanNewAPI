var should = require('should');
var patternUtil = require('../routes/patternUtil');

describe('AdEncrypt', function(){
    it('should return code after encrypt object by AES', function(done){
        let obj = {};
        let result = patternUtil.AdEncrypt(obj);
        result.should.String();
        done();
    })
    it('Should return code after encrypt object by AES (2)', function(done){
        let obj = {};
        let result = patternUtil.AdEncrypt(obj);
        result.should.String();
        done();
    })
})