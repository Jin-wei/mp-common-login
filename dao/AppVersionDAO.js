/**
 * Created by Szane on 2016/7/4.
 */
var db = require('../db/db.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('AppVersionDAO.js');

function getAppVersion(params, callback) {
    var query = "select * from app_version where app_type = ? ";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.appType;
    if (params.appVersionName != null) {
        query += " and app_version_name = ? ";
        paramsArr[i++] = params.appVersionName;
    }
    query += " order by id desc ";
    if (params.last == 1) {
        query += " limit 0,1 ";
    }
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getAppVersion ');
        callback(error, rows);
    });
}
function createAppVersion(params, callback) {
    var query = "insert into app_version (app_type,app_version_name,update_type,app_url,remark,img_url,status) " +
        "values (?,?,?,?,?,?,?) ";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.appType;
    paramsArr[i++] = params.appVersionName;
    paramsArr[i++] = params.updateType;
    paramsArr[i++] = params.appUrl;
    paramsArr[i++] = params.remark;
    paramsArr[i++] = params.imgUrl;
    paramsArr[i++] = params.status;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' createAppVersion ');
        callback(error, result);
    });
}
function addAppDownloadCount(params, callback) {
    var query = ' insert into sinotrans_core.app_download_count(type) values (?) ';
    db.dbQuery(query, [5], function (error, result) {
        logger.debug(' addAppDownloadCount ');
        callback(error, result);
    });
}
function getAppDownloadCount(params, callback) {
    var query = 'select count(*) as count from sinotrans_core.app_download_count where 1=1 ';
    db.dbQuery(query, [], function (error, result) {
        logger.debug(' getAppDownloadCount ');
        callback(error, result);
    });
}

module.exports = {
    getAppVersion: getAppVersion,
    createAppVersion: createAppVersion,
    addAppDownloadCount: addAppDownloadCount,
    getAppDownloadCount: getAppDownloadCount
};
