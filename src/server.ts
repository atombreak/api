import bodyParser from "body-parser";
import express from "express";
import connectDB from "../config/database";
import auth from "./routes/api/auth";
import user from "./routes/api/user";
import profile from "./routes/api/profile";
import comment from "./routes/api/comment";
import category from "./routes/api/category";
import products from "./routes/api/product";
import verification from "./routes/api/verification";

const app = express();

// Connect to MongoDB
connectDB();

// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// @route   GET /
// @desc    Test Base API
// @access  Public
app.get("/", (_req, res) => {
  res.send("API Running");
});


app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/profile", profile);
app.use("/api/user", user);
app.use("/api/comment", comment);
app.use("/api/categories", category);
app.use("/api/products", products);
app.use("/api/verify", verification);

const port = app.get("port");
const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`)
    fetch(`https://avatars.dicebear.com/api/adventurer/${"chocha"}.svg`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
  }
  
);

export default server;
