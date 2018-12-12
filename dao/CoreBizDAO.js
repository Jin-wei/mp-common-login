/**
 * Created by Szane on 16/12/10.
 */

var db = require('../db/db.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('CoreBizDAO.js');


function createCoreBiz(params, callback) {
    var query = ' insert into core_biz (port_id,port_name,state_id,state_name,city_id,city_name,biz_id,biz_name) ' +
        'values (?,?,?,?,?,?,?,?)';
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.portId;
    paramsArr[i++] = params.portName;
    paramsArr[i++] = params.stateId;
    paramsArr[i++] = params.stateName;
    paramsArr[i++] = params.cityId;
    paramsArr[i++] = params.cityName;
    paramsArr[i++] = params.bizId;
    paramsArr[i++] = params.bizName;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' createCoreBiz ');
        callback(error, result);
    });
}
function getDistinctCoreBiz(params, callback) {
    var query = ' select distinct biz_id,biz_name from core_biz cb where 1=1 ';
    var paramsArr = [], i = 0;
    if (params.portId != null) {
        query += ' and cb.port_id = ? ';
        paramsArr[i++] = params.portId;
    }
    if (params.portName != null) {
        query += ' and cb.port_name like ? ';
        paramsArr[i++] = '%' + params.portName + '%';
    }
    if (params.cityId != null) {
        query += ' and cb.city_id = ? ';
        paramsArr[i++] = params.cityId;
    }
    if (params.cityName != null) {
        query += ' and cb.city_name like ? ';
        paramsArr[i++] = '%' + params.cityName + '%';
    }
    if (params.bizId != null) {
        query += ' and cb.biz_id = ? ';
        paramsArr[i++] = params.bizId;
    }
    if (params.bizName != null) {
        query += ' and cb.biz_name like ? ';
        paramsArr[i++] = '%' + params.bizName + '%';
    }
    if (params.status != null) {
        query += ' and cb.status = ? ';
        paramsArr[i++] = params.status;
    }
    if (params.priority != null) {
        query += ' and cb.priority = ? ';
        paramsArr[i++] = params.priority;
    }
    if (params.lockValue != null) {
        query += ' and cb.lock_value = ? ';
        paramsArr[i++] = params.lockValue;
    }
    query += ' order by cb.priority,cb.grade desc,cb.created_on ';//先订阅的优先
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getDistinctCoreBiz ');
        callback(error, rows);
    });
}
function getDistinctCity(params, callback) {
    var query = ' select distinct city_id,city_name from core_biz where 1=1 ';
    var paramsArr = [], i = 0;
    if (params.status != null) {
        query += ' and status = ? ';
        paramsArr[i++] = params.status;
    }
    if (params.stateId != null) {
        query += ' and state_id = ? ';
        paramsArr[i++] = params.stateId;
    }
    if (params.bizId != null) {
        query += ' and biz_id = ? ';
        paramsArr[i++] = params.bizId;
    }
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getDistinctCity ');
        callback(error, rows);
    });
}
function getDistinctProvince(params, callback) {
    var query = ' select distinct state_id,state_name from core_biz where 1=1 ';
    var paramsArr = [], i = 0;
    if (params.status != null) {
        query += ' and status = ? ';
        paramsArr[i++] = params.status;
    }
    if (params.bizId != null) {
        query += ' and biz_id = ? ';
        paramsArr[i++] = params.bizId;
    }
    query += ' order by state_id = 370000 desc,state_id = 320000 desc ';
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getDistinctProvince ');
        callback(error, rows);
    });
}
function getDistinctPort(params, callback) {
    var query = ' select distinct cb.port_id,cb.port_name,pi.state_id as port_state_id, pi.state_name as port_state_name' +
        ' from core_biz cb left join sinotrans_core.port_info pi on cb.port_id = pi.zipcode where 1=1 ';
    var paramsArr = [], i = 0;
    if (params.status != null) {
        query += ' and cb.status = ? ';
        paramsArr[i++] = params.status;
    }
    if (params.bizId != null) {
        query += ' and cb.biz_id = ? ';
        paramsArr[i++] = params.bizId;
    }
    if (params.stateId != null) {
        query += ' and state_id = ? ';
        paramsArr[i++] = params.stateId;
    }
    if (params.portStateId != null) {
        query += ' and pi.state_id = ? ';
        paramsArr[i++] = params.portStateId;
    }
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getDistinctPort ');
        callback(error, rows);
    });
}
function getDistinctRoute(params, callback) {
    var query = ' select distinct city_id,port_id from core_biz where 1=1 ';
    var paramsArr = [], i = 0;
    if (params.status != null) {
        query += ' and status = ? ';
        paramsArr[i++] = params.status;
    }
    if (params.sZipcode != null && params.eZipcode != null) {
        query += ' and (( left(city_id,4) = ? and port_id = ? ) or (left(city_id,4) = ? and port_id = ? )) ';
        paramsArr[i++] = params.sZipcode;
        paramsArr[i++] = params.eZipcode;
        paramsArr[i++] = params.eZipcode;
        paramsArr[i++] = params.sZipcode;
    }
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getDistinctRoute ');
        callback(error, rows);
    });
}
function getCoreBiz(params, callback) {
    var query = ' select cb.* from core_biz cb where 1=1';
    var paramsArr = [], i = 0;
    if (params.coreBizId != null) {
        query += ' and cb.id = ? ';
        paramsArr[i++] = params.coreBizId;
    }
    if (params.portId != null) {
        query += ' and cb.port_id = ? ';
        paramsArr[i++] = params.portId;
    }
    if (params.portName != null) {
        query += ' and cb.port_name like ? ';
        paramsArr[i++] = '%' + params.portName + '%';
    }
    if (params.cityId != null) {
        query += ' and cb.city_id = ? ';
        paramsArr[i++] = params.cityId;
    }
    if (params.cityName != null) {
        query += ' and cb.city_name like ? ';
        paramsArr[i++] = '%' + params.cityName + '%';
    }
    if (params.bizId != null) {
        query += ' and cb.biz_id = ? ';
        paramsArr[i++] = params.bizId;
    }
    if (params.bizName != null) {
        query += ' and cb.biz_name like ? ';
        paramsArr[i++] = '%' + params.bizName + '%';
    }
    if (params.status != null) {
        query += ' and cb.status = ? ';
        paramsArr[i++] = params.status;
    }
    if (params.priority != null) {
        query += ' and cb.priority = ? ';
        paramsArr[i++] = params.priority;
    }
    if (params.lockValue != null) {
        query += ' and cb.lock_value = ? ';
        paramsArr[i++] = params.lockValue;
    }
    if (params.orderAsc == 1) {
        query += ' order by cb.grade ,cb.created_on desc ';
    } else
        query += ' order by cb.priority desc,cb.lock_value desc,cb.grade desc,cb.created_on ';//先订阅的优先
    if (params.start != null && params.size != null) {
        query += ' limit ?,? ';
        paramsArr[i++] = parseInt(params.start);
        paramsArr[i++] = parseInt(params.size);
    }
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getCoreBiz ');
        callback(error, rows);
    });
}
function getCoreBizCount(params, callback) {
    var query = ' select count(cb.id) as count from core_biz cb where 1=1';
    var paramsArr = [], i = 0;
    if (params.portId != null) {
        query += ' and cb.port_id = ? ';
        paramsArr[i++] = params.portId;
    }
    if (params.portName != null) {
        query += ' and cb.port_name like ? ';
        paramsArr[i++] = '%' + params.portName + '%';
    }
    if (params.cityId != null) {
        query += ' and cb.city_id = ? ';
        paramsArr[i++] = params.cityId;
    }
    if (params.cityName != null) {
        query += ' and cb.city_name like ? ';
        paramsArr[i++] = '%' + params.cityName + '%';
    }
    if (params.bizId != null) {
        query += ' and cb.biz_id = ? ';
        paramsArr[i++] = params.bizId;
    }
    if (params.bizName != null) {
        query += ' and cb.biz_name like ? ';
        paramsArr[i++] = '%' + params.bizName + '%';
    }
    if (params.status != null) {
        query += ' and cb.status = ? ';
        paramsArr[i++] = params.status;
    }
    if (params.priority != null) {
        query += ' and cb.priority = ? ';
        paramsArr[i++] = params.priority;
    }
    if (params.lockValue != null) {
        query += ' and cb.lock_value = ? ';
        paramsArr[i++] = params.lockValue;
    }
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getCoreBiz ');
        callback(error, rows);
    });
}
function updateCoreBiz(params, callback) {
    var query = ' update core_biz set id = id ';
    var paramsArr = [], i = 0;
    if (params.bizId != null) {
        query += ',set biz_id = ? ';
        paramsArr[i++] = params.bizId;
    }
    if (params.bizName != null) {
        query += ',set biz_name = ? ';
        paramsArr[i++] = params.bizName;
    }
    if (params.cityId != null) {
        query += ',set city_id = ? ';
        paramsArr[i++] = params.cityId;
    }
    if (params.cityName != null) {
        query += ',set city_name = ? ';
        paramsArr[i++] = params.cityName;
    }
    query += ' where id = ? ';
    paramsArr[i++] = params.coreBizId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateCoreBiz ');
        callback(error, result);
    });
}
function getRouteParams(params, callback) {
    var query = ' select bonus_point,order_interval from core_biz where port_id = ? and city_id = ? ';
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.portId;
    paramsArr[i++] = params.cityId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' getRouteParams ');
        callback(error, result);
    });
}
function updateRouteParams(params, callback) {
    var query = ' update core_biz set id = id ';
    var paramsArr = [], i = 0;
    if (params.bonusPoint != null) {
        query += ',bonus_point = ? ';
        paramsArr[i++] = params.bonusPoint;
    }
    if (params.orderInterval != null) {
        query += ',order_interval = ? ';
        paramsArr[i++] = params.orderInterval;
    }
    query += ' where city_id = ? and port_id = ? ';
    paramsArr[i++] = params.cityId;
    paramsArr[i++] = params.portId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateRouteParams ');
        callback(error, result);
    });
}
function deleteCoreBiz(params, callback) {
    var query = ' delete from core_biz where biz_id = ? ';
    db.dbQuery(query, [params.bizId], function (error, result) {
        logger.debug(' deleteCoreBiz ');
        callback(error, result);
    });
}
function updateCoreBizGrade(params, callback) {
    var query = ' update core_biz set grade = ? where biz_id = ? ';
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.grade;
    paramsArr[i++] = params.bizId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateCoreBizGrade ');
        callback(error, result);
    });
}
function updateCoreBizPriority(params, callback) {
    var query = ' update core_biz set priority = ? where ' +
        'lock_value<>1 and lock_value <> 2 and city_id = ? and port_id = ? ';
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.priority;
    paramsArr[i++] = params.cityId;
    paramsArr[i++] = params.portId;
    if (params.bizId != null) {
        paramsArr[i++] = params.bizId;
        query += ' and biz_id = ? ';
    }
    query += ' order by grade desc ';
    if (params.size != null) {
        paramsArr[i++] = parseInt(params.size);
        query += ' limit ? ';
    }
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateCoreBizPriority ');
        callback(error, result);
    });
}
function updateCoreBizPriorityByLock(params, callback) {
    var query = ' update core_biz set priority = lock_value where  lock_value = ? and city_id = ? and port_id = ? ';
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.lockValue;
    paramsArr[i++] = params.cityId;
    paramsArr[i++] = params.portId;
    if (params.bizId != null) {
        paramsArr[i++] = params.bizId;
        query += ' and biz_id = ? ';
    }
    query += ' order by grade desc ';
    if (params.size != null) {
        paramsArr[i++] = parseInt(params.size);
        query += ' limit ? ';
    }
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateCoreBizPriorityByLock ');
        callback(error, result);
    });
}
function getCoreBizGrade(params, callback) {
    var amountRate = 1.0;
    if (params.orderAmount == 0)
        amountRate = 0;
    else if (parseFloat(params.orderAmount) <= 1000)
        amountRate = Math.log(parseFloat(params.orderAmount)) / Math.log(10) / 3.0000;//lg (orderAmount) 底数定为10
    logger.debug('(' + params.completeRate + '*' + params.completeWeight + '+' + params.feedbackRate + '*' + params.feedbackWeight + ')*' + amountRate);
    callback((params.completeRate * params.completeWeight + params.feedbackRate * params.feedbackWeight) * amountRate);
}
function updateCoreBizLockValue(params, callback) {
    var query = ' update core_biz set priority = ?,lock_value = ? where id = ? ';
    db.dbQuery(query, [params.lockValue, params.lockValue, params.coreBizId], function (error, result) {
        logger.debug(' updateCoreBizLockValue ');
        callback(error, result);
    });
}

module.exports = {
    createCoreBiz: createCoreBiz,
    getCoreBiz: getCoreBiz,
    getCoreBizCount: getCoreBizCount,
    getDistinctCoreBiz: getDistinctCoreBiz,
    getDistinctCity: getDistinctCity,
    getDistinctProvince: getDistinctProvince,
    getDistinctPort: getDistinctPort,
    getDistinctRoute: getDistinctRoute,
    updateCoreBiz: updateCoreBiz,
    deleteCoreBiz: deleteCoreBiz,
    updateCoreBizGrade: updateCoreBizGrade,
    updateCoreBizPriority: updateCoreBizPriority,
    getCoreBizGrade: getCoreBizGrade,
    updateCoreBizLockValue: updateCoreBizLockValue,
    updateCoreBizPriorityByLock: updateCoreBizPriorityByLock,
    getRouteParams: getRouteParams,
    updateRouteParams: updateRouteParams
};
