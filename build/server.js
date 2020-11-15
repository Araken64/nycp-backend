"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* globals NodeJS */
var http = __importStar(require("http"));
var app_1 = __importDefault(require("./app"));
var port = process.env.PORT || 3000;
app_1.default.set('port', port);
var server = http.createServer(app_1.default);
console.log(process.env.NODE_ENV);
var errorHandler = function (error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var address = server.address();
    var bind = typeof address === 'string' ? "pipe " + address : "port: " + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + " requires elevated privileges.");
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + " is already in use.");
            process.exit(1);
            break;
        default:
            throw error;
    }
};
server.on('error', errorHandler);
server.on('listening', function () {
    var address = server.address();
    var bind = typeof address === 'string' ? "pipe " + address : "port: " + port;
    console.log("Listening on " + bind);
});
server.listen(port);
