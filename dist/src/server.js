"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("../config/database"));
const auth_1 = __importDefault(require("./routes/api/auth"));
const user_1 = __importDefault(require("./routes/api/user"));
const profile_1 = __importDefault(require("./routes/api/profile"));
const comment_1 = __importDefault(require("./routes/api/comment"));
const category_1 = __importDefault(require("./routes/api/category"));
const product_1 = __importDefault(require("./routes/api/product"));
const verification_1 = __importDefault(require("./routes/api/verification"));
const app = (0, express_1.default)();
// Connect to MongoDB
(0, database_1.default)();
// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// @route   GET /
// @desc    Test Base API
// @access  Public
app.get("/", (_req, res) => {
    res.send("API Running");
});
app.use("/api/auth", auth_1.default);
app.use("/api/user", user_1.default);
app.use("/api/profile", profile_1.default);
app.use("/api/user", user_1.default);
app.use("/api/comment", comment_1.default);
app.use("/api/categories", category_1.default);
app.use("/api/products", product_1.default);
app.use("/api/verify", verification_1.default);
const port = app.get("port");
const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`);
    fetch(`https://avatars.dicebear.com/api/adventurer/${"chocha"}.svg`)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
});
exports.default = server;
//# sourceMappingURL=server.js.map