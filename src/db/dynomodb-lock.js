"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AWS = require("aws-sdk");
var Dynamodb = /** @class */ (function () {
    function Dynamodb(clientConnection, url) {
        this.TABLE_NAME = process.env.LOCK_TABLE?process.env.LOCK_TABLE:"DynamoDB-Lock";
        this.client = clientConnection;
        this.url = url;
    }
    Dynamodb.prototype.isLock = function (Lockname) {
        var _this = this;
        // console.log(this.url);
        return new Promise(function (resolve, reject) {
            try {
                _this.client.get({
                    Key: {
                        "LockName": Lockname
                    },
                    TableName: _this.TABLE_NAME
                }, function (err, data) {
                    if (err) {
                        // console.log(err.err.stack);
                        reject(err);
                    }
                    else {
                        if (!data.Item) {
                            resolve(false);
                        }
                        else {
                            resolve(true);
                        }
                    }
                });
            }
            catch (e) {
                // console.log(e + " error in the exception ");
                reject(e);
            }
        });
    };
    Dynamodb.prototype.isTable = function (tableName) {
        var dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10', endpoint: this.url, });
        return new Promise(function (resolve, reject) {
            var status = false;
            var params = {
                TableName: tableName
            };
            dynamodb.describeTable(params, function (err, data) {
                if (err) {
                    if (err.code == 'ResourceNotFoundException') {
                        // console.log(false + " table not found");
                        status = false;
                        resolve(status);
                    }
                    else {
                        reject(err);
                    }
                } // an error occurred
                else {
                    if (data.Table.TableStatus == 'ACTIVE')
                        // console.log(true + " table found");
                    status = true;
                    resolve(status);
                }
            });
        });
    };
    Dynamodb.prototype.createTable = function (tableName) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var db = new AWS.DynamoDB({ apiVersion: '2012-08-10', endpoint: _this.url, });
            var table = tableName;
            var status = false;
            var params = {
                AttributeDefinitions: [
                    {
                        AttributeName: "LockName",
                        AttributeType: "S"
                    }
                ],
                KeySchema: [
                    {
                        AttributeName: "LockName",
                        KeyType: "HASH"
                    }
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                },
                TableName: _this.TABLE_NAME
            };
            db.createTable(params, function (err, data) {
                if (err) {
                    // console.log("table create fail");
                    // console.log(err, err.stack);
                    reject(err);
                } // an error occurred
                else {
                    // console.log("table create success");
                    var params_1 = {
                        TableName: table,
                        TimeToLiveSpecification: {
                            AttributeName: 'ttl',
                            // AttributeType:"N",/* required */
                            Enabled: true /* required */
                        }
                    };
                    db.updateTimeToLive(params_1, function (err, data) {
                        if (err){
                            // console.log(err, err.stack); // an error occurred
                          
                        }
                        else {
                            if (data.TimeToLiveSpecification.Enabled) {
                                status = data.TimeToLiveSpecification.Enabled;
                            }
                            else {
                                status = data.TimeToLiveSpecification.Enabled;
                            }
                        } // successful response
                    });
                } // successful response
            });
            resolve(status);
        });
    };
    Dynamodb.prototype.aquire_lock = function (lockname, lockExpireTime, operationId) {
        var _this = this;
        // console.log(this.dynamodb)
        var client = this.client;
        return new Promise(function (resolve, reject) {
            _this.isTable(_this.TABLE_NAME)
                .then(function (status) {
                // console.log("status" + status);
                if (!status) {
                    return _this.createTable(_this.TABLE_NAME).finally;
                }
                else {
                    return true;
                }
            })
                .then(function (res) {
                // console.log(client);
                if (res) {
                    // console.log(res);
                    var setlock_1 = function () {
                        _this.isLock(lockname)
                            .then(function (res) {
                            // console.log("islock " + res + Date.now() + " operation" + operationId);
                            try {
                                if (!res) {
                                    client.put({
                                        Item: {
                                            LockName: lockname,
                                            operationId: operationId,
                                            ttl: lockExpireTime,
                                        },
                                        TableName: _this.TABLE_NAME,
                                        ConditionExpression: 'attribute_not_exists(LockName)'
                                    }, function (err, data) {
                                        if (err) {
                                            // console.log(err);
                                            // reject(err);
                                        }
                                        else {
                                            // console.log("locked successd " + operationId+ " on "+ _this.TABLE_NAME);
                                            clearInterval(check_1);
                                            resolve(true);
                                        }
                                    });
                                }
                            }
                            catch (e) {
                                reject(e);
                            }
                        })
                            .catch(function (e) {
                            reject(e);
                        });
                    };
                    var check_1 = setInterval(function () { return setlock_1(); }, 3000);
                }
            })
                .catch(function (e) {
                reject(e);
            });
        });
    };
    Dynamodb.prototype.release_lock = function (lockname) {
        try {
            this.client.delete({
                Key: {
                    LockName: lockname,
                },
                TableName: this.TABLE_NAME
            }, function (err, data) {
                if (err){
                   return false;
                }
                else {
                    return true;
                    // console.log("delete success");
                    // console.log(data);
                }
            });
        }
        catch (e) {
        }
    };
    return Dynamodb;
}());
exports.Dynamodb = Dynamodb;
