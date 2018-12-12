/**
 * Created by ling xue on 2016/3/2.
 */

var commonUtil = require('mp-common-util');
var sysMsg = commonUtil.systemMsg;
var moduleMessage = require('../util/ModuleMessage.js');
var oAuthUtil = require('../util/OAuthUtil.js');//TODO Deprecated
var resUtil = commonUtil.responseUtil;
var httpUtil = commonUtil.httpUtil;
var encrypt = commonUtil.encrypt;
var sysConfig = require('../config/SystemConfig.js');
var listOfValue = require('../util/ListOfValue.js');
var userInfoDAO = require('../dao/UserInfoDAO.js');
var userDeviceDAO = require('../dao/UserDeviceDAO.js');
var bonusPointDAO = require('../dao/BonusPointDAO.js');
var roleBase = require('./RoleBase.js');
var bizDAO = require('../dao/BizDAO.js');
var redisDAO = require('../dao/RedisDAO.js');
var notifyTemplate = require('../util/NotifyTemplate.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserInfo.js');
var passwordUtil = require('../util/PasswordUtil.js');
var Seq = require('seq');
/**
 * 注册新用户
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function addUser(req, res, next) {
    var params = req.params;
    if (typeof(params.type) != 'number' && !params.phone && !params.password) {
        logger.warn('addUser:getUser ' + moduleMessage.ERROR_PARAMS_EMPTY);
        resUtil.resetFailedRes(res, moduleMessage.ERROR_PARAMS_EMPTY);
        return next();
    }
    var userId;
    var bizId;
    var user = {};
    Seq().seq(function () {
        var that = this;
        var subParams = {
            phone: params.phone
        };
        userInfoDAO.getUser(subParams, function (error, rows) {
            if (error) {
                logger.error('addUser:getUser ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    if (params.type == listOfValue.USER_TYPE_SHIPPING) {
                        logger.warn(' addUser ' + params.phone + moduleMessage.ERROR_USER_NAME_ADDED);
                        resUtil.resetFailedRes(res, moduleMessage.ERROR_USER_NAME_ADDED);
                        return next();
                    }
                    logger.warn(' addUser ' + params.phone + sysMsg.CUST_SIGNUP_PHONE_REGISTERED);
                    resUtil.resetFailedRes(res, sysMsg.CUST_SIGNUP_PHONE_REGISTERED);
                    return next();
                } else {
                    that();
                }
            }
        });
    }).seq(function () {
        var that = this;
        if (params.type == listOfValue.BIZ_TYPE_SHIPPING)
            that();
        else {
            params.status = listOfValue.USER_STATUS_ACTIVE;
            params.smsType = listOfValue.SMS_REG_TYPE;
            var key = listOfValue.CACHE_APPEND_REG + params.phone;
            logger.debug(key);
            logger.debug(params.phone);
            redisDAO.getStringVal({key: key}, function (error, result) {
                if (error) {
                    logger.error('createRegCaptcha ' + error.message);
                    resUtil.resInternalError(error, res, next);
                } else {
                    if (result == null || result != params.code) {
                        logger.warn(' addUser ' + params.phone + sysMsg.CUST_SMS_CAPTCHA_ERROR);
                        resUtil.resetFailedRes(res, sysMsg.CUST_SMS_CAPTCHA_ERROR);
                        return next();
                    } else {
                        that();
                    }
                }
            });
        }
    }).seq(function () {
        var that = this;
        var subParams = {
            username: params.phone,
            password: encrypt.encryptByMd5(params.password),
            status: listOfValue.USER_STATUS_ACTIVE,
            type: listOfValue.USER_TYPE_NOT_VERIFIED,
            subType: listOfValue.USER_SUB_TYPE_NOT_VERIFIED,
            phone: params.phone,
            remark: params.remark
        };
        userInfoDAO.createUser(subParams, function (error, result) {
            if (error) {
                logger.error(' addUser ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (result && result.insertId) {
                    userId = result.insertId;
                    that();
                } else {
                    logger.error(' addUser ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }
            }

        });
    }).seq(function () {
        var that = this;
        bizDAO.createBiz({
            userId: userId,
            type: params.type,
            name: params.name,
            shipBizCode: params.shipBizCode
        }, function (error, result) {
            if (error) {
                logger.error(' addUser:addBiz ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                bizId = result.insertId;
                that();
            }
        });
    }).seq(function () {
        var that = this;
        var template;
        if (params.type == listOfValue.USER_TYPE_AGENCY)
            template = notifyTemplate.AGENT_REGISTER;
        else if (params.type == listOfValue.USER_TYPE_TRUCK_TEAM)
            template = notifyTemplate.TRUCK_REGISTER;
        else if (params.type == listOfValue.USER_TYPE_SHIPPING)
            template = notifyTemplate.SHIP_REGISTER;
        roleBase.getReqWithToken(function (error, request) {
            httpUtil.httpPost(sysConfig.NotificationHost, '/api/notification', request, {
                title: template.title,
                body: template.content,
                status: listOfValue.NOTIFY_STATUS_READED_NO,
                receiver: userId,
                receiverBiz: bizId,
                receiverName: '',
                receiverType: params.type
            }, function (error, result) {
                if (error) {
                    logger.warn("send verify message " + error.message);
                } else {
                    logger.info(result);
                }
            });
        });
        that();
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
                        phone: params.phone,
                        userType: params.type,
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
        user.userId = userId;
        user.bizId = bizId;
        var deviceType = oAuthUtil.getRequestDevice(req.headers['User-Agent']);
        user.accessToken = oAuthUtil.createAccessToken(user.id, listOfValue.USER_TYPE_NOT_VERIFIED, listOfValue.USER_SUB_TYPE_NOT_VERIFIED,
            listOfValue.USER_STATUS_ACTIVE, deviceType);
        user.id = userId;
        user.type = listOfValue.USER_TYPE_NOT_VERIFIED;
        user.subType = listOfValue.USER_SUB_TYPE_NOT_VERIFIED;
        user.status = listOfValue.USER_STATUS_ACTIVE;
        roleBase.saveAccessToken(user, deviceType);
        resUtil.resetQueryRes(res, user);
        return next();
    });
}
/**
 * 添加子账户
 * @param req
 * @param res
 * @param next
 */
function addUserByBiz(req, res, next) {
    var params = req.params;
    var user = null;
    var openPassword;
    Seq().seq(function () {
        //查询手机号是否已成为认证用户
        var that = this;
        userInfoDAO.getUser({
            phone: params.phone
        }, function (error, rows) {
            if (error) {
                logger.error('addUser:getUser ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    if (rows[0].p_biz_id != null && rows[0].p_biz_id != '' && rows[0].status == 9) {
                        if (rows[0].p_biz_id == params.bizId) {
                            logger.warn(' addUser ' + params.phone + sysMsg.CUST_SIGNUP_PHONE_REGISTERED);
                            resUtil.resetFailedRes(res, sysMsg.CUST_SIGNUP_PHONE_REGISTERED);
                        } else {
                            logger.warn(' addUserByBiz ' + params.phone + ' ' + moduleMessage.ERROR_BIZ_OCCUPIED);
                            resUtil.resetFailedRes(res, moduleMessage.ERROR_BIZ_OCCUPIED);
                        }
                        return next();
                    } else {
                        user = rows[0];
                        that();
                    }
                } else {
                    that();
                }
            }
        });
    }).seq(function () {
        var that = this;
        //校验手机校验码
        params.status = listOfValue.USER_STATUS_ACTIVE;
        params.smsType = listOfValue.SMS_REG_TYPE;
        var key = listOfValue.CACHE_APPEND_REG + params.phone;
        logger.debug(key);
        logger.debug(params.phone);
        redisDAO.getStringVal({key: key}, function (error, result) {
            if (error) {
                logger.error('createRegCaptcha ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (result == null || result != params.code) {
                    logger.warn(' addUser ' + params.phone + sysMsg.CUST_SMS_CAPTCHA_ERROR);
                    resUtil.resetFailedRes(res, sysMsg.CUST_SMS_CAPTCHA_ERROR);
                    return next();
                } else {
                    that();
                }
            }
        });
    }).seq(function () {
        openPassword = passwordUtil.generateRandomPassword();//生成随机密码
        logger.debug(openPassword);
        if (params.subType >= 2 && params.subType <= 4) {
            params.type = listOfValue.USER_TYPE_AGENCY;
        } else if (params.subType >= 5 && params.subType <= 7) {
            params.type = listOfValue.USER_TYPE_TRUCK_TEAM;
        } else if (params.subType >= 8) {
            params.type = listOfValue.USER_TYPE_DRIVER;
        }
        var subParams = {
            bizId: params.bizId,
            username: params.phone,
            password: encrypt.encryptByMd5(openPassword),
            status: listOfValue.USER_STATUS_ACTIVE,
            type: params.type,
            subType: params.subType,
            phone: params.phone,
            name: params.name,
            bizName: params.bizName,
            departmentId: params.departmentId
        };
        var roleType;
        if (params.subType == listOfValue.USER_SUB_TYPE_AGENCY_ADMIN)
            roleType = '货代管理员';
        else if (params.subType == listOfValue.USER_SUB_TYPE_AGENCY_OPERATOR)
            roleType = '货代业务员';
        else if (params.subType == listOfValue.USER_SUB_TYPE_AGENCY_FINANCE)
            roleType = '货代财务';
        else if (params.subType == listOfValue.USER_SUB_TYPE_TRUCK_ADMIN)
            roleType = '车队管理员';
        else if (params.subType == listOfValue.USER_SUB_TYPE_TRUCK_DISPATCH)
            roleType = '车队调度';
        else if (params.subType == listOfValue.USER_SUB_TYPE_TRUCK_FINANCE)
            roleType = '车队财务';
        var msgParams = {
            phone: params.phone,
            bizName: params.bizName,
            roleType: roleType
        };
        if (user != null) {//用户已存在但未认证，修改用户信息
            bizDAO.getBizAndVerify({
                userId: subParams.userId
            }, function (error, rows) {
                if (error) {
                    logger.error(' getBizAndVerify ' + error.message);
                    resUtil.resInternalError(error, res, next);
                } else {
                    if (rows && rows.length > 0) {
                        if (rows[0].bi_type != params.type) {
                            resUtil.resetFailedRes(res, moduleMessage.ERROR_TYPE_INCORRECT);
                            return next();
                        } else {
                            roleBase.getReqWithToken(function (error, request) {
                                //发送注册成功短信
                                httpUtil.httpPost(sysConfig.MessageQueueHost, '/api/oc3/user/signed', request, msgParams, function (error, result) {
                                    if (error) {
                                        logger.warn("send verify message " + error.message);
                                    } else {
                                        logger.info(result);
                                    }
                                });
                            });
                            subParams.userNo = user.id;
                            userInfoDAO.updateUserInfo(subParams, function (error, result) {
                                if (error) {
                                    logger.error(' addUser ' + error.message);
                                    resUtil.resInternalError(error, res, next);
                                } else {
                                    resUtil.resetQueryRes(res, user);
                                    return next();
                                }
                            });
                        }
                    } else {
                        roleBase.getReqWithToken(function (error, request) {
                            //发送注册成功短信
                            httpUtil.httpPost(sysConfig.MessageQueueHost, '/api/oc3/user/signed', request, msgParams, function (error, result) {
                                if (error) {
                                    logger.warn("send verify message " + error.message);
                                } else {
                                    logger.info(result);
                                }
                            });
                        });
                        subParams.userNo = user.id;
                        userInfoDAO.updateUserInfo(subParams, function (error, result) {
                            if (error) {
                                logger.error(' addUser ' + error.message);
                                resUtil.resInternalError(error, res, next);
                            } else {
                                resUtil.resetQueryRes(res, user);
                                return next();
                            }
                        });
                    }
                }
            });
        } else {//用户为新添加
            msgParams = {
                phone: params.phone,
                openPassword: openPassword
            };
            roleBase.getReqWithToken(function (error, request) {
                //发送注册成功短信
                httpUtil.httpPost(sysConfig.MessageQueueHost, '/api/oc3/user/unsigned', request, msgParams, function (error, result) {
                    if (error) {
                        logger.warn("send verify message " + error.message);
                    } else {
                        logger.info(result);
                    }
                });
            });
            userInfoDAO.createUser(subParams, function (error, result) {
                if (error) {
                    logger.error(' addUser ' + error.message);
                    resUtil.resInternalError(error, res, next);
                } else {
                    if (result && result.insertId) {
                        var user = {
                            userId: result.insertId
                        };
                        resUtil.resetQueryRes(res, user);
                        return next();
                    } else {
                        logger.error(' addUser ' + error.message);
                        resUtil.resInternalError(error, res, next);
                    }
                }
            });
        }
    });
}
/**
 * 删除子账户
 * @param req
 * @param res
 * @param next
 */
function dismissUserFromBiz(req, res, next) {
    var params = req.params;
    userInfoDAO.cleanUserBizInfo({
        userId: params.userNo,
        type: listOfValue.USER_TYPE_NOT_VERIFIED,
        subType: listOfValue.USER_SUB_TYPE_NOT_VERIFIED
    }, function (error, result) {
        if (error) {
            logger.error(' cleanUserBizInfo ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            bizDAO.createBiz({
                userId: params.userNo,
                type: params.type
            }, function (error) {
                if (error) {
                    logger.error(' addUser:addBiz ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }
            });
            resUtil.resetUpdateRes(res, result);
            return next();
        }
    });
}
/**
 * 用户登录
 * @param req
 * @param res
 * @param next
 */
function userLogin(req, res, next) {
    var params = req.params;
    params.username = params.phone;
    var user = {};
    userInfoDAO.getUser({
        phone: params.phone,
        status: listOfValue.USER_STATUS_ACTIVE
    }, function (error, rows) {
        if (error) {
            logger.error(' userLogin ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            if (rows && rows.length > 0) {
                if (rows[0].password == encrypt.encryptByMd5(params.password)) {
                    user = rows[0];
                    var deviceType = oAuthUtil.getRequestDevice(req.headers['User-Agent']);
                    logger.debug(req.headers['User-Agent']);
                    user.accessToken = oAuthUtil.createAccessToken(user.id, user.type, user.sub_type, user.status, deviceType);
                    user.subType = user.sub_type;
                    roleBase.saveAccessToken(user, deviceType);
                    user.password = null;
                    resUtil.resetQueryRes(res, user);
                    return next();
                } else {
                    logger.error(' userLogin ' + sysMsg.CUST_LOGIN_PSWD_ERROR);
                    resUtil.resetFailedRes(res, sysMsg.CUST_LOGIN_PSWD_ERROR);
                    return next();
                }
            } else {
                logger.error(' userLogin ' + sysMsg.CUST_LOGIN_USER_UNREGISTERED);
                resUtil.resetFailedRes(res, sysMsg.CUST_LOGIN_USER_UNREGISTERED);
                return next();
            }
        }
    });
}
/**
 * 用户注销
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function userLogOut(req, res, next) {
    var params = req.params;
    roleBase.removeAccessToken(req.headers[oAuthUtil.headerTokenMeta], function (error, result) {
        if (error) {
            logger.warn('userLogOut remove server token ' + error.message)
        }
    });
    if (params.deviceToken != null) {
        logger.debug(' userLogOut ' + params.deviceToken);
        userDeviceDAO.deleteUserDevice({
            deviceToken: params.deviceToken
        }, function (error, result) {
            if (error) {
                logger.error(' deleteUserDevice ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                resUtil.resetSuccessRes(res);
                return next();
            }
        });
    } else {
        resUtil.resetSuccessRes(res);
        return next();
    }
}
/**
 * 用户修改密码
 * @param req
 * @param res
 * @param next
 */
function modifyUserPswd(req, res, next) {
    var params = req.params;
    params.username = params.phone;
    params.password = encrypt.encryptByMd5(params.oriPswd);
    Seq().seq(function () {
        var that = this;
        userInfoDAO.getUser(params, function (error, rows) {
            if (error) {
                logger.error(' userLogin ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    that();
                } else {
                    logger.error(' userLogin ' + sysMsg.CUST_ORIGIN_PSWD_ERROR);
                    resUtil.resetFailedRes(res, sysMsg.CUST_ORIGIN_PSWD_ERROR);
                    return next();
                }
            }
        });
    }).seq(function () {
        params.password = encrypt.encryptByMd5(params.newPswd);
        userInfoDAO.updateUserPassword(params, function (error, result) {
            if (error) {
                logger.error(' modifyUserPswd ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (result && result.affectedRows > 0) {
                    res.send(200, {success: true});
                } else {
                    logger.error(' modifyUserPswd ' + result.message);
                    resUtil.resetFailedRes(res, result.message);
                }
                return next();
            }
        });
    });
}
/**
 * 重置用户密码
 * @param req
 * @param res
 * @param next
 */
function resetUserPswd(req, res, next) {
    var params = req.params;
    params.smsType = listOfValue.SMS_PSWD_TYPE;
    params.username = params.phone;
    Seq().seq(function () {
        var that = this;
        var key = listOfValue.CACHE_APPEND_PSWD + params.phone;
        redisDAO.getStringVal({key: key}, function (error, result) {
            if (error) {
                logger.error('getPasswordCaptcha ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (result == null || result != params.code) {
                    logger.warn(' resetUserPswd ' + params.phone + sysMsg.CUST_SMS_CAPTCHA_ERROR);
                    resUtil.resetFailedRes(res, sysMsg.CUST_SMS_CAPTCHA_ERROR);
                    return next();
                } else {
                    that();
                }
            }
        });
    }).seq(function () {
        params.password = encrypt.encryptByMd5(params.newPswd);
        userInfoDAO.updateUserPassword(params, function (error, result) {
            if (error) {
                logger.error(' resetUserPswd ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (result && result.affectedRows > 0) {
                    res.send(200, {success: true});
                } else {
                    logger.error(' resetUserPswd ' + result.message);
                    resUtil.resetFailedRes(res, result.message);
                }
                return next();
            }
        });
    });
}
/**
 * 修改用户手机号
 * @param req
 * @param res
 * @param next
 */
function modifyUserPhone(req, res, next) {
    var params = req.params;
    var userId;
    Seq().seq(function () {
        var that = this;
        var subParams = {
            phone: params.oriPhone
        };
        userInfoDAO.getUser(subParams, function (error, rows) {
            if (error) {
                logger.error('modifyUserPhone:getUser ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    userId = rows[0].id;
                    that();
                } else {
                    logger.warn(' modifyUserPhone ' + subParams.phone + sysMsg.CUST_LOGIN_USER_UNREGISTERED);
                    resUtil.resetFailedRes(res, sysMsg.CUST_LOGIN_USER_UNREGISTERED);
                    return next();
                }
            }
        });
    }).seq(function () {
        var that = this;
        var subParams = {
            phone: params.newPhone
        };
        userInfoDAO.getUser(subParams, function (error, rows) {
            if (error) {
                logger.error('modifyUserPhone:getUser ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    logger.warn(' modifyUserPhone ' + subParams.phone + sysMsg.CUST_SIGNUP_PHONE_REGISTERED);
                    resUtil.resetFailedRes(res, sysMsg.CUST_SIGNUP_PHONE_REGISTERED);
                    return next();
                } else {
                    that();
                }
            }
        });
    }).seq(function () {
        var that = this;
        var key = listOfValue.CACHE_APPEND_RST + params.newPhone;
        redisDAO.getStringVal({key: key}, function (error, result) {
            if (error) {
                logger.error('modifyUserPhone:getPasswordCaptcha ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (result == null || result != params.code) {
                    logger.warn(' modifyUserPhone ' + params.newPhone + sysMsg.CUST_SMS_CAPTCHA_ERROR);
                    resUtil.resetFailedRes(res, sysMsg.CUST_SMS_CAPTCHA_ERROR);
                    return next();
                } else {
                    that();
                }
            }
        });
    }).seq(function () {
        var subParams = {
            newPhone: params.newPhone,
            userId: userId
        };
        userInfoDAO.updateUserPhone(subParams, function (error, result) {
            if (error) {
                logger.error(' modifyUserPhone ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (result && result.affectedRows > 0) {
                    resUtil.resetUpdateRes(res, result);
                    return next();
                } else {
                    logger.error(' modifyUserPhone ' + result.message);
                    resUtil.resInternalError(error, res, next);
                }
            }
        });
    });
}
function updateUserActive(req, res, next) {
    var params = req.params;
    userInfoDAO.updateUserStatus({
        userId: params.userNo,
        status: params.active
    }, function (error, result) {
        if (error) {
            logger.debug(' updateUserStatus ');
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetUpdateRes(res, result);
        return next();
    });
}
function updateUserType(req, res, next) {
    var params = req.params;
    userInfoDAO.updateUserType(params, function (error, result) {
        if (error) {
            logger.error(' updateUserActive ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            if (result && result.affectedRows > 0) {
                resUtil.resetUpdateRes(res, result);
                return next();
            } else {
                logger.error(' updateUserType ' + result.message);
                resUtil.resInternalError(error, res, next);
            }
        }
    });
}
function updateUserInfo(req, res, next) {
    var params = req.params;
    params.userId = params.userNo;
    userInfoDAO.updateUserInfo(params, function (error, result) {
        if (error) {
            logger.error(' updateUserInfo ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            if (result && result.affectedRows > 0) {
                resUtil.resetUpdateRes(res, result);
                return next();
            } else {
                logger.error(' updateUserInfo ' + result.message);
                resUtil.resInternalError(error, res, next);
            }
        }
    });
}
function getUserInfo(req, res, next) {
    var params = req.params;
    userInfoDAO.getUserAndDepartment(params, function (error, rows) {
        if (error) {
            logger.error(' getUserInfo ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetQueryRes(res, rows);
            return next();
        }
    });
}
/**
 * 查询用户统计数据
 * @param req
 * @param res
 * @param next
 */
function getUserCount(req, res, next) {
    var params = req.params;
    userInfoDAO.getUserCount(params, function (error, result) {
        if (error) {
            logger.error(' getUserCount ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetQueryRes(res, result);
            return next();
        }
    });
}
function getUserById(req, res, next) {
    var params = req.params;
    userInfoDAO.getUserById(params, function (error, rows) {
        if (error) {
            logger.error(' getUserById ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            if (rows && rows.length > 0) {
                resUtil.resetQueryRes(res, rows[0]);
            } else {
                resUtil.resetQueryRes(res, rows);
            }
            return next();
        }
    });
}
function wechatLogin(req, res, next) {
    var params = req.params;
    Seq().seq(function () {
        var that = this;
        userInfoDAO.getUser(params, function (error, rows) {
            if (error) {
                logger.error(' wechatLogin ' + error.message);
                resUtil.resInternalError(error, res, next);
            }
            if (rows && rows.length > 0) {
                logger.info(' wechatLogin ' + params.wechatId);
                var userTemp = rows[0];
                var user = {};
                user.userId = userTemp.id;
                user.accessToken = oAuthUtil.createAccessToken(user.userId, oAuthUtil.clientType.user, listOfValue.USER_STATUS_ACTIVE);
                resUtil.resetQueryRes(res, user);
                return next();
            } else {
                that();
            }
        });
    }).seq(function () {
        params.status = listOfValue.USER_STATUS_ACTIVE;
        userInfoDAO.createUser(params, function (error, result) {
            if (error) {
                logger.error(' wechatLogin ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (result && result.insertId) {
                    var userId = result.insertId;
                    var user = {};
                    user.userId = userId;
                    user.accessToken = oAuthUtil.createAccessToken(userId, oAuthUtil.clientType.user, listOfValue.USER_STATUS_ACTIVE);
                    resUtil.resetQueryRes(res, user);
                    return next();
                } else {
                    logger.error(' wechatLogin ' + result.message);
                    resUtil.resInternalError(error, res, next);
                }
            }
        })
    })
}

module.exports = {
    addUser: addUser,
    addUserByBiz: addUserByBiz,
    userLogin: userLogin,
    userLogOut: userLogOut,
    wechatLogin: wechatLogin,
    modifyUserPswd: modifyUserPswd,
    modifyUserPhone: modifyUserPhone,
    resetUserPswd: resetUserPswd,
    updateUserActive: updateUserActive,
    updateUserType: updateUserType,
    updateUserInfo: updateUserInfo,
    dismissUserFromBiz: dismissUserFromBiz,
    getUserInfo: getUserInfo,
    getUserCount: getUserCount,
    getUserById: getUserById
};