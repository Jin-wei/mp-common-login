/**
 * Created by Szane on 16/10/29.
 */
var commonUtil = require('mp-common-util');
var resUtil = commonUtil.responseUtil;
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Statistics.js');
var userInfoDAO = require('../dao/UserInfoDAO.js');
var iconv = require('iconv-lite');
var moment = require('moment');

function getUserStatisticsCSV(req, res, next) {
    userInfoDAO.getUser({}, function (error, rows) {
        if (error) {
            logger.error(' getUser ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            var str = '用户名,手机号,创建日期,最后登录日期,类别\r\n';
            if (rows && rows.length > 0) {
                for (var i = 0; i < rows.length; i++) {
                    var content = (rows[i].name || '') + ','
                        + (rows[i].phone || '') + ','
                        + (moment(rows[i].created_on).format("YYYY-MM-DD h:mm:ss") || '') + ','
                        + (moment(rows[i].last_login_on).format("YYYY-MM-DD h:mm:ss") || '') + ',';
                    var type = '';
                    if (rows[i].type == 0) {
                        type = '未认证用户';
                    } else if (rows[i].type == 2) {
                        type = '货代';
                    } else if (rows[i].type == 3) {
                        type = '船公司';
                    } else if (rows[i].type == 4) {
                        type = '车队';
                    } else if (rows[i].type == 5) {
                        type = '司机';
                    }
                    str += (content + type + '\r\n');
                }
            }
            var csvBuffer = iconv.encode(str, 'gb2312');
            res.set('content-type', 'application/csv');
            // res.set('charset', 'utf8');
            res.set('content-length', csvBuffer.length);
            res.writeHead(200);
            res.write(csvBuffer);
            res.end();
            return next(false);
        }
    });
}

module.exports = {
    getUserStatisticsCSV: getUserStatisticsCSV
};