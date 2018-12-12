/**
 * Created by Szane on 2016/4/20.
 */

var commonUtil = require('mp-common-util');
var sysMsg = commonUtil.systemMsg;
var resUtil = commonUtil.responseUtil;
var httpUtil = commonUtil.httpUtil;
var encrypt = commonUtil.encrypt;
var listOfValue = require('../util/ListOfValue.js');
var moduleMessage = require('../util/ModuleMessage.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Driver.js');
var sysConfig = require('../config/SystemConfig.js');
var Seq = require('seq');
var driverDAO = require('../dao/DriverDAO.js');
var userInfoDAO = require('../dao/UserInfoDAO.js');
var bizDAO = require('../dao/BizDAO.js');
var redisDAO = require('../dao/RedisDAO.js');
var notifyTemplate = require('../util/NotifyTemplate.js');
var roleBase = require('../bl/RoleBase.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var bonusPointDAO = require('../dao/BonusPointDAO.js');

function addDriver(req, res, next) {
    var params = req.params;
    params.opUser = params.adminId;
    Seq().seq(function () {
        var that = this;
        var subParams = {
            licNum: params.licNum
        };
        driverDAO.getDriver(subParams, function (error, rows) {
            if (error) {
                logger.error(' addDriver:getDriver ', error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    logger.error(' addDriver:getDriver ', moduleMessage.ERROR_DRIVER_ADDED);
                    resUtil.resetFailedRes(res, moduleMessage.ERROR_DRIVER_ADDED);
                } else {
                    that();
                }
            }
        })
    }).seq(function () {
        driverDAO.createDriver(params, function (error, result) {
            if (error) {
                logger.error(' createDriver ', error.message);
                resUtil.resInternalError(error, res, next);
            }
            resUtil.resetCreateRes(res, result);
            return next();
        });
    });
}
function driverRegister(req, res, next) {
    var params = req.params;
    var userId;
    var user = {};
    if (params.referId == 0 || params.referId == null) {
        logger.warn(' createDriver:getDriver ', sysMsg.ACCESS_TOKEN_NOT_ACTIVE);
        resUtil.resetFailedRes(res, sysMsg.ACCESS_TOKEN_NOT_ACTIVE);
        return next();
    }
    Seq().seq(function () {
        var that = this;
        var subParams = {
            driverId: params.referId
        };
        driverDAO.getDriver(subParams, function (error, rows) {//查询已有的driver
            if (error) {
                logger.error(' createDriver ', error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows[0]) {
                    if (rows[0].userId) {
                        logger.warn(' createDriver:getDriver ', sysMsg.CUST_SIGNUP_PHONE_REGISTERED);
                        resUtil.resetFailedRes(res, sysMsg.CUST_SIGNUP_PHONE_REGISTERED);
                        return next();
                    } else if (rows[0].status != listOfValue.DRIVER_STATUS_VERIFIED) {
                        logger.warn(' createDriver:getDriver ', moduleMessage.ERROR_VERIFY_YET);
                        resUtil.resetFailedRes(res, moduleMessage.ERROR_VERIFY_YET);
                        return next();
                    } else {
                        that();
                    }
                } else {
                    logger.warn(' createDriver:getDriver ', sysMsg.CUST_ACTIVE_STATE_ERROR);
                    resUtil.resetFailedRes(res, sysMsg.CUST_ACTIVE_STATE_ERROR);
                    return next();
                }
            }
        })
    }).seq(function () {
        var that = this;
        var subParams = {
            phone: params.phone
        };
        userInfoDAO.getUser(subParams, function (error, rows) {//查询手机是否被占用
            if (error) {
                logger.error(' driverRegister:getUser ' + error.message);
                resUtil.resetFailedRes(res, rows.message);
                return next();
            }
            if (rows && rows.length > 0) {
                logger.warn(' driverRegister:getUser ' + sysMsg.CUST_SIGNUP_PHONE_REGISTERED);
                resUtil.resetFailedRes(res, sysMsg.CUST_SIGNUP_PHONE_REGISTERED);
                return next();
            }
            that();
        });
    }).seq(function () {
        var that = this;
        params.status = listOfValue.USER_STATUS_ACTIVE;
        params.smsType = listOfValue.SMS_REG_TYPE;
        var key = listOfValue.CACHE_APPEND_REG + params.phone;
        redisDAO.getStringVal({key: key}, function (error, result) {//获取短信验证码
            if (error) {
                logger.error('createRegCaptcha ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (result == null || result != params.code) {
                    logger.warn(' driverRegister ' + params.phone + sysMsg.CUST_SMS_CAPTCHA_ERROR);
                    resUtil.resetFailedRes(res, sysMsg.CUST_SMS_CAPTCHA_ERROR);
                    return next();
                } else {
                    that();
                }
            }
        });
    }).seq(function () {
        var that = this;
        var subParams = {
            username: params.phone,
            password: encrypt.encryptByMd5(params.password),
            status: listOfValue.USER_STATUS_ACTIVE,
            type: listOfValue.USER_TYPE_DRIVER,
            subType: listOfValue.USER_SUB_TYPE_TRUCK_DRIVER,
            phone: params.phone
        };
        userInfoDAO.createUser(subParams, function (error, result) {//创建新user_info，获取userId
            if (error) {
                logger.error(' addUser ' + error.message);
                resUtil.resInternalError(error, res, next);
            }
            userId = result.insertId;
            that();
        });
    }).seq(function () {
        var that = this;
        var subParams = {
            driverUserId: userId,
            driverId: params.referId,
            opUser: userId
        };
        driverDAO.updateDriver(subParams, function (error, result) {//将phone和userId更新到driver中
            if (error) {
                logger.error(' updateDriver ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (result && result.affectedRows > 0) {
                    logger.info(' updateDriver ' + 'succeed');
                    that();
                } else {
                    logger.warn(' updateDriver ' + 'fail');
                    resUtil.resInternalError(error, res, next);
                }
            }
        });
    }).seq(function () {
        //注册时初始化用户积分
        var that = this;
        if (params.type == listOfValue.USER_TYPE_AGENCY || params.type == listOfValue.USER_TYPE_DRIVER) {
            bonusPointDAO.getBonusConfig({
                actionId: listOfValue.BONUS_TYPE_AGENT_SIGN_UP
            }, function (error, rows) {
                if (error) {
                    logger.error(' getBonusConfig ' + error.message);
                }
                if (rows && rows.length > 0) {
                    bonusPointDAO.createBonusPoint({
                        userNo: userId,
                        bizId: bizId,
                        totalPoint: rows[0].point
                    }, function (error, result) {
                        if (error) {
                            logger.error(' createBonusPoint ' + error.message);
                        } else if (result && result.insertId) {
                            bonusPointDAO.createBonusPointHistory({
                                bonusId: result.insertId,
                                userNo: userId,
                                actionId: listOfValue.BONUS_TYPE_AGENT_SIGN_UP,
                                actionName: rows[0].action_name,
                                type: rows[0].type,
                                point: rows[0].point,
                                remainPoint: rows[0].point
                            }, function (error, result) {
                                if (error) {
                                    logger.error(' createBonusPointHistory ' + error.message);
                                }
                            });
                        }
                    });
                }
                that();
            });
        } else that();
    }).seq(function () {
        var deviceType = oAuthUtil.getRequestDevice(req.headers['user-agent']);
        user.accessToken = oAuthUtil.createAccessToken(user.id, listOfValue.USER_TYPE_DRIVER, listOfValue.USER_SUB_TYPE_TRUCK_DRIVER,
            listOfValue.USER_STATUS_ACTIVE, deviceType);
        var userObj = {
            id: userId,
            accessToken: user.accessToken,
            type: listOfValue.USER_TYPE_DRIVER,
            subType: listOfValue.USER_SUB_TYPE_TRUCK_DRIVER,
            status: listOfValue.USER_STATUS_ACTIVE,
            device: deviceType
        };
        roleBase.saveAccessToken(userObj, deviceType);
        user.userId = userId;
        resUtil.resetQueryRes(res, user);
        return next();
    });
}
function mobileDriverRegister(req, res, next) {
    var params = req.params;
    var userId, driverId;
    Seq().seq(function () {
        var that = this;
        userInfoDAO.getUser({
            phone: params.phone
        }, function (error, rows) {//查询手机是否被占用
            if (error) {
                logger.error(' driverRegister:getUser ' + error.message);
                resUtil.resetFailedRes(res, rows.message);
                return next();
            }
            if (rows && rows.length > 0) {
                logger.warn(' driverRegister:getUser ' + sysMsg.CUST_SIGNUP_PHONE_REGISTERED);
                resUtil.resetFailedRes(res, sysMsg.CUST_SIGNUP_PHONE_REGISTERED);
                return next();
            } else
                that();
        });
    }).seq(function () {
        var that = this;
        params.status = listOfValue.USER_STATUS_ACTIVE;
        params.smsType = listOfValue.SMS_REG_TYPE;
        var key = listOfValue.CACHE_APPEND_REG + params.phone;
        redisDAO.getStringVal({key: key}, function (error, result) {//获取短信验证码
            if (error) {
                logger.error('createRegCaptcha ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (result == null || result != params.code) {
                    logger.warn(' driverRegister ' + params.phone + sysMsg.CUST_SMS_CAPTCHA_ERROR);
                    resUtil.resetFailedRes(res, sysMsg.CUST_SMS_CAPTCHA_ERROR);
                    return next();
                } else {
                    that();
                }
            }
        });
    }).seq(function () {
        var that = this;
        userInfoDAO.createUser({
            username: params.phone,
            password: encrypt.encryptByMd5(params.password),
            status: listOfValue.USER_STATUS_ACTIVE,
            type: listOfValue.USER_TYPE_NOT_VERIFIED,
            subType: listOfValue.USER_SUB_TYPE_NOT_VERIFIED,
            phone: params.phone
        }, function (error, result) {//创建新user_info，获取userId
            if (error) {
                logger.error(' addUser ' + error.message);
                resUtil.resInternalError(error, res, next);
            }
            userId = result.insertId;
            that();
        });
    }).seq(function () {
        var that = this;
        driverDAO.createDriver({
            userId: userId,
            opUser: userId
        }, function (error, result) {//将phone和userId更新到driver中
            if (error) {
                logger.error(' updateDriver ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (result && result.insertId) {
                    logger.info(' updateDriver ' + 'succeed');
                    driverId = result.insertId;
                    var template = notifyTemplate.ADMIN_DRIVER_VERIFY;
                    var content = template.content.replace('{@@}', params.phone);
                    roleBase.getReqWithToken(function (error, request) {
                        httpUtil.httpPost(sysConfig.stiHost, '/api/email', request, {
                            emailTo: sysConfig.xmlAdminEmail,
                            title: notifyTemplate.ADMIN_DRIVER_VERIFY.title,
                            content: content
                        }, function (error, result) {
                            if (error)
                                logger.error(' sendEmail ' + error.message);
                        });
                    });
                    that();
                } else {
                    logger.warn(' updateDriver ' + 'fail');
                    resUtil.resInternalError(error, res, next);
                }
            }
        });
    }).seq(function () {
        //注册时初始化用户积分
        var that = this;
        bonusPointDAO.getBonusConfig({
            actionId: listOfValue.BONUS_TYPE_DRIVER_SIGN_UP
        }, function (error, rows) {
            if (error) {
                logger.error(' getBonusConfig ' + error.message);
            }
            if (rows && rows.length > 0) {
                bonusPointDAO.createBonusPoint({
                    userNo: userId,
                    userType: listOfValue.USER_TYPE_DRIVER,
                    phone: params.phone,
                    totalPoint: rows[0].point
                }, function (error, result) {
                    if (error) {
                        logger.error(' createBonusPoint ' + error.message);
                    } else if (result && result.insertId) {
                        bonusPointDAO.createBonusPointHistory({
                            bonusId: result.insertId,
                            userNo: userId,
                            actionId: listOfValue.BONUS_TYPE_DRIVER_SIGN_UP,
                            actionName: rows[0].action_name,
                            type: rows[0].type,
                            point: rows[0].point,
                            remainPoint: rows[0].point
                        }, function (error, result) {
                            if (error) {
                                logger.error(' createBonusPointHistory ' + error.message);
                            }
                        });
                    }
                });
            }
            that();
        });
    }).seq(function () {
        var user = {};
        var deviceType = oAuthUtil.getRequestDevice(req.headers['user-agent']);
        user.accessToken = oAuthUtil.createAccessToken(userId, listOfValue.USER_TYPE_DRIVER, listOfValue.USER_SUB_TYPE_TRUCK_DRIVER,
            listOfValue.USER_STATUS_ACTIVE, deviceType);
        var userObj = {
            id: userId,
            accessToken: user.accessToken,
            type: listOfValue.USER_TYPE_DRIVER,
            subType: listOfValue.USER_SUB_TYPE_TRUCK_DRIVER,
            status: listOfValue.USER_STATUS_ACTIVE,
            device: deviceType
        };
        roleBase.saveAccessToken(userObj, deviceType);
        user.userId = userId;
        user.driverId = driverId;
        resUtil.resetQueryRes(res, user);
        return next();
    });
}
function getDriver(req, res, next) {
    var params = req.params;
    driverDAO.getDriver(params, function (error, rows) {
        if (error) {
            logger.error(' getDriver ' + error.message);
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetQueryRes(res, rows);
        return next();
    });
}

function updateDriver(req, res, next) {
    var params = req.params;
    params.opUser = params.adminId;
    params.status = listOfValue.DRIVER_STATUS_PENDING;
    driverDAO.updateDriver(params, function (error, result) {
        if (error) {
            logger.error(' updateDriver ' + error.message);
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetUpdateRes(res, result);
        return next();
    });
}
function updateDriverTeam(req, res, next) {
    var params = req.params;
    params.opUser = params.adminId;
    driverDAO.updateDriver({
        driverId: params.driverId,
        bizId: params.bizId
    }, function (error, result) {
        if (error) {
            logger.error(' updateDriver ' + error.message);
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetUpdateRes(res, result);
        return next();
    });
}

function updateDriverStatus(req, res, next) {
    var params = req.params;
    var phone, userId, bizId, driverName, bizName;
    params.opUser = params.adminId;
    Seq().seq(function () {
        var that = this;
        var subParams = {
            driverId: params.driverId
        };
        driverDAO.getDriver(subParams, function (error, rows) {
            if (error) {
                logger.error(' updateDriver ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    phone = rows[0].phone;
                    userId = rows[0].user_id;
                    bizId = rows[0].biz_id;
                    driverName = rows[0].name;
                    that();
                } else {
                    logger.error(' updateDriver ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }
            }
        });
    }).seq(function () {
        var that = this;
        bizDAO.getBiz({
            bizId: bizId
        }, function (error, rows) {
            if (error) {
                logger.error(' updateDriver ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    bizName = rows[0].name;
                    logger.debug(bizName);
                }
                that();
            }
        });
    }).seq(function () {
        var msgParams = {
            id: params.driverId,
            roleType: listOfValue.USER_TYPE_DRIVER
        };
        if (params.status == listOfValue.DRIVER_STATUS_VERIFIED) {
            userInfoDAO.updateUserType({
                type: listOfValue.USER_TYPE_DRIVER,
                userId: userId
            }, function (error, result) {
                if (error) {
                    logger.error(' updateDriverType ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }
            });
            userInfoDAO.updateUserSubType({
                subType: listOfValue.USER_SUB_TYPE_TRUCK_DRIVER,
                userId: userId
            }, function (error, result) {
                if (error) {
                    logger.error(' updateDriverType ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }
            });

            msgParams.result = 1;
            roleBase.getReqWithToken(function (error, request) {
                httpUtil.httpPost(sysConfig.MessageQueueHost, '/api/verifyResult', request, msgParams, function (error, result) {
                    if (error) {
                        logger.warn("send verify message " + error.message);
                    } else {
                        logger.info(result);
                    }
                });
                var template = notifyTemplate.DRIVER_VERIFIED;
                var content = template.content;
                content = content.replace('{@@}', driverName);
                httpUtil.httpPost(sysConfig.NotificationHost, '/api/notification', request, {
                    title: template.title,
                    body: content,
                    status: listOfValue.NOTIFY_STATUS_READED_NO,
                    receiver: userId,
                    receiverBiz: bizId,
                    receiverName: bizName,
                    receiverType: listOfValue.BIZ_TYPE_TRUCK_TEAM
                }, function (error, result) {
                    if (error) {
                        logger.warn("send verify message " + error.message);
                    } else {
                        logger.info(result);
                    }
                });
            });
        }
        else if (params.status == listOfValue.DRIVER_STATUS_REJECKED) {
            msgParams.result = 0;
            roleBase.getReqWithToken(function (error, request) {
                httpUtil.httpPost(sysConfig.MessageQueueHost, '/api/verifyResult', request, msgParams, function (error, result) {
                    if (error) {
                        logger.warn("send verify message " + error.message);
                    } else {
                        logger.info(result);
                    }
                });
                var template = notifyTemplate.DRIVER_VERIFIED_FAILED;
                var content = template.content;
                content = content.replace('{@@}', driverName);
                httpUtil.httpPost(sysConfig.NotificationHost, '/api/notification', request, {
                    title: template.title,
                    body: content,
                    status: listOfValue.NOTIFY_STATUS_READED_NO,
                    receiver: userId,
                    receiverBiz: bizId,
                    receiverName: bizName,
                    receiverType: listOfValue.BIZ_TYPE_TRUCK_TEAM
                }, function (error, result) {
                    if (error) {
                        logger.warn("send verify message " + error.message);
                    } else {
                        logger.info(result);
                    }
                });
            })
        }
        driverDAO.updateDriverStatus(params, function (error, result) {
            if (error) {
                logger.error(' updateDriver ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (result && result.affectedRows > 0) {
                    if (!userId && params.status == listOfValue.DRIVER_STATUS_VERIFIED) {
                        var subParams = {
                            id: params.driverId,
                            phone: phone,
                            referId: params.driverId,
                            roleType: listOfValue.USER_TYPE_DRIVER
                        };
                        roleBase.getReqWithToken(function (error, request) {
                            httpUtil.httpPost(sysConfig.MessageQueueHost, '/api/driverRefer', request, subParams, function (error, result) {
                                logger.debug(' sendDriverReferSms ');
                                if (error) {
                                    logger.warn("sendDriverReferSms " + error.message);
                                } else {
                                    logger.info(result);
                                }
                            });
                        });
                    }
                    resUtil.resetUpdateRes(res, result);
                    return next();
                } else {
                    logger.error(' updateDriver ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }
            }

        });
    });
}

function updateDriverActive(req, res, next) {
    var params = req.params;
    params.opUser = params.adminId;
    driverDAO.updateDriverActive(params, function (error, result) {
        if (error) {
            logger.error(' updateDriverActive ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            if (result && result.affectedRows > 0) {
                resUtil.resetUpdateRes(res, result);
            } else {
                logger.error(' updateDriverActive ' + result.message);
                resUtil.resetFailedRes(res, result.message);
            }
            return next();
        }

    });
}
function getDriverCountByBiz(req, res, next) {
    var params = req.params;
    driverDAO.getDriverCountByBiz(params, function (error, result) {
        if (error) {
            logger.error(' getDriverCountByBiz ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            if (result && result.length > 0) {
                resUtil.resetQueryRes(res, result);
            } else {
                logger.error(' getDriverCountByBiz ' + result.message);
                resUtil.resetFailedRes(res, result.message);
            }
            return next();
        }
    });
}
function getDriverCount(req, res, next) {
    var params = req.params;
    driverDAO.getDriverCount(params, function (error, result) {
        if (error) {
            logger.error(' getDriverCount ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetQueryRes(res, result);
            return next();
        }
    });
}
module.exports = {
    addDriver: addDriver,
    getDriver: getDriver,
    updateDriver: updateDriver,
    updateDriverStatus: updateDriverStatus,
    updateDriverActive: updateDriverActive,
    driverRegister: driverRegister,
    mobileDriverRegister: mobileDriverRegister,
    getDriverCount: getDriverCount,
    getDriverCountByBiz: getDriverCountByBiz,
    updateDriverTeam: updateDriverTeam
};