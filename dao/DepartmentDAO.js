/**
 * Created by Szane on 16/10/25.
 */
var db = require('../db/db.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('DepartmentDAO.js');

function addDepartment(params, callback) {
    var query = "insert into user_department (department_name,biz_id) values (?,?) ";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.departmentName;
    paramsArr[i++] = params.bizId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' addDepartment ');
        callback(error, result);
    });
}
function getDepartment(params, callback) {
    var query = "select * from user_department where 1=1 ";
    var paramsArr = [], i = 0;
    if (params.departmentId != null) {
        query += " and id = ? ";
        paramsArr[i++] = params.departmentId;
    }
    if (params.bizId != null) {
        query += " and biz_id = ? ";
        paramsArr[i++] = params.bizId;
    }
    if (params.departmentName != null) {
        query += " and department_name = ? ";
        paramsArr[i++] = params.departmentName;
    }
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' getDepartment ');
        callback(error, result);
    });
}
function getDepartmentCount(params, callback) {
    var query = "select count(*) as count from user_department where 1=1 ";
    var paramsArr = [], i = 0;
    if (params.departmentId != null) {
        query += " and id = ? ";
        paramsArr[i++] = params.departmentId;
    }
    if (params.bizId != null) {
        query += " and biz_id = ? ";
        paramsArr[i++] = params.bizId;
    }
    if (params.departmentName != null) {
        query += " and department_name = ? ";
        paramsArr[i++] = params.departmentName;
    }
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' getDepartmentCount ');
        callback(error, result);
    });
}
function updateDepartment(params, callback) {
    var query = 'update user_department set department_name = ? where id = ? ';
    db.dbQuery(query, [params.departmentName, params.departmentId], function (error, result) {
        logger.debug(' updateDepartment ');
        callback(error, result);
    });
}
function deleteDepartment(params, callback) {
    var query = "delete from user_department where id = ? ";
    db.dbQuery(query, [params.departmentId], function (error, result) {
        logger.debug(' deleteDepartment ');
        callback(error, result);
    });
}
module.exports = {
    addDepartment: addDepartment,
    getDepartment: getDepartment,
    updateDepartment: updateDepartment,
    deleteDepartment: deleteDepartment,
    getDepartmentCount: getDepartmentCount
};