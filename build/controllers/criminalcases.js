"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCriminalCases = exports.createCriminalCase = void 0;
var CriminalCase_1 = __importDefault(require("../models/CriminalCase"));
exports.createCriminalCase = function (req, res) {
    var criminalCase = new CriminalCase_1.default(__assign({}, req.body));
    criminalCase.save()
        .then(function () { return res.status(201).json({ message: 'Object saved !' }); })
        .catch(function (error) { return res.status(400).json({ error: error }); });
};
exports.getAllCriminalCases = function () {
};
