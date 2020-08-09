const express = require("express")
const chalk = require("chalk")
const debug = require("debug")("app")
const morgan = require("morgan")
const staticRoute = require("./staticRoute")

const app = express()
const PORT = process.env.PORT || 3000

app.use(morgan("short"))

staticRoute(app)

// expressがデフォルトで参照するviewsのパスを変更
app.set("views", "./src/views")
app.set("view engine", "ejs")

app.get("/", (req, res) => {
  res.render("index", { title: "MyLibrary", list: ["a", "b"] })
})

app.listen(PORT, () => {
  debug(
    `${chalk.green("■ ")}express app listen on ${chalk.yellow(PORT)} port.\n`
    + `open ${chalk.yellow(`http://localhost:${PORT}`)} for web browser.`
  )
})
