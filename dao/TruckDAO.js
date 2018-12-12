/**
 * Created by Szane on 2016/4/21.
 */
var db = require('../db/db.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('TruckDAO.js');

function createTruck(params, callback) {
    var query = "insert into truck_info (user_id,biz_id,type,owner_name,owner_phone,owner_id_num,owner_gender,truck_num," +
        "truck_lic_num,trailer_num,trailer_lic_num,lic_zipcode,trailer_lic_zipcode,truck_lic_img,trailer_lic_img," +
        "truck_lic_expired,trailer_lic_expired,insurance1_img,insurance2_img,insurance3_img," +
        "remark,op_user,e6_flag) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.userId;
    paramsArr[i++] = params.bizId;
    paramsArr[i++] = params.type;
    paramsArr[i++] = params.ownerName;
    paramsArr[i++] = params.ownerPhone;
    paramsArr[i++] = params.ownerIdNum;
    paramsArr[i++] = params.ownerGender;
    paramsArr[i++] = params.truckNum;
    paramsArr[i++] = params.truckLicNum;
    paramsArr[i++] = params.trailerNum;
    paramsArr[i++] = params.trailerLicNum;
    paramsArr[i++] = params.licZipcode;
    paramsArr[i++] = params.trailerLicZipcode;
    paramsArr[i++] = params.truckLicImgUrl;
    paramsArr[i++] = params.trailerLicImgUrl;
    paramsArr[i++] = params.truckLicExpired;
    paramsArr[i++] = params.trailerLicExpired;
    paramsArr[i++] = params.insurance1ImgUrl;
    paramsArr[i++] = params.insurance2ImgUrl;
    paramsArr[i++] = params.insurance3ImgUrl;
    paramsArr[i++] = params.remark;
    paramsArr[i++] = params.opUser;
    paramsArr[i++] = params.e6Flag;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' createTruck ');
        return callback(error, result);
    });
}
function getTruck(params, callback) {
    var query = "select * from truck_info where id is not null ";
    var paramsArr = [], i = 0;
    if (params.truckId != null) {
        paramsArr[i++] = params.truckId;
        query += " and id = ?";
    }
    if (params.userNo != null) {
        paramsArr[i++] = params.userNo;
        query += " and user_id = ?";
    }
    if (params.bizId != null) {
        paramsArr[i++] = params.bizId;
        query += " and biz_id = ?";
    }
    if (params.type != null) {
        paramsArr[i++] = params.type;
        query += " and type = ?";
    }
    if (params.ownerName != null) {
        paramsArr[i++] = params.ownerName;
        query += " and owner_name = ?";
    }
    if (params.ownerPhone != null) {
        paramsArr[i++] = params.ownerPhone;
        query += " and owner_phone = ?";
    }
    if (params.ownerIdNum != null) {
        paramsArr[i++] = params.ownerIdNum;
        query += " and owner_id_num = ?";
    }
    if (params.truckNum != null) {
        paramsArr[i++] = '%' + params.truckNum + '%';
        query += " and truck_num like ?";
    }
    if (params.truckLicNum != null) {
        paramsArr[i++] = params.truckLicNum;
        query += " and truck_lic_num = ?";
    }
    if (params.trailerNum != null) {
        paramsArr[i++] = params.trailerNum;
        query += " and trailer_num = ?";
    }
    if (params.status != null && params.status != '') {
        var statusArr = params.status.toString().split(',');
        query += ' and (status = ? ';
        paramsArr[i++] = statusArr[0];
        for (var j = 1; j < statusArr.length; j++) {
            query += ' or status = ? ';
            paramsArr[i++] = statusArr[j];
        }
        query += ') ';
    }
    if (params.active != null && params.active != '') {
        paramsArr[i++] = params.active;
        query += " and active = ?";
    }
    //登记时间
    if (params.startDate != null) {
        paramsArr[i++] = params.startDate + " 00:00:00";
        query += " and updated_on >= ? ";
    }
    if (params.endDate != null) {
        paramsArr[i++] = params.endDate + " 23:59:59";
        query += " and updated_on <= ? ";
    }
    query += " order by id desc ";
    if (params.start && params.size) {
        paramsArr[i++] = parseInt(params.start);
        paramsArr[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getTruck ');
        return callback(error, rows);
    });
}
function updateTruck(params, callback) {
    var query = "update truck_info set op_user = ? ";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.opUser;
    if (params.type != null) {
        paramsArr[i++] = params.type;
        query += " ,type = ?";
    }
    if (params.ownerName) {
        paramsArr[i++] = params.ownerName;
        query += " ,owner_name = ?";
    }
    if (params.ownerPhone) {
        paramsArr[i++] = params.ownerPhone;
        query += " ,owner_phone = ?";
    }
    if (params.ownerIdNum) {
        paramsArr[i++] = params.ownerIdNum;
        query += " ,owner_id_num = ?";
    }
    if (params.ownerGender != null) {
        paramsArr[i++] = params.ownerGender;
        query += " ,owner_gender = ?";
    }
    if (params.truckNum) {
        paramsArr[i++] = params.truckNum;
        query += " ,truck_num = ?";
    }
    if (params.truckLicNum) {
        paramsArr[i++] = params.truckLicNum;
        query += " ,truck_lic_num = ?";
    }
    if (params.trailerNum) {
        paramsArr[i++] = params.trailerNum;
        query += " ,trailer_num = ?";
    }
    if (params.trailerLicNum) {
        paramsArr[i++] = params.trailerLicNum;
        query += " ,trailer_lic_num = ?";
    }
    if (params.licZipcode) {
        paramsArr[i++] = params.licZipcode;
        query += " ,lic_zipcode = ?";
    }
    if (params.trailerLicZipcode) {
        paramsArr[i++] = params.trailerLicZipcode;
        query += " ,trailer_lic_zipcode = ?";
    }
    if (params.truckLicImgUrl) {
        paramsArr[i++] = params.truckLicImgUrl;
        query += " ,truck_lic_img = ?";
    }
    if (params.trailerLicImgUrl) {
        paramsArr[i++] = params.trailerLicImgUrl;
        query += " ,trailer_lic_img = ?";
    }
    if (params.truckLicExpired) {
        paramsArr[i++] = params.truckLicExpired;
        query += " ,truck_lic_expired = ?";
    }
    if (params.trailerLicExpired) {
        paramsArr[i++] = params.trailerLicExpired;
        query += " ,trailer_lic_expired = ?";
    }
    if (params.insurance1ImgUrl) {
        paramsArr[i++] = params.insurance1ImgUrl;
        query += " ,insurance1_img = ?";
    }
    if (params.insurance2ImgUrl) {
        paramsArr[i++] = params.insurance2ImgUrl;
        query += " ,insurance2_img = ?";
    }
    if (params.insurance3ImgUrl) {
        paramsArr[i++] = params.insurance3ImgUrl;
        query += " ,insurance3_img = ?";
    }
    if (params.status != null) {
        paramsArr[i++] = params.status;
        query += " ,status = ?";
    }
    if (params.remark) {
        paramsArr[i++] = params.remark;
        query += " ,remark = ?";
    }
    query += " where id = ? ";
    paramsArr[i++] = params.truckId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateTruck ');
        return callback(error, result);
    });
}
function updateTruckStatus(params, callback) {
    var query = " update truck_info set status = ? where id = ? ";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.status;
    paramsArr[i++] = params.truckId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateTruckStatus ');
        return callback(error, result);
    });
}
function updateTruckActive(params, callback) {
    var query = " update truck_info set active = ? where id = ?";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.active;
    paramsArr[i++] = params.truckId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateTruckActive ');
        return callback(error, result);
    });
}
function getTruckCount(params, callback) {
    var query = 'select count(*) as count from truck_info where 1=1 ';
    var paramsArr = [], i = 0;
    if (params.truckId != null) {
        paramsArr[i++] = params.truckId;
        query += " and id = ?";
    }
    if (params.userNo != null) {
        paramsArr[i++] = params.userNo;
        query += " and user_id = ?";
    }
    if (params.bizId != null) {
        paramsArr[i++] = params.bizId;
        query += " and biz_id = ?";
    }
    if (params.type != null) {
        paramsArr[i++] = params.type;
        query += " and type = ?";
    }
    if (params.ownerName != null) {
        paramsArr[i++] = params.ownerName;
        query += " and owner_name = ?";
    }
    if (params.ownerPhone != null) {
        paramsArr[i++] = params.ownerPhone;
        query += " and owner_phone = ?";
    }
    if (params.ownerIdNum != null) {
        paramsArr[i++] = params.ownerIdNum;
        query += " and owner_id_num = ?";
    }
    if (params.truckNum != null) {
        paramsArr[i++] = '%' + params.truckNum + '%';
        query += " and truck_num like ?";
    }
    if (params.truckLicNum != null) {
        paramsArr[i++] = params.truckLicNum;
        query += " and truck_lic_num = ?";
    }
    if (params.trailerNum != null) {
        paramsArr[i++] = params.trailerNum;
        query += " and trailer_num = ?";
    }
    if (params.status != null && params.status != '') {
        var statusArr = params.status.toString().split(',');
        query += ' and (status = ? ';
        paramsArr[i++] = statusArr[0];
        for (var j = 1; j < statusArr.length; j++) {
            query += ' or status = ? ';
            paramsArr[i++] = statusArr[j];
        }
        query += ') ';
    }
    if (params.active != null && params.active != '') {
        paramsArr[i++] = params.active;
        query += " and active = ?";
    }
    //登记时间
    if (params.startDate != null) {
        paramsArr[i++] = params.startDate + " 00:00:00";
        query += " and updated_on >= ? ";
    }
    if (params.endDate != null) {
        paramsArr[i++] = params.endDate + " 23:59:59";
        query += " and updated_on <= ? ";
    }
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' getTruckCount ');
        callback(error, result);
    });
}

function getTruckCountByBiz(params, callback) {
    var query = " select count(*) as truck_count from truck_info where active = 1 and status = 9 and biz_id = ? ";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.bizId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' getTruckCountByBiz ');
        return callback(error, result);
    });
}
function getTruckOccupiedCount(params, callback) {
    var query = ' select count(distinct ti.id) as count from truck_info ti left join sinotrans_core.order_item oi on ti.id = oi.truck_id ' +
        ' where ti.active = 1 and ti.status = 9 and ti.biz_id = ? and (oi.item_status = 4 or oi.item_status = 5) ';
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.bizId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' getTruckOccupiedCount ');
        return callback(error, result);
    });
}
function getActiveTruckCount(params, callback) {
    var query = 'select count(*)  as count from ' +
        '(select count(oi.id) as count,ti.id from truck_info ti ' +
        'LEFT JOIN sinotrans_core.order_item oi ON ti.id = oi.truck_id ' +
        'WHERE ti.active = 1 AND ti.status = 9 and oi.accept_on >= ? and oi.accept_on <= ? ' +
        'GROUP BY oi.truck_id HAVING COUNT>=2) as a';
    var paramsArr = [], i = 0;
    paramsArr[i++] = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);//一个月内接过单
    paramsArr[i++] = params.endTime || new Date();
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getActiveTruckCount ');
        callback(error, rows);
    });
}
function getActiveTruck(params, callback) {
    var query = ' select distinct ti.id from truck_info ti ' +
        'left join sinotrans_core.order_item oi on ti.id = oi.truck_id ' +
        'where ti.active = 1 and ti.status = 9 and timestampdiff(month,oi.accept_on,?)<=3 ';
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.endTime;
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getActiveTruck ');
        callback(error, rows);
    });
}
module.exports = {
    createTruck: createTruck,
    getTruck: getTruck,
    updateTruck: updateTruck,
    updateTruckStatus: updateTruckStatus,
    updateTruckActive: updateTruckActive,
    getTruckCount: getTruckCount,
    getTruckCountByBiz: getTruckCountByBiz,
    getTruckOccupiedCount: getTruckOccupiedCount,
    getActiveTruck: getActiveTruck,
    getActiveTruckCount: getActiveTruckCount
};