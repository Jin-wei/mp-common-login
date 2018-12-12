/**
 * Created by ling xue on 2016/3/2.
 */
var db = require('../db/db.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('UserInfoDAO.js');

function createAdmin(params, callback) {
    var query = 'insert into admin_user(username,name,password,admin_type,phone,remark) values (?,?,?,?,?,?); ';
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.username;
    paramsArr[i++] = params.name;
    paramsArr[i++] = params.password;
    paramsArr[i++] = params.adminType;
    paramsArr[i++] = params.phone;
    paramsArr[i++] = params.remark;
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' createAdmin ');
        return callback(error, rows);
    });
}
function getAdmin(params, callback) {
    var query = 'select * from admin_user where id is not null ';
    var paramArr = [], i = 0;
    if (params.adminId != null) {
        paramArr[i++] = params.adminId;
        query += ' and id = ? ';
    }
    if (params.username != null) {
        paramArr[i++] = params.username;
        query += ' and username = ? ';
    }
    if (params.phone != null) {
        paramArr[i++] = params.phone;
        query += ' and phone = ? ';
    }
    if (params.password != null) {
        paramArr[i++] = params.password;
        query += ' and password = ? ';
    }
    if (params.adminStatus != null) {
        paramArr[i++] = params.adminStatus;
        query += ' and admin_status = ? ';
    }
    if (params.start != null && params.size != null) {
        paramArr[i++] = parseInt(params.start);
        paramArr[i++] = parseInt(params.size);
        query += ' limit ?,? ';
    }
    db.dbQuery(query, paramArr, function (error, rows) {
        logger.debug(' getAdmin ');
        return callback(error, rows);
    });
}
function updateAdminStatus(params, callback) {
    var query = " update admin_user set admin_status = ? ";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.adminStatus;
    if (params.adminId != null) {
        query += " where id = ? ";
        paramsArr[i++] = params.adminId;
    } else if (params.phone != null) {
        query += " where phone = ?";
        paramsArr[i++] = params.phone;
    } else {
        query += " where 1=0 ";
    }
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateAdminStatus ');
        callback(error, result);
    });
}
function updateAdminType(params, callback) {
    var query = " update admin_user set admin_type = ? ";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.adminType;
    if (params.adminId != null) {
        query += " where id = ? ";
        paramsArr[i++] = params.adminId;
    } else if (params.phone != null) {
        query += " where phone = ?";
        paramsArr[i++] = params.phone;
    } else {
        query += " where 1=0 ";
    }
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateAdminType ');
        callback(error, result);
    });
}
function updateAdminPassword(params, callback) {
    var query = " update admin_user set password = ? ";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.password;
    if (params.adminId != null) {
        query += " where id = ? ";
        paramsArr[i++] = params.adminId;
    } else if (params.phone != null) {
        query += " where phone = ?";
        paramsArr[i++] = params.phone;
    } else {
        query += " where 1=0 ";
    }
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateAdminPassword ');
        callback(error, result);
    });
}

function createUser(params, callback) {
    var query = 'insert into user_info(username,email,phone,password,name,gender,avatar,address,state,city,zipcode,' +
        'department_id,wechat_id,wechat_status,status,type,sub_type,p_biz_id,remark) ' +
        ' values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);';
    var paramArr = [], i = 0;
    paramArr[i++] = params.username;
    paramArr[i++] = params.email;
    paramArr[i++] = params.phone;
    paramArr[i++] = params.password;
    paramArr[i++] = params.name;
    paramArr[i++] = params.gender ? params.gender : 1;
    paramArr[i++] = params.avatar;
    paramArr[i++] = params.address;
    paramArr[i++] = params.state;
    paramArr[i++] = params.city;
    paramArr[i++] = params.zipcode;
    paramArr[i++] = params.departmentId;
    paramArr[i++] = params.wechatId;
    paramArr[i++] = params.wechatStatus;
    paramArr[i++] = params.status;
    paramArr[i++] = params.type;
    paramArr[i++] = params.subType;
    paramArr[i++] = params.bizId;
    paramArr[i++] = params.remark;
    db.dbQuery(query, paramArr, function (error, rows) {
        logger.debug(' createUser ');
        return callback(error, rows);
    })
}

function updateUserStatus(params, callback) {
    var query = 'update user_info set status = ? where id is not null ';
    var paramArr = [], i = 0;
    paramArr[i++] = params.status;
    if (params.userId) {
        query = query + " and id = ? ";
        paramArr[i++] = params.userId;
    }
    if (params.username) {
        query = query + " and username = ? ";
        paramArr[i++] = params.username;
    }
    if (params.email) {
        query = query + " and email = ? ";
        paramArr[i++] = params.email;
    }
    if (params.phone) {
        query = query + " and phone = ? ";
        paramArr[i++] = params.phone;
    }
    if (params.wechatId) {
        query = query + " and wechat_id = ? ";
        paramArr[i++] = params.wechatId;
    }

    db.dbQuery(query, paramArr, function (error, rows) {
        logger.debug(' updateUserStatus ');
        return callback(error, rows);
    })
}

function updateUserWechatStatus(params, callback) {
    var query = 'update user_info set wechat_status = ? where wechat_id =? '
    var paramArr = [], i = 0;
    paramArr[i++] = params.wechatId;
    if (params.userId) {
        query = query + " and id = ? ";
        paramArr[i++] = params.userId;
    }
    db.dbQuery(query, paramArr, function (error, rows) {
        logger.debug(' updateUserWechatStatus ');
        return callback(error, rows);
    })
}
function getUserById(params, callback) {
    var query = 'select * from  user_info where id = ? ';
    var paramArr = [], i = 0;
    paramArr[i++] = params.userId;
    db.dbQuery(query, paramArr, function (error, rows) {
        logger.debug(' getUserById ');
        return callback(error, rows);
    });
}
function getUserAndDepartment(params, callback) {
    var query = 'select ui.*,ud.id as department_id,ud.department_name from user_info ui left join user_department ud on ui.department_id = ud.id ' +
        'where ui.id is not null ';
    var paramArr = [], i = 0;
    if (params.userNo != null) {
        query = query + " and ui.id = ? ";
        paramArr[i++] = params.userNo;
    }
    if (params.username != null) {
        query = query + " and ui.username = ? ";
        paramArr[i++] = params.username;
    }
    if (params.email != null) {
        query = query + " and ui.email = ? ";
        paramArr[i++] = params.email;
    }
    if (params.bizId != null) {
        query = query + " and ui.p_biz_id = ? ";
        paramArr[i++] = params.bizId;
    }
    if (params.phone != null) {
        query = query + " and ui.phone = ? ";
        paramArr[i++] = params.phone;
    }
    if (params.wechatId != null) {
        query = query + " and ui.wechat_id = ? ";
        paramArr[i++] = params.wechatId;
    }
    if (params.status != null) {
        query = query + " and ui.status = ? ";
        paramArr[i++] = params.status;
    }
    if (params.password) {
        paramArr[i++] = params.password;
        query += ' and ui.password = ? ';
    }
    db.dbQuery(query, paramArr, function (error, rows) {
        logger.debug(' getUser ');
        return callback(error, rows);
    });
}
function getUser(params, callback) {
    var query = 'select * from  user_info where id is not null ';
    var paramArr = [], i = 0;
    if (params.userId != null) {
        query = query + " and id = ? ";
        paramArr[i++] = params.userId;
    }
    if (params.userNo != null) {
        query += ' and id = ? ';
        paramArr[i++] = params.userNo;
    } else {
        if (params.username != null) {
            query = query + " and username = ? ";
            paramArr[i++] = params.username;
        }
        if (params.email != null) {
            query = query + " and email = ? ";
            paramArr[i++] = params.email;
        }
        if (params.phone != null) {
            query = query + " and phone = ? ";
            paramArr[i++] = params.phone;
        }
        if (params.wechatId != null) {
            query = query + " and wechat_id = ? ";
            paramArr[i++] = params.wechatId;
        }
        if (params.status != null) {
            query = query + " and status = ? ";
            paramArr[i++] = params.status;
        }
        if (params.password) {
            paramArr[i++] = params.password;
            query += ' and password = ? ';
        }
    }
    db.dbQuery(query, paramArr, function (error, rows) {
        logger.debug(' getUser ');
        return callback(error, rows);
    });
}
function getUserCount(params, callback) {
    var query = 'select count (*) as count from user_info where 1=1 ';
    var paramsArr = [], i = 0;
    if (params.status != null) {
        //允许同时传入多个status，并防止sql注入
        var statusArr = params.status.toString().split(',');
        query += ' and (status = ? ';
        paramsArr[i++] = statusArr[0];
        for (var j = 1; j < statusArr.length; j++) {
            query += ' or status = ? ';
            paramsArr[i++] = statusArr[j];
        }
        query += ') ';
    }
    if (params.bizId != null) {
        query = query + " and p_biz_id = ? ";
        paramsArr[i++] = params.bizId;
    }
    if (params.type != null) {
        var typeArr = params.type.split(',');
        query += ' and (type = ? ';
        paramsArr[i++] = typeArr[0];
        for (j = 1; j < typeArr.length; j++) {
            query += ' or type = ? ';
            paramsArr[i++] = typeArr[j];
        }
        query += ') ';
    }
    if (params.subType != null) {
        var subTypeArr = params.subType.split(',');
        query += ' and (sub_type = ? ';
        paramsArr[i++] = subTypeArr[0];
        for (j = 1; j < subTypeArr.length; j++) {
            query += ' or sub_type = ? ';
            paramsArr[i++] = subTypeArr[j];
        }
        query += ') ';
    }
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' getUserCount ');
        callback(error, result);
    });
}
function updateUserPassword(params, callback) {
    var query = " update user_info set password= ? where ";
    var paramArray = [], i = 0;
    paramArray[i++] = params.password;
    if (params.userNo) {
        query = query + " id = ? ";
        paramArray[i++] = params.userNo;
    } else if (params.email) {
        query = query + " email = ? ";
        paramArray[i++] = params.email;
    } else {
        query = query + " phone = ? ";
        paramArray[i++] = params.phone;
    }

    db.dbQuery(query, paramArray, function (error, rows) {
        logger.debug(' updateUserPassword ');
        return callback(error, rows);
    });
}
function updateUserPhone(params, callback) {
    var query = " update user_info set phone = ? ,username = ? where ";
    var paramArray = [], i = 0;
    paramArray[i++] = params.newPhone;
    paramArray[i++] = params.newPhone;
    if (params.userId) {
        query = query + " id = ? ";
        paramArray[i++] = params.userId;
    } else if (params.email) {
        query = query + " email = ? ";
        paramArray[i++] = params.email;
    } else {
        query = query + " phone = ? ";
        paramArray[i++] = params.phone;
    }
    db.dbQuery(query, paramArray, function (error, rows) {
        logger.debug(' updateUserPhone ');
        return callback(error, rows);
    });
}
function updateUserType(params, callback) {
    var query = " update user_info set type = ? where id = ? ";
    var paramsArray = [], i = 0;
    paramsArray[i++] = params.type;
    paramsArray[i++] = params.userId;
    db.dbQuery(query, paramsArray, function (error, rows) {
        logger.debug(' updateUserType ');
        return callback(error, rows);
    });
}
function updateUserSubType(params, callback) {
    var query = " update user_info set sub_type = ? where id = ? ";
    var paramsArray = [], i = 0;
    paramsArray[i++] = params.subType;
    paramsArray[i++] = params.userId;
    db.dbQuery(query, paramsArray, function (error, rows) {
        logger.debug(' updateUserSubType ');
        return callback(error, rows);
    });
}
function updateUserVerifyInfo(params, callback) {
    var query = "update user_info set type = ? ,sub_type = ?,name = ? where id = ? ";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.type;
    paramsArr[i++] = params.subType;
    paramsArr[i++] = params.name;
    paramsArr[i++] = params.userId;
    db.dbQuery(query, paramsArr, function (error, rows) {
        logger.debug(' updateUserVerifyInfo ');
        return callback(error, rows);
    });
}
function updateUserBizId(params, callback) {
    var query = " update user_info set p_biz_id = ? where id = ? ";
    db.dbQuery(query, [params.bizId, params.userId], function (error, result) {
        logger.debug(' updateUserBizId ');
        callback(error, result);
    });
}
function updateUserInfo(params, callback) {
    var query = " update user_info set id = id ";
    var paramsArray = [], i = 0;
    if (params.name != null) {
        paramsArray[i++] = params.name;
        query += ' ,name = ? ';
    }
    if (params.remark != null) {
        paramsArray[i++] = params.remark;
        query += ' ,remark = ? ';
    }
    if (params.address != null) {
        paramsArray[i++] = params.address;
        query += ' ,address = ? ';
    }
    if (params.state != null) {
        paramsArray[i++] = params.state;
        query += ' ,state = ? ';
    }
    if (params.city != null) {
        paramsArray[i++] = params.city;
        query += ' ,city = ? ';
    }
    if (params.zipcode != null) {
        paramsArray[i++] = params.zipcode;
        query += ' ,zipcode = ? ';
    }
    if (params.type != null) {
        query += " ,type = ?";
        paramsArray[i++] = params.type;
    }
    if (params.subType != null) {
        query += " ,sub_type = ?";
        paramsArray[i++] = params.subType;
    }
    if (params.departmentId != null) {
        query += " ,department_id = ?";
        paramsArray[i++] = params.departmentId;
    }
    if (params.bizId != null) {
        query += " ,p_biz_id = ? ";
        paramsArray[i++] = params.bizId;
    }
    query += " where id = ? ";
    paramsArray[i++] = params.userNo;
    db.dbQuery(query, paramsArray, function (error, rows) {
        logger.debug(' updateUserInfo ');
        return callback(error, rows);
    });
}
function cleanUserBizInfo(params, callback) {
    var query = " update user_info set p_biz_id = null, department_id = null";
    var paramsArray = [], i = 0;
    if (params.type != null) {
        query += " ,type = ?";
        paramsArray[i++] = params.type;
    }
    if (params.subType != null) {
        query += " ,sub_type = ?";
        paramsArray[i++] = params.subType;
    }
    query += " where id = ? ";
    paramsArray[i++] = params.userId;
    db.dbQuery(query, paramsArray, function (error, rows) {
        logger.debug(' cleanUserBizInfo ');
        return callback(error, rows);
    });
}
module.exports = {
    createUser: createUser,
    updateUserStatus: updateUserStatus,
    updateUserWechatStatus: updateUserWechatStatus,
    getUser: getUser,
    getUserCount: getUserCount,
    getUserAndDepartment: getUserAndDepartment,
    getUserById: getUserById,
    updateUserPassword: updateUserPassword,
    updateAdminStatus: updateAdminStatus,
    updateAdminType: updateAdminType,
    updateAdminPassword: updateAdminPassword,
    updateUserPhone: updateUserPhone,
    updateUserType: updateUserType,
    updateUserSubType: updateUserSubType,
    updateUserVerifyInfo: updateUserVerifyInfo,
    updateUserInfo: updateUserInfo,
    updateUserBizId: updateUserBizId,
    cleanUserBizInfo: cleanUserBizInfo,
    createAdmin: createAdmin,
    getAdmin: getAdmin
};