/**
 * Created by ling xue on 2016/3/7.
 */
var db=require('../db/db.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserSmsDAO.js');

function addSms(params,callback){
    var query = " insert into user_sms (phone,code,sms_type) values (?,?,?) ";
    var paramArray=[],i=0;
    paramArray[i++]=params.phone;
    paramArray[i++]=params.code;
    paramArray[i]=params.smsType;

    db.dbQuery(query,paramArray,function(error,rows){
        logger.debug('addSms');
        return callback(error,rows);
    });
}

function querySms(params,callback){
    var query = " select * from user_sms where phone = ? "
    var paramArray=[],i=0;
    paramArray[i++]=params.phone;
    if(params.code){
        paramArray[i++]=params.code;
        query += " and code = ? "
    }
    if(params.smsType){
        paramArray[i++]=params.smsType;
        query += " and sms_type = ? "
    }
    db.dbQuery(query,paramArray,function(error,rows){
        logger.debug('querySms');
        return callback(error,rows);
    });
}

function updateSms(params,callback){
    var query = " update user_sms set code=? where phone = ? and sms_type = ? "
    var paramArray=[],i=0;
    paramArray[i++]=params.code;
    paramArray[i++]=params.phone;
    paramArray[i]=params.smsType;

    db.dbQuery(query,paramArray,function(error,rows){
        logger.debug('updateSms');
        return callback(error,rows);
    });
}


module.exports = {
    addSms : addSms ,
    querySms : querySms ,
    updateSms : updateSms
}