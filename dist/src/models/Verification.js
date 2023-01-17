"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const VerificationSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    imgURL: {
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
 * TVerification
 * @param userId:string
 * @param imgURL:string
 */
const Verification = (0, mongoose_1.model)("Verification", VerificationSchema);
exports.default = Verification;
//# sourceMappingURL=Verification.js.map