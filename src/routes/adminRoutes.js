const express = require("express");
const debug = require("debug")("app:adminRoutes");
const { MongoClient } = require("mongodb");

const adminRouter = express.Router();

const books = [
  {
    id: 1,
    title: "Node.jsの基礎",
    author: "桒畑 天"
  },
  {
    id: 1,
    title: "Azureとexpress",
    author: "Jonathan Mills"
  }
];

const router = () => {
  adminRouter.route("/").get((req, res) => {
    const URL = process.env.MONGO_URL;
    const DB_NAME = process.env.MONGO_NAME;
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(URL);
        debug("Connected MongoDB");
        const db = client.db(DB_NAME);
        const result = await db.collection("books").insertMany(books);
        res.json(result);
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  });
  return adminRouter;
};

module.exports = router;
