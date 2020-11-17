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
var Mongoose = __importStar(require("mongoose"));
var CriminalCase_1 = __importDefault(require("./CriminalCase"));
var prisonerSchema = new Mongoose.Schema({
    prisonFileNumber: {
        type: String, maxlength: 10, index: true, unique: true,
    },
    givenName: { type: String, maxlength: 30 },
    surname: { type: String, maxlength: 30 },
    dateOfBirth: { type: Date, max: Date.now() },
    placeOfBirth: { type: String, maxlength: 30 },
    dateOfIncaceration: { type: Date },
    motiveLabel: { type: String, maxlength: 50, required: true },
    juridictionName: { type: String, maxlength: 30, required: true },
    criminalCase: { type: [CriminalCase_1.default], required: true },
    decision: {
        type: [
            {
                type: { type: String, maxlength: 1, required: true },
                dateOfDecision: { type: Date },
                duration: { type: Number },
                dateOfFinalDischarge: { type: Date },
            },
        ],
    },
});
exports.default = Mongoose.model('Prisoner', prisonerSchema);
