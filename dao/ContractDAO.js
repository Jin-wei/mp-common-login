/**
 * Created by Szane on 16/12/7.
 */
var roleBase = require('../bl/RoleBase.js');
var sysConfig = require('../config/SystemConfig.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('ContractDAO.js');
var commonUtil = require('mp-common-util');
var httpUtil = commonUtil.httpUtil;

function generateContractNum(params, callback) {
    var year = 1900 + params.datetime.getYear();
    var month = params.datetime.getMonth() + 1;
    var cArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'];
    roleBase.getReqWithToken(function (error, request) {
        httpUtil.httpGet(sysConfig.cmsHost, '/api/contentCount', request, {
            type: {t1: '1', t2: params.typeNum.toString()},
            startDate: new Date(params.datetime.getFullYear(), params.datetime.getMonth(), 1),
            endDate: new Date(params.datetime.getFullYear(), params.datetime.getMonth() + 1, 0)
        }, function (error, result) {
            if (error) {
                callback(error, null);
            } else {
                var serNo = result.result % 100;
                var cNo = cArr[parseInt(result.result / 100)];
                var cNum = 'XML-' + params.type + (year + '').substr(2, 4) + (month < 10 ? '0' + month : month) + cNo + serNo;
                logger.debug(cNum);
                callback(error, cNum);
            }
        });
    });
}

module.exports = {
    generateContractNum: generateContractNum
};
