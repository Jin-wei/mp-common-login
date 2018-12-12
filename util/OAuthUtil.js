/**
 * Created by xueling on 16/7/5.
 */

var serializer = require('serializer');
var headerTokenMeta = "auth-token";
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('OAuthUtil.js');

var BROWSER_IE = 1;
var BROWSER_CHROME = 2;
var BROWSER_FIREFOX = 3;
var BROWSER_SAFARI = 4;
var BROWSER_OTHER = 5;
var APP_ANDROID = 6;
var APP_IOS = 7;
var DEVICE_UNKNOWN = 8;

var sysModules = [
    {mch: 'sso', desc: 'login'},
    {mch: 'mq', desc: 'message-queue'},
    {mch: 'image', desc: 'mimetype'},
    {mch: 'core', desc: 'order'},
    {mch: 'loc', desc: 'location'},
    {mch: 'batch', desc: 'common-batch'},
    {mch: 'notification', desc: 'common-notify'},
    {mch: 'sti', desc: 'sti'}
];

var sysNames = ['sso', 'mq', 'image', 'core', 'loc', 'batch', 'notification', 'sti'];

var oc3_token_opt = {
    head: "OC3_U_",
    web_expire: 7 * 24 * 60 * 60,
    app_expire: 7 * 24 * 60 * 60
};


function _extend(dst, src) {
    var srcs = [];
    if (typeof(src) == 'object') {
        srcs.push(src);
    } else if (typeof(src) == 'array') {
        for (var i = src.length - 1; i >= 0; i--) {
            srcs.push(this._extend({}, src[i]))
        }
    } else {
        throw new Error("Invalid argument")
    }

    for (i = srcs.length - 1; i >= 0; i--) {
        for (var key in srcs[i]) {
            dst[key] = srcs[i][key];
        }
    }
    return dst;
}


function createAccessToken(userId, userType, subType, userStatus, device) {
    var createTime = parseInt(new Date().getTime() / 1000);
    var out = _extend({}, {
        access_token: serializer.stringify([userId, userType, subType, userStatus, device, createTime]),
        refresh_token: null
    });
    return out.access_token;
}

function parseAccessToken(accessToken) {
    try {
        var data = serializer.parse(accessToken);
        var tokenInfo = {};
        tokenInfo.userId = data[0];
        tokenInfo.userType = data[1];
        tokenInfo.subType = data[2];
        tokenInfo.userStatus = data[3];
        tokenInfo.device = data[4];
        tokenInfo.createTime = data[5];
        return tokenInfo;
    } catch (e) {
        return null;
    }
}

function getRequestDevice(userAgent) {
    if (userAgent == null) {
        return DEVICE_UNKNOWN;
    } else {
        userAgent = userAgent.toLowerCase();
    }
    if (userAgent.startsWith('mozilla')) {
        if (userAgent.indexOf('windows') >= 0) {
            return BROWSER_IE;
        } else if (userAgent.indexOf('safari') >= 0) {
            if (userAgent.indexOf('chrome') >= 0) {
                return BROWSER_CHROME;
            } else {
                return BROWSER_SAFARI;
            }
        } else if (userAgent.indexOf('firefox') >= 0) {
            return BROWSER_FIREFOX;
        } else {
            return BROWSER_OTHER;
        }
    } else if (userAgent == 'xml_android') {
        return APP_ANDROID;
    } else {
        return DEVICE_UNKNOWN;
    }
}

function getReqToken(req) {
    if (req && req.headers) {
        logger.debug('headers');
        logger.debug(req.headers);
        return req.headers[headerTokenMeta];
    } else {
        return null;
    }
}

function getReqMethod(req) {
    if (req && req.method) {
        return req.method.toLowerCase();
    } else {
        return null;
    }
}
function getReqApi(req) {
    if (req && req.url) {
        var url = req.url.toLowerCase();
        if (url.indexOf('?') > 0) {
            //url.length = url.indexOf('?')-1;
            url = url.substring(0, url.indexOf('?'));
        }
        return url;
    } else {
        return null;
    }
}

module.exports = {
    createAccessToken: createAccessToken,
    parseAccessToken: parseAccessToken,
    getRequestDevice: getRequestDevice,
    headerTokenMeta: headerTokenMeta,
    oc3_token_opt: oc3_token_opt,
    sysModules: sysModules,
    sysNames: sysNames,
    getReqToken: getReqToken,
    getReqMethod: getReqMethod,
    getReqApi: getReqApi
};