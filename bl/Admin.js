/**
 * Created by Szane on 2016/5/6.
 */
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Admin.js');
var userInfoDAO = require('../dao/UserInfoDAO.js');
var commonUtil = require('mp-common-util');
var sysMsg = commonUtil.systemMsg;
var resUtil = commonUtil.responseUtil;
var oAuthUtil = require('../util/OAuthUtil.js');
var listOfValue = require('../util/ListOfValue.js');
var roleBase = require('./RoleBase.js');
var Seq = require('seq');
var encrypt = commonUtil.encrypt;
var moduleMessage = require('../util/ModuleMessage.js');

function adminLogin(req, res, next) {
    var params = req.params;
    var user = {};
    userInfoDAO.getAdmin({
        username: params.username,
        password: encrypt.encryptByMd5(params.password),
        adminStatus: listOfValue.ADMIN_STATUS_ACTIVE
    }, function (error, rows) {
        if (error) {
            logger.error(' adminLogin ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            if (rows && rows.length > 0) {
                user = rows[0];
                var deviceType = oAuthUtil.getRequestDevice(req.headers['User-Agent']);
                user.subType = rows[0].admin_type;
                user.status = rows[0].admin_status;
                //创建accessToken
                user.accessToken = 'ADMIN_' + oAuthUtil.createAccessToken(user.id, listOfValue.USER_TYPE_ADMIN, user.subType,
                        user.admin_status, deviceType);
                roleBase.saveAccessToken(user, deviceType);
                user.password = null;
                resUtil.resetQueryRes(res, user);
                return next();
            } else {
                logger.error(' adminLogin ' + sysMsg.CUST_LOGIN_PSWD_ERROR);
                resUtil.resetFailedRes(res, sysMsg.CUST_LOGIN_PSWD_ERROR);
                return next();
            }
        }
    });
}
function getAdmin(req, res, next) {
    var params = req.params;
    userInfoDAO.getAdmin(params, function (error, rows) {
        if (error) {
            logger.error(' getAdmin ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetQueryRes(res, rows);
            return next();
        }
    });
}
function createAdmin(req, res, next) {
    var params = req.params;
    var user = {};
    Seq().seq(function () {
        var that = this;
        userInfoDAO.getAdmin({
            username: params.username,
            adminStatus: listOfValue.ADMIN_STATUS_ACTIVE
        }, function (error, rows) {
            if (error) {
                logger.error(' getAdmin ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    logger.warn(' getAdmin ' + params.phone + moduleMessage.ERROR_USER_NAME_ADDED);
                    resUtil.resetFailedRes(res, moduleMessage.ERROR_USER_NAME_ADDED);
                    return next();
                } else {
                    that();
                }
            }
        });
    }).seq(function () {
        var subParams = {
            username: params.username,
            name: params.name,
            password: encrypt.encryptByMd5('111111'),
            phone: params.phone,
            adminType: params.adminType
        };
        userInfoDAO.createAdmin(subParams, function (error, result) {
            if (error) {
                logger.error(' createAdmin ' + result.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (result && result.affectedRows > 0) {
                    user.adminId = result.insertId;
                    resUtil.resetQueryRes(res, user);
                    return next();
                } else {
                    resUtil.resetFailedRes(res, result.message);
                    return next();
                }
            }
        });
    });
}
//删除用户
function removeAdmin(req, res, next) {
    var params = req.params;
    userInfoDAO.updateAdminStatus({
        adminId: params.adminId,
        adminStatus: listOfValue.ADMIN_STATUS_DROP
    }, function (error, result) {
        if (error) {
            logger.error(' updateAdminStatus ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetUpdateRes(res, result);
            return next();
        }
    });
}
//重置密码
function resetPassword(req, res, next) {
    var params = req.params;
    userInfoDAO.updateAdminPassword({
        adminId: params.adminId,
        password: encrypt.encryptByMd5('111111')
    }, function (error, result) {
        if (error) {
            logger.error(' updateAdminPassword ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            roleBase.resetAdmin(function (error, result) {
                if (error) {
                    logger.error(error);
                }
            });
            resUtil.resetUpdateRes(res, result);
            return next();
        }
    });
}
function updateAdminType(req, res, next) {
    var params = req.params;
    userInfoDAO.updateAdminType({
        adminId: params.adminId,
        adminType: params.adminType
    }, function (error, result) {
        if (error) {
            logger.error(' updateAdminType ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetUpdateRes(res, result);
            return next();
        }
    });
}

function adminLogout(req, res, next) {
    roleBase.removeAccessToken(req.headers[oAuthUtil.headerTokenMeta], function (error, result) {
        if (error) {
            logger.warn('userLogOut remove server token ' + error.message)
        }
    });
    resUtil.resetSuccessRes(res);
    return next();
}
function modifyAdminPassword(req, res, next) {
    var params = req.params;
    params.password = encrypt.encryptByMd5(params.oriPswd);
    var adminUser;
    Seq().seq(function () {
        var that = this;
        userInfoDAO.getAdmin({username: params.username, password: params.password}, function (error, rows) {
            if (error) {
                logger.error(' modifyAdminPassword ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    adminUser = rows[0];
                    that();
                } else {
                    logger.error(' modifyAdminPassword ' + sysMsg.CUST_ORIGIN_PSWD_ERROR);
                    resUtil.resetFailedRes(res, sysMsg.CUST_ORIGIN_PSWD_ERROR);
                    return next();
                }
            }
        });
    }).seq(function () {
        userInfoDAO.updateAdminPassword({
            password: encrypt.encryptByMd5(params.newPswd),
            adminId: adminUser.id
        }, function (error, result) {
            if (error) {
                logger.error(' modifyAdminPassword ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (result && result.affectedRows > 0) {
                    res.send(200, {success: true});
                } else {
                    logger.error(' modifyAdminPassword ' + result.message);
                    resUtil.resetFailedRes(res, result.message);
                }
                roleBase.resetAdmin(function (error, result) {
                    if (error) {
                        logger.error(error);
                    } else
                        logger.debug(result);
                });
                return next();
            }
        });
    });
}
module.exports = {
    adminLogin: adminLogin,
    adminLogout: adminLogout,
    createAdmin: createAdmin,
    removeAdmin: removeAdmin,
    resetPassword: resetPassword,
    updateAdminType: updateAdminType,
    modifyAdminPassword: modifyAdminPassword,
    getAdmin: getAdmin
};