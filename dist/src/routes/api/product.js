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
const Product_1 = __importDefault(require("../../models/Product"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const User_1 = __importDefault(require("../../models/User"));
const router = (0, express_1.Router)();
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit, category, filter } = req.query;
        const pageCount = parseInt(page) || 1;
        const limitParsed = (parseInt(limit) || 50) * 1;
        const skipCount = (pageCount - 1) * limitParsed;
        const categoryParsed = (category || "");
        const filterParsed = (filter || "");
        console.log(req.userId);
        const products = yield Product_1.default.find({ "$or": [
                { "name": { $regex: `${filterParsed.split("%").join(" ")}`, $options: "i" } },
                { "description": { $regex: `${filterParsed.split("%").join(" ")}`, $options: "i" } },
                { "location": { $regex: `${filterParsed.split("%").join(" ")}`, $options: "i" } },
                { "price": { $regex: `${filterParsed.split("%").join(" ")}`, $options: "i" } },
            ] })
            .where({ category: { $regex: categoryParsed, $options: "i" } })
            .limit(limitParsed)
            .sort({ createdAt: -1 })
            .skip(skipCount);
        console.log("products::", products.length);
        if (!products)
            return res.json({ status: http_status_codes_1.default.BAD_REQUEST, msg: "products not found" });
        console.log("I can reach here");
        res.json({ products: products, status: http_status_codes_1.default.OK });
    }
    catch (err) {
        console.error(err.message);
        if (err) {
            return res.json({ status: http_status_codes_1.default.BAD_REQUEST, msg: "products not found" });
            ;
        }
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
router.get("/mine", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find({ userId: req.userId });
        if (!products)
            return res.json({ status: http_status_codes_1.default.BAD_REQUEST, msg: "products not found" });
        res.json({ status: http_status_codes_1.default.OK, products: products });
    }
    catch (err) {
        console.error(err.message);
        if (err) {
            return res.json({ status: http_status_codes_1.default.BAD_REQUEST, msg: "products not found" });
        }
        res.send({ msg: "Server Error", status: http_status_codes_1.default.INTERNAL_SERVER_ERROR });
    }
}));
router.delete("/:productId", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Remove user
        const user = yield User_1.default.findOne({
            _id: req.userId,
        });
        const product = yield Product_1.default.findOne({ _id: req.params.productId });
        if (Boolean(product) && user.id === product.userId) {
            yield Product_1.default.findOneAndRemove({ _id: req.params.productId });
            return res.json({
                status: http_status_codes_1.default.OK,
                msg: "1 Product was successfully removed from your store."
            });
        }
        else {
            return res.json({
                status: http_status_codes_1.default.FORBIDDEN,
                msg: "Could not delete product from the store."
            });
        }
    }
    catch (err) {
        console.error(err.message);
        res.send({ msg: "Server Error", status: http_status_codes_1.default.INTERNAL_SERVER_ERROR });
    }
}));
// @route   POST api/user 
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post("/", [
    (0, express_validator_1.check)("name", "Please provide description").isString(),
    (0, express_validator_1.check)("description", "Please user id").isString(),
    (0, express_validator_1.check)("location", "Please provide description").isString(),
    (0, express_validator_1.check)("category", "Please user id").isString(),
    (0, express_validator_1.check)("isNew", "Please select if the product is new").isBoolean(),
    (0, express_validator_1.check)("photos", "Please there should be at least one photo").isArray().isLength({ min: 1 }),
    (0, express_validator_1.check)("price", "Please rate the user").isNumeric(),
], auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.json({ status: http_status_codes_1.default.BAD_REQUEST, errors: errors.array() });
    }
    const { description, name, location, price, category, photos, isNew } = req.body;
    try {
        // Build user object based on TUser
        const user = yield User_1.default.findOne({
            _id: req.userId,
        });
        const userProduct = yield Product_1.default.find({ userId: req.userId });
        if (!user.isStudent && !user.subscribed && userProduct.length >= 1) {
            res.send({
                status: http_status_codes_1.default.FORBIDDEN,
                msg: "You have reached your maximum upload limit, User has not yet subscribed, "
            });
            return;
        }
        if (userProduct.length >= 10 && user.subscribed && !user.isStudent) {
            res.send({
                status: http_status_codes_1.default.FORBIDDEN,
                msg: "You have reached your maximum upload limit on your subscription"
            });
            return;
        }
        if (userProduct.length >= 2 && !user.subscribed && user.isStudent) {
            res.send({
                status: http_status_codes_1.default.FORBIDDEN,
                msg: "You have reached your maximum upload limit, User has not yet Validated"
            });
            return;
        }
        if (userProduct.length >= 10 && user.subscribed && user.isStudent) {
            res.status(http_status_codes_1.default.OK).send({
                status: http_status_codes_1.default.FORBIDDEN,
                msg: "You have reached your maximum upload limit on your subscription"
            });
            return;
        }
        const productFields = {
            description,
            name,
            location,
            price,
            category,
            photos,
            userId: req.userId,
            isNew,
            sellerName: `${user.first_name} ${user.last_name}`,
            sellerPhone: `${user.phone_number}`
        };
        let product = new Product_1.default(productFields);
        yield product.save();
        if (!product) {
            res.send({ msg: "Could not save product", status: http_status_codes_1.default.EXPECTATION_FAILED });
        }
        else {
            res.send({ product: product, status: http_status_codes_1.default.OK });
        }
    }
    catch (err) {
        console.error(err.message);
        res.send({ status: http_status_codes_1.default.INTERNAL_SERVER_ERROR, msg: "Server Error" });
    }
}));
exports.default = router;
//# sourceMappingURL=product.js.map