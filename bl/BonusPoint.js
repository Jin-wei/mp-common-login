/**
 * Created by Szane on 17/1/11.
 */
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('BonusPoint.js');
var commonUtil = require('mp-common-util');
var resUtil = commonUtil.responseUtil;
var httpUtil = commonUtil.httpUtil;
var Seq = require('seq');
var bonusPointDAO = require('../dao/BonusPointDAO.js');
var roleBase = require('./RoleBase.js');
var config = require('../config/SystemConfig.js');


function createBonusPoint(req, res, next) {
    var params = req.params;
    bonusPointDAO.createBonusPoint(params, function (error, result) {
        if (error) {
            logger.error(' createBonusPoint ');
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetCreateRes(res, result);
        return next();
    });
}
function updateBonusPoint(req, res, next) {
    var params = req.params;
    bonusPointDAO.updateBonusPoint(params, function (error, result) {
        if (error) {
            logger.error(' updateBonusPoint ');
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetUpdateRes(res, result);
        return next();
    });
}
function changeBonusPointByConfig(req, res, next) {
    var params = req.params;
    logger.debug('point' + params.point);
    var bonusConfig = {}, bonusRecord = {}, point = params.point || 0;
    Seq().seq(function () {
        var that = this;
        bonusPointDAO.getBonusConfig({
            actionId: params.bonusType
        }, function (error, result) {
            if (error) {
                logger.error(' getBonusConfig ' + error.message);
                resUtil.resInternalError(error, res, next);
            }
            if (result && result.length > 0)
                bonusConfig = result[0];
            that();
        });
    }).seq(function () {
        var that = this;
        bonusPointDAO.getBonusPoint({
            userNo: params.userNo
        }, function (error, result) {
            if (error) {
                logger.error(' getBonusPoint ' + error.message);
                resUtil.resInternalError(error, res, next);
            }
            if (result && result.length > 0)
                bonusRecord = result[0];
            that();
        });
    }).seq(function () {
        var that = this;
        bonusPointDAO.updateBonusPoint({
            bonusId: bonusRecord.id,
            totalPoint: parseInt(bonusRecord.total_point) + parseInt(point || bonusConfig.point)
        }, function (error, result) {
            if (error) {
                logger.error(' updateBonusPoint ' + error.message);
                resUtil.resInternalError(error, res, next);
            }
            if (result && result.affectedRows > 0)
                that();

        });
    }).seq(function () {
        bonusPointDAO.createBonusPointHistory({
            bonusId: bonusRecord.id,
            userNo: params.userNo,
            orderId: params.orderId,
            actionId: bonusConfig.id,
            actionName: bonusConfig.action_name,
            type: bonusConfig.type,
            point: params.point || bonusConfig.point,
            remainPoint: parseInt(bonusRecord.total_point) + parseInt(point || bonusConfig.point)
        }, function (error, result) {
            if (error) {
                logger.error(' updateBonusPoint ' + error.message);
                resUtil.resInternalError(error, res, next);
            }
            resUtil.resetUpdateRes(res, result);
            return next();
        });
    });
}
function getBonusPoint(req, res, next) {
    var params = req.params;
    bonusPointDAO.getBonusPoint(params, function (error, result) {
        if (error) {
            logger.error(' getBonusPoint ');
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetQueryRes(res, result);
        return next();
    });
}
function getBonusPointCount(req, res, next) {
    var params = req.params;
    bonusPointDAO.getBonusPointCount(params, function (error, result) {
        if (error) {
            logger.error(' getBonusPointCount ');
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetQueryRes(res, result);
        return next();
    });
}
function createBonusPointHistory(req, res, next) {
    var params = req.params;
    bonusPointDAO.createBonusPointHistory(params, function (error, result) {
        if (error) {
            logger.error(' createBonusPointHistory ');
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetCreateRes(res, result);
        return next();
    });
}
function getBonusPointHistory(req, res, next) {
    var params = req.params;
    bonusPointDAO.getBonusPointHistory(params, function (error, result) {
        if (error) {
            logger.error(' getBonusPointHistory ');
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetQueryRes(res, result);
        return next();
    });
}
function getBonusPointHistoryCount(req, res, next) {
    var params = req.params;
    bonusPointDAO.getBonusPointHistoryCount(params, function (error, result) {
        if (error) {
            logger.error(' getBonusPointHistoryCount ');
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetQueryRes(res, result);
        return next();
    });
}
function getBonusConfig(req, res, next) {
    var params = req.params;
    bonusPointDAO.getBonusConfig(params, function (error, result) {
        if (error) {
            logger.error(' getBonusConfig ');
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetQueryRes(res, result);
        return next();
    });
}
function updateBonusConfig(req, res, next) {
    var params = req.params;
    bonusPointDAO.updateBonusConfig(params, function (error, result) {
        if (error) {
            logger.error(' updateBonusConfig ');
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetUpdateRes(res, result);
        return next();
    });
}
function updateBonusPointHistoryStatus(req, res, next) {
    var params = req.params;
    bonusPointDAO.updateBonusPointHistoryStatus(params, function (error, result) {
        if (error) {
            logger.error(' updateBonusPointHistoryStatus ');
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetUpdateRes(res, result);
        return next();
    });
}
module.exports = {
    createBonusPoint: createBonusPoint,
    updateBonusPoint: updateBonusPoint,
    getBonusPoint: getBonusPoint,
    getBonusPointCount: getBonusPointCount,
    createBonusPointHistory: createBonusPointHistory,
    getBonusPointHistory: getBonusPointHistory,
    getBonusPointHistoryCount: getBonusPointHistoryCount,
    getBonusConfig: getBonusConfig,
    updateBonusConfig: updateBonusConfig,
    changeBonusPointByConfig: changeBonusPointByConfig,
    updateBonusPointHistoryStatus: updateBonusPointHistoryStatus
};