"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var body_parser_1 = __importDefault(require("body-parser"));
var criminalcases_1 = __importDefault(require("./routes/criminalcases"));
mongoose_1.default.connect('mongodb+srv://elethuillier:6PCPBuIfOfCVng3c@learningcluster.csr6l.mongodb.net/nycpdb?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(function () { return console.log('Connexion à MongoDB réussie'); })
    .catch(function () { return console.log('Connexion à MongoDB échouée'); });
var app = express_1.default();
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use(body_parser_1.default.json());
app.use('/api/criminalcases', criminalcases_1.default);
exports.default = app;
