const express = require("express");
const s3 = require("../s3");
const path = require("path");

const router = express.Router();

// List the demo sites
router.get("/", function (req, res) {
  s3.listObjects().then(function (data) {
    return data.CommonPrefixes.map(function (item) {
      return item.Prefix;
    });
  }).then(function (items) {
    res.send(`
      <html>
        <head>
          <link rel="stylesheet" href="/css/app.css">
        </head>
        <body>
          <a href="https://docs.google.com/a/pearlshare.com/document/d/17icoA-WL101Z-ih2engZ7QkK-NnkBkwIxv5aq8E4n9c/edit?usp=sharing" class="ps-demo-documentation">Documentation</a>
          <h1>Demos</h1>
          <ul class="ps-demo-list">
            ${items.map(i => `<li><a href=${s3.publicUrl(i)}>${i}</a> - <a href="${path.join("/editor", i, "index.html")}"><small>edit</small></a></li>`).join("")}
          </ul>
          <div>
            <a href="/downloader">New</a>
          </div>
        </body>
      </html>
    `);
  });
});

module.exports = router;
