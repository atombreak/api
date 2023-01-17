import { Document, model, Schema } from "mongoose";

/**
 * Type to model the Comment Schema for TypeScript.
 * @param description:string
 * @param rating: number
 * @param usersId: string
 * @param commenter: string
 */

export type TComment = {
  description: string;
  rating: number;
  userId: string;
  commenter: string;
};

/**
 * Mongoose Document based on TComment for TypeScript.
 * https://mongoosejs.com/docs/documents.html
 *
 * TComment
 * @param description:string
 * @param rating: number;
 * @param userId: string
 * @param commenter: string
 */

export interface IComment extends TComment, Document {}

const CommentSchema: Schema = new Schema({
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

const Comment = model<IComment>("Comment", CommentSchema);

export default Comment;
