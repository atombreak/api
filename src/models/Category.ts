import { Document, model, Schema } from "mongoose";

/**
 * Type to model the User Schema for TypeScript.
 * @param name:string
 */

export type TCategory = {
  name: string;
};

/**
 * Mongoose Document based on TUser for TypeScript.
 * https://mongoosejs.com/docs/documents.html
 *
 * TComment
 * @param name:string
 */

export interface ICategory extends TCategory, Document {}

const CommentSchema: Schema = new Schema({
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

const Category = model<ICategory>("Category", CommentSchema);

export default Category;
