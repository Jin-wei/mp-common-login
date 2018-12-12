/**
 * Created by ling xue on 2016/3/7.
 */

var commonUtil = require('mp-common-util');
var sysMsg = commonUtil.systemMsg;
var resUtil = commonUtil.responseUtil;
var httpUtil = commonUtil.httpUtil;
var encrypt = commonUtil.encrypt;
var roleBase = require('../bl/RoleBase.js');
var userInfoDAO = require('../dao/UserInfoDAO.js');
var bizDAO = require('../dao/BizDAO.js');
var redisDAO = require('../dao/RedisDAO.js');
var Seq = require('seq');
var sysConfig = require('../config/SystemConfig.js');
var listOfValue = require('../util/ListOfValue.js');
var messageType = require('../util/MessageType.js');
var serverLogger = require('../util/ServerLogger.js');
var moduleMessage = require('../util/ModuleMessage.js');
var logger = serverLogger.createLogger('UserMsg.js');

/**
 * send random key sms to new user phone,before check user phone .
 * @param req
 * @param res
 * @param next
 */
function sendSignInSms(req, res, next) {
    var params = req.params;
    params.smsType = listOfValue.SMS_REG_TYPE;
    var captchaKey = "";
    var insertFlag = true;
    Seq().seq(function () {
        var that = this;
        userInfoDAO.getUser(params, function (error, rows) {
            if (error) {
                logger.error(' sendSignInSms ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    logger.warn(' sendSignInSms ' + params.phone + sysMsg.CUST_SIGNUP_PHONE_REGISTERED);
                    resUtil.resetFailedRes(res, sysMsg.CUST_SIGNUP_PHONE_REGISTERED);
                    return next();
                } else {
                    that();
                }
            }
        })
    }).seq(function () {
        captchaKey = encrypt.getSmsRandomKey();
        var that = this;
        params.code = captchaKey;
        logger.info(captchaKey);
        var subParams = {
            phone: params.phone,
            captcha: params.code
        };
        roleBase.getReqWithToken(function (error, request) {
            httpUtil.httpPost(sysConfig.MessageQueueHost, '/api/userReg', request, subParams, function (error, result) {
                if (error) {
                    logger.warn("sendSignInSms " + error.message);
                } else {
                    logger.info(result);
                }
            });
            that();
        });
    }).seq(function () {
        var subParams = {};
        subParams.expired = listOfValue.EXPIRED_TIME_REG_SMS;
        subParams.key = listOfValue.CACHE_APPEND_REG + params.phone;
        subParams.value = params.code;
        redisDAO.setStringVal(subParams, function (error, result) {
            if (error) {
                logger.error('sendSignInSms ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                logger.info('sendSignInSms ' + ' success');
                resUtil.resetSuccessRes(res);
                return next();
            }
        })
    })
}
function sendSignInSmsForSubUser(req, res, next) {
    var params = req.params;
    params.smsType = listOfValue.SMS_REG_TYPE;
    var captchaKey = "";
    var insertFlag = true;
    var user;
    Seq().seq(function () {
        var that = this;
        userInfoDAO.getUser(params, function (error, rows) {
            if (error) {
                logger.error(' sendSignInSmsForSubUser ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    if (rows[0].p_biz_id != null && rows[0].p_biz_id != '') {
                        if (rows[0].p_biz_id == params.bizId) {
                            logger.warn(' addUserByBiz ' + params.phone + sysMsg.CUST_SIGNUP_PHONE_REGISTERED);
                            resUtil.resetFailedRes(res, sysMsg.CUST_SIGNUP_PHONE_REGISTERED);
                        } else {
                            logger.warn(' addUserByBiz ' + params.phone + ' ' + moduleMessage.ERROR_BIZ_OCCUPIED);
                            resUtil.resetFailedRes(res, moduleMessage.ERROR_BIZ_OCCUPIED);
                        }
                        return next();
                    } else {
                        bizDAO.getBizAndVerify({
                            userId: rows[0].userId
                        }, function (error, rows) {
                            if (error) {
                                logger.error(' getBizAndVerify ' + error.message);
                                resUtil.resInternalError(error, res, next);
                            } else {
                                if (rows && rows.length > 0 && rows[0].bizVerifyId != null
                                    && rows[0].bv_status == listOfValue.BIZ_VERIFY_VERIFIED) {
                                    logger.warn(' addUserByBiz ' + params.phone + sysMsg.CUST_SIGNUP_PHONE_REGISTERED);
                                    resUtil.resetFailedRes(res, sysMsg.CUST_SIGNUP_PHONE_REGISTERED);
                                    return next();
                                } else {
                                    user = rows[0];
                                    that();
                                }
                            }
                        });
                    }
                } else {
                    that();
                }
            }
        })
    }).seq(function () {
        captchaKey = encrypt.getSmsRandomKey();
        var that = this;
        params.code = captchaKey;
        logger.info(captchaKey);
        var subParams = {
            phone: params.phone,
            captcha: params.code
        };
        roleBase.getReqWithToken(function (error, request) {
            httpUtil.httpPost(sysConfig.MessageQueueHost, '/api/userReg', request, subParams, function (error, result) {
                if (error) {
                    logger.warn("sendSignInSmsForSubUser " + error.message);
                } else {
                    logger.info(result);
                }
            });
            that();
        });
    }).seq(function () {
        var subParams = {};
        subParams.expired = listOfValue.EXPIRED_TIME_REG_SMS;
        subParams.key = listOfValue.CACHE_APPEND_REG + params.phone;
        subParams.value = params.code;
        redisDAO.setStringVal(subParams, function (error, result) {
            if (error) {
                logger.error('sendSignInSmsForSubUser ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                logger.info('sendSignInSmsForSubUser ' + ' success');
                resUtil.resetQueryRes(res, user);
                return next();
            }
        });
    });
}

/**
 * send captcha sms to user phone ,before check user phone.
 * @param req
 * @param res
 * @param next
 */
function sendPasswordSms(req, res, next) {
    var params = req.params;
    params.smsType = listOfValue.SMS_PSWD_TYPE;
    var captchaKey = "";
    var insertFlag = true;
    Seq().seq(function () {
        var that = this;
        userInfoDAO.getUser(params, function (error, rows) {
            if (error) {
                logger.error(' sendPasswordSms ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length < 1) {
                    logger.warn(' sendPasswordSms ' + params.phone + sysMsg.CUST_LOGIN_USER_UNREGISTERED);
                    resUtil.resetFailedRes(res, sysMsg.CUST_LOGIN_USER_UNREGISTERED);
                    return next();
                } else {
                    that();
                }
            }
        });
    }).seq(function () {
        captchaKey = encrypt.getSmsRandomKey();
        var that = this;
        logger.info(captchaKey);
        params.code = captchaKey;
        var subParams = {
            phone: params.phone,
            captcha: params.code
        };
        roleBase.getReqWithToken(function (error, request) {
            logger.debug(request);
            httpUtil.httpPost(sysConfig.MessageQueueHost, '/api/userPassword', request, subParams, function (error, result) {
                if (error) {
                    logger.warn("sendSignInSms " + error.message);
                } else {
                    logger.info(result);
                }
            });
            that();
        })
    }).seq(function () {
        var subParams = {};
        subParams.expired = listOfValue.EXPIRED_TIME_PSWD_SMS;
        subParams.key = listOfValue.CACHE_APPEND_PSWD + params.phone;
        subParams.value = params.code;
        redisDAO.setStringVal(subParams, function (error, result) {
            if (error) {
                logger.error('sendPasswordSms ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                logger.info('sendPasswordSms ' + ' success');
                resUtil.resetSuccessRes(res);
                return next();
            }
        });
    });

}
function sendResetPhoneSms(req, res, next) {
    var params = req.params;
    params.smsType = listOfValue.SMS_PHONE_TYPE;
    var captchaKey = "";
    var insertFlag = true;
    Seq().seq(function () {
        var that = this;
        userInfoDAO.getUser(params, function (error, rows) {
            if (error) {
                logger.error(' sendResetPhoneSms ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length < 1) {
                    that();
                } else {
                    logger.warn(' sendResetPhoneSms ' + params.phone + sysMsg.CUST_SIGNUP_PHONE_REGISTERED);
                    resUtil.resetFailedRes(res, sysMsg.CUST_SIGNUP_PHONE_REGISTERED);
                    return next();
                }
            }
        });
    }).seq(function () {
        captchaKey = encrypt.getSmsRandomKey();
        var that = this;
        logger.info(captchaKey);
        params.code = captchaKey;
        var subParams = {
            phone: params.phone,
            captcha: params.code
        };
        roleBase.getReqWithToken(function (error, request) {
            httpUtil.httpPost(sysConfig.MessageQueueHost, '/api/userPhone', request, subParams, function (error, result) {
                if (error) {
                    logger.warn("sendResetPhoneSms " + error.message);
                } else {
                    logger.info(result);
                }
            });
            that();
        })

    }).seq(function () {
        var subParams = {};
        subParams.expired = listOfValue.EXPIRED_TIME_PHONE_SMS;
        subParams.key = listOfValue.CACHE_APPEND_RST + params.phone;
        subParams.value = params.code;
        redisDAO.setStringVal(subParams, function (error, result) {
            if (error) {
                logger.error('sendResetPhoneSms ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                logger.info('sendResetPhoneSms ' + ' success');
                resUtil.resetSuccessRes(res);
                return next();
            }
        });
    });
}
module.exports = {
    sendSignInSms: sendSignInSms,
    sendPasswordSms: sendPasswordSms,
    sendResetPhoneSms: sendResetPhoneSms,
    sendSignInSmsForSubUser: sendSignInSmsForSubUser
};