"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userProduct = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    photos: {
        type: [String],
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    sellerName: {
        type: String,
        required: true,
    },
    sellerPhone: {
        type: String,
        required: true,
    },
    isNew: {
        type: Boolean,
        required: true,
    },
    createdAt: {
        type: String,
        default: new Date(Date.now()).toDateString()
    },
    modifiedAt: {
        type: String,
        default: new Date(Date.now()).toDateString()
    },
    active: {
        type: Boolean,
        default: true
    }
});
/**
 * Mongoose Model based on TUser for TypeScript.
 * https://mongoosejs.com/docs/models.html
 *
 * TUser
 * @param name:string
 * @param description:string
 * @param price:string
 * @param location:string
 * @param category:string
 * @param userId:string
 * @param isNew:boolean
 * @param photos:string[]
 */
const Product = (0, mongoose_1.model)("Product", userProduct);
exports.default = Product;
//# sourceMappingURL=Product.js.map