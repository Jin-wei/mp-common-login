/**
 * Created by Szane on 2016/4/19.
 */
var commonUtil = require('mp-common-util');
var resUtil = commonUtil.responseUtil;
var httpUtil = commonUtil.httpUtil;
var reqUtil = require('../util/HttpReqUtil.js');
var listOfValue = require('../util/ListOfValue.js');
var moduleMessage = require('../util/ModuleMessage.js');
var sysConfig = require('../config/SystemConfig.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Biz.js');
var Seq = require('seq');
var bizDAO = require('../dao/BizDAO.js');
var bizVerifyDAO = require('../dao/BizVerifyDAO.js');
var userInfoDAO = require('../dao/UserInfoDAO.js');
var bonusPointDAO = require('../dao/BonusPointDAO.js');
var notifyTemplate = require('../util/NotifyTemplate.js');
var roleBase = require('../bl/RoleBase.js');

function addBiz(req, res, next) {
    var params = req.params;
    Seq().seq(function () {
        params.opUser = params.adminId;
        params.userId = params.userNo;
        params.ipInfo = reqUtil.getClientIp(req);
        bizDAO.createBiz(params, function (error, result) {
            if (error) {
                logger.error(' addBiz ' + error.message);
                resUtil.resInternalError(error, res, next);
            }
            resUtil.resetCreateRes(res, result);
            return next();
        });
    });
}
function getUserAndBiz(req, res, next) {
    var params = req.params;
    bizDAO.getUserAndBiz(params, function (error, rows) {
        if (error) {
            logger.error(' getUserAndBiz ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            if (error) {
                logger.error(' getSubUserAndBiz ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                res.send(200, {success: true, result: rows});
                return next();
            }
        }
    });
}
function getUserAndBizCount(req, res, next) {
    var params = req.params;
    bizDAO.getUserAndBizCount(params, function (error, rows) {
        if (error) {
            logger.error(' getUserAndBizCount ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetQueryRes(res, rows);
            return next();
        }
    });
}
function getBiz(req, res, next) {
    var params = req.params;
    bizDAO.getBiz(params, function (error, rows) {
        if (error) {
            logger.error(' getBiz ' + error.message);
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetQueryRes(res, rows);
        return next();
    });
}
function getBizAndVerify(req, res, next) {
    var params = req.params;
    bizDAO.getBizAndVerify(params, function (error, rows) {
        if (error) {
            logger.error(' getBizAndVerify ' + error.message);
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetQueryRes(res, rows);
        return next();
    });
}
function getBizAndVerifyCount(req, res, next) {
    var params = req.params;
    bizDAO.getBizAndVerifyCount(params, function (error, rows) {
        if (error) {
            logger.error(' getBizAndVerifyCount ' + error.message);
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetQueryRes(res, rows);
        return next();
    });
}
function updateBiz(req, res, next) {
    logger.debug(' bl:updateBiz ');
    var params = req.params;
    bizVerifyDAO.updateBizVerifyBizLicNum({
        bizId: params.bizId,
        bizLicNum: params.bizLicNum
    }, function (error) {
        if (error) {
            logger.error(' updateBizVerifyBizLicNum ' + error.message);
            resUtil.resInternalError(error, res, next);
        }
    });
    params.ipInfo = reqUtil.getClientIp(req);
    bizDAO.updateBiz(params, function (error, result) {
        if (error) {
            logger.error(' updateBiz ' + error.message);
            resUtil.resInternalError(error, res, next);
        }
        if (params.adminId == null) {
            var template = notifyTemplate.ADMIN_BIZ_VERIFY;
            var content = template.content.replace('{@@}', params.name);
            roleBase.getReqWithToken(function (error, request) {
                httpUtil.httpPost(sysConfig.stiHost, '/api/email', request, {
                    emailTo: sysConfig.xmlAdminEmail,
                    title: notifyTemplate.ADMIN_BIZ_VERIFY.title,
                    content: content
                }, function (error, result) {
                    if (error)
                        logger.error(' sendEmail ' + error.message);
                });
            })
        }
        bonusPointDAO.updateBonusPoint({
            bizId: params.bizId,
            bizName: params.name
        }, function (error, result) {
            if (error) {
                logger.error(' updateBonusPoint ' + error.message);
            }
        });
        resUtil.resetUpdateRes(res, result);
        return next();
    });
}
function addBizVerify(req, res, next) {
    var params = req.params;
    params.opUser = params.adminId;
    Seq().seq(function () {
        var that = this;
        bizDAO.getBizAndVerify({
            userNo: params.userNo || params.userId,
            verified: 1
        }, function (error, rows) {
            if (error) {
                logger.error(' addBizVerify:getBizAndVerify ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0 && rows[0].bizVerifyId != null) {
                    logger.error(moduleMessage.ERROR_VERIFY_ADDED);
                    resUtil.resetFailedRes(res, moduleMessage.ERROR_VERIFY_ADDED);
                } else {
                    that();
                }
            }
        });
    }).seq(function () {
        bizVerifyDAO.createBizVerify(params, function (error, result) {
            if (error) {
                logger.error(' addBizVerify ' + error.message);
                resUtil.resInternalError(error, res, next);
            }
            resUtil.resetCreateRes(res, result);
            return next();
        });
    });
}
function updateBizVerify(req, res, next) {
    logger.debug('bl:updateBizVerify');
    var params = req.params;
    bizVerifyDAO.updateBizVerify(params, function (error, result) {
        if (error) {
            logger.error(' updateBiz ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            if (result && result.affectedRows > 0) {
                if (params.adminId == null) {
                    params.status = listOfValue.BIZ_VERIFY_STATUS_PENDING;
                    bizVerifyDAO.updateBizVerifyStatus(params, function (error, result) {
                        if (result && result.affectedRows > 0) {
                            resUtil.resetUpdateRes(res, result);
                        } else {
                            resUtil.resetFailedRes(res, result.message);
                        }
                        return next();
                    })
                } else {
                    resUtil.resetUpdateRes(res, result);
                    return next();
                }
            } else {
                resUtil.resetFailedRes(res, result.message);
                return next();
            }
        }
    });
}
function updateBizStatus(req, res, next) {
    var params = req.params;
    bizDAO.updateBizStatus(params, function (error, result) {
        if (error) {
            logger.error(' updateBiz ' + error.message);
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetUpdateRes(res, result);
        return next();
    });
}
function updateBizVerifyStatus(req, res, next) {
    var params = req.params;
    var bizType, bizName, userId, bizId;
    var msgParams = {
        id: params.bizVerifyId,
        roleType: listOfValue.USER_TYPE_NOT_VERIFIED
    };
    if (params.status == listOfValue.BIZ_VERIFY_VERIFIED) {
        msgParams.result = 1;
    } else {
        msgParams.result = 0;
    }
    Seq().seq(function () {
        var that = this;
        var subParams = {
            bizVerifyId: params.bizVerifyId
        };
        bizDAO.getBizAndVerify(subParams, function (error, rows) {
            if (error) {
                logger.error(' updateBizVerifyStatus: getBizAndVerify ' + error.message);
                resUtil.resInternalError(error, res, next);
            }
            if (rows && rows.length > 0) {
                userId = rows[0].user_id;
                bizId = rows[0].id;
                bizType = rows[0].bi_type;
                bizName = rows[0].name;
                var subType = (rows[0].bi_type == 2 ? listOfValue.USER_SUB_TYPE_AGENCY_ADMIN :
                    (rows[0].bi_type == 4 ? listOfValue.USER_SUB_TYPE_TRUCK_ADMIN : listOfValue.USER_SUB_TYPE_NOT_VERIFIED));
                userInfoDAO.updateUserVerifyInfo({
                    userId: rows[0].user_id,
                    type: rows[0].bi_type,
                    subType: subType,
                    name: rows[0].name
                }, function (error) {
                    if (error) {
                        logger.error(' updateBiz: getBiz ' + error.message);
                    }
                    that();
                });
            }
        });
    }).seq(function () {
        roleBase.getReqWithToken(function (error, request) {
            httpUtil.httpPost(sysConfig.MessageQueueHost, '/api/verifyResult', request, msgParams, function (error, result) {
                if (error) {
                    logger.warn("send verify message " + error.message);
                } else {
                    logger.info(result);
                }
            });
            var template;
            if (params.status != null && params.status == listOfValue.BIZ_STATUS_VERIFIED) {
                if (bizType == listOfValue.USER_TYPE_AGENCY)
                    template = notifyTemplate.AGENT_VERIFIED;
                else if (bizType == listOfValue.USER_TYPE_TRUCK_TEAM)
                    template = notifyTemplate.TRUCK_VERIFIED;
                else if (bizType == listOfValue.USER_TYPE_SHIPPING)
                    template = notifyTemplate.SHIP_VERIFIED;
            } else {
                template = notifyTemplate.VERIFY_FAILED;
            }
            httpUtil.httpPost(sysConfig.NotificationHost, '/api/notification', request, {
                title: template.title,
                body: template.content,
                status: listOfValue.NOTIFY_STATUS_READED_NO,
                receiver: userId,
                receiverBiz: bizId,
                receiverName: bizName,
                receiverType: bizType
            }, function (error, result) {
                if (error) {
                    logger.warn("send verify message " + error.message);
                } else {
                    logger.info(result);
                }
            });
        });
        bizDAO.updateBizStatus({
            bizId: bizId,
            status: params.status
        }, function (error) {
            if (error) {
                logger.error(' updateBiz ' + error.message);
                resUtil.resInternalError(error, res, next);
            }
        });
        bizVerifyDAO.updateBizVerifyStatus(params, function (error, result) {
            if (error) {
                logger.error(' updateBiz ' + error.message);
                resUtil.resInternalError(error, res, next);
            }
            resUtil.resetUpdateRes(res, result);
            return next();
        });
    });
}
function addBizTruckRel(req, res, next) {
    var params = req.params;
    Seq().seq(function () {
        var that = this;
        bizDAO.getBizTruckRel(params, function (error, rows) {
            if (error) {
                logger.error(' getBizTruckRel ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    logger.error(' addBizTruckRel ' + moduleMessage.ERROR_TRUCKTEAM_ADDED);
                    resUtil.resetFailedRes(res, moduleMessage.ERROR_TRUCKTEAM_ADDED);
                } else {
                    that();
                }
            }
        })
    }).seq(function () {
        bizDAO.addBizTruckRel(params, function (error, result) {
            if (error) {
                logger.error(' addBizTruckRel ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (result && result.affectedRows > 0) {
                    resUtil.resetUpdateRes(res, result);
                } else {
                    logger.error(' addBizTruckRel ' + result.message);
                    resUtil.resetFailedRes(res, result.message);
                }
                return next();
            }
        });
    });

}
function deleteBizTruckRel(req, res, next) {
    var params = req.params;
    bizDAO.deleteBizTruckRel(params, function (error, result) {
        if (error) {
            logger.error(' deleteBizTruckRel ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            if (result && result.affectedRows > 0) {
                resUtil.resetUpdateRes(res, result);
            } else {
                logger.error(' deleteBizTruckRel ' + result.message);
                resUtil.resetFailedRes(res, result.message);
            }
            return next();
        }
    });
}
function getBizTruckTeam(req, res, next) {
    var params = req.params;
    bizDAO.getBizTruckTeam(params, function (error, rows) {
        if (error) {
            logger.error(' getBizTruckTeam ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetQueryRes(res, rows);
            return next();
        }
    });
}
function checkLicenseNum(req, res, next) {
    var params = req.params;
    bizDAO.getBizAndVerify({
        status: listOfValue.BIZ_STATUS_VERIFIED,
        type: params.type,
        bizLicNum: params.bizLicNum
    }, function (error, rows) {
        if (error) {
            logger.error(' checkLicenseNum ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            if (rows && rows.length > 0 && rows[0].id != params.bizId) {
                var errMsg = moduleMessage.ERROR_BIZ_LIC_ADDED.replace('{@@}', rows[0].name);
                resUtil.resetFailedRes(res, errMsg);
                return next();
            } else {
                resUtil.resetSuccessRes(res);
                return next();
            }
        }
    });
}
module.exports = {
    addBiz: addBiz,
    getBiz: getBiz,
    getUserAndBiz: getUserAndBiz,
    getUserAndBizCount: getUserAndBizCount,
    getBizAndVerify: getBizAndVerify,
    getBizAndVerifyCount: getBizAndVerifyCount,
    updateBiz: updateBiz,
    updateBizStatus: updateBizStatus,
    addBizVerify: addBizVerify,
    updateBizVerify: updateBizVerify,
    updateBizVerifyStatus: updateBizVerifyStatus,
    addBizTruckRel: addBizTruckRel,
    deleteBizTruckRel: deleteBizTruckRel,
    getBizTruckTeam: getBizTruckTeam,
    checkLicenseNum: checkLicenseNum
};

