/**
 * Created by Szane on 2016/4/21.
 */
var db = require('../db/db.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('BizVerifyDAO.js');
function createBizVerify(params, callback) {
    var query = "insert into biz_verify (user_id,biz_id,biz_lic_img,biz_lic_num,org_lic_img,org_lic_num,tax_lic_img," +
        "tax_lic_num,bank_lic_img,bank_lic_num,bank_name,trans_lic_img,trans_lic_num,owner_lic_img1,owner_lic_img2," +
        "owner_lic_num,type,remark,op_user) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
    var paramArr = [], i = 0;
    paramArr[i++] = params.userId;
    paramArr[i++] = params.bizId;
    paramArr[i++] = params.bizLicImgUrl;
    paramArr[i++] = params.bizLicNum;
    paramArr[i++] = params.orgLicImgUrl;
    paramArr[i++] = params.orgLicNum;
    paramArr[i++] = params.taxLicImgUrl;
    paramArr[i++] = params.taxLicNum;
    paramArr[i++] = params.bankLicImgUrl;
    paramArr[i++] = params.bankLicNum;
    paramArr[i++] = params.bankName;
    paramArr[i++] = params.transLicImgUrl;
    paramArr[i++] = params.transLicNum;
    paramArr[i++] = params.ownerLicImgUrl1;
    paramArr[i++] = params.ownerLicImgUrl2;
    paramArr[i++] = params.ownerLicNum;
    paramArr[i++] = params.type;
    paramArr[i++] = params.remark;
    paramArr[i++] = params.opUser;
    db.dbQuery(query, paramArr, function (error, rows) {
        logger.debug(' createBizVerify ');
        return callback(error, rows);
    });
}
function updateBizVerify(params, callback) {
    var query = "update biz_verify set biz_lic_img = ? , org_lic_img = ? ,tax_lic_img = ?,bank_lic_img = ?,trans_lic_img = ?," +
        "owner_lic_img1 = ?,owner_lic_img2 = ?";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.bizLicImgUrl;
    paramsArr[i++] = params.orgLicImgUrl;
    paramsArr[i++] = params.taxLicImgUrl;
    paramsArr[i++] = params.bankLicImgUrl;
    paramsArr[i++] = params.transLicImgUrl;
    paramsArr[i++] = params.ownerLicImgUrl1;
    paramsArr[i++] = params.ownerLicImgUrl2;
    if (params.bizLicNum) {
        query += " ,biz_lic_num = ? ";
        paramsArr[i++] = params.bizLicNum;
    }
    if (params.orgLicNum) {
        query += " ,org_lic_num = ? ";
        paramsArr[i++] = params.orgLicNum;
    }
    if (params.taxLicNum) {
        query += " ,tax_lic_num = ? ";
        paramsArr[i++] = params.taxLicNum;
    }
    if (params.bankLicNum) {
        query += " ,bank_lic_num = ? ";
        paramsArr[i++] = params.bankLicNum;
    }
    if (params.bankName) {
        query += " ,bank_name = ? ";
        paramsArr[i++] = params.bankName;
    }
    if (params.transLicNum) {
        query += " ,trans_lic_num = ? ";
        paramsArr[i++] = params.transLicNum;
    }
    if (params.ownerLicNum) {
        query += " ,owner_lic_num = ? ";
        paramsArr[i++] = params.ownerLicNum;
    }
    if (params.type != null) {
        query += " ,type = ? ";
        paramsArr[i++] = params.type;
    }
    if (params.status) {
        query += " ,status = ? ";
        paramsArr[i++] = params.status;
    }
    if (params.remark) {
        query += " ,remark = ? ";
        paramsArr[i++] = params.remark;
    }
    if (params.opUser) {
        query += " ,opUser = ? ";
        paramsArr[i++] = params.opUser;
    }
    query += " where id = ? ";
    paramsArr[i++] = params.bizVerifyId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug('  updateBizVerify ');
        return callback(error, result);
    });
}
function updateBizVerifyStatus(params, callback) {
    var query = "update biz_verify set status = ? where id = ?";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.status;
    paramsArr[i++] = params.bizVerifyId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateBizVerifyStatus ');
        return callback(error, result);
    });
}
function updateBizVerifyBizLicNum(params, callback) {
    var query = "update biz_verify set biz_lic_num = ? where biz_id = ?";
    var paramsArr = [], i = 0;
    paramsArr[i++] = params.bizLicNum;
    paramsArr[i++] = params.bizId;
    db.dbQuery(query, paramsArr, function (error, result) {
        logger.debug(' updateBizVerifyBizLicNum ');
        return callback(error, result);
    });
}
module.exports = {
    createBizVerify: createBizVerify,
    updateBizVerify: updateBizVerify,
    updateBizVerifyStatus: updateBizVerifyStatus,
    updateBizVerifyBizLicNum: updateBizVerifyBizLicNum
};