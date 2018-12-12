/**
 * 车辆管理
 * Created by Szane on 2016/4/21.
 */
var commonUtil = require('mp-common-util');
var resUtil = commonUtil.responseUtil;
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Truck.js');
var Seq = require('seq');
var truckDAO = require('../dao/TruckDAO.js');
var moduleMessage = require('../util/ModuleMessage.js');
var roleBase = require('../bl/RoleBase.js');
var httpUtil = commonUtil.httpUtil;
var notifyTemplate = require('../util/NotifyTemplate.js');
var sysConfig = require('../config/SystemConfig.js');

function getTruck(req, res, next) {
    var params = req.params;
    truckDAO.getTruck(params, function (error, rows) {
        if (error) {
            logger.error(' getTruck ' + error.message);
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetQueryRes(res, rows);
        return next();
    });
}
function addTruck(req, res, next) {
    var params = req.params;
    params.opUser = params.adminId;
    Seq().seq(function () {
        var that = this;
        var subParams = {
            truckNum: params.truckNum
        };
        truckDAO.getTruck(subParams, function (error, rows) {
            if (error) {
                logger.error(' createTruck:getTruck ', error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    logger.error(' createTruck ', moduleMessage.ERROR_TRUCK_ADDED);
                    resUtil.resetFailedRes(res, moduleMessage.ERROR_TRUCK_ADDED);
                } else {
                    that();
                }
            }
        });
    }).seq(function () {
        truckDAO.createTruck(params, function (error, result) {
            if (error) {
                logger.error(' createTruck ', error.message);
                resUtil.resInternalError(error, res, next);
            }
            var template = notifyTemplate.ADMIN_TRUCK_VERIFY;
            var content = template.content.replace('{@@}', params.truckNum);
            roleBase.getReqWithToken(function (error, request) {
                httpUtil.httpPost(sysConfig.stiHost, '/api/email', request, {
                    emailTo: sysConfig.xmlAdminEmail,
                    title: notifyTemplate.ADMIN_TRUCK_VERIFY.title,
                    content: content
                }, function (error, result) {
                    if (error)
                        logger.error(' sendEmail ' + error.message);
                });
            });
            resUtil.resetCreateRes(res, result);
            return next();
        });
    });
}
function updateTruck(req, res, next) {
    var params = req.params;
    params.opUser = params.adminId;
    truckDAO.updateTruck(params, function (error, result) {
        if (error) {
            logger.error(' updateTruck ' + error.message);
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetUpdateRes(res, result);
        return next();
    });
}
function updateTruckStatus(req, res, next) {
    var params = req.params;
    params.opUser = params.adminId;
    truckDAO.updateTruckStatus(params, function (error, result) {
        if (error) {
            logger.error(' updateTruckStatus ' + error.message);
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetUpdateRes(res, result);
        return next();
    });
}
function updateTruckActive(req, res, next) {
    var params = req.params;
    params.opUser = params.adminId;
    truckDAO.updateTruckActive(params, function (error, result) {
        if (error) {
            logger.error(' updateTruckActive ' + error.message);
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetUpdateRes(res, result);
        return next();
    });
}
function getTruckCount(req, res, next) {
    var params = req.params;
    truckDAO.getTruckCount(params, function (error, result) {
        if (error) {
            logger.error(' getTruckCount ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetQueryRes(res, result);
            return next();
        }
    });
}
function getTruckCountByBiz(req, res, next) {
    var params = req.params;
    truckDAO.getTruckCountByBiz(params, function (error, result) {
        if (error) {
            logger.error(' getTruckCountByBiz ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            if (result && result.length > 0) {
                resUtil.resetQueryRes(res, result);
            } else {
                logger.error(' getTruckCountByBiz ' + result.message);
                resUtil.resetFailedRes(res, result.message);
            }
            return next();
        }
    })
}
function getActiveTruckCount(req, res, next) {
    var params = req.params;
    truckDAO.getActiveTruckCount({}, function (error, rows) {
        if (error) {
            logger.error(' getActiveTruckCount ');
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetQueryRes(res, rows);
        return next();
    });
}
function getActiveTruck(req, res, next) {
    var params = req.params;
    truckDAO.getActiveTruck({}, function (error, rows) {
        if (error) {
            logger.error(' getActiveTruck ');
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetQueryRes(res, rows);
        return next();
    });
}
module.exports = {
    getTruck: getTruck,
    addTruck: addTruck,
    updateTruck: updateTruck,
    updateTruckStatus: updateTruckStatus,
    updateTruckActive: updateTruckActive,
    getTruckCount: getTruckCount,
    getTruckCountByBiz: getTruckCountByBiz,
    getActiveTruckCount: getActiveTruckCount,
    getActiveTruck: getActiveTruck
};