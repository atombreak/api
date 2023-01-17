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
const Category_1 = __importDefault(require("../../models/Category"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield Category_1.default.find();
        if (!category)
            return res
                .status(http_status_codes_1.default.BAD_REQUEST)
                .json({ msg: "categories not found" });
        res.status(http_status_codes_1.default.OK).json(category);
    }
    catch (err) {
        console.error(err.message);
        if (err) {
            return res.send({
                status: http_status_codes_1.default.BAD_REQUEST,
                message: "Error getting category",
            });
        }
        res.send({
            status: http_status_codes_1.default.INTERNAL_SERVER_ERROR,
            message: "Server Error",
        });
    }
}));
// @route   POST api/user 
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post("/", [
    (0, express_validator_1.check)("name", "Please provide the name").isString(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res
            .status(http_status_codes_1.default.BAD_REQUEST)
            .json({ errors: errors.array() });
    }
    const { name } = req.body;
    try {
        // Build user object based on TUser
        const categoryFields = {
            name: name.toLocaleLowerCase(),
        };
        let category = new Category_1.default(categoryFields);
        yield category.save();
        if (!category) {
            res.send({ status: http_status_codes_1.default.EXPECTATION_FAILED, msg: "Could not save category" });
        }
        else {
            res.status(http_status_codes_1.default.OK).send(category);
        }
    }
    catch (err) {
        console.error(err.message);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
exports.default = router;
//# sourceMappingURL=category.js.map