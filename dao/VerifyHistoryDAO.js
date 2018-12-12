/**
 * Created by Szane on 2016/4/26.
 */
var db = require('../db/db.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('VerifyHistoryDAO.js');

function getVerifyHistory(params, callback) {
    var query = "select vh.*,au.name from verify_history vh left join admin_user au on vh.op_user = au.id " +
        "where vh.id is not null ";
    var paramsArr = [], i = 0;
    if (params.verifyId) {
        paramsArr [i++] = params.verifyId;
        query += " and vh.verify_id = ? ";
    }
    if (params.verifyType != null && params.verifyType != '') {
        paramsArr[i++] = params.verifyType;
        query += " and vh.verify_type = ? ";
    }
    if (params.startDate) {
        paramsArr[i++] = params.startDate + " 00:00:00";
        query += " and vh.created_on >= ?  ";
    }
    if (params.endDate) {
        paramsArr[i++] = params.endDate + " 23:59:59";
        query += " and vh.created_on <= ?  ";
    }
    query += " order by vh.created_on desc ";
    if (params.start && params.size) {
        paramsArr[i++] = parseInt(params.start);
        paramsArr[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getVerifyHistory ');
        callback(error, rows);
    });

}
function createVerifyHistory(params, callback) {
    var query = "insert into verify_history (verify_id,verify_type,remark,verify_status,op_user) values (?,?,?,?,?) ";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.verifyId;
    paramsArr[i++] = params.verifyType;
    paramsArr[i++] = params.remark;
    paramsArr[i++] = params.verifyStatus;
    paramsArr[i++] = params.opUser;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' createVerifyHistory ');
        callback(error, result);
    });
}
module.exports = {
    getVerifyHistory: getVerifyHistory,
    createVerifyHistory: createVerifyHistory
};