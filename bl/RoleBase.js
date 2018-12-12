/**
 * Created by ling xue on 2016/3/4.
 */
var commonUtil = require('mp-common-util');
var sysMsg = commonUtil.systemMsg;
var moduleMessage = require('../util/ModuleMessage.js');
var oAuthUtil = require('../util/OAuthUtil.js');
var resUtil = commonUtil.responseUtil;
var httpUtil = commonUtil.httpUtil;
var encrypt = commonUtil.encrypt;
var sysConfig = require('../config/SystemConfig.js');
var listOfValue = require('../util/ListOfValue.js');
var userInfoDAO = require('../dao/UserInfoDAO.js');
var loginHistoryDAO = require('../dao/LoginHistoryDAO.js');
var redisDAO = require('../dao/RedisDAO.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('RoleBase.js');
var Seq = require('seq');

var reqTokenObj = {
    headers: {
        'auth-token': null
    }
};

function refreshAdminToken(req, res, next) {
    var params = req.params;
    var accessToken = req.headers[oAuthUtil.headerTokenMeta];
    if (accessToken == undefined) {
        logger.warn(' refreshAdminToken ' + sysMsg.ACCESS_TOKEN_ERROR);
        resUtil.resNoAuthorizedError(sysMsg.ACCESS_TOKEN_ERROR, res, next);
    }
    var tokenInfo = oAuthUtil.parseAccessToken(accessToken);
    if (tokenInfo == undefined) {
        logger.warn(' refreshAdminToken ' + sysMsg.ACCESS_TOKEN_ERROR);
        resUtil.resNoAuthorizedError(sysMsg.ACCESS_TOKEN_ERROR, res, next);
    }
    if (params.adminId != tokenInfo.userId) {
        logger.warn(' refreshAdminToken :' + sysMsg.ACCESS_TOKEN_ERROR);
        resUtil.resNoAuthorizedError(sysMsg.ACCESS_TOKEN_ERROR, res, next);
    }
    removeAccessToken(accessToken, function (error, result) {
    });
    var deviceType = oAuthUtil.getRequestDevice(req.headers['user-agent']);
    logger.debug(req.headers['user-agent']);
    userInfoDAO.getAdmin({adminId: params.adminId}, function (error, rows) {
        if (error) {
            logger.error(' refreshAdminToken ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            if (rows && rows.length == 1) {
                var userTemp = {
                    id: rows[0].id,
                    type: listOfValue.USER_TYPE_ADMIN,
                    subType: rows[0].admin_type,
                    status: rows[0].admin_status
                };
                userTemp.accessToken = 'ADMIN_' + oAuthUtil.createAccessToken(userTemp.id, userTemp.type, userTemp.subType, userTemp.status, deviceType);
                saveAccessToken(userTemp, deviceType);
                logger.info('refreshAdminToken' + userTemp.id);
                resUtil.resetQueryRes(res, userTemp);
                return next();
            } else {
                logger.warn('refreshAdminToken' + sysMsg.ACCESS_TOKEN_ERROR);
                resUtil.resNoAuthorizedError(sysMsg.ACCESS_TOKEN_ERROR, res, next);
            }
        }
    })
}

function refreshMchToken(req, res, next) {
    var params = req.params;
    var accessToken = req.headers[oAuthUtil.headerTokenMeta];
    logger.debug(' [refreshMchToken] ' + accessToken);
    if (accessToken == undefined) {
        logger.warn(' refreshMchToken ' + sysMsg.ACCESS_TOKEN_ERROR);
        resUtil.resNoAuthorizedError(sysMsg.ACCESS_TOKEN_ERROR, res, next);
    }
    var tokenInfo = oAuthUtil.parseAccessToken(accessToken);
    logger.debug(' tokenInfo ' + tokenInfo.userId);
    if (tokenInfo == undefined) {
        logger.warn(' refreshMchToken ' + sysMsg.ACCESS_TOKEN_ERROR);
        resUtil.resNoAuthorizedError(sysMsg.ACCESS_TOKEN_ERROR, res, next);
    }
    if (params.mch != tokenInfo.userId) {
        logger.warn(' refreshMchToken :' + sysMsg.ACCESS_TOKEN_ERROR);
        resUtil.resNoAuthorizedError(sysMsg.ACCESS_TOKEN_ERROR, res, next);
    }
    var deviceType = oAuthUtil.getRequestDevice(req.headers['user-agent']);
    var mchTemp = {
        id: tokenInfo.userId,
        type: tokenInfo.userType,
        subType: tokenInfo.subType,
        status: tokenInfo.userStatus
    };
    mchTemp.accessToken = oAuthUtil.createAccessToken(tokenInfo.userId, tokenInfo.userType, tokenInfo.subType, tokenInfo.userStatus, deviceType);
    saveAccessToken(mchTemp, deviceType);
    logger.info(' refreshMchToken ' + mchTemp.accessToken);
    resUtil.resetQueryRes(res, mchTemp);
    return next();
}

function refreshToken(req, res, next) {
    logger.debug(' [refreshToken] ');
    var params = req.params;
    var accessToken = params.token;
    if (accessToken == undefined) {
        logger.warn(' refreshToken ' + sysMsg.ACCESS_TOKEN_ERROR);
        resUtil.resNoAuthorizedError(sysMsg.ACCESS_TOKEN_ERROR, res, next);
    }
    var tokenInfo = oAuthUtil.parseAccessToken(accessToken);
    if (tokenInfo == undefined) {
        logger.warn(' refreshToken ' + sysMsg.ACCESS_TOKEN_ERROR);
        resUtil.resNoAuthorizedError(sysMsg.ACCESS_TOKEN_ERROR, res, next);
    }
    if (params.userId != tokenInfo.userId) {
        logger.warn(' refreshToken :' + sysMsg.ACCESS_TOKEN_ERROR);
        resUtil.resNoAuthorizedError(sysMsg.ACCESS_TOKEN_ERROR, res, next);
    }
    var deviceType = oAuthUtil.getRequestDevice(req.headers['user-agent']);
    logger.debug('refreshToken:' + req.headers['user-agent']);
    userInfoDAO.getUser({userId: params.userId}, function (error, rows) {
        if (error) {
            logger.error(' refreshToken ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            if (rows && rows.length == 1) {
                var userTemp = {
                    id: rows[0].id,
                    type: rows[0].type,
                    subType: rows[0].sub_type,
                    status: rows[0].status
                };
                userTemp.accessToken = oAuthUtil.createAccessToken(userTemp.id, userTemp.type, userTemp.subType, userTemp.status, deviceType);
                saveAccessToken(userTemp, deviceType);
                removeAccessToken(accessToken, function (error, result) {
                    if (error) {
                        logger.warn('refreshToken :del old token ' + error.message);
                    }
                });
                loginHistoryDAO.getLoginHistory({
                    userId: params.userId,
                    date: new Date()
                }, function (error, result) {
                    if (error) {
                        logger.error(' getLoginHistory ' + error.message);
                    }
                    if (result && result.length == 0) {
                        loginHistoryDAO.createLoginHistory({
                            userId: userTemp.id,
                            type: userTemp.type
                        }, function (error, result) {
                            if (error) {
                                logger.error(' getLoginHistory ' + error.message);
                            }
                        });
                    }
                });
                logger.info('refreshToken' + userTemp.id);
                resUtil.resetQueryRes(res, userTemp);
                return next();
            } else {
                logger.warn('refreshToken' + sysMsg.ACCESS_TOKEN_ERROR);
                resUtil.resNoAuthorizedError(sysMsg.ACCESS_TOKEN_ERROR, res, next);
            }
        }
    });
}
function resetAdmin(callback) {
    redisDAO.removeKeyByPrefix({prefix: 'OC3_U_ADMIN_'}, function (error, result) {
        callback(error, result);
    });
}
function checkUserToken(rolesArray) {
    function authCheck(req, res, next) {
        // if (rolesArray.length == 0)
        // return next();
        logger.debug(' authCheck: ' + rolesArray.toString() + ' ' + req.url);
        var userInfo = null;
        // return next();//FIXME 暂不校验权限
        var reqToken = oAuthUtil.getReqToken(req);
        logger.debug('【reqToken】' + reqToken);
        if (reqToken == null) {
            return resUtil.resetFailedRes(res, moduleMessage.ERROR_LOGIN_EXPIRED, next);
        }

        var token = oAuthUtil.oc3_token_opt.head + reqToken;
        logger.debug('token :' + token);
        Seq().seq(function () {
            var that = this;
            redisDAO.getStringVal({key: token}, function (error, result) {
                if (error) {
                    resUtil.resNoAuthorizedError(sysMsg.ACCESS_TOKEN_ERROR, res, next);
                } else {
                    logger.debug('authCheck:getStringVal ' + result);
                    if (result) {
                        try {
                            userInfo = eval("(" + result + ")");
                            if (userInfo.type == listOfValue.USER_TYPE_ADMIN) {
                                req.params.adminId = userInfo.id;
                            } else if (userInfo.type == listOfValue.USER_TYPE_MCH) {
                                return next();
                            } else {
                                if (userInfo.id) {
                                    req.params.userId = userInfo.id;//FIXME
                                    return next();
                                }
                            }
                        } catch (e) {
                            userInfo = null;
                            logger.debug('userInfo = null ' + req.url);
                            return resUtil.resetFailedRes(res, moduleMessage.ERROR_LOGIN_EXPIRED, next);
                        }
                        that();
                    } else {
                        return resUtil.resetFailedRes(res, moduleMessage.ERROR_LOGIN_EXPIRED, next);
                    }
                }
            });
        }).seq(function () {
            redisDAO.expireStringVal({key: token, expired: oAuthUtil.oc3_token_opt.web_expire});
            if (userInfo) {
                if (rolesArray.indexOf(userInfo.subType) >= 0) {
                    return next();
                } else if (userInfo.type == listOfValue.USER_TYPE_MCH) {
                    return next();
                } else {
                    return resUtil.resetFailedRes(res, moduleMessage.ERROR_LOGIN_EXPIRED, next);
                }
            } else {
                return resUtil.resetFailedRes(res, moduleMessage.ERROR_LOGIN_EXPIRED, next);
            }
        });
    }

    return authCheck;
}

function checkReqUserToken(req, res, next) {
    var rolesArray = req.params.rolesArray;

    var userInfo = null;
    var reqToken = oAuthUtil.getReqToken(req);
    logger.debug(' checkReqUserToken:reqToken ' + reqToken);
    if (rolesArray && rolesArray.length == 0 && reqToken && !reqToken.startsWith('ADMIN')) {//FIXME 内部接口 匿名登录 的校验方式待完善
        resUtil.resetSuccessRes(res);
        return next();
    }
    if (reqToken == null) {
        return resUtil.resetFailedRes(res, moduleMessage.ERROR_LOGIN_EXPIRED, next);
    }

    var token = oAuthUtil.oc3_token_opt.head + reqToken;
    Seq().seq(function () {
        var that = this;
        redisDAO.getStringVal({key: token}, function (error, result) {
            if (error) {
                logger.error(' getStringVal ' + error.message);
                return resUtil.resetFailedRes(res, moduleMessage.ERROR_LOGIN_EXPIRED, next);
            } else {
                if (result) {
                    try {
                        userInfo = eval("(" + result + ")");
                        if (userInfo.type == listOfValue.USER_TYPE_ADMIN) {
                            req.params.adminId = userInfo.id;
                        } else {
                            if (userInfo.id && userInfo.type != listOfValue.USER_TYPE_MCH) {
                                req.params.userId = userInfo.id
                            }
                        }
                    } catch (e) {
                        userInfo = null;
                        logger.error(' getStringVal catch ' + e.message);
                        return resUtil.resetFailedRes(res, moduleMessage.ERROR_LOGIN_EXPIRED, next);
                    }
                    that();
                } else {
                    return resUtil.resetFailedRes(res, moduleMessage.ERROR_LOGIN_EXPIRED, next);
                }
            }
        });
    }).seq(function () {
        var that = this;
        // if (userInfo.type && req.method != 'GET') {
        //     redisDAO.getStringVal({key: 'req_gap' + encrypt.encryptByMd5(userInfo.id + req.url)}, function (error, result) {
        //         if (error) {
        //             logger.error(' setStringVal ' + error.message);
        //             resUtil.resInternalError(error, res, next);
        //         }
        //         if (result && result == userInfo.id + req.url) {
        //             logger.warn(' request too fast ');
        //             resUtil.resetFailedRes(res, '请求过于频繁');
        //         } else
        //             that();
        //     });
        // } else
        that();
    }).seq(function () {
        var that = this;
        // if (userInfo.type && req.method != 'GET') {
        //     redisDAO.setStringVal({
        //         key: 'req_gap' + encrypt.encryptByMd5(userInfo.id + req.url),
        //         value: userInfo.id + req.url,
        //         expired: 30 //同一用户的相同请求间隔30秒
        //     }, function (error, result) {
        //         if (error) {
        //             logger.error(' setStringVal ' + error.message);
        //             resUtil.resInternalError(error, res, next);
        //         }
        //         that();
        //     });
        // } else
        that();
    }).seq(function () {
        //FIXME 暂时关闭
        resUtil.resetSuccessRes(res);
        return next();
        redisDAO.expireStringVal({key: token, expired: oAuthUtil.oc3_token_opt.web_expire});
        if (userInfo) {
            if (rolesArray.indexOf(userInfo.subType) >= 0) {
                resUtil.resetSuccessRes(res);
                return next();
            } else if (userInfo.type == listOfValue.USER_TYPE_MCH) {
                resUtil.resetSuccessRes(res);
                return next();
            } else {
                resUtil.resNoAuthorizedError(sysMsg.ACCESS_TOKEN_ERROR, res, next);
            }
        } else {
            resUtil.resNoAuthorizedError(sysMsg.ACCESS_TOKEN_ERROR, res, next);
        }
    });
}

function testRedisKey(req, res, next) {
    var params = req.params;
    console.log(req.headers['user-agent']);
    console.log(parseInt(new Date().getTime() / 1000));
    console.log(oAuthUtil.createAccessToken(10000, 5, 1, 1));
    redisDAO.getStringVal(params, function (error, result) {
        console.log(error | result)
    });
    res.send(200, {success: true});
    return next();
}

function saveAccessToken(user, deviceType) {
    logger.debug('[saveAccessToken]');
    var userObj = {
        id: user.id,
        type: user.type,
        subType: user.subType,
        status: user.status,
        device: deviceType
    };
    var userStr = JSON.stringify(userObj);
    var tokenKey = oAuthUtil.oc3_token_opt.head + user.accessToken;
    var expired = oAuthUtil.oc3_token_opt.web_expire;
    var subParams = {
        key: tokenKey,
        value: userStr,
        expired: expired
    };
    redisDAO.setAsyStringVal(subParams);
}

function getSysModuleToken(req, res, next) {
    var params = req.params;
    var mch = params.mch;
    var desc = params.desc;
    for (var i = 0; i < oAuthUtil.sysModules.length; i++) {
        if (oAuthUtil.sysModules[i].mch == mch) {
            if (oAuthUtil.sysModules[i].desc == desc) {
                //create token
                var devType = oAuthUtil.getRequestDevice(req.headers['user-agent']);
                var newAccessToken = oAuthUtil.createAccessToken(mch, listOfValue.USER_TYPE_MCH, 9, 1, devType);//subType = 9
                saveAccessToken({
                    id: mch,
                    type: listOfValue.USER_TYPE_MCH,
                    subType: 9,
                    status: 1,
                    accessToken: newAccessToken
                }, devType);
                logger.info('getSysModuleToken' + desc);
                resUtil.resetQueryRes(res, {accessToken: newAccessToken});
            } else {
                resUtil.resNoAuthorizedError(error, res, next);
            }
        }
    }
}

function removeAccessToken(accessToken, callback) {
    var tokenKey = oAuthUtil.oc3_token_opt.head + accessToken;
    redisDAO.removeStringVal({key: tokenKey}, function (error, result) {
        callback(error, result);
    });
}

function refreshModuleToken(callback) {
    httpUtil.httpGet(sysConfig.loginModule, '/api/mch/' + listOfValue.moduleInfo.mch + '/token', reqTokenObj,
        listOfValue.moduleInfo, function (error, result) {
            callback(error, result);
        });
}

function createModuleToken(callback) {
    httpUtil.httpPost(sysConfig.loginModule, '/api/mch', reqTokenObj, listOfValue.moduleInfo,
        function (error, result) {
            callback(error, result);
        });
}

function getReqWithToken(callback) {
    logger.debug(' getReqWithToken ' + reqTokenObj);
    logger.debug(' refresh token:last create time has passed for '
        + ( new Date().getTime() - reqTokenObj.headers.createTime) / 1000);
    var gapTime = 2 * 60 * 60 * 1000;
    if (reqTokenObj.headers['user-agent'] == 'xml_android') {
        logger.debug(' getToken for android ');
        gapTime = 30 * 24 * 60 * 60 * 1000;
    }
    if (reqTokenObj.headers[oAuthUtil.headerTokenMeta] == null
        || reqTokenObj.headers[oAuthUtil.headerTokenMeta] == undefined) {
        //create token
        createModuleToken(function (error, result) {
            if (error) {
                logger.error('getReqWithToken ' + error.message);
            } else {
                if (result.result)
                    reqTokenObj.headers[oAuthUtil.headerTokenMeta] = result.result.accessToken;
                reqTokenObj.headers.createTime = new Date().getTime();
            }
            logger.debug(reqTokenObj);
            callback(error, reqTokenObj);
        });
    } else if ((reqTokenObj.headers.createTime + gapTime) <= new Date().getTime()) {
        refreshModuleToken(function (error, result) {
            logger.debug(error || result);
            if (error) {
                logger.error('getReqWithToken ' + error.message);
            } else {
                reqTokenObj.headers[oAuthUtil.headerTokenMeta] = result.accessToken;
                reqTokenObj.headers.createTime = new Date().getTime();
            }
            callback(error, reqTokenObj);
        })
    } else {
        callback(null, reqTokenObj);
    }
}

module.exports = {
    refreshToken: refreshToken,
    refreshAdminToken: refreshAdminToken,
    refreshMchToken: refreshMchToken,
    checkUserToken: checkUserToken,
    checkReqUserToken: checkReqUserToken,
    testRedisKey: testRedisKey,
    saveAccessToken: saveAccessToken,
    removeAccessToken: removeAccessToken,
    getSysModuleToken: getSysModuleToken,
    getReqWithToken: getReqWithToken,
    resetAdmin: resetAdmin
};