/**
 * Created by Szane on 16/10/25.
 */

var commonUtil = require('mp-common-util');
var resUtil = commonUtil.responseUtil;
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Department.js');
var departmentDAO = require('../dao/DepartmentDAO.js');
var moduleMessage = require('../util/ModuleMessage.js');
var Seq = require('seq');

function addDepartment(req, res, next) {
    var params = req.params;
    Seq().seq(function () {
        var that = this;
        departmentDAO.getDepartment({
            departmentName: params.departmentName,
            bizId: params.bizId
        }, function (error, rows) {
            if (error) {
                logger.error(' getDepartment ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    resUtil.resetFailedRes(res, moduleMessage.ERROR_DEPARTMENT_ADDED);
                    return next();
                } else
                    that();
            }
        });
    }).seq(function () {
        departmentDAO.addDepartment({
            departmentName: params.departmentName,
            bizId: params.bizId
        }, function (error, result) {
            if (error) {
                logger.error(' addDepartment ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                resUtil.resetCreateRes(res, result);
                return next();
            }
        })
    });
}
function getDepartment(req, res, next) {
    var params = req.params;
    departmentDAO.getDepartment(params, function (error, rows) {
        if (error) {
            logger.error(' addDepartment ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetQueryRes(res, rows);
            return next();
        }
    });
}
function getDepartmentCount(req, res, next) {
    var params = req.params;
    departmentDAO.getDepartmentCount(params, function (error, rows) {
        if (error) {
            logger.error(' getDepartmentCount ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetQueryRes(res, rows);
            return next();
        }
    });
}
function updateDepartment(req, res, next) {
    var params = req.params;
    departmentDAO.updateDepartment(params, function (error, result) {
        if (error) {
            logger.error(' updateDepartment ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetUpdateRes(res, result);
            return next();
        }
    });
}
function deleteDepartment(req, res, next) {
    var params = req.params;
    departmentDAO.deleteDepartment(params, function (error, result) {
        if (error) {
            logger.error(' deleteDepartment ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetUpdateRes(res, result);
            return next();
        }
    });
}
module.exports = {
    addDepartment: addDepartment,
    getDepartment: getDepartment,
    updateDepartment: updateDepartment,
    deleteDepartment: deleteDepartment,
    getDepartmentCount: getDepartmentCount
};