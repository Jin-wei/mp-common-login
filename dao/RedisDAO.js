/**
 * Created by xueling on 16/4/27.
 */
var redisClient = require('../db/RedisCon.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('RedisDAO.js');
const QUERY_EXPIRED = 60 * 60;

function setStringVal(params, callback) {
    /*
     if (params.expired) {
     redisCon.expire(params.key, params.expired);
     }*/
    try {
        redisClient.set(params.key, params.value);
        if (params.expired) {
            redisClient.expire(params.key, params.expired);
        }

        logger.debug('setStringVal');
        callback(null, {affectedRows: 1});
    } catch (e) {
        callback(e, null);
    }
}

function setObjectVal(params, callback) {
    try {
        redisClient.set(params.key, JSON.stringify(params.value));
        if (params.expired) {
            redisClient.expire(params.key, QUERY_EXPIRED);
        }
        logger.debug('setStringVal');
        callback(null, {affectedRows: 1});
    } catch (e) {
        callback(e, null);
    }
}
function getObjectVal(params, callback) {
    redisClient.get(params.key, function (error, result) {
        logger.debug('getStringVal');
        if (result)
            result = JSON.parse(result);
        callback(error, result);
    });
}
function setAsyStringVal(params) {
    if (params.expired && parseInt(params.expired)) {
        redisClient.set(params.key, params.value, 'EX', params.expired);
    } else {
        redisClient.set(params.key, params.value);
    }
    redisClient.get(params.key, function (error, result) {
        logger.debug(error || result);
    });
}

function getStringVal(params, callback) {
    redisClient.get(params.key, function (error, result) {
        logger.debug('getStringVal');
        callback(error, result);
    });
}

function removeStringVal(params, callback) {
    redisClient.del(params.key, function (error, result) {
        logger.debug('removeStringVal');
        callback(error, result);
    });
}
function removeKeyByPrefix(params, callback) {
    redisClient.keys(params.prefix + "*", function (error, keys) {
        logger.debug(keys);
        keys.forEach(function (key) {
            redisClient.del(key, function (error, result) {
                logger.debug('removeKeyByPrefix');
            });
        });
        callback(error, keys);
    });
}
function expireStringVal(params) {
    redisClient.expire(params.key, params.expired);
}

module.exports = {
    setStringVal: setStringVal,
    getStringVal: getStringVal,
    setObjectVal: setObjectVal,
    getObjectVal: getObjectVal,
    setAsyStringVal: setAsyStringVal,
    removeStringVal: removeStringVal,
    expireStringVal: expireStringVal,
    removeKeyByPrefix: removeKeyByPrefix
};