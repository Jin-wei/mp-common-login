/**
 * Created by Szane on 2016/4/26.
 */
var commonUtil = require('mp-common-util');
var resUtil = commonUtil.responseUtil;
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('VerifyHistoryDAO.js');
var verifyHistoryDAO = require('../dao/VerifyHistoryDAO.js');

function getVerifyHistory(req, res, next) {
    var params = req.params;
    verifyHistoryDAO.getVerifyHistory(params, function (error, rows) {
        if (error) {
            logger.error(' getVerifyHistory ' + error.message);
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetQueryRes(res, rows);
        return next();
    });
}
function addVerifyHistory(req, res, next) {
    var params = req.params;
    params.opUser = params.adminId;
    verifyHistoryDAO.createVerifyHistory(params, function (error, result) {
        if (error) {
            logger.error(' addVerifyHistory ', error.message);
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetCreateRes(res, result);
        return next();
    });
}
module.exports = {
    getVerifyHistory: getVerifyHistory,
    addVerifyHistory: addVerifyHistory
};
