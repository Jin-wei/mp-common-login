/**
 * Created by Szane on 2016/4/20.
 */

var db = require('../db/db.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DriverDAO.js');

function getDriver(params, callback) {
    var query = "select dv.*,bi.name as biz_name from driver_verify dv left join biz_info bi on dv.biz_id = bi.id" +
        " where dv.id is not null ";
    var paramsArr = [], i = 0;
    if (params.driverId != null) {
        query += " and dv.id = ? ";
        paramsArr[i++] = params.driverId;
    }
    if (params.driverUserId != null) {
        query += " and dv.user_id = ? ";
        paramsArr[i++] = params.driverUserId;
    }
    if (params.userNo != null) {
        query += " and dv.user_id = ? ";
        paramsArr[i++] = params.userNo;
    }
    if (params.signed == 1) {
        query += " and (dv.user_id is not null and dv.status = 9) ";
    }
    if (params.signed == 0) {
        query += " and ((dv.user_id is null) or (dv.user_id is not null and dv.status <> 9 )) ";
    }
    if (params.bizId) {
        query += " and dv.biz_id = ? ";
        paramsArr[i++] = params.bizId;
    }
    if (params.name) {
        query += " and dv.name like ? ";
        paramsArr[i++] = '%' + params.name + '%';
    }
    if (params.bizName != null) {
        query += " and bi.name like ? ";
        paramsArr[i++] = '%' + params.bizName + '%';
    }
    if (params.truckId) {
        query += " and truck_id = ? ";
        paramsArr[i++] = params.truckId;
    }
    if (params.phone) {
        query += " and dv.phone = ? ";
        paramsArr[i++] = params.phone;
    }
    if (params.status != null) {
        var statusArr = params.status.toString().split(',');
        query += ' and (dv.status = ? ';
        paramsArr[i++] = statusArr[0];
        for (var j = 1; j < statusArr.length; j++) {
            query += ' or dv.status = ? ';
            paramsArr[i++] = statusArr[j];
        }
        query += ') ';
    }
    if (params.active != null && params.active != '') {
        query += " and dv.active = ? ";
        paramsArr[i++] = params.active;
    }
    if (params.licNum) {
        query += " and dv.lic_num = ? ";
        paramsArr[i++] = params.licNum;
    }
    //登记时间
    if (params.startDate) {
        paramsArr[i++] = params.startDate + " 00:00:00";
        query += " and dv.updated_on >= ? ";
    }
    if (params.endDate) {
        paramsArr[i++] = params.endDate + " 23:59:59";
        query += " and dv.updated_on <= ? ";
    }
    if (params.createdOnStart) {
        paramsArr[i++] = params.createdOnStart + " 00:00:00";
        query += " and dv.created_on >= ? ";
    }
    if (params.createdOnEnd) {
        paramsArr[i++] = params.createdOnEnd + " 23:59:59";
        query += " and dv.created_on <= ? ";
    }
    query += " order by dv.id desc ";
    if (params.start && params.size) {
        paramsArr[i++] = parseInt(params.start);
        paramsArr[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    //TODO 增加查询条件
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' getDriver ');
        callback(error, rows);
    });
}
function createDriver(params, callback) {
    var query = "insert into driver_verify (biz_id,user_id,name,gender,phone,truck_id,res_zipcode,res_address,lic_zipcode,lic_type," +
        "lic_date,lic_img,lic_num,id_img1,id_img2,id_num,remark,op_user) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.bizId;
    paramsArr[i++] = params.userId;
    paramsArr[i++] = params.name;
    paramsArr[i++] = params.gender;
    paramsArr[i++] = params.phone;
    paramsArr[i++] = params.truckId;
    paramsArr[i++] = params.resZipcode;
    paramsArr[i++] = params.resAddress;
    paramsArr[i++] = params.licZipcode;
    paramsArr[i++] = params.licType;
    paramsArr[i++] = params.licDate;
    paramsArr[i++] = params.licImgUrl;
    paramsArr[i++] = params.licNum;
    paramsArr[i++] = params.idImgUrl1;
    paramsArr[i++] = params.idImgUrl2;
    paramsArr[i++] = params.idNum;
    paramsArr[i++] = params.remark;
    paramsArr[i++] = params.adminId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' createDriver ');
        callback(error, result);
    });
}
function updateDriver(params, callback) {
    var query = "update driver_verify set op_user = ? ";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.opUser;
    if (params.name) {
        paramsArr[i++] = params.name;
        query += " ,name = ? ";
    }
    if (params.gender) {
        paramsArr[i++] = params.gender;
        query += " ,gender = ? ";
    }
    if (params.phone) {
        paramsArr[i++] = params.phone;
        query += " ,phone = ? ";
    }
    if (params.driverUserId) {
        paramsArr[i++] = params.driverUserId;
        query += " ,user_id = ? ";
    }
    if (params.truckId) {
        paramsArr[i++] = params.truckId;
        query += " ,truck_id = ? ";
    }
    if (params.bizId != null) {
        paramsArr[i++] = params.bizId;
        query += " ,biz_id = ? ";
    }
    if (params.resZipcode) {
        paramsArr[i++] = params.resZipcode;
        query += " ,res_zipcode = ? ";
    }
    if (params.resAddress) {
        paramsArr[i++] = params.resAddress;
        query += " ,res_address = ? ";
    }
    if (params.licZipcode) {
        paramsArr[i++] = params.licZipcode;
        query += " ,lic_zipcode = ? ";
    }
    if (params.licType) {
        paramsArr[i++] = params.licType;
        query += " ,lic_type = ? ";
    }
    if (params.licDate) {
        paramsArr[i++] = params.licDate;
        query += " ,lic_date = ? ";
    }
    if (params.licImgUrl) {
        paramsArr[i++] = params.licImgUrl;
        query += " ,lic_img = ? ";
    }
    if (params.licNum) {
        paramsArr[i++] = params.licNum;
        query += " ,lic_num = ? ";
    }
    if (params.idImgUrl1) {
        paramsArr[i++] = params.idImgUrl1;
        query += " ,id_img1 = ? ";
    }
    if (params.idImgUrl2) {
        paramsArr[i++] = params.idImgUrl2;
        query += " ,id_img2 = ? ";
    }
    if (params.idNum) {
        paramsArr[i++] = params.idNum;
        query += " ,id_num = ? ";
    }
    if (params.status) {
        query += " ,status = ? ";
        paramsArr[i++] = params.status;
    }
    if (params.remark) {
        query += " ,remark = ? ";
        paramsArr[i++] = params.remark;
    }
    query += " where id = ? ";
    paramsArr[i++] = params.driverId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateDriver ');
        callback(error, result);
    });
}
function updateDriverStatus(params, callback) {
    var query = "update driver_verify set status = ? where id = ?";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.status;
    paramsArr[i++] = params.driverId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateDriverStatus ');
        return callback(error, result);
    });
}
function updateDriverType(params, callback) {
    var query = "update driver_verify set type = ?,sub_type = ? where id = ?";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.type;
    paramsArr[i++] = params.subType;
    paramsArr[i++] = params.driverId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateDriverType ');
        return callback(error, result);
    });
}
function updateDriverActive(params, callback) {
    var query = "update driver_verify set active = ? where id = ?";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.active;
    paramsArr[i++] = params.driverId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateDriverActive ');
        return callback(error, result);
    });
}
function getDriverCount(params, callback) {
    var query = 'select count(*) as count from driver_verify where 1=1 ';
    var paramsArr = [], i = 0;
    if (params.status != null) {
        var statusArr = params.status.toString().split(',');
        query += ' and (status = ? ';
        paramsArr[i++] = statusArr[0];
        for (var j = 1; j < statusArr.length; j++) {
            query += ' or status = ? ';
            paramsArr[i++] = statusArr[j];
        }
        query += ') ';
    }
    if (params.active != null) {
        query += ' and active = ? ';
        paramsArr[i++] = params.active;
    }
    if (params.driverId != null) {
        query += " and id = ? ";
        paramsArr[i++] = params.driverId;
    }
    if (params.driverUserId != null) {
        query += " and user_id = ? ";
        paramsArr[i++] = params.driverUserId;
    }
    if (params.signed == 1) {
        query += " and (user_id is not null and status = 9) ";
    }
    if (params.signed == 0) {
        query += " and ((user_id is null) or (user_id is not null and status <> 9 )) ";
    }
    if (params.bizId) {
        query += " and biz_id = ? ";
        paramsArr[i++] = params.bizId;
    }
    if (params.bizName != null) {
        query += " and bi.name like ? ";
        paramsArr[i++] = '%' + params.bizName + '%';
    }
    if (params.name) {
        query += " and name = ? ";
        paramsArr[i++] = params.name;
    }
    if (params.truckId) {
        query += " and truck_id = ? ";
        paramsArr[i++] = params.truckId;
    }
    if (params.phone) {
        query += " and phone = ? ";
        paramsArr[i++] = params.phone;
    }
    if (params.licNum) {
        query += " and lic_num = ? ";
        paramsArr[i++] = params.licNum;
    }
    //登记时间
    if (params.startDate) {
        paramsArr[i++] = params.startDate + " 00:00:00";
        query += " and updated_on >= ? ";
    }
    if (params.endDate) {
        paramsArr[i++] = params.endDate + " 23:59:59";
        query += " and updated_on <= ? ";
    }
    if (params.createdOnStart) {
        paramsArr[i++] = params.createdOnStart + " 00:00:00";
        query += " and created_on >= ? ";
    }
    if (params.createdOnEnd) {
        paramsArr[i++] = params.createdOnEnd + " 23:59:59";
        query += " and created_on <= ? ";
    }
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' getDriverCount ');
        callback(error, result);
    });
}
function getDriverCountByBiz(params, callback) {
    var query = " select count(*) as driver_count from driver_verify where status = 9 and biz_id = ? ";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.bizId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' getDriverCountByBiz ');
        return callback(error, result);
    });
}
module.exports = {
    getDriver: getDriver,
    createDriver: createDriver,
    updateDriver: updateDriver,
    updateDriverStatus: updateDriverStatus,
    updateDriverType: updateDriverType,
    updateDriverActive: updateDriverActive,
    getDriverCount: getDriverCount,
    getDriverCountByBiz: getDriverCountByBiz
};
