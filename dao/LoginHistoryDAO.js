/**
 * Created by Szane on 17/2/8.
 */
var db = require('../db/db.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('LoginHistoryDAO.js');

function getLoginHistory(params, callback) {
    var query = ' select * from login_history where 1=1 ';
    var paramsArr = [], i = 0;
    if (params.userId != null) {
        paramsArr[i++] = params.userId;
        query += ' and user_id = ? ';
    }
    if (params.date != null) {
        paramsArr[i++] = params.date;
        query += ' and date(?) = date(created_on) ';
    }
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' getLoginHistory ');
        callback(error, result);
    });
}
function createLoginHistory(params, callback) {
    var query = ' insert into login_history (user_id,type) values (?,?) ';
    var paramsArr = [], i = 0;
    paramsArr [i++] = params.userId;
    paramsArr[i++] = params.type;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' createLoginHistory ');
        callback(error, result);
    });
}
module.exports = {
    createLoginHistory: createLoginHistory,
    getLoginHistory: getLoginHistory
};