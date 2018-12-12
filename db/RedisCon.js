/**
 * Created by xueling on 16/4/27.
 */
var sysConfig = require('../config/SystemConfig.js');
var redis = require("redis"),
    redisClient = redis.createClient(sysConfig.redisConfig.url);

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

redisClient.on("error", function (err) {
    console.log("Error " + err);
});

module.exports = redisClient;