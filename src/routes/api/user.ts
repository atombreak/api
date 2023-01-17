import bcrypt from "bcryptjs";
import config from "config";
import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import gravatar from "gravatar";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import Payload from "../../types/Payload";
import Request from "../../types/Request";
import User, { IUser, TUser } from "../../models/User";

const router: Router = Router();
// @route   POST api/user
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("phone_number", "Please provide your phone number").exists(),
    check("school", "Please select your school").exists(),
    check("studentId", "Must enter student ID").exists(),
    check("isStudent", "Please specify if user is a student").isBoolean(),
    check("first_name", "First name is required").exists(),
    check("last_name", "Last name is required").exists(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    console.log('I have reached the here')
    console.log(req.body);
    
    const { email, password, phone_number, school, studentId, isStudent, first_name, last_name }: IUser = req.body;

    try {
      let user: IUser = await User.findOne({ email });

      if (user) {
        return res.json({
          errors:
            {
              msg: "User already exists",
              status: HttpStatusCodes.CONFLICT
            },
        });
      }

      const options: gravatar.Options = {
        s: "200",
        r: "pg",
        d: "mm",
      };

      const photo = gravatar.url(email, options);

      const avatar = `https://avatars.dicebear.com/api/adventurer/${first_name}${last_name}.svg`

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      // Build user object based on TUser
      const userFields: TUser = {
        email,
        password: hashed,
        photo: "",
        phone_number,
        isStudent,
        last_name,
        first_name,
        school: school || " ",
        studentId: studentId || " ",
        subscribed: false,
        verified: isStudent ? !isStudent : !isStudent,
      };

      user = new User(userFields);

      await user.save();

      const payload: Payload = {
        userId: user.id,
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: config.get("jwtExpiration") },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.send({
        status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
        message: "Server Error",
      });
    }
  }
);

export default router;
