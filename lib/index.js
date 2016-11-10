require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const scraper = require("./scraper");
const uploader = require("./uploader");

process.env.PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
  extended: false
}));

// Show the downloader interface
app.use(express.static("lib/views"));

app.post("/downloader", function (req, res) {
  console.log("req.body", req.body);
  scraper(req.body.url, req.body.out).then(function (outdir) {
    return uploader.syncDir(outdir, req.body.out);
  })
  .then(function (s3Url) {
    res.redirect(s3Url);
  });
});

// Stub out JS requests
app.use(/.*\.js/, function (req, res) {
  res.set("Content-Type", "text/javascript");
  res.send("");
});

app.use("/demos", express.static("tmp"));

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port 3000!')
})
