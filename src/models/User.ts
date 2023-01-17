import { Document, model, Schema } from "mongoose";

/**
 * Type to model the User Schema for TypeScript.
 * @param email:string
 * @param password:string
 * @param photo:string
 * @param first_name:string
 * @param last_name:string
 * @param phone_number:string
 * @param school:string
 * @param studentId:string
 * @param subscribed:boolean
 * @param isStudent:boolean
 * @param verified:boolean
 */

export type TUser = {
  email: string;
  password: string;
  photo?: string;
  phone_number: string;
  school: string;
  studentId?: string;
  first_name: string;
  last_name?: string;
  subscribed: boolean;
  isStudent: boolean;
  verified: boolean;
}
/**
 * Mongoose Document based on TUser for TypeScript.
 * https://mongoosejs.com/docs/documents.html
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
 * @param subscribed:boolean
 * @param isStudent:boolean
 * @param verified:boolean
 */

export interface IUser extends TUser, Document {}


const userSchema: Schema = new Schema({
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

const User = model<IUser>("User", userSchema);

export default User;
