"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommentSchema = new mongoose_1.Schema({
    description: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        default: 1
    },
    userId: {
        type: String,
        required: true,
    },
    commenter: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        default: new Date(Date.now()).toDateString()
    },
});
/**
 * Mongoose Model based on TComment for TypeScript.
 * https://mongoosejs.com/docs/models.html
 *
 * TUser
 * @param name:string
 * @param rating: number
 * @param userId: string
 * @param commenter: string
 */
const Comment = (0, mongoose_1.model)("Comment", CommentSchema);
exports.default = Comment;
//# sourceMappingURL=Comment.js.map