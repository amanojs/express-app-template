const passport = require("passport");
const { Strategy } = require("passport-local");
const { MongoClient } = require("mongodb");
const debug = require("debug")("app:local.strategy");

const URL = process.env.MONGO_URL;
const DB_NAME = process.env.MONGO_NAME;

const localStrategy = () => {
  passport.use(new Strategy(
    {
      usernameField: "username",
      passwordField: "password"
    }, (username, password, done) => {
      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(URL);
          const db = client.db(DB_NAME);
          const col = db.collection("users");
          const user = await col.findOne({ username });
          if (user && user.password === password) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    }
  ));
};

module.exports = localStrategy;
