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
          <style>
            li {
              line-height: 3em;
            }
          </style>
        </head>
        <body>
          <h1>Demos</h1>
          <ul>
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
