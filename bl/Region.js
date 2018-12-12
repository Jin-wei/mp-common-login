/**
 * Created by ling xue  on 15-9-25.
 */


var regionDao = require('../dao/RegionDAO.js');
var commonUtil = require('mp-common-util');
var resUtil = commonUtil.responseUtil;
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('Region.js');
var Seq = require('seq');

function queryRegion(req, res, next) {
    var params = req.params;
    regionDao.queryRegion(params, function (error, rows) {
        if (error) {
            logger.error(' queryRegion ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            logger.info(' queryRegion ' + ' success');
            resUtil.resetQueryRes(res, rows, null);
            return next();
        }
    })
}

function queryParentRegion(req, res, next) {
    var params = req.params;
    regionDao.query1LevelRegion(params, function (error, rows) {
        if (error) {
            logger.error(' queryParentRegion ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            logger.info(' queryParentRegion ' + ' success');
            resUtil.resetQueryRes(res, rows, null);
            return next();
        }
    });
}

function queryLevelRegion(req, res, next) {
    var params = req.params;
    regionDao.query3LevelRegion(params, function (error, rows) {
        if (error) {
            logger.error(' queryLevelRegion ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            logger.info(' query3LevelRegion ' + ' success');
            resUtil.resetQueryRes(res, rows, null);
            return next();
        }
    });
}
function queryRegionTree(req, res, next) {
    var result = [];
    var states = [];
    Seq().seq(function () {
        var that = this;
        regionDao.query1LevelRegion({}, function (error, rows) {
            if (error) {
                logger.error(' query1LevelRegion ' + error.message);
                resUtil.resInternalError(error, res, next);
            }
            states = rows;
            that();
        });
    }).seq(function () {
        Seq(states).seqEach(function (state, i) {
            var that = this;
            regionDao.querySubRegion({pid: state.id}, function (error, rows) {
                if (error) {
                    logger.error(' querySubRegion ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }
                result.push({name: state.name, zipcode: state.id, city: rows});
                that(null, i);
            });
        }).seq(function () {
            resUtil.resetQueryRes(res, result);
            return next();
        });
    });
}
function updateRegion(req, res, next) {
    var params = req.params;
    regionDao.updateRegion(params, function (error, result) {
        if (error) {
            resInternalError(error, res, next);
        } else {
            resUtil.resetUpdateRes(res, result);
            return next();
        }
    });
}
module.exports = {
    queryRegion: queryRegion,
    queryParentRegion: queryParentRegion,
    queryLevelRegion: queryLevelRegion,
    queryRegionTree: queryRegionTree,
    updateRegion: updateRegion
};