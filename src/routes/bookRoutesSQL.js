const express = require("express");
const sql = require("mssql");
const debug = require("debug")("app:bookRoutes");

const bookRouter = express.Router();

const router = (navItems) => {
  bookRouter.route("/").get((req, res) => {
    (async function query() {
      const request = new sql.Request();
      const { recordset } = await request.query("SELECT * FROM books;").catch((err) => debug("SQLexecute err:", err));
      res.render("books", { title: "MyLibrary", nav: navItems, lists: recordset });
    }());
  });

  bookRouter.route("/single").get((req, res) => {
    res.send("single book page");
  });

  bookRouter.route("/:id")
    .all((req, res, next) => {
      (async function query() {
        const { id } = req.params;
        const request = new sql.Request();
        const { recordset } = await request.input("id", sql.Int, id)
          .query("SELECT * from books WHERE id = @id").catch((err) => debug("SQLexecute err:", err));
        debug("idQuery result:", recordset);
        if (recordset.length) {
          [req.book] = recordset;// なぜかデストラクチャリングできない jsの変数巻き上げのせいかも
        }
        next();
      }());
    })
    .get((req, res) => {
      if (req.book) {
        return res.render("_book", { title: "MyLibrary", nav: navItems, book: req.book });
      }
      return res.redirect("/");
    });

  return bookRouter;
};

module.exports = router;
