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
const Comment_1 = __importDefault(require("../../models/Comment"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = (0, express_1.Router)();
router.get("/:userId", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield Comment_1.default.find({ userId: req.params.userId });
        if (!comment)
            return res
                .status(http_status_codes_1.default.BAD_REQUEST)
                .json({ msg: "Comments not found" });
        res.status(http_status_codes_1.default.OK).json(comment);
    }
    catch (err) {
        console.error(err.message);
        if (err) {
            return res
                .status(http_status_codes_1.default.BAD_REQUEST)
                .json({ msg: "Comments not found" });
        }
        res.send({ status: http_status_codes_1.default.INTERNAL_SERVER_ERROR, msg: "Server Error" });
    }
}));
// @route   POST api/user 
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post("/", [
    (0, express_validator_1.check)("description", "Please provide description").isString(),
    (0, express_validator_1.check)("userId", "Please user id").isString(),
    (0, express_validator_1.check)("commenter", "Please commenter id").isString(),
    (0, express_validator_1.check)("rating", "Please rate the user").isNumeric(),
], auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res
            .status(http_status_codes_1.default.BAD_REQUEST)
            .json({ errors: errors.array() });
    }
    const { description, rating, userId, commenter } = req.body;
    try {
        // Build user object based on TUser
        const commentFields = {
            description,
            rating,
            userId,
            commenter
        };
        let comment = new Comment_1.default(commentFields);
        yield comment.save();
        if (!comment) {
            res.status(http_status_codes_1.default.EXPECTATION_FAILED).send("Could not save comment");
        }
        else {
            res.status(http_status_codes_1.default.OK).send(comment);
        }
    }
    catch (err) {
        console.error(err.message);
        res.send({ status: http_status_codes_1.default.INTERNAL_SERVER_ERROR, msg: "Server Error" });
    }
}));
exports.default = router;
//# sourceMappingURL=comment.js.map