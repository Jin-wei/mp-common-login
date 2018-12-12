/**
 * Created by Szane on 2016/7/4.
 */
var commonUtil = require('mp-common-util');
var resUtil = commonUtil.responseUtil;
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('AppVersion.js');
var appVersionDAO = require('../dao/AppVersionDAO.js');
var config = require('../config/SystemConfig.js');

function createAppVersion(req, res, next) {
    var params = req.params;
    appVersionDAO.createAppVersion(params, function (error, result) {
        if (error) {
            logger.error(' createAppVersion ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetCreateRes(res, result);
            return next();
        }
    });
}
function getAppVersion(req, res, next) {
    var params = req.params;
    appVersionDAO.getAppVersion(params, function (error, rows) {
        if (error) {
            logger.error(' getAppVersion ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            resUtil.resetQueryRes(res, rows);
            return next();
        }
    });
}

function appDownload(req, res, next) {
    var params = req.params;
    appVersionDAO.addAppDownloadCount({}, function (error, result) {
        if (error) {
            logger.error(' addAppDownloadCount ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            appVersionDAO.getAppVersion({last: 1, appType: 2}, function (error, result) {
                if (error) {
                    logger.error(' getAppVersion ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }
                appVersionDAO.getAppDownloadCount({}, function (error, rows) {
                    if (error) {
                        logger.error(' getAppVersion ' + error.message);
                        resUtil.resInternalError(error, res, next);
                    }
                    if (rows && rows.length > 0) {
                        result[0].download_count = rows[0].count;
                    }
                    resUtil.resetQueryRes(res, result);
                    return next();
                });
            });
        }
    });
}
module.exports = {
    createAppVersion: createAppVersion,
    getAppVersion: getAppVersion,
    appDownload: appDownload
};