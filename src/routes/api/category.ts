import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";
import Request from "../../types/Request";
import { TCategory, ICategory } from '../../models/Category';
import Category from '../../models/Category';
 
const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const category: ICategory[] = await Category.find();

    if (!category)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ msg: "categories not found" });

    res.status(HttpStatusCodes.OK).json(category);
  } catch (err) {
    console.error(err.message);
    if (err) {
      return res.send({
          status: HttpStatusCodes.BAD_REQUEST,
          message: "Error getting category",
        });
    }
    res.send({
      status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
      message: "Server Error",
    });
  }
});

// @route   POST api/user 
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post(
  "/",
  [
    check("name", "Please provide the name").isString(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { name }: TCategory = req.body;

    try {
      // Build user object based on TUser
      
      const categoryFields: TCategory = {
        name: name.toLocaleLowerCase(),
      };
      
      let category = new Category(categoryFields);

      await category.save();
      if (!category) {
        res.send({status: HttpStatusCodes.EXPECTATION_FAILED , msg: "Could not save category"})
      } else {
        res.status(HttpStatusCodes.OK).send(category);
      }

    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);

export default router;