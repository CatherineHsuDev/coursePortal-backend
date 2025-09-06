const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");
// const path = require("path");
const port = process.env.PORT || 4000;

// 連結mongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => {
    console.log("Connecting to mongoDB");
  })
  .catch((e) => {
    console.log(e);
  });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use(express.static(path.join(__dirname, "client", "dist")));

// http://localhost:8080/api/user
// authRoute --> ./routes --> index.js --> auth: require("./auth") --> router.get("/testAPI", (req, res)
app.use("/api/user", authRoute);

// course route 應該被jwt保護
// 如果request header內部沒有jwt，則request就會被視為是unauthorized
// app.use(點選的http路徑, 檢查點, 點選後要去的路徑);
// passport.authenticate通過require("./config/passport")(passport);到passport.js
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

// 只有登入系統的人才能去新增課程或註冊課程
// 這些登入的人手上一定有json web token
// 驗證手上的json web token是有效的token
// 驗證通過才能註冊或新增課程

// if (
//   process.env.NODE_ENV === "production" ||
//   process.env.NODE_ENV === "staging"
// ) {
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
//   });
// }

app.get("/", (req, res) => {
  res.send("home page");
});

app.listen(port, () => {
  console.log(`server running at port 4000`);
});
