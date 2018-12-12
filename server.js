/**
 * Created by ling xue on 2016/3/3.
 */


var restify = require('restify');
var admin = require('./bl/Admin.js');
var userInfo = require('./bl/UserInfo.js');
var userSms = require('./bl/UserMsg.js');
var roleBase = require('./bl/RoleBase.js');
var biz = require('./bl/Biz.js');
var driver = require('./bl/Driver.js');
var truck = require('./bl/Truck.js');
var captcha = require('./bl/CaptchaBl.js');
var region = require('./bl/Region.js');
var userDevice = require('./bl/UserDevice.js');
var appVersion = require('./bl/AppVersion.js');
var verifyHistory = require('./bl/VerifyHistory.js');
var contract = require('./bl/Contract.js');
var department = require('./bl/Department.js');
var statistics = require('./bl/Statistics.js');
var coreBizConfig = require('./bl/CoreBizConfig.js');
var coreBiz = require('./bl/CoreBiz.js');
var bonusPoint = require('./bl/BonusPoint.js');

var sysError = require('mp-common-util').responseUtil;

function createServer(options) {
    var server = restify.createServer({
        name: 'mp',
        version: '1.0.0'
    });

    // Clean up sloppy paths like
    server.pre(restify.pre.sanitizePath());

    // Handles annoying user agents (curl)
    server.pre(restify.pre.userAgentConnection());

    //server.use(roleBase.checkAuthToken);
    server.use(restify.throttle({
        burst: 100,
        rate: 50,
        ip: true
    }));

    restify.CORS.ALLOW_HEADERS.push('auth-token');
    restify.CORS.ALLOW_HEADERS.push('client-id');
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Origin");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Credentials");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods", "GET");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods", "POST");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods", "PUT");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Methods", "DELETE");
    restify.CORS.ALLOW_HEADERS.push("Access-Control-Allow-Headers", "accept,api-version, content-length, content-md5,x-requested-with,content-type, date, request-id, response-time");
    server.use(restify.CORS({headers: ['auth-token'], origins: ['*']}));
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.dateParser());
    server.use(restify.authorizationParser());
    server.use(restify.queryParser());
    server.use(restify.gzipResponse());
    server.use(restify.fullResponse());
    server.use(restify.bodyParser({uploadDir: __dirname + '/uploads/'}));

    var STATIS_FILE_RE = /\.(css|js|jpe?g|png|gif|less|eot|svg|bmp|tiff|ttf|otf|woff|pdf|ico|json|wav|ogg|mp3?|xml)$/i;
    server.get(/\/apidoc\/?.*/, restify.serveStatic({
        directory: './public'
    }));

    server.get('/', function (req, res, next) {
        sysError.resNoAuthorizedError(null, res, next);
    });
    server.get('/api/captcha', captcha.createCaptcha);

    /**
     * Region Module
     */
    server.get('/api/region', region.queryRegion);
    server.get('/api/region/levelRegion', region.queryLevelRegion);
    server.get('/api/region/parent', region.queryParentRegion);
    server.get('/api/region/tree', region.queryRegionTree);
    server.put({path: '/api/region', contentType: 'application/json'}, region.updateRegion);

    //server.get('/api/captcha',roleBase.createCaptcha);

    var subTypeArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 99];//所有已注册二级类型
    var adminSubArray = [9, 10, 11, 12, 13, 14, 99];//后台用户所有二级类型
    var userSubArray = [1, 2, 3, 4, 5, 6, 7, 8];//前台用户所有二级类型
    var authBizArray = [2, 5];//已认证的企业账号二级类型

    //后台用户登录
    server.post({
        path: '/api/admin/login',
        contentType: 'application/json'
    }, admin.adminLogin);
    //创建后台用户
    server.post({
        path: '/api/adminUser',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), admin.createAdmin);
    //获取管理员信息
    server.get('/api/adminUser', roleBase.checkUserToken([]), admin.getAdmin);
    //后台用户修改密码
    server.put({
        path: '/api/admin/:username/password',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), admin.modifyAdminPassword);
    //删除管理用户
    server.put({
        path: '/api/admin/:adminId/remove',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), admin.removeAdmin);
    //设置管理员角色
    server.put({
        path: '/api/admin/:adminId/type/:adminType',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), admin.updateAdminType);
    //重置管理员密码
    server.put({
        path: '/api/admin/:adminId/resetPassword',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), admin.resetPassword);
    //后台用户登出
    server.post({
        path: '/api/admin/logout',
        contentType: 'application/json'
    }, admin.adminLogout);
    //修改前台用户激活状态
    server.put({
        path: '/api/user/:userNo/active/:active',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), userInfo.updateUserActive);

    //前台用户登录
    server.post({
        path: '/api/login',
        contentType: 'application/json'
    }, userInfo.userLogin);
    //微信登录
    // server.post({path: '/api/wechatLogin', contentType: 'application/json'}, userInfo.wechatLogin);
    //前台用户登出
    server.post({
        path: '/api/logout',
        contentType: 'application/json'
    }, userInfo.userLogOut);
    //前台用户注册
    server.post({path: '/api/user', contentType: 'application/json'}, userInfo.addUser);
    //添加子账号
    server.post({path: '/api/user/biz/:bizId'}, roleBase.checkUserToken([]), userInfo.addUserByBiz);
    //前台用户重置密码
    server.post({
        path: '/api/user/:phone/password',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), userInfo.resetUserPswd);
    //前台用户修改密码
    server.put({
        path: '/api/user/:phone/password',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), userInfo.modifyUserPswd);
    //前台用户修改手机号
    server.put({
        path: '/api/user/:oriPhone/phone',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), userInfo.modifyUserPhone);
    //删除子账号
    server.put({
        path: '/api/user/:userNo/dismiss',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), userInfo.dismissUserFromBiz);
    //更新前台用户类型
    // server.put({
    //     path: '/api/user/:userId/type/:type',
    //     contentType: 'application/json'
    // }, userInfo.updateUserType);
    //更新用户信息
    server.put({
        path: '/api/user/:userNo',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), userInfo.updateUserInfo);
    //获取前台用户信息
    server.get('/api/user', roleBase.checkUserToken([]), userInfo.getUserInfo);
    //获取前台用户数量
    server.get('/api/user/count', roleBase.checkUserToken([]), userInfo.getUserCount);
    //获取单个前台用户信息
    server.get('/api/user/:userId', roleBase.checkUserToken([]), userInfo.getUserById);
    //添加部门
    server.post({
        path: '/api/department',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), department.addDepartment);
    //获取部门信息
    server.get('/api/department', roleBase.checkUserToken([]), department.getDepartment);
    server.get('/api/department/count', roleBase.checkUserToken([]), department.getDepartmentCount);
    //更新部门信息
    server.put({
        path: '/api/department/:departmentId',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), department.updateDepartment);
    //删除部门信息
    server.del({
        path: '/api/department/:departmentId',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), department.deleteDepartment);
    //刷新token
    server.get('/api/user/:userId/token', roleBase.refreshToken);
    //刷新后台用户token
    server.post({path: '/api/admin/:adminId/token', contentType: 'application/json'}, roleBase.refreshAdminToken);
    server.get('/api/mch/:mch/token', roleBase.refreshMchToken);
    server.post({path: '/api/mch', contentType: 'application/json'}, roleBase.getSysModuleToken);
    server.post({path: '/api/user/:userId/token/:token', contentType: 'application/json'}, roleBase.refreshToken);
    server.post({path: '/api/userToken', contentType: 'application/json'}, roleBase.checkUserToken);
    server.post({path: '/api/roleBase', contentType: 'application/json'}, roleBase.checkReqUserToken);
    //发送注册短信
    server.post({
        path: '/api/sms/:phone/sign',
        contentType: 'application/json'
    }, userSms.sendSignInSms);
    //发送重置密码短信
    server.post({
        path: '/api/sms/:phone/password',
        contentType: 'application/json'
    }, userSms.sendPasswordSms);
    //发送更换手机号短信
    server.post({
        path: '/api/sms/:phone/reset',
        contentType: 'application/json'
    }, userSms.sendResetPhoneSms);
    //发送增加子账号短信
    server.post({
        path: '/api/sms/:phone/signSubUser',
        contentType: 'application/json'
    }, userSms.sendSignInSmsForSubUser);
    //获取企业信息
    server.get('/api/biz', roleBase.checkUserToken([]), biz.getBiz);
    //获取企业认证信息
    server.get('/api/bizAndVerify', roleBase.checkUserToken([]), biz.getBizAndVerify);
    //获取企业认证信息数量
    server.get('/api/bizAndVerify/count', roleBase.checkUserToken([]), biz.getBizAndVerifyCount);
    //获取企业常用车队
    // server.get('/api/biz/:bizId/truckTeam', biz.getBizTruckTeam);
    //添加常用车队
    // server.post({path: '/api/biz/:bizId/bizTruckRel/:truckBizId', contentType: 'application/json'}, biz.addBizTruckRel);
    //删除常用车队
    // server.del('/api/biz/:bizId/bizTruckRel/:truckBizId', biz.deleteBizTruckRel);
    //获取前台用户企业信息
    server.get('/api/userAndBiz', roleBase.checkUserToken([]), biz.getUserAndBiz);
    //获取前台用户企业信息数量
    server.get('/api/userAndBiz/count', roleBase.checkUserToken([]), biz.getUserAndBizCount);
    //检查营业执照号
    server.get('/api/checkLicNum', roleBase.checkUserToken([]), biz.checkLicenseNum);
    //添加企业信息
    server.post({
        path: '/api/biz',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), biz.addBiz);
    //提交企业认证审核
    server.post({
        path: '/api/bizVerify',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), biz.addBizVerify);
    //更新企业信息
    server.put({
        path: '/api/biz/:bizId',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), biz.updateBiz);
    //更新认证信息
    server.put({
        path: '/api/bizVerify/:bizVerifyId',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), biz.updateBizVerify);
    //更新企业信息状态
    server.put({
        path: '/api/biz/:bizId/status/:status',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), biz.updateBizStatus);
    //更新企业审核状态
    server.put({
        path: '/api/bizVerify/:bizVerifyId/status/:status',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), biz.updateBizVerifyStatus);
    //添加审核历史信息
    server.post({
        path: '/api/verifyHistory',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), verifyHistory.addVerifyHistory);
    //获取审核历史信息
    server.get('/api/verifyHistory', roleBase.checkUserToken([]), verifyHistory.getVerifyHistory);

    ///////////////////////////////////////////////////DRIVER MODULE////////////////////////////////////////////////////
    //司机登录
    server.post({
        path: '/api/driver/login',
        contentType: 'application/json'
    }, userInfo.userLogin);
    //获取司机信息
    server.get('/api/driver', roleBase.checkUserToken([]), driver.getDriver);
    //添加司机
    server.post({
        path: '/api/driver',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), driver.addDriver);
    //司机注册
    server.post({
        path: '/api/driverUser',
        contentType: 'application/json'
    }, driver.driverRegister);
    //手机端司机注册
    server.post({path: '/api/mobileDriver', contentType: 'application/json'}, driver.mobileDriverRegister);
    //更新司机信息
    server.put({
        path: '/api/driver/:driverId',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), driver.updateDriver);
    //更新司机状态
    server.put({
        path: '/api/driver/:driverId/biz/:bizId',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), driver.updateDriverTeam);
    //更新司机状态
    server.put({
        path: '/api/driver/:driverId/status/:status',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), driver.updateDriverStatus);
    //启停用司机
    server.put({
        path: '/api/driver/:driverId/active/:active',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), driver.updateDriverActive);
    //获取企业司机数量
    server.get('/api/driver/:bizId/count', roleBase.checkUserToken([]), driver.getDriverCountByBiz);
    //获取司机数量
    server.get('/api/driverVerify/count', roleBase.checkUserToken([]), driver.getDriverCount);
    //获取车辆信息
    server.get('/api/truck', roleBase.checkUserToken([]), truck.getTruck);
    //获取车辆数量
    server.get('/api/truck/count', roleBase.checkUserToken([]), truck.getTruckCount);
    //获取活跃运力数量
    server.get('/api/activeTruck/count', roleBase.checkUserToken([]), truck.getActiveTruckCount);
    //获取活跃运力车辆信息
    server.get('/api/activeTruck', roleBase.checkUserToken([]), truck.getActiveTruck);
    //添加车辆信息
    server.post({
        path: '/api/truck',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), truck.addTruck);
    //更新车辆信息
    server.put({
        path: '/api/truck/:truckId',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), truck.updateTruck);
    //更新车辆状态
    server.put({
        path: '/api/truck/:truckId/status/:status',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), truck.updateTruckStatus);
    //启停用车辆
    server.put({
        path: '/api/truck/:truckId/active/:active',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), truck.updateTruckActive);
    //新增app版本信息
    server.post({
        path: '/api/appVersion',
        contentType: 'application/json'
    }, appVersion.createAppVersion);
    //获取app版本信息
    server.get('/api/appVersion', appVersion.getAppVersion);
    //新增用户设备信息
    server.post({
        path: '/api/userDevice',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), userDevice.createUserDevice);
    //获取用户设备信息
    server.get('/api/userDevice', userDevice.getUserDevice);
    //删除用户设备信息
    server.del('/api/userDevice/:userId/deviceToken/:deviceToken', roleBase.checkUserToken([]), userDevice.deleteUserDevice);
    //生成车队合同PDF
    server.get('/api/contract/truck/:bizId', contract.generateTruckPdf);
    //生成货代合同PDF
    server.get('/api/contract/agent/:bizId', contract.generateAgentPdf);
    //生成结算协议
    server.get('/api/contract/credit/:bizId', contract.generateCreditPdf);
    //注册合同PDF
    server.get('/api/contract/register/:phone', contract.generateSignUpPdf);
    //初始化注册合同
    // server.get('/api/initRegister', contract.initRegisterContract);
    //初始化实名认证合同
    // server.get('/api/initContract', contract.initBizContract);
    //新增核心车队参数
    server.post({
        path: '/api/coreBizParam',
        contentType: 'application/json'
    }, coreBizConfig.createCoreBizParam);
    //获取核心车队参数
    server.get('/api/coreBizParam', coreBizConfig.getCoreBizParam);
    //更新核心车队参数
    server.put({
        path: '/api/coreBizParam/:paramId',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), coreBizConfig.updateCoreBizParam);
    //删除核心车队参数
    server.del('/api/coreBizParam/:paramId', roleBase.checkUserToken([]), coreBizConfig.deleteCoreBizParam);
    //新增（某条线路的）核心车队
    server.post({
        path: '/api/coreBiz',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), coreBiz.createCoreBiz);
    //获取核心车队信息
    server.get('/api/coreBiz', roleBase.checkUserToken([]), coreBiz.getCoreBiz);
    //获取核心车队记录数量
    server.get('/api/coreBizCount', roleBase.checkUserToken([]), coreBiz.getCoreBizCount);
    //更新核心车队信息
    server.put({
        path: '/api/coreBiz/:bizIds',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), coreBiz.updateCoreBiz);
    //更新核心车队评分
    server.put({
        path: '/api/coreGrade',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), coreBiz.updateBizGrade);
    //更新核心车队优先级
    server.put({
        path: '/api/corePriority',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), coreBiz.updateBizPriority);
    //将更新评分与排名的请求push in mq
    server.post({
        path: '/api/mqGrade',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), coreBiz.pushUpdateMsg);
    //锁定核心车队
    server.put({
        path: '/api/coreBiz/prime/:coreBizId',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), coreBiz.lockPrimeBiz);
    //锁定次核心车队
    server.put({
        path: '/api/coreBiz/minor/:coreBizId',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), coreBiz.lockMinorBiz);
    //解锁核心车队
    server.put({
        path: '/api/coreBiz/unlock/:coreBizId',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), coreBiz.unlockCoreBiz);
    //获取订阅城市
    server.get('/api/coreCity', roleBase.checkUserToken([]), coreBiz.getSubscribedCities);
    //获取订阅城市的省份
    server.get('/api/coreState', roleBase.checkUserToken([]), coreBiz.getSubscribedProvince);
    //获取订阅线路的港口
    server.get('/api/corePort', roleBase.checkUserToken([]), coreBiz.getCorePorts);
    //获取订阅线路
    server.get('/api/coreRoutes', roleBase.checkUserToken([]), coreBiz.getCoreRoutes);

    server.get('/api/statePorts', roleBase.checkUserToken([]), coreBiz.getStateAndPorts);

    server.get('/api/cityPorts', roleBase.checkUserToken([]), coreBiz.getCityAndPorts);//wrong English name 实际查询省和市

    server.get('/api/distinctBiz', roleBase.checkUserToken([]), coreBiz.getDistinctCoreBiz);
    server.get('/api/generalBiz', roleBase.checkUserToken([]), coreBiz.getDistinctBiz);
    server.get('/api/routeParams', roleBase.checkUserToken([]), coreBiz.getRouteParams);

    server.put({
        path: '/api/routeParams',
        contentType: 'application/json'
    }, roleBase.checkUserToken([]), coreBiz.updateRouteParams);

    server.get('/api/bonusPoint', bonusPoint.getBonusPoint);

    server.get('/api/bonusPointConfig', bonusPoint.getBonusConfig);

    server.get('/api/bonusPointHistory', bonusPoint.getBonusPointHistory);

    server.get('/api/bonusPoint/count', bonusPoint.getBonusPointCount);

    server.get('/api/bonusPointHistory/count', bonusPoint.getBonusPointHistoryCount);

    server.put({
        path: '/api/bonusPointConfig',
        contentType: 'application/json'
    }, bonusPoint.updateBonusConfig);

    server.put({
        path: '/api/bonusPoint/:bonusType/user/:userNo',
        contentType: 'application/json'
    }, bonusPoint.changeBonusPointByConfig);

    server.put({
        path: '/api/bonusPoint',
        contentType: 'application/json'
    }, bonusPoint.updateBonusPoint);

    server.put({
        path: '/api/bonusPointHistory/status',
        contentType: 'application/json'
    }, bonusPoint.updateBonusPointHistoryStatus);

    server.get('/api/downloadApp', appVersion.appDownload);

    server.on('NotFound', function (req, res, next) {
        res.send(404);
        next();
    });
    return (server);
}

module.exports = {
    createServer: createServer
};