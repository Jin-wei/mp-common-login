/**
 * Created by Szane on 16/11/9.
 */
var fs = require('fs');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('FileDAO.js');
var mongoose = require('../db/MongoCon.js').getMongo();
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var conn = mongoose.connection;
var gfs = null;
conn.once('open', function () {
    gfs = Grid(conn.db);
    //console.log(gfs);
    // all set!
});
function createFile(file, metaData, callback) {
    var writeOptions = {
        filename: file.name,
        content_type: file.type
    };
    if (metaData != null && metaData != {}) {
        writeOptions.metadata = metaData;
    }
    var writestream = gfs.createWriteStream(writeOptions);
    var errorFlag = false;
    var readStream = fs.createReadStream(file.path);
    readStream.pipe(writestream);
    readStream.on('error', function (err) {
        errorFlag = true;
        logger.debug('createFile error');
        callback(err, null);
    });
    readStream.on('close', function (error) {
        logger.debug('createFile read stream close');
        if (!errorFlag) fs.unlink(file.path);
    });
    writestream.on('close', function (file) {
        logger.debug('createFile write stream close');
        callback(null, file);
    });
}
function createFileByStream(file, callback) {
    var writeOptions = {
        filename: file.name,
        content_type: 'application/pdf'
    };
    writeOptions.metadata = {};
    writeOptions.aliases = '';
    var writestream = gfs.createWriteStream(writeOptions);
    var readStream = file.stream;
    var errorFlag = false;
    readStream.pipe(writestream);
    readStream.on('error', function (err) {
        errorFlag = true;
        logger.debug('createFile error');
        callback(err, null);
    });
    readStream.on('close', function (error) {
        logger.debug('createFile read stream close');
        // if (!errorFlag) fs.unlink(file.path);
    });
    writestream.on('close', function (file) {
        logger.debug('createFile write stream close');
        callback(null, file);
    });
}

module.exports = {
    createFile: createFile,
    createFileByStream: createFileByStream
};
