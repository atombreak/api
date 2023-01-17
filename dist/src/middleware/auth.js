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
const config_1 = __importDefault(require("config"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
function default_1(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get token from header
        const token = req.header("x-auth-token");
        console.log(token);
        // Check if no token
        if (!token) {
            return res.json({ status: http_status_codes_1.default.UNAUTHORIZED, msg: "No token, authorization denied" });
        }
        // Verify token
        try {
            jsonwebtoken_1.default.verify(token, config_1.default.get("jwtSecret"), (err, data) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log('Error', err.message);
                    return res.json({ status: http_status_codes_1.default.NOT_FOUND, msg: "Could not verify token" });
                }
                if (data) {
                    //const payload: Payload | any = jwt.verify(token, config.get("jwtSecret"));
                    req.userId = data.userId;
                    const user = yield User_1.default.findOne({
                        _id: req.userId,
                    });
                    if (!user) {
                        return res
                            .status(http_status_codes_1.default.NOT_FOUND)
                            .json({ msg: "User was not found in the database" });
                    }
                    console.log('data fetched', data.userId);
                    next();
                }
            }));
        }
        catch (err) {
            res
                .json({ status: http_status_codes_1.default.UNAUTHORIZED, msg: "Token is not valid" });
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=auth.js.map