const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const globalVars = require("../helpers/globalVars");

// Load User model
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          // Match user
          const user = await User.findOne({ email: email });
          if (!user) {
            globalVars.topLoginMsg = "This email is not registered";
            return done(null, false);
          }
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              globalVars.topLoginMsg = "Password incorrect";
              return done(null, false);
            }
          });
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
