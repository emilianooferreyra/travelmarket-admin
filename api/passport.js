const User = require("./models/user.js");

var passportJWT = require("passport-jwt");
var JwtStrategy = passportJWT.Strategy,
  ExtractJwt = passportJWT.ExtractJwt;

module.exports = function (passport) {
  var jwtOptions = {};
  jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
  jwtOptions.secretOrKey = "getintravelmarketsecret";
  passport.use(
    new JwtStrategy(jwtOptions, function (jwt_payload, next) {
      User.findOne(
        {
          _id: jwt_payload.id,
        },
        function (err, user) {
          if (user) {
            next(null, user);
          } else {
            next(null, false);
          }
        }
      );
    })
  );
};
