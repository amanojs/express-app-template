const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const debug = require("debug")("app:google");

const google_Strategy = () => {
  passport.use(new GoogleStrategy({
    clientID: "542795180613-9m23ro1vj7u8k5p1u3jhhpg3oaojdb0l.apps.googleusercontent.com",
    clientSecret: "iyZuS_lOLuYX_PXaWDGf1u4w",
    callbackURL: "/google/callback"
  }, (accessToken, refreshToken, profile, done) => {
    debug("google strategy")
    try {
      if (profile) {
        done(null, profile);
        debug(profile)
      } else {
        done(null, false);
        throw new Error("No profile")
      }
    } catch (err) {
      debug(err)
    }
  }));
};

module.exports = google_Strategy;
