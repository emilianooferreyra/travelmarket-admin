const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Package = require("./models/package.js");
const config = require("./config");
const router = require("./routes");
const middleware = require("./middleware");
const db = require("./db");

app.use("/api/uploads", express.static("uploads"));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  // res.setHeader('Access-Control-Allow-Origin', 'http://gettravelmarket.com');
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, __setxhr_"
  );
  next();
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.listen(3000, function () {
  console.log("Travel Market app listening on port 3000!");
});

app.use("/", router);
