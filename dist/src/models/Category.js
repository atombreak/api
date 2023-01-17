"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        default: new Date(Date.now()).toDateString()
    },
});
/**
 * Mongoose Model based on TUser for TypeScript.
 * https://mongoosejs.com/docs/models.html
 *
 * TUser
 * @param name:string
 */
const Category = (0, mongoose_1.model)("Category", CommentSchema);
exports.default = Category;
//# sourceMappingURL=Category.js.map