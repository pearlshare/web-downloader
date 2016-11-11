const express = require("express");
const scraper = require("../scraper");
const s3 = require("../s3");
const path = require("path");

const tmpdir = path.join(__dirname, "../../tmp");
const router = express.Router();

router.get("/", function (req, res) {
  res.send(`
    <html>
      <body>
        <div>
          <a href="/">Back to list</a>
        </div>
        <h1>Download new website to demo</h1>
        <form action="/downloader" method="post">
          <p>This will create a copy of a webpage ready for editing. </p>
          <div>
            <label for="out">Name of client</label>
            <input type="text" name="out" id="out"></input>
          </div>
          <div>
            <label for="url">Web page URL to copy</label>
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
  .then(function () {
    res.redirect(`/editor/${req.body.out}/index.html`);
  });
});

module.exports = router;
