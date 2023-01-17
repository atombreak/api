import config from "config";
import { Response, NextFunction } from "express";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import Payload from "../types/Payload";
import Request from "../types/Request";
import { IUser } from '../models/User';
import User from '../models/User';

export default async function(req: Request, res: Response, next: NextFunction) {
  // Get token from header
  const token = req.header("x-auth-token");
  console.log(token);

  // Check if no token
  if (!token) {
    return res.json({status: HttpStatusCodes.UNAUTHORIZED, msg: "No token, authorization denied" });
  }
  // Verify token
  try {
    jwt.verify(token, config.get("jwtSecret"), async(err, data) => {
      if (err) {
        console.log('Error', err.message);
        return res.json({status: HttpStatusCodes.NOT_FOUND, msg: "Could not verify token" });
      }
      if (data) {
        //const payload: Payload | any = jwt.verify(token, config.get("jwtSecret"));
        req.userId = (data as any).userId;
        const user: IUser = await User.findOne({
          _id: req.userId,
        });
        if(!user){
          return res
          .status(HttpStatusCodes.NOT_FOUND)
          .json({ msg: "User was not found in the database"});
        }
        console.log('data fetched', (data as any).userId);
        next();
      }
    });
  } catch (err) {
    res
      .json({ status: HttpStatusCodes.UNAUTHORIZED, msg: "Token is not valid" });
  }
}