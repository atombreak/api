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
const User_1 = __importDefault(require("../../models/User"));
const Product_1 = __importDefault(require("../../models/Product"));
const Comment_1 = __importDefault(require("../../models/Comment"));
const router = (0, express_1.Router)();
// @route   GET api/profile/user/:userId
// @desc    Get profile by userId
// @access  Private
router.get("/:id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        //console.log(id)
        const sellerProducts = yield Product_1.default.find({ userId: id });
        const sellerComments = yield Comment_1.default.find({ userId: id });
        console.log(sellerProducts);
        const user = yield User_1.default.findOne({
            _id: id,
        });
        //console.log(req.userId)
        //console.log('user response::', user)
        if (!user)
            return res
                .json({ status: http_status_codes_1.default.BAD_REQUEST, msg: "User not found" });
        res.send({ status: http_status_codes_1.default.OK, user: user, products: sellerProducts, comments: sellerComments });
    }
    catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res
                .json({ status: http_status_codes_1.default.BAD_REQUEST, msg: "User not found" });
        }
        res.send({ status: http_status_codes_1.default.INTERNAL_SERVER_ERROR, msg: "Server Error" });
    }
}));
// @route   GET api/profile/user/:userId
// @desc    Get profile by userId
// @access  Private
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productsLength = yield Product_1.default.find({ userId: req.userId }).countDocuments();
        const user = yield User_1.default.findOne({
            _id: req.userId,
        });
        //console.log(req.userId)
        if (!user)
            return res
                .json({ status: http_status_codes_1.default.BAD_REQUEST, msg: "User not found" });
        res.send({ status: http_status_codes_1.default.OK, user: user, products: productsLength });
    }
    catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res
                .json({ status: http_status_codes_1.default.BAD_REQUEST, msg: "User not found" });
        }
        res.send({ status: http_status_codes_1.default.INTERNAL_SERVER_ERROR, msg: "Server Error" });
    }
}));
// @route   DELETE api/profile
// @desc    Delete profile and user
// @access  Private
router.put("/", auth_1.default, [
    (0, express_validator_1.check)("email", "Please include a valid email").isEmail(),
    (0, express_validator_1.check)("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res
            .status(http_status_codes_1.default.BAD_REQUEST)
            .json({ errors: errors.array() });
    }
    const { email, password, photo } = req.body;
    try {
        // Remove user
        yield User_1.default.findOneAndUpdate({ _id: req.userId }, { email, password, photo });
        res.json({ msg: "User Updated" });
    }
    catch (err) {
        console.error(err.message);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
router.delete("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Remove user
        yield User_1.default.findOneAndRemove({ _id: req.userId });
        res.json({ msg: "User removed" });
    }
    catch (err) {
        res.send({ status: http_status_codes_1.default.INTERNAL_SERVER_ERROR, msg: "Server Error" });
    }
}));
exports.default = router;
//# sourceMappingURL=profile.js.map