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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("config"));
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const gravatar_1 = __importDefault(require("gravatar"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../models/User"));
const router = (0, express_1.Router)();
// @route   POST api/user
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post("/", [
    (0, express_validator_1.check)("email", "Please include a valid email").isEmail(),
    (0, express_validator_1.check)("phone_number", "Please provide your phone number").exists(),
    (0, express_validator_1.check)("school", "Please select your school").exists(),
    (0, express_validator_1.check)("studentId", "Must enter student ID").exists(),
    (0, express_validator_1.check)("isStudent", "Please specify if user is a student").isBoolean(),
    (0, express_validator_1.check)("first_name", "First name is required").exists(),
    (0, express_validator_1.check)("last_name", "Last name is required").exists(),
    (0, express_validator_1.check)("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res
            .status(http_status_codes_1.default.BAD_REQUEST)
            .json({ errors: errors.array() });
    }
    console.log('I have reached the here');
    console.log(req.body);
    const { email, password, phone_number, school, studentId, isStudent, first_name, last_name } = req.body;
    try {
        let user = yield User_1.default.findOne({ email });
        if (user) {
            return res.json({
                errors: {
                    msg: "User already exists",
                    status: http_status_codes_1.default.CONFLICT
                },
            });
        }
        const options = {
            s: "200",
            r: "pg",
            d: "mm",
        };
        const photo = gravatar_1.default.url(email, options);
        const avatar = `https://avatars.dicebear.com/api/adventurer/${first_name}${last_name}.svg`;
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashed = yield bcryptjs_1.default.hash(password, salt);
        // Build user object based on TUser
        const userFields = {
            email,
            password: hashed,
            photo: "",
            phone_number,
            isStudent,
            last_name,
            first_name,
            school: school || " ",
            studentId: studentId || " ",
            subscribed: false,
            verified: isStudent ? !isStudent : !isStudent,
        };
        user = new User_1.default(userFields);
        yield user.save();
        const payload = {
            userId: user.id,
        };
        jsonwebtoken_1.default.sign(payload, config_1.default.get("jwtSecret"), { expiresIn: config_1.default.get("jwtExpiration") }, (err, token) => {
            if (err)
                throw err;
            res.json({ token });
        });
    }
    catch (err) {
        console.error(err.message);
        res.send({
            status: http_status_codes_1.default.INTERNAL_SERVER_ERROR,
            message: "Server Error",
        });
    }
}));
exports.default = router;
//# sourceMappingURL=user.js.map