var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server;
var serverLogger = require('../util/ServerLogger.js');
var sysConfig = require('../config/SystemConfig.js');
var logger = serverLogger.createLogger('MongoCon.js');

var db = null;
MongoClient.connect(sysConfig.mongoOptions.connect, function (err, dbInstance) {
    if (err) {
        logger.error(' connect Mongodb failed ' + err.message);
    } else {
        db = dbInstance;
    }
});
var mongoose = require('mongoose');

mongoose.connect(sysConfig.mongoOptions.connect);

var getDb = function (callback) {
    // Open the connection to the server
    if (db == null) {
        logger.info(' getDb ' + 'attempt to create mongodb connection ');
        MongoClient.connect(sysConfig.mongoOptions.connect, function (err, dbInstance) {
            if (err) {
                logger.error(' connect Mongodb failed ' + err.message);
                return callback(err, null);
            } else {
                return callback(null, dbInstance);
            }

        });
    } else {
        callback(null, db);
    }

};

function getMongo() {

    return mongoose;
}

module.exports = {
    getDb: getDb,
    getMongo: getMongo
};

