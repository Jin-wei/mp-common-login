/**
 * Created by Szane on 16/12/10.
 */
var db = require('../db/db.js');
var redis = require('../dao/RedisDAO.js');
var encrypt = require('mp-common-util').encrypt;
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CoreBizConfigDAO.js');


function createCoreBizParam(params, callback) {
    var query = ' insert into core_biz_config (param_name,param_value,remark) values (?,?,?) ';
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.paramName;
    paramsArr[i++] = params.paramValue;
    paramsArr[i++] = params.remark;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' createCoreBizParam ');
        // if (result && result.insertId)
        //     redis.setObjectVal({
        //         key: 'core_biz_config_' + result.insertId + params.paramName,
        //         value: paramsArr
        //     }, function (error, result) {
        //         if (error)
        //             logger.error(' setObjectVal ' + error.message);
        //     });
        callback(error, result);
    });

}
function getCoreBizParam(params, callback) {
    var query = ' select * from core_biz_config where 1=1 ';
    var paramsArr = [], i = 0;
    if (params.paramName != null) {
        paramsArr[i++] = params.paramName;
        query += ' and param_name = ? ';
    }
    // var key = 'core_biz_config' + encrypt.encryptByMd5(query + JSON.stringify(paramsArr));
    // redis.getObjectVal({key: key}, function (error, rows) {
    //     if (rows) {
    //         callback(error, rows);
    //         return;
    //     }
    //     if (error) {
    //         logger.error(' getObjectVal ' + error.message);
    //     }
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getCoreBizParam ');
        // redis.setObjectVal({
        //     key: key,
        //     value: rows
        // }, function (error, result) {
        //     logger.debug(' getCoreBizParam:setObjectVal ');
        //     logger.debug(error || result);
        // });
        callback(error, rows);
    });
    // });
}
function updateCoreBizParam(params, callback) {
    var query = ' update core_biz_config set id = id ';
    var paramsArr = [], i = 0;
    if (params.paramName != null) {
        paramsArr[i++] = params.paramName;
        query += ' ,param_name = ? ';
    }
    if (params.paramValue != null) {
        paramsArr[i++] = params.paramValue;
        query += ' ,param_value = ? ';
    }
    if (params.remark != null) {
        paramsArr[i++] = params.remark;
        query += ' ,remark = ? ';
    }
    query += ' where id = ? ';
    paramsArr[i++] = params.paramId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateCoreBizParam ');
        callback(error, result);
    });
}
function deleteCoreBizParam(params, callback) {
    var query = ' delete from core_biz_config where id = ? ';
    db.dbQuery(query, [params.paramId], function (error, result) {
        logger.debug(' deleteCoreBizParam ');
        callback(error, result);
    });
}

module.exports = {
    createCoreBizParam: createCoreBizParam,
    getCoreBizParam: getCoreBizParam,
    updateCoreBizParam: updateCoreBizParam,
    deleteCoreBizParam: deleteCoreBizParam
};