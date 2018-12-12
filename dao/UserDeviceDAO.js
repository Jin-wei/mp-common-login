/**
 * Created by Szane on 2016/7/4.
 */
var db = require('../db/db.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserDeviceDAO.js');

function createUserDevice(params, callback) {
    var query = "insert into user_device (user_id,device_token,device_type,device_account,sound_type) values " +
        "(?,?,?,?,?) ";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.userId;
    paramsArr[i++] = params.deviceToken;
    paramsArr[i++] = params.deviceType;
    paramsArr[i++] = params.deviceAccount;
    paramsArr[i++] = params.soundType;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' createUserDevice ');
        callback(error, result);
    });
}
function getUserDevice(params, callback) {
    var query = "select * from user_device where 1=1 ";
    var paramsArr = [], i = 0;
    if (params.userNo != null) {
        query += " and user_id = ? ";
        paramsArr[i++] = params.userNo;
    }
    if (params.deviceToken != null) {
        query += " and device_token = ? ";
        paramsArr[i++] = params.deviceToken;
    }
    if (params.deviceType != null) {
        query += " and device_type = ? ";
        paramsArr[i++] = params.deviceType;
    }
    if (params.deviceAccount != null) {
        query += " and device_account = ? ";
        paramsArr[i++] = params.deviceAccount;
    }
    if (params.soundType != null) {
        query += " and sound_type = ? ";
        paramsArr[i++] = params.soundType;
    }
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getUserDevice ');
        callback(error, rows);
    });
}
function deleteUserDevice(params, callback) {
    var query = "delete from user_device where 1=1 ";
    var paramsArr = [], i = 0;
    if (params.userId != null) {
        query += " and user_id = ? ";
        paramsArr[i++] = params.userId;
    }
    if (params.deviceToken != null) {
        query += " and device_token = ? ";
        paramsArr[i++] = params.deviceToken;
    }
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' deleteUserDevice ');
        callback(error, result);
    });
}
module.exports = {
    createUserDevice: createUserDevice,
    getUserDevice: getUserDevice,
    deleteUserDevice: deleteUserDevice
};