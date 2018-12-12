/**
 * Created by xueling on 16/5/6.
 */
var http = require('http');
var request = require('request');
function httpReq(options, paramStr, callback) {
    try {
        var req = http.request(options, function (res) {
            var data = "";
            res.on('data', function (d) {
                data += d;
            });
            res.on('end', function () {
                var resObj = eval("(" + data + ")");
                callback(null, resObj);
            });
        });
        req.write(paramStr);
        req.end();
        req.on('error', function (e) {
            callback(e, null);
        });
    } catch (e) {
        callback(e, null);
    }
}

function httpFormSubmit(url, subParams, callback) {
    try {
        request.post(url, {
            form: subParams
        }, function (error, response, body) {
            var resObj = eval("(" + body + ")");
            callback(error, resObj)
        });
    } catch (e) {
        callback(e, null)
    }
}
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
}
module.exports = {
    httpReq: httpReq,
    httpFormSubmit: httpFormSubmit,
    getClientIp: getClientIp
};