/**
 * Created by Szane on 16/12/10.
 */

var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CoreBizConfig.js');
var coreBizConfigDAO = require('../dao/CoreBizConfigDAO.js');
var commonUtil = require('mp-common-util');
var resUtil = commonUtil.responseUtil;

function createCoreBizParam(req, res, next) {
    var params = req.params;
    coreBizConfigDAO.createCoreBizParam(params, function (error, result) {
        if (error) {
            logger.error(' createCoreBizParam ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetCreateRes(res, result);
            return next();
        }
    });
}
function getCoreBizParam(req, res, next) {
    var params = req.params;
    coreBizConfigDAO.getCoreBizParam(params, function (error, rows) {
        if (error) {
            logger.error(' getCoreBizParam ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetQueryRes(res, rows);
            return next();
        }
    });
}
function updateCoreBizParam(req, res, next) {
    var params = req.params;
    coreBizConfigDAO.updateCoreBizParam(params, function (error, result) {
        if (error) {
            logger.error(' updateCoreBizParam ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetUpdateRes(res, result);
            return next();
        }
    });
}
function deleteCoreBizParam(req, res, next) {
    var params = req.params;
    coreBizConfigDAO.deleteCoreBizParam(params, function (error, result) {
        if (error) {
            logger.error(' deleteCoreBizParam ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetUpdateRes(res, result);
            return next();
        }
    });
}

module.exports = {
    createCoreBizParam: createCoreBizParam,
    getCoreBizParam: getCoreBizParam,
    updateCoreBizParam: updateCoreBizParam,
    deleteCoreBizParam: deleteCoreBizParam
};