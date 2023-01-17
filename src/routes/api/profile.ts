import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";
import auth from "../../middleware/auth";
import Request from "../../types/Request";
import User, { IUser } from "../../models/User";
import Product, { IProduct } from '../../models/Product';
import Comment, {IComment} from '../../models/Comment';

const router: Router = Router();

// @route   GET api/profile/user/:userId
// @desc    Get profile by userId
// @access  Private
router.get("/:id", auth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    //console.log(id)
    const sellerProducts: IProduct[] = await Product.find({userId: id});
    const sellerComments: IComment[] = await Comment.find({userId: id});
    console.log(sellerProducts)
    const user: IUser = await User.findOne({
      _id: id,
    });
    //console.log(req.userId)
    //console.log('user response::', user)
    if (!user)
      return res
        .json({status: HttpStatusCodes.BAD_REQUEST, msg: "User not found" });

    res.send({status: HttpStatusCodes.OK, user: user, products: sellerProducts, comments: sellerComments});
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res
        .json({status: HttpStatusCodes.BAD_REQUEST, msg: "User not found" });
    }
    res.send({status:HttpStatusCodes.INTERNAL_SERVER_ERROR, msg: "Server Error"});
  }
});

// @route   GET api/profile/user/:userId
// @desc    Get profile by userId
// @access  Private
router.get("/", auth, async (req: Request, res: Response) => {
  try {
    const productsLength: number = await Product.find({userId: req.userId}).countDocuments();
    const user: IUser = await User.findOne({
      _id: req.userId,
    });
    //console.log(req.userId)
    if (!user)
      return res
        .json({status: HttpStatusCodes.BAD_REQUEST, msg: "User not found" });

    res.send({status: HttpStatusCodes.OK, user: user, products: productsLength});
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res
        .json({status: HttpStatusCodes.BAD_REQUEST, msg: "User not found" });
    }
    res.send({status:HttpStatusCodes.INTERNAL_SERVER_ERROR, msg: "Server Error"});
  }
});

// @route   DELETE api/profile
// @desc    Delete profile and user
// @access  Private
router.put("/", auth, [
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { email, password, photo }: Partial<IUser> = req.body;

  try {
    // Remove user
    await User.findOneAndUpdate({ _id: req.userId }, {email, password, photo});

    res.json({ msg: "User Updated" });
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

router.delete("/", auth, async (req: Request, res: Response) => {
  try {
    // Remove user
    await User.findOneAndRemove({ _id: req.userId });

    res.json({ msg: "User removed" });
  } catch (err) {
    res.send({status:HttpStatusCodes.INTERNAL_SERVER_ERROR, msg: "Server Error"});
  }
});

export default router;
