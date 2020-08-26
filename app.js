const express = require("express");
const chalk = require("chalk");
const debug = require("debug")("app");
const morgan = require("morgan");
const sql = require("mssql");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware set up
// app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: "library",
  resave: false,
  saveUninitialized: true
}));
require("./staticRoute")(app);
require("./src/config/passport.js")(app);

// SQLserver setup
const config = {
  user: "library",
  password: "Keion1207",
  server: "amlibrary.database.windows.net",
  database: "AMlibrary",
  options: {
    encrypt: true
  }
};
sql.connect(config).catch((err) => debug(err));

// Routing
const navItems = [{ link: "/books", title: "Books" }, { link: "/authors", title: "Authors" }];
const bookRouter = require("./src/routes/bookRoutes")(navItems);
const adminRouter = require("./src/routes/adminRoutes")(navItems);
const authRouter = require("./src/routes/authRoutes")();

app.use("/books", bookRouter);
app.use("/admin", adminRouter);
app.use("/auth", authRouter);

// express views setup
app.set("views", "./src/views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { title: "MyLibrary", list: ["a", "b"], nav: navItems });
});

app.get("/google", passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"],
  session: true
}));

app.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "/"
}), (req, res) => {
  // emailの値を表示
  debug(req.user.emails[0].value);
  res.redirect("/auth/profile");
});

app.listen(PORT, () => {
  debug(
    `${chalk.green("■ ")}express app listen on ${chalk.yellow(PORT)} port.\n`
    + `open ${chalk.yellow(`http://localhost:${PORT}`)} for web browser.`
  );
});
