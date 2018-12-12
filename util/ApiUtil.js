/**
 * Created by ling xue on 14-5-22.
 */
var oAuthUtil = require('mp-common-util').oauthUtil;
var mdb = require('../db/MongoCon.js');
var sysMsg = require('mp-common-util').systemMsg;
var sysError = require('mp-common-util').systemError;
var Seq = require('seq');

function save(req ,res ,next){
    //console.log(new Date().getTime());
    var url = req.url;
    if(url.indexOf('?') >0){
        //console.log(url);
        url = url.substring(0,url.indexOf('?'));

    }
    if(!url.toLowerCase().match(".json|.html|.png|.css|.js|.jpg|.woff|.map|.gif|.ico" )){
        //console.log(url);
        var apiObj = {};
        apiObj.url = url;
        if(req.route){
            apiObj.path = req.route.path;
        }

        apiObj.referer = req.headers.referer;
        apiObj.method = req.method;
        apiObj.userAgent = req.headers['user-agent'];
        //apiObj.token = req.headers['auth-token'];
        if(req.headers['auth-token'] ){
            var tokenInfo = oAuthUtil.parseAccessToken(req.headers['auth-token']);
            apiObj.userId = tokenInfo.userId;

        }
        apiObj.statusCode = res.statusCode;
        apiObj.time = req._time;
        apiObj.params = req.params;
        //console.log(apiObj);
        mdb.getDb(function(error,db){
            if(error){
                throw sysError.InternalError(error.message,sysMsg.SYS_ADD_API_RECORD_ERROR);
            }
            db.collection("api_records").insert(apiObj,function(error,record){
                if(error){
                    throw sysError.InternalError(error.message,sysMsg.SYS_ADD_API_RECORD_ERROR);
                }
                //console.log("End Time :"+new Date().getTime()+"---->")+record[0]._id.toString();
            });

        })
    }
    //next();
}


function testDbRef(req,res,next){

}

module.exports = {
    save : save ,
    testDbRef :testDbRef
}