/**
 * Created by Szane on 16/12/10.
 */

var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CoreBiz.js');
var coreBizDAO = require('../dao/CoreBizDAO.js');
var coreBizConfigDAO = require('../dao/CoreBizConfigDAO.js');
var commonUtil = require('mp-common-util');
var resUtil = commonUtil.responseUtil;
var httpUtil = commonUtil.httpUtil;
var roleBase = require('../bl/RoleBase.js');
var sysConfig = require('../config/SystemConfig.js');
var Seq = require('seq');
var listOfValue = require('../util/ListOfValue.js');
var moduleMessage = require('../util/ModuleMessage.js');
var truckDAO = require('../dao/TruckDAO.js');
var bizDAO = require('../dao/BizDAO.js');

/**
 * 车队订阅城市，创建对应的核心车队
 * @param req
 * @param res
 * @param next
 */
function createCoreBiz(req, res, next) {
    var params = req.params;
    Seq().seq(function () {
        var that = this;
        coreBizDAO.deleteCoreBiz({
            bizId: params.bizId
        }, function (error, result) {
            if (error) {
                logger.error(' getCoreBiz ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                that();
            }
        })
    }).seq(function () {
        Seq(params.routes).seqEach(function (item, i) {
            var count = this;
            Seq().seq(function () {
                var that = this;
                // coreBizDAO.getCoreBiz({
                //     portId: item.portId,
                //     portName: item.portName,
                //     cityId: item.cityId,
                //     cityName: item.cityName,
                //     stateId: params.stateId,
                //     stateName: params.stateName,
                //     bizId: params.bizId
                // }, function (error, rows) {
                //     if (error) {
                //         logger.error(' getCoreBiz ' + error.message);
                //         resUtil.resInternalError(error, res, next);
                //     }
                //     if (rows && rows.length > 0) {
                //         resUtil.resetFailedRes(res, moduleMessage.ERROR_CORE_BIZ_ADDED);
                //         return next();
                //     }
                that();
                // });
            }).seq(function () {
                coreBizDAO.createCoreBiz({
                    portId: item.portId,
                    portName: item.portName,
                    cityId: item.cityId,
                    cityName: item.cityName,
                    stateId: item.stateId,
                    stateName: item.stateName,
                    bizId: params.bizId,
                    bizName: params.bizName
                }, function (error, result) {
                    if (error) {
                        logger.error(' createCoreBiz ' + error.message);
                        resUtil.resInternalError(error, res, next);
                    } else {
                        count(null, i);
                    }
                });
            })
        }).seq(function () {
            resUtil.resetSuccessRes(res);
            return next();
        });
    });
}
function getDistinctBiz(req, res, next) {
    var params = req.params;
    var coreBizArr = [];
    params.type = 4;
    params.status = 9;
    bizDAO.getBizAndVerify(params, function (error, rows) {
        if (error) {
            logger.debug(' getDistinctCoreBiz ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            if (rows && rows.length > 0) {
                Seq(rows).seqEach(function (item, i) {
                    var count = this;
                    truckDAO.getTruckCountByBiz({
                        bizId: item.id
                    }, function (error, result) {
                        if (error) {
                            logger.error(' getTruckCountByBiz ' + error.message);
                            resUtil.resInternalError(error, res, next)
                        }
                        if (result && result.length > 0) {
                            item.truck_count = result[0].truck_count;
                        }
                        truckDAO.getTruckOccupiedCount({
                            bizId: item.id
                        }, function (error, result) {
                            if (error) {
                                logger.error(' getTruckCountByBiz ' + error.message);
                                resUtil.resInternalError(error, res, next)
                            }
                            if (result && result.length > 0) {
                                item.occupied_count = result[0].count;
                            }
                            item.biz_name = item.name;
                            if (item.name != null)
                                coreBizArr.push(item);
                            count(null, i);
                        });
                    });
                }).seq(function () {
                    resUtil.resetQueryRes(res, coreBizArr);
                    return next();
                });
            } else {
                resUtil.resetQueryRes(res, coreBizArr);
                return next();
            }
        }
    });
}
/**
 * 获取不重复的核心车队列表
 * @param req
 * @param res
 * @param next
 */
function getDistinctCoreBiz(req, res, next) {
    var params = req.params;
    var coreBizArr = [];
    coreBizDAO.getDistinctCoreBiz(params, function (error, rows) {
        if (error) {
            logger.debug(' getDistinctCoreBiz ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            if (rows && rows.length > 0) {
                Seq(rows).seqEach(function (item, i) {
                    var count = this;
                    truckDAO.getTruckCountByBiz({
                        bizId: item.biz_id
                    }, function (error, result) {
                        if (error) {
                            logger.error(' getTruckCountByBiz ' + error.message);
                            resUtil.resInternalError(error, res, next)
                        }
                        if (result && result.length > 0) {
                            item.truck_count = result[0].truck_count;
                        }
                        truckDAO.getTruckOccupiedCount({
                            bizId: item.biz_id
                        }, function (error, result) {
                            if (error) {
                                logger.error(' getTruckCountByBiz ' + error.message);
                                resUtil.resInternalError(error, res, next)
                            }
                            if (result && result.length > 0) {
                                item.occupied_count = result[0].count;
                            }
                            coreBizArr.push(item);
                            count(null, i);
                        });
                    });
                }).seq(function () {
                    resUtil.resetQueryRes(res, coreBizArr);
                    return next();
                });
            } else {
                resUtil.resetQueryRes(res, coreBizArr);
                return next();
            }
        }
    });
}
function getStateAndPorts(req, res, next) {
    var params = req.params;
    coreBizDAO.getDistinctPort({bizId: params.bizId}, function (error, rows) {
        if (error) {
            logger.debug(' getDistinctProvince ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            if (rows && rows.length > 0) {
                var result = [];
                Seq(rows).seqEach(function (item, i) {
                    var count = this;
                    var ob = {};
                    ob.state_id = item.port_state_id;
                    ob.state_name = item.port_state_name;
                    coreBizDAO.getDistinctPort({
                        bizId: params.bizId,
                        portStateId: item.port_state_id
                    }, function (error, pRow) {
                        if (error) {
                            logger.debug(' getDistinctPort ' + error.message);
                            resUtil.resInternalError(error, res, next);
                        }
                        ob.port = pRow;
                        result.push(ob);
                        count(null, i);
                    });
                }).seq(function () {
                    resUtil.resetQueryRes(res, result);
                    return next();
                });
            } else {
                resUtil.resetQueryRes(res, {});
                return next();
            }
        }
    });
}
function getCityAndPorts(req, res, next) {
    var params = req.params;
    coreBizDAO.getDistinctProvince(params, function (error, rows) {
        if (error) {
            logger.debug(' getDistinctProvince ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            if (rows && rows.length > 0) {
                var result = [];
                Seq(rows).seqEach(function (item, i) {
                    var count = this;
                    var ob = {};
                    ob.state_id = item.state_id;
                    ob.state_name = item.state_name;
                    coreBizDAO.getDistinctCity({stateId: item.state_id, bizId: params.bizId}, function (error, pRow) {
                        if (error) {
                            logger.debug(' getDistinctPort ' + error.message);
                            resUtil.resInternalError(error, res, next);
                        }
                        ob.port = pRow;
                        result.push(ob);
                        count(null, i);
                    });
                }).seq(function () {
                    resUtil.resetQueryRes(res, result);
                    return next();
                });
            } else {
                resUtil.resetQueryRes(res, {});
                return next();
            }
        }
    });
}
function getCorePorts(req, res, next) {
    var params = req.params;
    coreBizDAO.getDistinctPort(params, function (error, rows) {
        if (error) {
            logger.error(' getCorePorts ' + error.message);
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetQueryRes(res, rows);
        return next();
    });
}
function getSubscribedCities(req, res, next) {
    var params = req.params;
    coreBizDAO.getDistinctCity(params, function (error, rows) {
        if (error) {
            logger.debug(' getDistinctCity ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetQueryRes(res, rows);
            return next();
        }
    });
}
function getSubscribedProvince(req, res, next) {
    var params = req.params;
    coreBizDAO.getDistinctProvince(params, function (error, rows) {
        if (error) {
            logger.debug(' getDistinctProvince ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetQueryRes(res, rows);
            return next();
        }
    });
}
function getCoreRoutes(req, res, next) {
    coreBizDAO.getDistinctRoute({
        status: listOfValue.SUBSCRIBE_STATUS_ON
    }, function (error, rows) {
        if (error) {
            logger.debug(' getCoreRoutes ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetQueryRes(res, rows);
            return next();
        }
    });
}
function getCoreBiz(req, res, next) {
    var params = req.params;
    var coreBizArr = [];
    coreBizDAO.getCoreBiz(params, function (error, rows) {
        if (error) {
            logger.debug(' getCoreBiz ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            if (rows && rows.length > 0) {
                Seq(rows).seqEach(function (item, i) {
                    var count = this;
                    truckDAO.getTruckCountByBiz({
                        bizId: item.biz_id
                    }, function (error, result) {
                        if (error) {
                            logger.error(' getTruckCountByBiz ' + error.message);
                            resUtil.resInternalError(error, res, next)
                        }
                        if (result && result.length > 0) {
                            item.truck_count = result[0].truck_count;
                        }
                        truckDAO.getTruckOccupiedCount({
                            bizId: item.biz_id
                        }, function (error, result) {
                            if (error) {
                                logger.error(' getTruckCountByBiz ' + error.message);
                                resUtil.resInternalError(error, res, next)
                            }
                            if (result && result.length > 0) {
                                item.occupied_count = result[0].count;
                            }
                            coreBizArr.push(item);
                            count(null, i);
                        });
                    });
                }).seq(function () {
                    resUtil.resetQueryRes(res, coreBizArr);
                    return next();
                });
            } else {
                resUtil.resetQueryRes(res, coreBizArr);
                return next();
            }
        }
    });
}
function getCoreBizCount(req, res, next) {
    var params = req.params;
    coreBizDAO.getCoreBizCount(params, function (error, rows) {
        if (error) {
            logger.debug(' getCoreBiz ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetQueryRes(res, rows);
            return next();
        }
    });
}
function updateCoreBiz(req, res, next) {
    var params = req.params;
    coreBizDAO.updateCoreBiz(params, function (error, result) {
        if (error) {
            logger.debug(' updateCoreBiz ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetUpdateRes(res, result);
            return next();
        }
    });
}
/**
 * 根据订阅城市更新核心车队评分与排名
 * @param req
 * @param res
 * @param next
 */
function updateBizGrade(req, res, next) {
    var params = req.params;
    var bizList = [], bizIds,
        completeRateArr = [], feedbackRateArr = [], orderAmountArr = [], bizGradeArr = [],
        completeWeight = 0, feedbackWeight = 0;
    Seq().seq(function () {
        //获取所有参与订阅的车队列表(distinct)
        var that = this;
        coreBizDAO.getDistinctCoreBiz({
            bizId: params.bizId,//不传时，更新该地区所有核心车队
            portId: params.portId,
            cityId: params.cityId,
            status: listOfValue.SUBSCRIBE_STATUS_ON
        }, function (error, rows) {
            if (error) {
                logger.debug(' getDistinctCoreBiz ' + error.message);
                resUtil.resInternalError(error, res, next);
            }
            if (rows && rows.length > 0) {
                bizList = rows;
                that();
            }
            else {
                resUtil.resetSuccessRes(res);
                return next();
            }
        });
    }).seq(function () {
        var that = this;
        bizIds = bizList[0].biz_id;
        if (bizList.length > 1)
            for (var i = 1; i < bizList.length; i++)
                bizIds += (',' + bizList[i].biz_id);
        //获取各车队订单完成率
        roleBase.getReqWithToken(function (error, request) {
            httpUtil.httpGet(sysConfig.coreHost, '/api/completeRate/' + bizIds, request, {}, function (error, result) {
                if (error) {
                    logger.error(' getCompleteRate ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }
                if (result && result.result) {
                    completeRateArr = result.result.completeRateArr;
                    orderAmountArr = result.result.orderAmountArr;
                }
                that();
            });
        });
    }).seq(function () {
        var that = this;
        //获取各车队平均评价分
        roleBase.getReqWithToken(function (error, request) {
            httpUtil.httpGet(sysConfig.coreHost, '/api/bizRatingAvg', request, {bizIds: bizIds}, function (error, result) {
                if (error) {
                    logger.error(' getCompleteRate ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }
                if (result && result.result) {
                    feedbackRateArr = result.result;
                    logger.debug('feedback rate');
                    logger.debug(feedbackRateArr);
                }
                that();
            });
        });
    }).seq(function () {
        var that = this;
        coreBizConfigDAO.getCoreBizParam({
            paramName: 'complete_weight'
        }, function (error, rows) {
            if (error) {
                logger.error(' getCoreBizParam ');
                resUtil.resInternalError(error, res, next);
            }
            if (rows && rows.length > 0) {
                completeWeight = rows[0].param_value;
            }
            that();
        });
    }).seq(function () {
        var that = this;
        coreBizConfigDAO.getCoreBizParam({
            paramName: 'feedback_weight'
        }, function (error, rows) {
            if (error) {
                logger.error(' getCoreBizParam ');
                resUtil.resInternalError(error, res, next);
            }
            if (rows && rows.length > 0) {
                feedbackWeight = rows[0].param_value;
            }
            that();
        });
    }).seq(function () {
        var that = this;
        //计算车队综合评分
        Seq(bizList).seqEach(function (biz, i) {
            var count = this;
            coreBizDAO.getCoreBizGrade({
                orderAmount: orderAmountArr[i],
                completeRate: completeRateArr[i],
                feedbackRate: feedbackRateArr[i],
                completeWeight: completeWeight,
                feedbackWeight: feedbackWeight
            }, function (result) {
                bizGradeArr.push(result || 0);
                count(null, i);
            });
        }).seq(function () {
            logger.debug(bizGradeArr);
            that();
        });
    }).seq(function () {
        var that = this;
        //更新各车队的综合评分
        Seq(bizList).seqEach(function (biz, i) {
            var that = this;
            logger.debug(' biz ' + biz.biz_id + ' grade ' + bizGradeArr[i]);
            coreBizDAO.updateCoreBizGrade({
                bizId: biz.biz_id,
                grade: bizGradeArr[i]
            }, function (error, result) {
                if (error) {
                    logger.error(' updateCoreBizGrade ');
                    resUtil.resInternalError(error, res, next);
                }
                that(null, i);
            });
        }).seq(function () {
            that();
        });
    }).seq(function () {
        resUtil.resetSuccessRes(res);
        return next();
    });
}
function updateBizPriority(req, res, next) {
    var params = req.params;
    var minorNum = 0, primeNum = 0;
    Seq().seq(function () {
        var that = this;
        coreBizConfigDAO.getCoreBizParam({
            paramName: 'prime_num'
        }, function (error, rows) {
            if (error) {
                logger.error(' getCoreBizParam ');
                resUtil.resInternalError(error, res, next);
            }
            if (rows && rows.length > 0) {
                primeNum = parseInt(rows[0].param_value);
            }
            that();
        });
    }).seq(function () {
        var that = this;
        coreBizConfigDAO.getCoreBizParam({
            paramName: 'minor_num'
        }, function (error, rows) {
            if (error) {
                logger.error(' getCoreBizParam ');
                resUtil.resInternalError(error, res, next);
            }
            if (rows && rows.length > 0) {
                minorNum = parseInt(rows[0].param_value);
            }
            that();
        });
    }).seq(function () {
        //重置所有车队优先级
        var that = this;
        coreBizDAO.updateCoreBizPriority({
            portId: params.portId,
            cityId: params.cityId,
            priority: listOfValue.PRIORITY_DEFAULT
        }, function (error, result) {
            if (error) {
                logger.error(' updateCoreBizPriority ');
                resUtil.resInternalError(error, res, next);
            }
            that();
        })
    }).seq(function () {
        var that = this;
        //更新锁定核心车队优先级
        coreBizDAO.updateCoreBizPriorityByLock({
            portId: params.portId,
            cityId: params.cityId,
            lockValue: listOfValue.PRIORITY_PRIME
        }, function (error, result) {
            if (error) {
                logger.error(' updateCoreBizPriorityByLock ');
                resUtil.resInternalError(error, res, next);
            }
            if (result && result.affectedRows > 0)
                primeNum -= result.affectedRows;
            that();
        });
    }).seq(function () {
        var that = this;
        //更新锁定次核心车队优先级
        coreBizDAO.updateCoreBizPriorityByLock({
            portId: params.portId,
            cityId: params.cityId,
            lockValue: listOfValue.PRIORITY_MINOR
        }, function (error, result) {
            if (error) {
                logger.error(' updateCoreBizPriorityByLock ');
                resUtil.resInternalError(error, res, next);
            }
            if (result && result.affectedRows > 0)
                minorNum -= result.affectedRows;
            that();
        });

    }).seq(function () {
        var that = this;
        //更新次核心车队优先级
        coreBizDAO.updateCoreBizPriority({
            portId: params.portId,
            cityId: params.cityId,
            priority: listOfValue.PRIORITY_MINOR,
            size: minorNum + primeNum
        }, function (error, result) {
            if (error) {
                logger.error(' updateCoreBizPriority ');
                resUtil.resInternalError(error, res, next);
            }
            that();
        });
    }).seq(function () {
        //更新核心车队优先级
        coreBizDAO.updateCoreBizPriority({
            portId: params.portId,
            cityId: params.cityId,
            priority: listOfValue.PRIORITY_PRIME,
            size: primeNum
        }, function (error, result) {
            if (error) {
                logger.error(' updateCoreBizPriority ');
                resUtil.resInternalError(error, res, next);
            }
            resUtil.resetUpdateRes(res, result);
            return next();
        });
    });
}
function pushUpdateMsg(req, res, next) {
    var params = req.params;
    roleBase.getReqWithToken(function (error, request) {
        httpUtil.httpPost(sysConfig.MessageQueueHost, '/api/core/grade', request, {bizId: params.bizId}, function (error, result) {
            if (error) {
                logger.error(' pushUpdateMsg ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                resUtil.resetQueryRes(res, result);
                return next();
            }
        });
    });
}
function lockPrimeBiz(req, res, next) {
    var params = req.params;
    var coreBiz = {}, coreBizPrime = null, coreBizMinor = null;// 待锁定的车队，原来在核心车队表最末的车队，和原来在次核心车队表最末的车队
    var minorNum = 0, primeNum = 0;
    Seq().seq(function () {
        var that = this;
        coreBizConfigDAO.getCoreBizParam({
            paramName: 'prime_num'
        }, function (error, rows) {
            if (error) {
                logger.error(' getCoreBizParam ');
                resUtil.resInternalError(error, res, next);
            }
            if (rows && rows.length > 0) {
                primeNum = parseInt(rows[0].param_value);
            }
            that();
        });
    }).seq(function () {
        var that = this;
        coreBizConfigDAO.getCoreBizParam({
            paramName: 'minor_num'
        }, function (error, rows) {
            if (error) {
                logger.error(' getCoreBizParam ');
                resUtil.resInternalError(error, res, next);
            }
            if (rows && rows.length > 0) {
                minorNum = parseInt(rows[0].param_value);
            }
            that();
        });
    }).seq(function () {
        var that = this;
        coreBizDAO.getCoreBiz({
            coreBizId: params.coreBizId
        }, function (error, rows) {
            if (error) {
                logger.error(' getCoreBiz ');
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0)
                    coreBiz = rows[0];
                if (coreBiz.priority == listOfValue.PRIORITY_PRIME) {
                    coreBizDAO.updateCoreBizLockValue({
                        coreBizId: params.coreBizId,
                        lockValue: listOfValue.PRIORITY_PRIME
                    }, function (error, result) {
                        if (error) {
                            logger.error(' lockPrimeBiz ');
                            resUtil.resInternalError(error, res, next);
                        } else {
                            resUtil.resetUpdateRes(res, result);
                            return next();
                        }
                    });
                } else
                    that();
            }
        });
    }).seq(function () {
        var that = this;
        coreBizDAO.getCoreBiz({
            portId: coreBiz.port_id,
            cityId: coreBiz.city_id,
            priority: listOfValue.PRIORITY_PRIME,
            orderAsc: 1
        }, function (error, rows) {
            if (error) {
                logger.error(' getCoreBiz ');
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0 && rows.length >= primeNum)
                    coreBizPrime = rows[0];
                coreBizDAO.updateCoreBizLockValue({
                    coreBizId: params.coreBizId,
                    lockValue: listOfValue.PRIORITY_PRIME
                }, function (error, result) {
                    if (error) {
                        logger.error(' lockPrimeBiz ');
                        resUtil.resInternalError(error, res, next);
                    } else {
                        that();
                    }
                });
            }
        });
    }).seq(function () {
        var that = this;
        if (coreBizPrime != null)
            coreBizDAO.getCoreBiz({
                portId: coreBiz.port_id,
                cityId: coreBiz.city_id,
                priority: listOfValue.PRIORITY_MINOR,
                orderAsc: 1
            }, function (error, rows) {
                if (error) {
                    logger.error(' getCoreBiz ');
                    resUtil.resInternalError(error, res, next);
                } else {
                    if (rows && rows.length > 0 && rows.length >= minorNum)
                        coreBizMinor = rows[0];
                    that();
                }
            });
        else {
            resUtil.resetSuccessRes(res);
            return next();
        }
    }).seq(function () {
        if (coreBizPrime != null)
            coreBizDAO.updateCoreBizPriority({
                bizId: coreBizPrime.biz_id,
                cityId: coreBizPrime.city_id,
                portId: coreBizPrime.port_id,
                priority: listOfValue.PRIORITY_MINOR
            }, function (error, result) {
                if (error) {
                    logger.error(' getCoreBiz ');
                    resUtil.resInternalError(error, res, next);
                }
                if (coreBizMinor != null)
                    coreBizDAO.updateCoreBizPriority({
                        bizId: coreBizMinor.biz_id,
                        cityId: coreBizMinor.city_id,
                        portId: coreBizMinor.port_id,
                        priority: listOfValue.PRIORITY_DEFAULT
                    }, function (error, result) {
                        if (error) {
                            logger.error(' getCoreBiz ');
                            resUtil.resInternalError(error, res, next);
                        }
                    });
                resUtil.resetSuccessRes(res);
                return next();
            });


    });
}
function lockMinorBiz(req, res, next) {
    var params = req.params;
    var coreBiz = {}, coreBizMinor = null;// 待锁定的车队，和原来在次核心车队表最末的车队
    var minorNum = 0;
    Seq().seq(function () {
        var that = this;
        coreBizConfigDAO.getCoreBizParam({
            paramName: 'minor_num'
        }, function (error, rows) {
            if (error) {
                logger.error(' getCoreBizParam ');
                resUtil.resInternalError(error, res, next);
            }
            if (rows && rows.length > 0) {
                minorNum = parseInt(rows[0].param_value);
            }
            that();
        });
    }).seq(function () {
        var that = this;
        coreBizDAO.getCoreBiz({
            coreBizId: params.coreBizId
        }, function (error, rows) {
            if (error) {
                logger.error(' getCoreBiz ');
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0)
                    coreBiz = rows[0];
                if (coreBiz.priority == listOfValue.PRIORITY_MINOR) {
                    coreBizDAO.updateCoreBizLockValue({
                        coreBizId: params.coreBizId,
                        lockValue: listOfValue.PRIORITY_MINOR
                    }, function (error, result) {
                        if (error) {
                            logger.error(' lockPrimeBiz ');
                            resUtil.resInternalError(error, res, next);
                        }
                        resUtil.resetUpdateRes(res, result);
                        return next();
                    });
                } else
                    that();
            }
        });
    }).seq(function () {
        var that = this;
        coreBizDAO.getCoreBiz({
            portId: coreBiz.port_id,
            cityId: coreBiz.city_id,
            priority: listOfValue.PRIORITY_MINOR,
            orderAsc: 1
        }, function (error, rows) {
            if (error) {
                logger.error(' getCoreBiz ');
                resUtil.resInternalError(error, res, next);
            } else {
                if (rows && rows.length > 0 && rows.length >= minorNum)
                    coreBizMinor = rows[0];
                coreBizDAO.updateCoreBizLockValue({
                    coreBizId: params.coreBizId,
                    lockValue: listOfValue.PRIORITY_MINOR
                }, function (error, result) {
                    if (error) {
                        logger.error(' lockPrimeBiz ');
                        resUtil.resInternalError(error, res, next);
                    }
                    that();
                });
            }
        });
    }).seq(function () {
        if (coreBizMinor != null)
            coreBizDAO.updateCoreBizPriority({
                bizId: coreBizMinor.biz_id,
                cityId: coreBizMinor.city_id,
                portId: coreBizMinor.port_id,
                priority: listOfValue.PRIORITY_DEFAULT
            }, function (error, result) {
                if (error) {
                    logger.error(' getCoreBiz ');
                    resUtil.resInternalError(error, res, next);
                }
                resUtil.resetSuccessRes(res);
                return next();
            });
    });
}
function unlockCoreBiz(req, res, next) {
    var params = req.params;
    coreBizDAO.updateCoreBizLockValue({
        coreBizId: params.coreBizId,
        lockValue: listOfValue.PRIORITY_DEFAULT
    }, function (error, result) {
        if (error) {
            logger.error(' unlockCoreBiz ');
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetUpdateRes(res, result);
            return next();
        }
    });
}

function getRouteParams(req, res, next) {
    var params = req.params;
    coreBizDAO.getRouteParams(params, function (error, result) {
        if (error) {
            logger.error(' getRouteParams ' + error.message);
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetQueryRes(res, result);
        return next();
    });
}
function updateRouteParams(req, res, next) {
    var params = req.params;
    coreBizDAO.updateRouteParams(params, function (error, result) {
        if (error) {
            logger.error(' updateRouteParams ' + error.message);
            resUtil.resInternalError(error, res, next);
        }
        resUtil.resetUpdateRes(res, result);
        return next();
    });
}
module.exports = {
    createCoreBiz: createCoreBiz,
    getCoreBiz: getCoreBiz,
    getCoreBizCount: getCoreBizCount,
    getDistinctCoreBiz: getDistinctCoreBiz,
    getCorePorts: getCorePorts,
    getCoreRoutes: getCoreRoutes,
    updateCoreBiz: updateCoreBiz,
    updateBizGrade: updateBizGrade,
    updateBizPriority: updateBizPriority,
    lockPrimeBiz: lockPrimeBiz,
    lockMinorBiz: lockMinorBiz,
    unlockCoreBiz: unlockCoreBiz,
    getSubscribedCities: getSubscribedCities,
    getStateAndPorts: getStateAndPorts,
    getCityAndPorts: getCityAndPorts,
    getSubscribedProvince: getSubscribedProvince,
    pushUpdateMsg: pushUpdateMsg,
    getRouteParams: getRouteParams,
    updateRouteParams: updateRouteParams,
    getDistinctBiz: getDistinctBiz
};