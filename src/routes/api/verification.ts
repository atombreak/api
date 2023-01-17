import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";
import Request from "../../types/Request";
import { TVerification, IVerification } from '../../models/Verification';
import auth from "../../middleware/auth";
import  Verification from '../../models/Verification';
 
const router: Router = Router();
router.post(
  "/",
  [
    check("imgURL", "Please provide the image URL ").isString(),
  ],
  auth,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { imgURL }: TVerification = req.body;

    try {
      // Build user object based on TUser
        const VerificationFields: TVerification = {
        userId: req.userId,
        imgURL: imgURL,
      };
      
      let verification = new  Verification(VerificationFields);

      await verification.save();
      if (!verification) {
        res.send({msg: "Could not save category", status: HttpStatusCodes.EXPECTATION_FAILED})
      } else {
        res.send({verification: verification, status: HttpStatusCodes.OK});
      }

    } catch (err) {
      console.error(err.message);
      res.send({status:HttpStatusCodes.INTERNAL_SERVER_ERROR, msg: "Server Error"});
    }
  }
);

export default router;