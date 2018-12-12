/**
 * Created by Szane on 2016/8/11.
 */
var fs = require('fs');
var wkhtmltopdf = require('wkhtmltopdf');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Contract.js');
var commonUtil = require('mp-common-util');
var resUtil = commonUtil.responseUtil;
var httpUtil = commonUtil.httpUtil;
var bizDAO = require('../dao/BizDAO.js');
var userInfoDAO = require('../dao/UserInfoDAO.js');
var regionDAO = require('../dao/RegionDAO.js');
var Seq = require('seq');
var moment = require('moment');
var config = require('../config/SystemConfig.js');
var fileDAO = require('../dao/FileDAO.js');
var contractDAO = require('../dao/ContractDAO.js');
var reqUtil = require('../util/HttpReqUtil.js');

function generateSignUpPdf(req, res, next) {
    var params = req.params;
    var userAccount = params.phone, timeStamp, ipAddress;
    Seq().seq(function () {
        var that = this;
        userInfoDAO.getUser({phone: userAccount}, function (error, rows) {
            if (error) {
                logger.error(' getUser ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    timeStamp = moment(rows[0].created_on).format('YYYY-MM-DD HH:mm:ss');
                }
                ipAddress = reqUtil.getClientIp(req);
                that();
            }
        });
    }).seq(function () {
        fs.readFile(__dirname + '/template/register_contract.html', {encoding: 'utf8'}, function (err, tpldata) {
            if (err) {
                logger.error(' generateSignUpPdf ' + err.message);
                resUtil.resInternalError(err, res, next);
            } else {
                var rootUrl = req.isSecure() ? 'https://' : 'http://' + req.header('Host');
                var output = tpldata.toString()
                    .replace(/\{\{rootUrl\}\}/g, rootUrl)
                    .replace(/\{\{timeStamp\}\}/g, timeStamp)
                    .replace(/\{\{userAccount\}\}/g, userAccount)
                    .replace(/\{\{ipAddress\}\}/g, ipAddress);
                var stream = wkhtmltopdf(output, {encoding: 'utf8', pageSize: 'letter'});
                var file = {
                    name: 'contract.pdf',
                    stream: stream
                };
                var fileId;
                fileDAO.createFileByStream(file, function (error, result) {
                    if (error) {
                        logger.error(' createFileByStream ' + error.message);
                        resUtil.resInternalError(error, res, next);
                    } else {
                        logger.debug(result);
                        fileId = result._id;
                        res.send(200, {success: true, file_id: fileId, active_on: timeStamp});
                        return next();
                    }
                });
            }
        });
    });
}
function generateTruckPdf(req, res, next) {
    var params = req.params;
    var bizName, address, bizUser, operator, phone, year, month, date, contractNo,
        userNo, timeStamp, ipAddress, userAccount, datetime;
    Seq().seq(function () {
        var that = this;
        bizDAO.getBizAndVerify({bizId: params.bizId}, function (error, rows) {
            if (error) {
                logger.error(' getBizAndVerify ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    bizName = rows[0].name;
                    regionDAO.query3LevelRegion({
                        regionId: rows[0].zipcode
                    }, function (error, region) {
                        if (error) {
                            logger.error(' getBizAndVerify ' + error.message);
                            resUtil.resInternalError(error, res, next);
                        } else {
                            if (region && region.length > 0)
                                address = (region[0].r1_name + region[0].r2_name + region[0].r3_name + rows[0].address);
                            bizUser = rows[0].jur_per;
                            operator = rows[0].operator;
                            phone = rows[0].phone;
                            datetime = rows[0].bv_updated_on;
                            year = 1900 + datetime.getYear();
                            month = datetime.getMonth() + 1;
                            date = datetime.getDate();
                            userNo = rows[0].user_id;
                            ipAddress = rows[0].ip_info;
                            timeStamp = moment(rows[0].bv_updated_on).format('YYYY-MM-DD HH:mm:ss');
                            that();
                        }
                    });
                }
            }
        });
    }).seq(function () {
        var that = this;
        contractDAO.generateContractNum({datetime: datetime, type: 'CD', typeNum: 5}, function (error, result) {
            if (error) {
                logger.error(' generateContractNum ' + error.message);
                resUtil.resInternalError(error, res, next);
            }
            contractNo = result;
            that();
        });
    }).seq(function () {
        var that = this;
        userInfoDAO.getUser({userId: userNo}, function (error, rows) {
            if (error) {
                logger.error(' getUser ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    userAccount = rows[0].phone;
                    that();
                }
            }
        });
    }).seq(function () {
        fs.readFile(__dirname + '/template/contract_truck.html', {encoding: 'utf8'}, function (err, tpldata) {
            if (err) {
                logger.error(' generateTruckPdf ' + err.message);
                resUtil.resInternalError(err, res, next);
            } else {
                var rootUrl = req.isSecure() ? 'https://' : 'http://' + req.header('Host');
                var output = tpldata.toString()
                    .replace(/\{\{rootUrl\}\}/g, rootUrl)
                    .replace(/\{\{address\}\}/g, address || '')
                    .replace(/\{\{bizName\}\}/g, bizName || '')
                    .replace(/\{\{bizUser\}\}/g, bizUser || '')
                    .replace(/\{\{operator\}\}/g, operator || '')
                    .replace(/\{\{phone\}\}/g, phone || '')
                    .replace(/\{\{year\}\}/g, year)
                    .replace(/\{\{month\}\}/g, month)
                    .replace(/\{\{date\}\}/g, date)
                    .replace(/\{\{contractNo\}\}/g, contractNo)
                    .replace(/\{\{timeStamp\}\}/g, timeStamp)
                    .replace(/\{\{userAccount\}\}/g, userAccount)
                    .replace(/\{\{ipAddress\}\}/g, ipAddress);
                var stream = wkhtmltopdf(output, {encoding: 'utf8', pageSize: 'letter'});
                var file = {
                    name: 'contract.pdf',
                    stream: stream
                };
                var fileId;
                fileDAO.createFileByStream(file, function (error, result) {
                    if (error) {
                        logger.error(' createFileByStream ' + error.message);
                        resUtil.resInternalError(error, res, next);
                    } else {
                        logger.debug(result);
                        fileId = result._id;
                        res.send(200, {success: true, file_id: fileId, contract_no: contractNo, active_on: datetime});
                        return next();
                    }
                });
            }
        });
    });
}
function generateAgentPdf(req, res, next) {
    var params = req.params;
    var bizName, address, bizUser, operator, phone, year, month, date, contractNo,
        userNo, timeStamp, ipAddress, userAccount, datetime;
    Seq().seq(function () {
        var that = this;
        bizDAO.getBizAndVerify({bizId: params.bizId}, function (error, rows) {
            if (error) {
                logger.error(' getBizAndVerify ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    bizName = rows[0].name;
                    regionDAO.query3LevelRegion({
                        regionId: rows[0].zipcode
                    }, function (error, region) {
                        if (error) {
                            logger.error(' getBizAndVerify ' + error.message);
                            resUtil.resInternalError(error, res, next);
                        } else {
                            if (region && region.length > 0)
                                address = (region[0].r1_name + region[0].r2_name + region[0].r3_name + rows[0].address);
                            bizUser = rows[0].jur_per;
                            operator = rows[0].operator;
                            phone = rows[0].phone;
                            datetime = rows[0].bv_updated_on;
                            year = 1900 + datetime.getYear();
                            month = datetime.getMonth() + 1;
                            date = datetime.getDate();
                            userNo = rows[0].user_id;
                            ipAddress = rows[0].ip_info;
                            timeStamp = moment(rows[0].bv_updated_on).format('YYYY-MM-DD HH:mm:ss');
                            that();
                        }
                    });
                }
            }
        });
    }).seq(function () {
        var that = this;
        contractDAO.generateContractNum({datetime: datetime, type: 'HF', typeNum: 2}, function (error, result) {
            if (error) {
                logger.error(' generateContractNum ' + error.message);
                resUtil.resInternalError(error, res, next);
            }
            contractNo = result;
            that();
        });
    }).seq(function () {
        var that = this;
        userInfoDAO.getUser({userId: userNo}, function (error, rows) {
            if (error) {
                logger.error(' getUser ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    userAccount = rows[0].phone;

                    that();
                }
            }
        });
    }).seq(function () {
        fs.readFile(__dirname + '/template/contract_agent.html', {encoding: 'utf8'}, function (err, tpldata) {
            if (err) {
                logger.error(' generateTruckPdf ' + err.message);
                resUtil.resInternalError(err, res, next);
            } else {
                var rootUrl = req.isSecure() ? 'https://' : 'http://' + req.header('Host');
                var output = tpldata.toString()
                    .replace(/\{\{rootUrl\}\}/g, rootUrl)
                    .replace(/\{\{address\}\}/g, address || '')
                    .replace(/\{\{bizName\}\}/g, bizName || '')
                    .replace(/\{\{bizUser\}\}/g, bizUser || '')
                    .replace(/\{\{operator\}\}/g, operator || '')
                    .replace(/\{\{phone\}\}/g, phone || '')
                    .replace(/\{\{year\}\}/g, year)
                    .replace(/\{\{month\}\}/g, month)
                    .replace(/\{\{date\}\}/g, date)
                    .replace(/\{\{contractNo\}\}/g, contractNo)
                    .replace(/\{\{timeStamp\}\}/g, timeStamp)
                    .replace(/\{\{userAccount\}\}/g, userAccount)
                    .replace(/\{\{ipAddress\}\}/g, ipAddress);
                var stream = wkhtmltopdf(output, {encoding: 'utf8', pageSize: 'letter'});
                var file = {
                    name: 'contract.pdf',
                    stream: stream
                };
                var fileId;
                fileDAO.createFileByStream(file, function (error, result) {
                    if (error) {
                        logger.error(' createFileByStream ' + error.message);
                        resUtil.resInternalError(error, res, next);
                    } else {
                        logger.debug(result);
                        fileId = result._id;
                        res.send(200, {success: true, file_id: fileId, contract_no: contractNo, active_on: datetime});
                        return next();
                    }
                });
            }
        });
    });
}
function generateCreditPdf(req, res, next) {
    var params = req.params;
    var bizName, address, bizUser, operator, phone, year, month, date, contractNo,
        userNo, timeStamp, ipAddress, userAccount, datetime;
    Seq().seq(function () {
        var that = this;
        bizDAO.getBizAndVerify({bizId: params.bizId}, function (error, rows) {
            if (error) {
                logger.error(' getBizAndVerify ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    bizName = rows[0].name;
                    regionDAO.query3LevelRegion({
                        regionId: rows[0].zipcode
                    }, function (error, region) {
                        if (error) {
                            logger.error(' getBizAndVerify ' + error.message);
                            resUtil.resInternalError(error, res, next);
                        } else {
                            if (region && region.length > 0)
                                address = (region[0].r1_name + region[0].r2_name + region[0].r3_name + rows[0].address);
                            bizUser = rows[0].jur_per;
                            operator = rows[0].operator;
                            phone = rows[0].phone;
                            datetime = rows[0].bv_updated_on;
                            year = 1900 + datetime.getYear();
                            month = datetime.getMonth() + 1;
                            date = datetime.getDate();
                            userNo = rows[0].user_id;
                            ipAddress = rows[0].ip_info;
                            timeStamp = moment(rows[0].bv_updated_on).format('YYYY-MM-DD HH:mm:ss');
                            that();
                        }
                    });
                }
            }
        });
    }).seq(function () {
        var that = this;
        contractDAO.generateContractNum({datetime: datetime, type: 'HJ', typeNum: 3}, function (error, result) {
            if (error) {
                logger.error(' generateContractNum ' + error.message);
                resUtil.resInternalError(error, res, next);
            }
            contractNo = result;
            that();
        });
    }).seq(function () {
        var that = this;
        userInfoDAO.getUser({userId: userNo}, function (error, rows) {
            if (error) {
                logger.error(' getUser ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0) {
                    userAccount = rows[0].phone;

                    that();
                }
            }
        });
    }).seq(function () {
        fs.readFile(__dirname + '/template/cost_agreement.html', {encoding: 'utf8'}, function (err, tpldata) {
            if (err) {
                logger.error(' generateTruckPdf ' + err.message);
                resUtil.resInternalError(err, res, next);
            } else {
                var rootUrl = req.isSecure() ? 'https://' : 'http://' + req.header('Host');
                var output = tpldata.toString()
                    .replace(/\{\{rootUrl\}\}/g, rootUrl)
                    .replace(/\{\{address\}\}/g, address || '')
                    .replace(/\{\{bizName\}\}/g, bizName || '')
                    .replace(/\{\{bizUser\}\}/g, bizUser || '')
                    .replace(/\{\{operator\}\}/g, operator || '')
                    .replace(/\{\{phone\}\}/g, phone || '')
                    .replace(/\{\{year\}\}/g, year)
                    .replace(/\{\{month\}\}/g, month)
                    .replace(/\{\{date\}\}/g, date)
                    .replace(/\{\{contractNo\}\}/g, contractNo)
                    .replace(/\{\{timeStamp\}\}/g, timeStamp)
                    .replace(/\{\{userAccount\}\}/g, userAccount)
                    .replace(/\{\{ipAddress\}\}/g, ipAddress);
                var stream = wkhtmltopdf(output, {encoding: 'utf8', pageSize: 'letter'});
                var file = {
                    name: 'contract.pdf',
                    stream: stream
                };
                var fileId;
                fileDAO.createFileByStream(file, function (error, result) {
                    if (error) {
                        logger.error(' createFileByStream ' + error.message);
                        resUtil.resInternalError(error, res, next);
                    } else {
                        logger.debug(result);
                        fileId = result._id;
                        res.send(200, {success: true, file_id: fileId, contract_no: contractNo, active_on: datetime});
                        return next();
                    }
                });
            }
        });
    });
}
function initRegisterContract(req, res, next) {
    var userList = [];
    var sum = 0;
    Seq().seq(function () {
        var that = this;
        bizDAO.getUserAndBiz({}, function (error, rows) {
            userList = rows;
            that();
        });
    }).seq(function () {
        Seq(userList).seqEach(function (user, i) {
            var count = this;
            if (user.type != 2 && user.type != 4)
                count(null, i);
            else
                Seq().seq(function () {
                    var that = this;
                    // httpUtil.httpDelete(config.cmsHost, '/api/content', {}, {
                    //     // bizId: user.biz_id,
                    //     t1: '1',
                    //     t2: user.type == 2 ? '1' : '4'
                    // }, function (error, result) {
                    //     logger.debug(error || result);
                    //     if (error)
                    //         resUtil.resInternalError(error, res, next);
                    that();
                    // });
                }).seq(function () {
                    httpUtil.httpGet(config.loginModule, '/api/contract/register/' + user.phone,
                        {}, {}, function (error, result) {
                            logger.debug(error || result);
                            if (error)
                                resUtil.resInternalError(error, res, next);
                            httpUtil.httpGet(config.cmsHost, '/api/content', {}, {
                                bizId: user.biz_id,
                                t1: '1',
                                t2: user.type == 2 ? '1' : '4'
                            }, function (error, rows) {
                                if (error)
                                    resUtil.resInternalError(error, res, next);
                                if (rows.result && rows.result.length > 0) {
                                    logger.debug('注册协议已存在' + user.biz_id);
                                    count(null, i);
                                }
                                else
                                    httpUtil.httpPost(config.cmsHost, '/api/content', {}, {
                                        bizId: user.biz_id,
                                        type: {t1: '1', t2: user.type == 2 ? '1' : '4'},
                                        title: user.type == 2 ? '货代注册协议' : '车队注册协议',
                                        activeOn: user.created_on,
                                        addons: [{name: user.type == 2 ? '货代注册协议' : '车队注册协议', url: result.file_id}]
                                    }, function (error, result) {
                                        logger.debug(error || result);
                                        if (error)
                                            resUtil.resInternalError(error, res, next);
                                        sum++;
                                        count(null, i);
                                    });
                            });

                        });
                });
        }).seq(function () {
            resUtil.resetQueryRes(res, sum);
            return next();
        });
    });
}
function initBizContract(req, res, next) {
    var bizList = [];
    var sum = 0;
    Seq().seq(function () {
        var that = this;
        bizDAO.getBizAndVerify({
            status: 9,
            type: 2
        }, function (error, rows) {
            bizList = rows;
            that();
        });
    }).seq(function () {
        var that = this;
        Seq(bizList).seqEach(function (biz, i) {
            var count = this;
            httpUtil.httpGet(config.loginModule, '/api/contract/agent/' + biz.id, {}, {}, function (error, result1) {
                logger.debug('1');
                logger.debug(error || result1);
                if (error)
                    resUtil.resInternalError(error, res, next);
                httpUtil.httpGet(config.cmsHost, '/api/content', {}, {
                    bizId: biz.id,
                    t1: '1',
                    t2: '2'
                }, function (error, result2) {
                    logger.debug('2');
                    logger.debug(error || result2);
                    if (error)
                        resUtil.resInternalError(error, res, next);
                    if (result2 && result2.result && result2.result.length > 0)
                        httpUtil.httpPut(config.cmsHost, '/api/content/' + result2.result[0]._id, {}, {
                            contentInfo: {
                                type: {t1: '1', t2: '2'},
                                title: '货代实名认证合同',
                                code: result1.contract_no,
                                author: biz.name,
                                activeOn: biz.bv_updated_on,
                                addons: {name: '货代实名认证合同', url: result1.file_id}
                            }
                        }, function (error, result3) {
                            logger.debug('3');
                            logger.debug(error || result3);
                            if (error)
                                resUtil.resInternalError(error, res, next);
                            sum++;
                            count(null, i);
                        });
                    else
                        httpUtil.httpPost(config.cmsHost, '/api/content', {}, {
                            bizId: biz.id,
                            type: {t1: '1', t2: '2'},
                            title: '货代实名认证合同',
                            code: result1.contract_no,
                            author: biz.name,
                            activeOn: biz.bv_updated_on,
                            addons: {name: '货代实名认证合同', url: result1.file_id}
                        }, function (error, result3) {
                            logger.debug('4');
                            logger.debug(error || result3);
                            if (error)
                                resUtil.resInternalError(error, res, next);
                            sum++;
                            count(null, i);
                        });
                });
            });
        }).seq(function () {
            bizDAO.getBizAndVerify({
                status: 9,
                type: 4
            }, function (error, rows) {
                bizList = rows;
                that();
            });
        });
    }).seq(function () {
        Seq(bizList).seqEach(function (biz, i) {
            var count = this;
            httpUtil.httpGet(config.loginModule, '/api/contract/truck/' + biz.id, {}, {}, function (error, result1) {
                logger.debug(error || result1);
                if (error)
                    resUtil.resInternalError(error, res, next);
                httpUtil.httpGet(config.cmsHost, '/api/content', {}, {
                    bizId: biz.id,
                    t1: '1',
                    t2: '5'
                }, function (error, result2) {
                    logger.debug(error || result2);
                    if (error)
                        resUtil.resInternalError(error, res, next);
                    if (result2 && result2.result && result2.result.length > 0)
                        httpUtil.httpPut(config.cmsHost, '/api/content/' + result2.result[0]._id, {}, {
                            contentInfo: {
                                type: {t1: '1', t2: '5'},
                                title: '车队实名认证合同',
                                code: result1.contract_no,
                                author: biz.name,
                                activeOn: biz.bv_updated_on,
                                addons: {name: '车队实名认证合同', url: result1.file_id}
                            }
                        }, function (error, result3) {
                            logger.debug(error, result3);
                            if (error)
                                resUtil.resInternalError(error, res, next);
                            sum++;
                            count(null, i);
                        });
                    else
                        httpUtil.httpPost(config.cmsHost, '/api/content', {}, {
                            bizId: biz.id,
                            type: {t1: '1', t2: '5'},
                            code: result1.contract_no,
                            title: '车队实名认证合同',
                            author: biz.name,
                            activeOn: biz.bv_updated_on,
                            addons: {name: '车队实名认证合同', url: result1.file_id}
                        }, function (error, result3) {
                            logger.debug(error || result3);
                            if (error)
                                resUtil.resInternalError(error, res, next);
                            sum++;
                            count(null, i);
                        });
                });
            });
        }).seq(function () {
            resUtil.resetQueryRes(res, sum);
            return next();
        });
    });
}


module.exports = {
    generateTruckPdf: generateTruckPdf,
    generateAgentPdf: generateAgentPdf,
    generateSignUpPdf: generateSignUpPdf,
    generateCreditPdf: generateCreditPdf,
    initRegisterContract: initRegisterContract,
    initBizContract: initBizContract
};