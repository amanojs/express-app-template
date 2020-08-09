const express = require("express")
const path = require("path")
// CDN化
module.exports = (app) => {
  // publicフォルダ
  app.use(express.static(path.join(__dirname, "public")))
  // bootstrap(css)
  app.use(
    "/css",
    express.static(
      path.join(__dirname, "node_modules", "bootstrap", "dist", "css")
    )
  )
  // bootstrap(js)
  app.use(
    "/js",
    express.static(
      path.join(__dirname, "node_modules", "bootstrap", "dist", "js")
    )
  )
  // jquery
  app.use(
    "/js",
    express.static(path.join(__dirname, "node_modules", "jquery", "dist"))
  )
}
