/**
 * Created by Szane on 17/1/11.
 */
var db = require('../db/db.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('BonusPointDAO.js');
function createBonusPoint(params, callback) {
    var query = ' insert into bonus_point(user_id,biz_id,biz_name,user_type,phone,total_point,remark)' +
        ' values (?,?,?,?,?,?,?) ';
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.userNo;
    paramsArr[i++] = params.bizId;
    paramsArr[i++] = params.bizName;
    paramsArr[i++] = params.userType;
    paramsArr[i++] = params.phone;
    paramsArr[i++] = params.totalPoint;
    paramsArr[i++] = params.remark;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' createBonusPoint ');
        callback(error, result);
    });
}
function updateBonusPoint(params, callback) {
    var query = ' update bonus_point set id = id ';
    var paramsArr = [], i = 0;
    if (params.bizId != null) {
        paramsArr[i++] = params.bizId;
        query += ' ,biz_id = ? ';
    }
    if (params.bizName != null) {
        paramsArr[i++] = params.bizName;
        query += ' ,biz_name = ? ';
    }
    if (params.userType != null) {
        paramsArr[i++] = params.userType;
        query += ' ,user_type = ? ';
    }
    if (params.phone != null) {
        paramsArr[i++] = params.phone;
        query += ' ,phone = ? ';
    }
    if (params.changePoint != null) {
        paramsArr[i++] = parseInt(params.changePoint);
        query += ' ,total_point = total_point - ? ';
    }
    if (params.totalPoint != null) {
        paramsArr[i++] = params.totalPoint;
        query += ' ,total_point = ? ';
    }
    if (params.firstFlag != null) {
        paramsArr[i++] = params.firstFlag;
        query += ' ,first_flag = ? ';
    }
    if (params.userNo != null) {
        query += ' where user_id = ? ';
        paramsArr[i++] = params.userNo;
    }
    else if (params.bonusId != null) {
        query += ' where id = ? ';
        paramsArr[i++] = params.bonusId;
    }
    else if (params.bizId != null) {
        query += ' where biz_id = ? ';
        paramsArr[i++] = params.bizId;
    }
    else {
        query += ' where 1 = 0 ';
    }
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateBonusPoint ');
        callback(error, result);
    });
}
function getBonusPoint(params, callback) {
    var query = ' select bp.* from bonus_point bp where 1=1 ';
    var paramsArr = [], i = 0;
    if (params.userNo != null) {
        paramsArr[i++] = params.userNo;
        query += ' and bp.user_id = ? ';
    }
    if (params.bizId != null) {
        paramsArr[i++] = params.bizId;
        query += ' and bp.biz_id = ? ';
    }
    if (params.bizName != null) {
        paramsArr[i++] = '%' + params.bizName + '%';
        query += ' and bp.biz_name like ? ';
    }
    if (params.phone != null) {
        paramsArr[i++] = params.phone;
        query += ' and bp.phone = ? ';
    }
    if (params.userType != null) {
        paramsArr[i++] = params.userType;
        query += ' and bp.user_type = ? ';
    }
    if (params.size != null && params.start != null) {
        paramsArr[i++] = parseInt(params.start);
        paramsArr[i++] = parseInt(params.size);
        query += ' limit ?,? ';
    }
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getBonusPoint ');
        callback(error, rows);
    });

}
function getBonusPointCount(params, callback) {
    var query = ' select count(bp.id) as count from bonus_point bp where 1=1 ';
    var paramsArr = [], i = 0;
    if (params.userNo != null) {
        paramsArr[i++] = params.userNo;
        query += ' and bp.user_id = ? ';
    }
    if (params.bizId != null) {
        paramsArr[i++] = params.bizId;
        query += ' and bp.biz_id = ? ';
    }
    if (params.bizName != null) {
        paramsArr[i++] = '%' + params.bizName + '%';
        query += ' and bp.biz_name like ? ';
    }
    if (params.phone != null) {
        paramsArr[i++] = params.phone;
        query += ' and bp.phone = ? ';
    }
    if (params.userType != null) {
        paramsArr[i++] = params.userType;
        query += ' and bp.user_type = ? ';
    }
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getBonusPointCount ');
        callback(error, rows);
    });

}
function createBonusPointHistory(params, callback) {
    var query = ' insert into bonus_point_history (user_id,order_id,action_id,action_name,type,point,remain_point,remark) ' +
        'values (?,?,?,?,?,?,?,?) ';
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.userNo;
    paramsArr[i++] = params.orderId;
    paramsArr[i++] = params.actionId;
    paramsArr[i++] = params.actionName;
    paramsArr[i++] = params.type;
    paramsArr[i++] = params.point;
    paramsArr[i++] = params.remainPoint;
    paramsArr[i++] = params.remark;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' createBonusPointHistory ');
        callback(error, result);
    });
}
function getBonusPointHistory(params, callback) {
    var query = ' select bph.* from bonus_point_history bph where 1=1 ';
    var paramsArr = [], i = 0;
    if (params.userNo != null) {
        query += ' and bph.user_id = ? ';
        paramsArr[i++] = params.userNo;
    }
    if (params.bonusId != null) {
        query += ' and bph.bonus_id = ? ';
        paramsArr[i++] = params.bonusId;
    }
    if (params.phone != null) {
        query += ' and bph.phone = ? ';
        paramsArr[i++] = params.phone;
    }
    if (params.type != null) {
        query += ' and bph.type = ? ';
        paramsArr[i++] = params.type;
    }
    if (params.status != null) {
        query += ' and bph.status = ? ';
        paramsArr[i++] = params.status;
    }
    if (params.orderId != null) {
        query += ' and bph.order_id = ? ';
        paramsArr[i++] = params.orderId;
    }
    if (params.size != null && params.start != null) {
        paramsArr[i++] = parseInt(params.start);
        paramsArr[i++] = parseInt(params.size);
        query += ' limit ?,? ';
    }
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getBonusPointHistory ');
        callback(error, rows);
    });
}
function getBonusPointHistoryCount(params, callback) {
    var query = ' select count(bph.id) as count from bonus_point_history bph where 1=1 ';
    var paramsArr = [], i = 0;
    if (params.userNo != null) {
        query += ' and bph.user_id = ? ';
        paramsArr[i++] = params.userNo;
    }
    if (params.bonusId != null) {
        query += ' and bph.bonus_id = ? ';
        paramsArr[i++] = params.bonusId;
    }
    if (params.type != null) {
        query += ' and bph.type = ? ';
        paramsArr[i++] = params.type;
    }
    if (params.status != null) {
        query += ' and bph.status = ? ';
        paramsArr[i++] = params.status;
    }
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getBonusPointHistoryCount ');
        callback(error, rows);
    });
}
function updateBonusPointHistoryStatus(params, callback) {
    var query = ' update bonus_point_history set status = ? where user_id = ? ';
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.status;
    paramsArr[i++] = params.userNo;
    if (params.type != null) {
        paramsArr[i++] = params.type;
        query += ' and type = ? ';
    }
    if (params.createdOnStart != null) {
        paramsArr[i++] = params.createdOnStart + ' 00:00:00';
        query += ' and created_on >= ? ';
    }
    if (params.createdOnEnd != null) {
        paramsArr[i++] = params.createdOnEnd + ' 23:59:59';
        query += ' and created_on <= ? ';
    }
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateBonusPointHistoryStatus ');
        callback(error, result);
    });
}
function getBonusConfig(params, callback) {
    var query = ' select * from bonus_config where 1=1 ';
    var paramsArr = [], i = 0;
    if (params.actionId != null) {
        query += ' and id = ? ';
        paramsArr[i++] = params.actionId;
    }
    if (params.userType != null) {
        query += ' and user_type = ? ';
        paramsArr[i++] = params.userType;
    }
    if (params.type != null) {
        query += ' and type = ? ';
        paramsArr[i++] = params.type;
    }
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getBonusConfig ');
        callback(error, rows);
    });
}
function updateBonusConfig(params, callback) {
    var query = ' update bonus_config set id = id ';
    var paramsArr = [], i = 0;
    if (params.point != null) {
        paramsArr[i++] = params.point;
        query += ' ,point = ? ';
    }
    query += ' where id = ? ';
    paramsArr[i++] = params.configId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateBonusConfig ');
        callback(error, result);
    });
}
module.exports = {
    createBonusPoint: createBonusPoint,
    updateBonusPoint: updateBonusPoint,
    getBonusPoint: getBonusPoint,
    getBonusPointCount: getBonusPointCount,
    createBonusPointHistory: createBonusPointHistory,
    getBonusPointHistory: getBonusPointHistory,
    getBonusPointHistoryCount: getBonusPointHistoryCount,
    getBonusConfig: getBonusConfig,
    updateBonusConfig: updateBonusConfig,
    updateBonusPointHistoryStatus: updateBonusPointHistoryStatus
};