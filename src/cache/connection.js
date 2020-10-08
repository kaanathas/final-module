"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppCache = /** @class */ (function () {
    function AppCache() {
    }
    AppCache.prototype.Cache = function () {
    };
    AppCache.getConnection = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.connection != null) {
                // console.log("get cache  "+ this.connection)
                resolve(_this.connection);
            }
            else {
                resolve(null);
            }
        });
    };
    AppCache.setConnection = function (connection) {
        this.connection = connection;
    };
    AppCache.connection = null;
    return AppCache;
}());
exports.AppCache = AppCache;
