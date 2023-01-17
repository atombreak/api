import { Document, model, Schema } from "mongoose";

/**
 * Type to model the User Schema for TypeScript.
 * @param name:string
 * @param description:string
 * @param price:string
 * @param location:string
 * @param category:string
 * @param userId:string
 * @param sellerName:string
 * @param sellerPhone:string
 * @param isNew:boolean
 * @param photos:string[]
 */

export type TProduct = {
  name: string;
  description: string;
  price: string;
  location: string;
  category: string;
  photos: string[];
  userId: string;
  sellerPhone: string;
  sellerName: string;
  isNew: boolean;
};

/**
 * Mongoose Document based on TUser for TypeScript.
 * https://mongoosejs.com/docs/documents.html
 *
 * TUser
 * @param name:string
 * @param description:string
 * @param price:string
 * @param location:string
 * @param category:string
 * @param userId:string *
 * @param sellerName:string
 * @param sellerPhone:string
 * @param isNew:boolean
 * @param photos:string[]
 */

export interface IProduct extends TProduct, Document {}

const userProduct: Schema = new Schema({
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

const Product = model<IProduct>("Product", userProduct);

export default Product;
