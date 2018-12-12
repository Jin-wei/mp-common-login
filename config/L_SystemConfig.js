
var mysqlConnectOptions ={
    user: '@@mysqlUser',
    password: '@@mysqlPass',
    database:'@@mysqlDB',
    host: '@@mysqlHost' ,
    charset : 'utf8mb4'
    //,dateStrings : 'DATETIME'
};

var loggerConfig = {
    level : '@@logLevel',
    config : {
        appenders: [
            { type: 'console' },
            {
                "type": "file",
                "filename": "@@logFileFullName",
                "maxLogSize": @@logMaxSize,
                "backups": @@logBackups
            }
        ]
    }
}
function getMysqlConnectOptions (){
    return mysqlConnectOptions;
}

var mongoOptions = {
    connect: 'mongodb://123.57.11.150:27017/sinotrans-cms'
};

var MessageQueueHost = {
    host: "@@mqHost",
    port:@@mqPort
}

var redisConfig = {
    url : "@@redisUrl"
}

var loginModule ={
    host:"@@loginHost",
    port:@@loginPort
}
var NotificationHost = {
    host: "@@notifyHost",
    port: 8096
};
var openamOptions = {
    host: 'openam.yipincaidan.com',
    port : 80,
    path: '/openam' ,
    adminUsername : 'amadmin',
    adminPassword : 'mission2016',
    adminToken : 'AQIC5wM2LY4SfczKd3VMUTmFUMU93lmW9e1mElurLFPDYO8.*AAJTSQACMDEAAlNLABM0NzEyNTg2Njc1NTQyNDY0NjE3AAJTMQAA*' ,
    client_id :' MyApp',
    client_secret :'password',
    application_name : 'sinotrans-api'
}
var coreHost = {
    host: '127.0.0.1',
    port: 8094
};
var sinotransHost = {
    host: 'www.sd.sinotrans.com',
    port: 80
};
var cmsHost = {
    host: "127.0.0.1",
    port: 8097
};
var doBookingUrl = '/cywebservice/cywebservice.asmx/CntrBookingSuccess';
var cancelBookingUrl = '/cywebservice/cywebservice.asmx/CntrBookingCancel';
var containerCountUrl = '/CYWebService/CYWebService.asmx/CntrCountInYard';
var containerDetailUrl = '/cywebservice/cywebservice.asmx/CntrDetailInYard';
var containerDetailByCustomerUrl = '/cywebservice/cywebservice.asmx/CntrDetailInYardByCustomer';
var taobaoIpUtil = {
    host: 'ip.taobao.com',
    port: 80,
    url: '/service/getIpInfo2.php'
};
var appUrl = 'http://www.xiangml.com/download/xiangml_pro.apk';
var stiHost = {
    host: '123.56.234.68',
    port: 8299
};
module.exports = {
    getMysqlConnectOptions : getMysqlConnectOptions,
    loggerConfig : loggerConfig,
    MessageQueueHost :MessageQueueHost ,
    redisConfig : redisConfig ,
    openamOptions : openamOptions,
    loginModule : loginModule ,
    NotificationHost : NotificationHost,
    coreHost: coreHost,
    sinotransHost: sinotransHost,
    mongoOptions: mongoOptions,
    cmsHost:cmsHost,
    doBookingUrl: doBookingUrl,
    cancelBookingUrl: cancelBookingUrl,
    containerCountUrl: containerCountUrl,
    containerDetailUrl: containerDetailUrl,
    containerDetailByCustomerUrl: containerDetailByCustomerUrl,
    taobaoIpUtil:taobaoIpUtil,
    appUrl: appUrl,
    stiHost:stiHost
}
