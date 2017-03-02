var should = require('should');
var patternUtil = require('../routes/patternUtil');

describe('AdEncrypt', function(){
    it('should return code(string) after encrypt object by AES', function(done){
        let obj = {};
        let result = patternUtil.AdEncrypt(obj);
        result.should.String();
        done();
    })
});

describe('getRegex', function(){
    it('should return Keyword - itri', function(done){
        let domain = "mweb.gomaji.com";        
        let result = patternUtil.getRegex(domain);
        console.log(result.regex);
	    result.should.String();	
        done();
    })
});