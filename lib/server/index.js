// Dependencies
const bodyParser = require("body-parser");
const express = require("express");

const app = express();

// Serve static assets
app.use(express.static("public"));

// HTTP Basic authentication
const basicAuth = require("basic-auth");
app.use(function (req, res, next) {
  const user = basicAuth(req);
  if (user && process.env.USERNAME === user.name && process.env.PASSWORD === user.pass) {
    next();
  } else {
    res.statusCode = 401;
    res.setHeader("WWW-Authenticate", "Basic realm=${process.env.HOSTNAME}");
    res.end("Access denied");
  }
});

// Parse url encoded forms
app.use(bodyParser.urlencoded({
  extended: false,
  limit: "5mb"
}));

// Mount apps
const downloader = require("./downloader");
const editor = require("./editor");
const browse = require("./browse");

app.use("/downloader", downloader);
app.use("/editor", editor);
app.use("/", browse);

// For dev use expose items in the temp folder
if (process.env.NODE_ENV !== "production") {
  app.use("/demos", express.static("tmp"));
}

app.listen(process.env.PORT, function () {
  console.log("App listening on port 3000!");
});
