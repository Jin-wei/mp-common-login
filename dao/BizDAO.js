/**
 * Created by Szane on 2016/4/19.
 */
var db = require('../db/db.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('BizDAO.js');
function getUserAndBiz(params, callback) {
    var query = 'select ui.id,ui.phone,ui.name as ui_name,ui.type as user_type,bi.type,ui.sub_type,bi.name as bi_name,' +
        'bv.biz_lic_num,ui.created_on,bi.id as biz_id,bv.id as verify_id,ui.p_biz_id,bi.jur_per,bi.ship_biz_code, ' +
        'ui.remark ' +
        'from user_info ui ' +
        'left join biz_info bi on bi.user_id = ui.id ' +
        'left join biz_verify bv on bi.id = bv.biz_id ' +
        'where 1=1 ';
    var paramsArr = [], i = 0;
    if (params.userNo != null) {
        query += " and ui.id = ? ";
        paramsArr[i++] = params.userNo;
    }
    if (params.bizId != null) {
        query += " and bi.id = ? ";
        paramsArr[i++] = params.bizId;
    }
    if (params.status != null) {
        query += ' and ui.status = ? ';
        paramsArr[i++] = params.status;
    }
    if (params.bizStatus != null) {
        query += ' and bv.status = ? ';
        paramsArr[i++] = params.bizStatus;
    }
    if (params.unverified == 1) {
        query += ' and bv.status <> 9 or bv.status is null ';
    }
    if (params.phone != null) {
        query += " and ui.phone like ? ";
        paramsArr[i++] = '%' + params.phone + '%';
    }
    if (params.name != null) {
        query += " and ui.name like ? ";
        paramsArr[i++] = '%' + params.name + '%';
    }
    if (params.shipBizCode != null) {
        query += ' and find_in_set(?,bi.ship_biz_code) ';
        paramsArr[i++] = params.shipBizCode;
    }
    if (params.bizName != null) {
        query += " and bi.name like '%" + params.bizName + "%'";
    }
    if (params.bizLicNum != null) {
        query += " and bv.biz_lic_num like '%" + params.bizLicNum + "%'";
    }
    if (params.type != null) {
        query += " and bi.type = ? ";
        paramsArr[i++] = params.type;
    }
    if (params.userType != null) {
        query += " and (ui.type = ? or bi.type = ?) ";
        paramsArr[i++] = params.userType;
        paramsArr[i++] = params.userType;
    }
    if (params.subType != null) {
        query += " and ui.sub_type = ? ";
        paramsArr[i++] = params.subType;
    }
    if (params.createdOnStart != null) {
        query += " and ui.created_on >= ? ";
        paramsArr[i++] = params.createdOnStart + ' 00:00:00';
    }
    if (params.createdOnEnd != null) {
        query += " and ui.created_on <= ? ";
        paramsArr[i++] = params.createdOnEnd + ' 23:59:59';
    }
    query += ' order by ui.created_on desc';
    if (params.start != null && params.size != null) {
        query += " limit ?,? ";
        paramsArr[i++] = parseInt(params.start);
        paramsArr[i++] = parseInt(params.size);
    }
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getUserAndBiz ');
        callback(error, rows);
    });
}
function getSubUserAndBiz(params, callback) {
    var query = 'select ui.id,ui.phone,ui.name as ui_name,ui.type as user_type,bi.type,ui.sub_type,bi.name as bi_name,' +
        'bv.biz_lic_num,ui.created_on,bi.jur_per ' +
        'from user_info ui ' +
        'left join biz_info bi on bi.id = ui.p_biz_id ' +
        'left join biz_verify bv on bi.id = bv.biz_id ' +
        'where 1=1 and ui.p_biz_id is not null ';//以p_biz_id 为空 为企业账号
    var paramsArr = [], i = 0;
    if (params.phone != null) {
        query += " and ui.phone like '%" + params.phone + "%'";
    }
    if (params.name != null) {
        query += " and ui.name like '%" + params.name + "%'";
    }
    if (params.bizName != null) {
        query += " and bi.name like '%" + params.bizName + "%'";
    }
    if (params.bizLicNum != null) {
        query += " and bv.biz_lic_num like '%" + params.bizLicNum + "%'";
    }
    if (params.type != null) {
        query += " and bi.type = ? ";
        paramsArr[i++] = params.type;
    }
    if (params.userType != null) {
        query += " and (ui.type = ? or bi.type = ?) ";
        paramsArr[i++] = params.userType;
        paramsArr[i++] = params.userType;
    }
    if (params.subType != null) {
        query += " and ui.sub_type = ? ";
        paramsArr[i++] = params.subType;
    }
    if (params.createdOnStart != null) {
        query += " and ui.created_on >= ? ";
        paramsArr[i++] = params.createdOnStart + ' 00:00:00';
    }
    if (params.createdOnEnd != null) {
        query += " and ui.created_on <= ? ";
        paramsArr[i++] = params.createdOnEnd + ' 23:59:59';
    }
    query += ' order by ui.created_on desc';
    if (params.start != null && params.size != null) {
        query += " limit ?,? ";
        paramsArr[i++] = parseInt(params.start);
        paramsArr[i++] = parseInt(params.size);
    }
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getSubUserAndBiz ');
        callback(error, rows);
    });
}
function getUserAndBizCount(params, callback) {
    var query = 'select count(ui.id) as count ' +
        'from user_info ui ' +
        'left join biz_info bi on bi.user_id = ui.id ' +
        'left join biz_verify bv on bi.id = bv.biz_id where 1=1 ';
    var paramsArr = [], i = 0;
    if (params.phone != null) {
        query += " and ui.phone like '%" + params.phone + "%'";
    }
    if (params.status != null) {
        query += ' and ui.status = ? ';
        paramsArr[i++] = params.status;
    }
    if (params.bizStatus != null) {
        query += ' and bv.status = ? ';
        paramsArr[i++] = params.bizStatus;
    }
    if (params.unverified == 1) {
        query += ' and bv.status <> 9 or bv.status is null ';
    }
    if (params.name != null) {
        query += " and ui.name like '%" + params.name + "%'";
    }
    if (params.bizName != null) {
        query += " and bi.name like '%" + params.bizName + "%'";
    }
    if (params.bizLicNum != null) {
        query += " and bv.biz_lic_num like '%" + params.bizLicNum + "%'";
    }
    if (params.type != null) {
        query += " and bi.type = ? ";
        paramsArr[i++] = params.type;
    }
    if (params.shipBizCode != null) {
        query += ' and find_in_set(?,bi.ship_biz_code) ';
        paramsArr[i++] = params.shipBizCode;
    }
    if (params.userType != null) {
        query += " and (ui.type = ? or bi.type = ?) ";
        paramsArr[i++] = params.userType;
        paramsArr[i++] = params.userType;
    }
    if (params.subType != null) {
        query += " and ui.sub_type = ? ";
        paramsArr[i++] = params.subType;
    }
    if (params.createdOnStart != null) {
        query += " and ui.created_on >= ? ";
        paramsArr[i++] = params.createdOnStart + ' 00:00:00';
    }
    if (params.createdOnEnd != null) {
        query += " and ui.created_on <= ? ";
        paramsArr[i++] = params.createdOnEnd + ' 23:59:59';
    }
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getUserAndBizCount ');
        callback(error, rows);
    });
}
function getBiz(params, callback) {
    var query = "select * from biz_info where id is not null ";
    var paramArr = [], i = 0;
    if (params.bizId) {
        query += " and id = ? ";
        paramArr[i++] = params.bizId;
    }
    if (params.userNo) {
        query = query + " and user_id = ? ";
        paramArr[i++] = params.userNo;
    }
    if (params.name) {
        query = query + " and name like ? ";
        paramArr[i++] = "%" + params.name + "%";
    }
    if (params.bizName != null) {
        query = query + " and name = ? ";
        paramArr[i++] = params.bizName;
    }
    if (params.type != null && params.type != '') {
        query = query + " and type = ? ";
        paramArr[i++] = params.type;
    }
    if (params.status != null && params.status != '') {
        query = query + " and status = ? ";
        paramArr[i++] = params.status;
    }
    query += " order by id desc ";
    if (params.start && params.size) {
        paramArr[i++] = parseInt(params.start);
        paramArr[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    //TODO 增加查询条件
    db.dbQuery(query, paramArr, function (error, rows) {
        logger.debug(' getBiz ');
        return callback(error, rows);
    });
}
function getBizAndVerify(params, callback) {
    var query = "select ui.username as user_name, ui.phone as user_phone ,bi.id,bi.user_id,bi.name,bi.email as bi_email," +
        "bi.operator,bi.zipcode,bi.jur_per,bi.cdh_code,bi.phone,bi.zipcode,bi.address, bi.type as bi_type," +
        "bi.status as bi_status,bi.created_on as bi_created_on,bi.updated_on as bi_updated_on,bi.part_id as bi_part_id,iz.part_name as iz_part_name," +
        "bv.id as bizVerifyId,bv.biz_id,bv.biz_lic_img,bv.biz_lic_num,bv.org_lic_img,bv.org_lic_num,bv.tax_lic_img,bv.tax_lic_num," +
        "bv.bank_lic_img,bv.bank_lic_num,bv.bank_name,bv.trans_lic_img,bv.trans_lic_num,bv.owner_lic_img1,bv.owner_lic_img2,bv.owner_lic_num," +
        "bv.remark,bv.op_user,bv.type as bv_type,bv.status as bv_status,bv.created_on as bv_created_on,bv.updated_on as bv_updated_on,bi.ip_info " +
        "from biz_info bi " +
        "left join biz_verify bv on bi.id = bv.biz_id " +
        "left join user_info ui on ui.id = bi.user_id " +
        "left join organiz iz on bi.part_id = iz.part_id " +
        "where bi.id is not null ";
    var paramArr = [], i = 0;
    if (params.bizId) {
        query += " and bi.id = ? ";
        paramArr[i++] = params.bizId;
    }
    if (params.verified == 1) {
        query += " and bv.id is not null ";
    }
    if (params.bizLicNum != null) {
        query += " and bv.biz_lic_num = ? ";
        paramArr[i++] = params.bizLicNum;
    }
    if (params.userName != null) {
        query += " and ui.username = ? ";
        paramArr[i++] = params.userName;
    }
    if (params.userNo != null) {
        query = query + " and bi.user_id = ? ";
        paramArr[i++] = params.userNo;
    }
    if (params.name) {
        query += " and bi.name like ? ";
        paramArr[i++] = '%' + params.name + '%';
    }
    if (params.bizName) {
        query += " and bi.name like ? ";
        paramArr[i++] = '%' + params.bizName + '%';
    }
    if (params.jurPer != null) {
        query += " and bi.jur_per like ? ";
        paramArr[i++] = '%' + params.jurPer + '%';
    }
    if (params.zipcode != null) {
        query += " and left(bi.zipcode,4) = ? ";
        paramArr[i++] = params.zipcode;
    }
    if (params.operator) {
        query += " and bi.operator like ? ";
        paramArr[i++] = '%' + params.operator + '%';
    }
    if (params.phone) {
        query += " and bi.phone like ? ";
        paramArr[i++] = '%' + params.phone + '%';
    }
    if (params.type != null && params.type != '') {
        query = query + " and bi.type = ? ";
        paramArr[i++] = params.type;
    }
    if (params.bizVerifyId) {
        query = query + " and bv.id = ? ";
        paramArr[i++] = params.bizVerifyId;
    }
    if (params.status != null && params.status != '') {
        if (params.status < 0) {
            query += " and bv.status is null ";
        } else {
            var statusArr = params.status.toString().split(',');
            query += ' and (bv.status = ? ';
            paramArr[i++] = statusArr[0];
            for (var j = 1; j < statusArr.length; j++) {
                query += ' or bv.status = ? ';
                paramArr[i++] = statusArr[j];
            }
            query += ') ';
        }
    }
    if (params.startDate != null) {
        paramArr[i++] = params.startDate + " 00:00:00";
        query += " and bv.updated_on >= ? ";
    }
    if (params.endDate != null) {
        paramArr[i++] = params.endDate + " 23:59:59";
        query += " and bv.updated_on <= ? ";
    }
    if (params.bvCreatedOnStart != null) {
        paramArr[i++] = params.bvCreatedOnStart + " 00:00:00";
        query += " and bv.created_on >= ? ";
    }
    if (params.bvCreatedOnEnd != null) {
        paramArr[i++] = params.bvCreatedOnEnd + " 23:59:59";
        query += " and bv.created_on <= ? ";
    }
    if (params.biCreatedOnStart != null) {
        paramArr[i++] = params.biCreatedOnStart + " 00:00:00";
        query += " and bi.created_on >= ? ";
    }
    if (params.biCreatedOnEnd != null) {
        paramArr[i++] = params.biCreatedOnEnd + " 23:59:59";
        query += " and bi.created_on <= ? ";
    }
    query += " order by bi.id desc ";
    if (params.start && params.size) {
        paramArr[i++] = parseInt(params.start);
        paramArr[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    //TODO 增加查询条件
    db.dbQuery(query, paramArr, function (error, rows) {
        logger.debug(' getBizAndVerify ');
        return callback(error, rows);
    });
}
function getBizAndVerifyCount(params, callback) {
    var query = "select count(bi.id) as count " +
        "from biz_info bi left join biz_verify bv on bi.id = bv.biz_id " +
        "left join user_info ui on ui.id = bi.user_id " +
        "where bi.id is not null ";
    var paramArr = [], i = 0;
    if (params.bizId) {
        query += " and bi.id = ? ";
        paramArr[i++] = params.bizId;
    }
    if (params.bizLicNum != null) {
        query += " and bv.biz_lic_num = ? ";
        paramArr[i++] = params.bizLicNum;
    }
    if (params.userName != null) {
        query += " and ui.username = ? ";
        paramArr[i++] = params.userName;
    }
    if (params.userNo != null) {
        query = query + " and bi.user_id = ? ";
        paramArr[i++] = params.userNo;
    }
    if (params.name) {
        query += " and bi.name like ? ";
        paramArr[i++] = '%' + params.name + '%';
    }
    if (params.jurPer != null) {
        query += " and bi.jur_per like ? ";
        paramArr[i++] = '%' + params.jurPer + '%';
    }
    if (params.operator) {
        query += " and bi.operator like ? ";
        paramArr[i++] = '%' + params.operator + '%';
    }
    if (params.phone) {
        query += " and bi.phone like ? ";
        paramArr[i++] = '%' + params.phone + '%';
    }
    if (params.type != null && params.type != '') {
        query = query + " and bi.type = ? ";
        paramArr[i++] = params.type;
    }
    if (params.bizVerifyId) {
        query = query + " and bv.id = ? ";
        paramArr[i++] = params.bizVerifyId;
    }
    if (params.status != null && params.status != '') {
        if (params.status < 0) {
            query += " and bv.status is null ";
        } else {
            var statusArr = params.status.toString().split(',');
            query += ' and (bv.status = ? ';
            paramArr[i++] = statusArr[0];
            for (var j = 1; j < statusArr.length; j++) {
                query += ' or bv.status = ? ';
                paramArr[i++] = statusArr[j];
            }
            query += ') ';
        }
    }
    if (params.startDate != null) {
        paramArr[i++] = params.startDate + " 00:00:00";
        query += " and bv.updated_on >= ? ";
    }
    if (params.endDate != null) {
        paramArr[i++] = params.endDate + " 23:59:59";
        query += " and bv.updated_on <= ? ";
    }
    if (params.bvCreatedOnStart != null) {
        paramArr[i++] = params.bvCreatedOnStart + " 00:00:00";
        query += " and bv.created_on >= ? ";
    }
    if (params.bvCreatedOnEnd != null) {
        paramArr[i++] = params.bvCreatedOnEnd + " 23:59:59";
        query += " and bv.created_on <= ? ";
    }
    if (params.biCreatedOnStart != null) {
        paramArr[i++] = params.biCreatedOnStart + " 00:00:00";
        query += " and bi.created_on >= ? ";
    }
    if (params.biCreatedOnEnd != null) {
        paramArr[i++] = params.biCreatedOnEnd + " 23:59:59";
        query += " and bi.created_on <= ? ";
    }
    db.dbQuery(query, paramArr, function (error, rows) {
        logger.debug(' getBizAndVerifyCount ');
        return callback(error, rows);
    });
}
function createBiz(params, callback) {
    var query = "insert into biz_info (user_id,name,ship_biz_code,operator,jur_per,cdh_code,phone,zipcode,address,type,ip_info)" +
        " values (?,?,?,?,?,?,?,?,?,?,?) ";
    var paramArr = [], i = 0;
    paramArr[i++] = params.userId;
    paramArr[i++] = params.name;
    paramArr[i++] = params.shipBizCode;
    paramArr[i++] = params.operator;
    paramArr[i++] = params.jurPer;
    paramArr[i++] = params.cdhCode;
    paramArr[i++] = params.phone;
    paramArr[i++] = params.zipcode;
    paramArr[i++] = params.address;
    paramArr[i++] = params.type;
    paramArr[i++] = params.ipInfo;
    db.dbQuery(query, paramArr, function (error, rows) {
        logger.debug(' createBiz ');
        return callback(error, rows);
    });
}
function updateBiz(params, callback) {
    var query = "update biz_info set id = id ";
    var paramsArr = [], i = 0;
    if (params.name != null) {
        paramsArr[i++] = params.name;
        query += ' ,name = ? ';
    }
    if (params.operator != null) {
        paramsArr[i++] = params.operator;
        query += ' ,operator = ? ';
    }
    if (params.phone != null) {
        paramsArr[i++] = params.phone;
        query += ' ,phone = ? ';
    }
    if (params.email != null) {
        paramsArr[i++] = params.email;
        query += ' ,email = ? ';
    }
    if (params.zipcode != null) {
        paramsArr[i++] = params.zipcode;
        query += ' ,zipcode = ? ';
    }
    if (params.address != null) {
        paramsArr[i++] = params.address;
        query += ' ,address = ? ';
    }
    if (params.jurPer != null) {
        paramsArr[i++] = params.jurPer;
        query += " ,jur_per = ? ";
    }
    if (params.shipBizCode != null) {
        paramsArr[i++] = params.shipBizCode;
        query += " ,ship_biz_code = ? ";
    }
    if (params.cdhCode != null) {
        paramsArr[i++] = params.cdhCode;
        query += " ,cdh_code = ? ";
    }
    if (params.type != null) {
        paramsArr[i++] = params.type;
        query += " ,type = ? ";
    }
    if (params.status != null) {
        paramsArr[i++] = params.status;
        query += " ,status = ? ";
    }
    if (params.partID != null) {
        paramsArr[i++] = params.partID;
        query += " ,part_id = ? ";
    }
    if (params.innerFlag != null) {
        paramsArr[i++] = params.innerFlag;
        query += " ,inner_flag = ? ";
    }
    if (params.ipInfo != null) {
        paramsArr[i++] = params.ipInfo;
        query += " ,ip_info = ? ";
    }
    query += " where id = ? ";
    paramsArr[i++] = params.bizId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug('  updateBiz ');
        return callback(error, result);
    });
}
function deleteBizInfo(params, callback) {
    var query = 'delete from biz_info where id = ?';
    db.dbQuery(query, [params.bizId], function (error, result) {
        logger.debug(' deleteBizInfo ');
        callback(error, result);
    });
}
function deleteBizVerify(params, callback) {
    var query = 'delete from biz_verify where biz_id = ?';
    db.dbQuery(query, [params.bizId], function (error, result) {
        logger.debug(' deleteBizVerify ');
        callback(error, result);
    });
}
function updateBizStatus(params, callback) {
    var query = "update biz_info set status = ? where id = ?";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.status;
    paramsArr[i++] = params.bizId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateBizStatus ');
        return callback(error, result);
    });
}
function addBizTruckRel(params, callback) {
    var query = " insert into biz_truck_team_rel (biz_id,truck_biz_id) values (?,?) ";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.bizId;
    paramsArr[i++] = params.truckBizId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' addBizTruckRel ');
        return callback(error, result);
    });
}
function deleteBizTruckRel(params, callback) {
    var query = " delete from biz_truck_team_rel where biz_id = ? and truck_biz_id = ? ";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.bizId;
    paramsArr[i++] = params.truckBizId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' deleteBizTruckRel ');
        return callback(error, result);
    });
}
function getBizTruckRel(params, callback) {
    var query = " select * from biz_truck_team_rel where biz_id = ? and truck_biz_id = ? ";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.bizId;
    paramsArr[i++] = params.truckBizId;
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getBizTruckRel ');
        return callback(error, rows);
    });
}
function getBizTruckTeam(params, callback) {
    var query = " select bi.* from biz_truck_team_rel brtl left join biz_info bi on brtl.truck_biz_id = bi.id where brtl.biz_id = ? ";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.bizId;
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getBizTruckTeam ');
        return callback(error, rows);
    });
}
module.exports = {
    getBiz: getBiz,
    getBizAndVerify: getBizAndVerify,
    getBizAndVerifyCount: getBizAndVerifyCount,
    deleteBizInfo: deleteBizInfo,
    deleteBizVerify: deleteBizVerify,
    createBiz: createBiz,
    updateBiz: updateBiz,
    updateBizStatus: updateBizStatus,
    addBizTruckRel: addBizTruckRel,
    deleteBizTruckRel: deleteBizTruckRel,
    getBizTruckRel: getBizTruckRel,
    getBizTruckTeam: getBizTruckTeam,
    getUserAndBiz: getUserAndBiz,
    getSubUserAndBiz: getSubUserAndBiz,
    getUserAndBizCount: getUserAndBizCount
};

