const express = require("express");
const { MongoClient, ObjectID } = require("mongodb");
const debug = require("debug")("app:bookRoutes");

const bookRouter = express.Router();
const URL = process.env.MONGO_URL;
const DB_NAME = process.env.MONGO_NAME;

const router = (navItems) => {
  bookRouter.route("/").get((req, res) => {
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(URL);
        debug("Connected MongoDB");
        const db = client.db(DB_NAME);
        const col = await db.collection("books");
        const books = await col.find().toArray();
        res.render("books", { title: "MyLibrary", nav: navItems, lists: books });
      } catch (err) {
        debug(err.stack);
      }
      client.close();
    }());
  });

  bookRouter.route("/:id")
    .all((req, res, next) => {
      const { id } = req.params;
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(URL);
          debug("Connected MongoDB");
          const db = client.db(DB_NAME);
          const col = await db.collection("books");
          const book = await col.findOne({ _id: new ObjectID(id) });
          res.render("_book", { title: "MyLibrary", nav: navItems, book });
          debug(book);
        } catch (err) {
          debug(err.stack);
        }
        client.close();
        next();
      }());
    })
    .get((req, res) => {
      if (req.book) {
        res.render("_book", { title: "MyLibrary", nav: navItems, book: req.book });
      }
    });

  return bookRouter;
};

module.exports = router;
