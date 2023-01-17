import { Document, model, Schema } from "mongoose";

/**
 * Type to model the User Schema for TypeScript.
 * @param userId:string
 * @param imgURL:string
 */

export type TVerification = {
  userId: string;
  imgURL: string;
};

/**
 * Mongoose Document based on TUser for TypeScript.
 * https://mongoosejs.com/docs/documents.html
 *
 * TVerification
 * @param userId:string
 * @param imgURL:string
 */

export interface IVerification extends TVerification, Document {}

const VerificationSchema: Schema = new Schema({
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

const Verification = model<IVerification>("Verification", VerificationSchema);

export default Verification;
