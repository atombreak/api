import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";
import Request from "../../types/Request";
import Comment, { TComment } from '../../models/Comment';
import { IComment } from '../../models/Comment';
import auth from "../../middleware/auth";

const router: Router = Router();

router.get("/:userId", auth, async (req: Request, res: Response) => {
  try {
    const comment: IComment[] = await Comment.find({userId: req.params.userId});

    if (!comment)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ msg: "Comments not found" });

    res.status(HttpStatusCodes.OK).json(comment);
  } catch (err) {
    console.error(err.message);
    if (err) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ msg: "Comments not found" });
    }
    res.send({status:HttpStatusCodes.INTERNAL_SERVER_ERROR, msg: "Server Error"});
  }
  
});

// @route   POST api/user 
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post(
  "/",
  [
    check("description", "Please provide description").isString(),
    check("userId", "Please user id").isString(),
    check("commenter", "Please commenter id").isString(),
    check("rating", "Please rate the user").isNumeric(),
  ],
  auth,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { description, rating, userId, commenter }: TComment = req.body;

    try {
      // Build user object based on TUser
      
      const commentFields: TComment = {
        description,
        rating,
        userId,
        commenter
      };
      
      let comment = new Comment(commentFields);

      await comment.save();
      if (!comment) {
        res.status(HttpStatusCodes.EXPECTATION_FAILED).send("Could not save comment")
      } else {
        res.status(HttpStatusCodes.OK).send(comment);
      }

    } catch (err) {
      console.error(err.message);
      res.send({status:HttpStatusCodes.INTERNAL_SERVER_ERROR, msg: "Server Error"});
    }
  }
);

export default router;