var express = require("express");
var router = express.Router(),
  jwt = require("jsonwebtoken"),
  User = require("./models/user");

router.post("/api/login", function (req, res) {
  if (req.body.username && req.body.password) {
    var username = req.body.username;
    var password = req.body.password;

    // usually this would be a database call:
    User.findOne(
      {
        username: username,
      },
      function (err, user) {
        if (!user) {
          return res.status(400).json({
            message: "no such user found",
          });
        }

        if (user.password === req.body.password) {
          var payload = {
            id: user.id,
          };
          var token = jwt.sign(payload, "getintravelmarketsecret");
          return res.json({
            message: "ok",
            token: token,
          });
        } else {
          return res.status(400).json({
            message: "passwords did not match",
          });
        }
      }
    );
  } else {
    return res.status(400).json({
      message: "username and password are required",
    });
  }
});

module.exports = router;
