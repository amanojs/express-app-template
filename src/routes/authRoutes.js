const express = require("express");
const { MongoClient } = require("mongodb");
const debug = require("debug")("app:authRoutes");
const passport = require("passport");

const authRouter = express.Router();
const URL = process.env.MONGO_URL;
const DB_NAME = process.env.MONGO_NAME;

const router = () => {
  authRouter.route("/signUp").post((req, res) => {
    debug(req.body);
    // create user
    const { username, password } = req.body;
    (async function addUser() {
      let client;
      try {
        client = await MongoClient.connect(URL);
        const db = client.db(DB_NAME);
        const col = db.collection("users");
        const user = { username, password };
        const result = await col.insertOne(user);
        debug(result);
        req.login(result.ops[0], () => {
          res.redirect("/auth/profile");
        });
      } catch (err) {
        debug(err.stack);
      }
    }());
  });

  authRouter.route("/signIn").post(passport.authenticate("local", {
    successRedirect: "/auth/profile",
    failureRedirect: "/"
  }));

  authRouter.route("/profile")
    .all((req, res, next) => {
      if (req.user) {
        next();
      }
      res.redirect("/");
    })
    .get((req, res) => {
      res.json(req.user);
    });
  return authRouter;
};

module.exports = router;
