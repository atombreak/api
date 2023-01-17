"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
    },
    isStudent: {
        type: Boolean,
        required: true,
        default: false,
    },
    studentId: {
        type: String,
    },
    school: {
        type: String,
    },
    subscribed: {
        type: Boolean,
        default: false,
    },
    verified: {
        type: Boolean,
        default: false,
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
 * @param email:string
 * @param password:string
 * @param photo:string
 * @param first_name:string
 * @param last_name:string
 * @param phone_number:string
 * @param school:string
 * @param studentId:string
 * @param gender:string
 * @param subscribed:boolean
 * @param isStudent:boolean
 */
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
//# sourceMappingURL=User.js.map