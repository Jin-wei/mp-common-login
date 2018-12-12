/**
 * Created by Szane on 2016/7/4.
 */
var commonUtil = require('mp-common-util');
var resUtil = commonUtil.responseUtil;
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('AppVersion.js');
var moduleMessage = require('../util/ModuleMessage.js')
var userDeviceDAO = require('../dao/UserDeviceDAO.js');
var Seq = require('seq');

function createUserDevice(req, res, next) {
    var params = req.params;
    Seq().seq(function () {
        var that = this;
        var subParams = {
            userId: params.userNo,
            deviceToken: params.deviceToken
        };
        userDeviceDAO.getUserDevice(subParams, function (error, rows) {
            if (error) {
                logger.error(' getUserDevice ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    logger.warn(' getUserDevice ' + moduleMessage.ERROR_DEVICE_TOKEN_ADDED);
                    resUtil.resetFailedRes(res, moduleMessage.ERROR_DEVICE_TOKEN_ADDED);
                    return next();
                } else {
                    that();
                }
            }
        });
    }).seq(function () {
        userDeviceDAO.createUserDevice(params, function (error, result) {
            if (error) {
                logger.error(' createUserDevice ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                resUtil.resetCreateRes(res, result);
                return next();
            }
        });
    });
}
function getUserDevice(req, res, next) {
    var params = req.params;
    userDeviceDAO.getUserDevice(params, function (error, rows) {
        if (error) {
            logger.error(' getUserDevice ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetQueryRes(res, rows);
            return next();
        }
    });
}
function deleteUserDevice(req, res, next) {
    var params = req.params;
    userDeviceDAO.deleteUserDevice(params, function (error, result) {
        if (error) {
            logger.error(' deleteUserDevice ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetUpdateRes(res, result);
            return next();
        }
    });
}
module.exports = {
    createUserDevice: createUserDevice,
    getUserDevice: getUserDevice,
    deleteUserDevice: deleteUserDevice
};