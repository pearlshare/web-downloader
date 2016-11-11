const express = require("express");
const scraper = require("../scraper");
const s3 = require("../s3");
const path = require("path");

const tmpdir = path.resolve(__dirname, "../../../tmp");
const router = express.Router();

router.get("/", function (req, res) {
  res.send(`
    <html>
      <body>
        <div>
          <a href="/">Back to list</a>
        </div>
        <h1>Download new website demo</h1>
        <form action="/downloader" method="post">
          <div>
            <label for="out">Name</label>
            <input type="text" name="out" id="out"></input>
          </div>
          <div>
            <label for="url">Url</label>
            <input type="text" name="url" id="name"></input>
          </div>
          <div>
            <input type="submit" value="Create demo" />
          </div>
        </form>
      </body>
    </html>
  `);
});

// Upload a website
router.post("/", function (req, res) {
  scraper(req.body.url, path.join(tmpdir, req.body.out)).then(function (outdir) {
    return s3.syncDir(outdir, req.body.out);
  })
  .then(function (s3Url) {
    res.redirect(s3Url);
  });
});

module.exports = router;
