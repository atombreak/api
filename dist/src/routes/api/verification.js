"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const Verification_1 = __importDefault(require("../../models/Verification"));
const router = (0, express_1.Router)();
router.post("/", [
    (0, express_validator_1.check)("imgURL", "Please provide the image URL ").isString(),
], auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res
            .status(http_status_codes_1.default.BAD_REQUEST)
            .json({ errors: errors.array() });
    }
    const { imgURL } = req.body;
    try {
        // Build user object based on TUser
        const VerificationFields = {
            userId: req.userId,
            imgURL: imgURL,
        };
        let verification = new Verification_1.default(VerificationFields);
        yield verification.save();
        if (!verification) {
            res.send({ msg: "Could not save category", status: http_status_codes_1.default.EXPECTATION_FAILED });
        }
        else {
            res.send({ verification: verification, status: http_status_codes_1.default.OK });
        }
    }
    catch (err) {
        console.error(err.message);
        res.send({ status: http_status_codes_1.default.INTERNAL_SERVER_ERROR, msg: "Server Error" });
    }
}));
exports.default = router;
//# sourceMappingURL=verification.js.map