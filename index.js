"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redis = require("redis");
var AWS = require("aws-sdk");
var redis_lock_1 = require("./src/db/redis-lock");
var dynomodb_lock_1 = require("./src/db/dynomodb-lock");
var connection_1 = require("./src/cache/connection");
var connection;
function init(url, db) {
    return new Promise(function (resolve, reject) {
        if (db == "redis") {
            var previous_connection_1;
            connection_1.AppCache.getConnection().then(function (res) {
                previous_connection_1 = res;
                connection = res;
                if (previous_connection_1) {
                    try {
                        previous_connection_1.client('id', function (err, res) {
                            // console.log("previous connection live success of id " + res);
                            var lock_initial = new redis_lock_1.Redis(previous_connection_1);
                            resolve(lock_initial);
                        });
                    }
                    catch (e) {
                        // console.log("previous connection failed reason" + e);
                        var conn = redis.createClient(url);
                        connection = conn;
                        conn.on('error', function (res) {
                            // console.log("error");
                        });
                        connection_1.AppCache.setConnection(conn);
                        var lock_initial = new redis_lock_1.Redis(conn);
                        resolve(lock_initial);
                    }
                }
                else {
                    var conn = redis.createClient(url);
                    // console.log("new connection success");
                    conn.on('error', function (res) {
                        // console.log("error");
                    });
                    conn.client('id', function (err, res) {
                        // console.log("new connection live success of id " + res);
                    });
                    connection_1.AppCache.setConnection(conn);
                    var lock_initial = new redis_lock_1.Redis(conn);
                    resolve(lock_initial);
                }
            }).catch(function (e) { console.log(e); });
        }
        else if (db == "dynamodb") {
            var previous_connection_2;
            connection_1.AppCache.getConnection().then(function (res) {
                previous_connection_2 = res;
                connection = res;
                if (previous_connection_2) {
                    // console.log("old connection live success  ");
                    try {
                        AWS.config.update({ region: "us-east-1" });
                        resolve(new dynomodb_lock_1.Dynamodb(previous_connection_2, url));
                    }
                    catch (e) {
                        AWS.config.update({ region: "us-east-1" });
                        var dynamodbClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', endpoint: url, });
                        connection_1.AppCache.setConnection(dynamodbClient);
                        resolve(new dynomodb_lock_1.Dynamodb(dynamodbClient, url));
                    }
                }
                else {
                    AWS.config.update({ region: "us-east-1" });
                    var dynamodbClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', endpoint: url, });
                    connection_1.AppCache.setConnection(dynamodbClient);
                    resolve(new dynomodb_lock_1.Dynamodb(dynamodbClient, url));
                }
            }).catch(function (e) { console.log(e); });
        }
        else {
            reject("Database unknow");
        }
    });
}
exports.init = init;
