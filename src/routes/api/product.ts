import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";
import Request from "../../types/Request";
import { TProduct } from '../../models/Product';
import Product from '../../models/Product';
import auth from "../../middleware/auth";
import { IUser } from '../../models/User';
import User from '../../models/User';

const router: Router = Router();

router.get("/", auth, async (req: Request, res: Response) => {
  try {
    const { page, limit, category, filter } = req.query;
    const pageCount: number = parseInt(page as string) || 1
    const limitParsed: number = (parseInt(limit as string) || 50) * 1
    const skipCount: number = (pageCount - 1) * limitParsed
    const categoryParsed = (category || "") as string
    const filterParsed: string = (filter || "") as string
    console.log(req.userId)
    const products: TProduct[] = await Product.find({ "$or": [
        {"name": {$regex: `${filterParsed.split("%").join(" ")}`, $options: "i"}},
        {"description": {$regex: `${filterParsed.split("%").join(" ")}`, $options: "i"}},
        {"location": {$regex: `${filterParsed.split("%").join(" ")}`, $options: "i"}},
        {"price": {$regex: `${filterParsed.split("%").join(" ")}`, $options: "i"}},
    ]})
    .where({category: {$regex: categoryParsed, $options: "i"}})
    .limit(limitParsed)
    .sort({ createdAt: -1 })
    .skip(skipCount);

    console.log("products::", products.length)

    if (!products) return res.json({status: HttpStatusCodes.BAD_REQUEST, msg: "products not found" });

    console.log("I can reach here");
    res.json({products: products, status: HttpStatusCodes.OK});
  } catch (err) {
    console.error(err.message);
    if (err) {
      return res.json({status: HttpStatusCodes.BAD_REQUEST, msg: "products not found" });;
    }

    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

router.get("/mine", auth, async (req: Request, res: Response) => {
  try {
    const products: TProduct[] = await Product.find({userId: req.userId});

    if (!products)
          return res.json({status: HttpStatusCodes.BAD_REQUEST, msg: "products not found" });

    res.json({status: HttpStatusCodes.OK, products: products});
  } catch (err) {
    console.error(err.message);
    if (err) {
      return res.json({status: HttpStatusCodes.BAD_REQUEST, msg: "products not found" });
    }
    res.send({msg: "Server Error", status: HttpStatusCodes.INTERNAL_SERVER_ERROR});
  }
});

router.delete("/:productId", auth, async (req: Request, res: Response) => {
  try {
    // Remove user
    const user: IUser = await User.findOne({
      _id: req.userId,
    });
    
    const product: TProduct = await Product.findOne({ _id: req.params.productId });

    if(Boolean(product) && user.id === product.userId){
      await Product.findOneAndRemove({ _id: req.params.productId });
     return res.json({
        status: HttpStatusCodes.OK,
        msg: "1 Product was successfully removed from your store." 
       });
    } else {
     return res.json({
        status: HttpStatusCodes.FORBIDDEN,
        msg: "Could not delete product from the store." 
       });
    }

  } catch (err) {
    console.error(err.message);
    res.send({msg: "Server Error", status: HttpStatusCodes.INTERNAL_SERVER_ERROR});
  }
});

// @route   POST api/user 
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post(
  "/",
  [
    check("name", "Please provide description").isString(),
    check("description", "Please user id").isString(),
    check("location", "Please provide description").isString(),
    check("category", "Please user id").isString(),
    check("isNew", "Please select if the product is new").isBoolean(),
    check("photos", "Please there should be at least one photo").isArray().isLength({min: 1}),
    check("price", "Please rate the user").isNumeric(),
  ],
  auth,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({status: HttpStatusCodes.BAD_REQUEST, errors: errors.array()});
    }
 
    const { description, name, location, price, category, photos, isNew}: TProduct = req.body;

    try {
      // Build user object based on TUser
      const user: IUser = await User.findOne({
        _id: req.userId,
      });

      const userProduct: TProduct[] = await Product.find({userId: req.userId})

      if(!user.isStudent && !user.subscribed && userProduct.length >= 1){
        res.send({
          status: HttpStatusCodes.FORBIDDEN,
          msg: "You have reached your maximum upload limit, User has not yet subscribed, "
        })
        return;
      }

      if(userProduct.length >= 10 && user.subscribed && !user.isStudent) {
        res.send({
          status: HttpStatusCodes.FORBIDDEN,
          msg: "You have reached your maximum upload limit on your subscription"
        })
        return;
      }

      if(userProduct.length >= 2 && !user.subscribed && user.isStudent) {
        res.send({
          status: HttpStatusCodes.FORBIDDEN,
          msg: "You have reached your maximum upload limit, User has not yet Validated"
        })
        return;
      }

      if(userProduct.length >= 10 && user.subscribed && user.isStudent) {
        res.status(HttpStatusCodes.OK).send({
          status: HttpStatusCodes.FORBIDDEN,
          msg: "You have reached your maximum upload limit on your subscription"
        })
        return;
      }
      
      const productFields: TProduct = {
        description,
        name,
        location,
        price,
        category,
        photos,
        userId: req.userId,
        isNew,
        sellerName: `${user.first_name} ${user.last_name}`,
        sellerPhone: `${user.phone_number}`
      };
      
      let product = new Product(productFields);

      await product.save();
      if (!product) {
        res.send({msg: "Could not save product", status: HttpStatusCodes.EXPECTATION_FAILED})
      } else {
        res.send({product: product, status: HttpStatusCodes.OK});
      }
    } catch (err) {
      console.error(err.message);
      res.send({status:HttpStatusCodes.INTERNAL_SERVER_ERROR, msg: "Server Error"});
    }
  }
);
export default router;